// Run a local server first, then: node scripts/test-navigation.cjs http://127.0.0.1:5178
// Uses Node's built-in WebSocket and a local Chrome/Edge installation; no test dependencies.
const assert = require('node:assert/strict');
const {spawn} = require('node:child_process');
const {existsSync, mkdtempSync} = require('node:fs');
const {tmpdir} = require('node:os');
const {join} = require('node:path');

const origin = process.argv[2] || 'http://127.0.0.1:5178';
const executable = [process.env.BROWSER_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
].find(path => path && existsSync(path));
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  assert(executable, 'Set BROWSER_PATH to an installed Chromium browser.');
  await fetch(origin);
  // A separate temporary profile never reads or changes the user's browser profile.
  const profile = mkdtempSync(join(tmpdir(), 'bihar-navigation-'));
  const browser = spawn(executable, ['--headless=new', '--remote-debugging-port=0',
    `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', 'about:blank'],
  {windowsHide: true, stdio: ['ignore', 'ignore', 'pipe']});
  let socket, closeBrowser;
  const pending = new Map();
  let nextId = 0;
  try {
    const endpoint = await new Promise((resolve, reject) => {
      let output = '';
      const timeout = setTimeout(() => reject(new Error('Browser startup timed out.')), 15000);
      browser.once('error', error => {clearTimeout(timeout); reject(error);});
      browser.once('exit', code => {clearTimeout(timeout); reject(new Error(`Browser exited: ${code}`));});
      browser.stderr.on('data', chunk => {
        output += chunk;
        const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
        if (match) {clearTimeout(timeout); resolve(match[1]);}
      });
    });
    const debuggerOrigin = endpoint.replace(/^ws:/, 'http:').split('/devtools/')[0];
    const targets = await (await fetch(`${debuggerOrigin}/json/list`)).json();
    socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {socket.onopen = resolve; socket.onerror = reject;});
    const runtimeErrors = [];
    socket.onmessage = event => {
      const message = JSON.parse(event.data);
      if (message.id && pending.has(message.id)) {
        const {resolve, reject, timeout} = pending.get(message.id);
        clearTimeout(timeout); pending.delete(message.id);
        if (message.error) reject(new Error(JSON.stringify(message.error)));
        else resolve(message.result);
      }
      if (message.method === 'Runtime.exceptionThrown') runtimeErrors.push(message.params.exceptionDetails);
    };
    const call = (method, params = {}) => new Promise((resolve, reject) => {
      const id = ++nextId;
      const timeout = setTimeout(() => {pending.delete(id); reject(new Error(`Timed out: ${method}`));}, 15000);
      pending.set(id, {resolve, reject, timeout});
      socket.send(JSON.stringify({id, method, params}));
    });
    closeBrowser = () => call('Browser.close');
    const evaluate = async expression => {
      const result = await call('Runtime.evaluate', {expression, returnByValue: true, awaitPromise: true});
      if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    };
    const waitFor = async (expression, label) => {
      for (let attempt = 0; attempt < 100; attempt++) {
        if (await evaluate(expression)) return;
        await delay(100);
      }
      throw new Error(`Failed: ${label}`);
    };
    const click = async expression => {
      const point = await evaluate(`(() => {
        const element = ${expression};
        if (!element) throw new Error('Missing click target');
        element.scrollIntoView({block:'nearest',behavior:'instant'});
        const rect = element.getBoundingClientRect();
        const x = rect.x + rect.width / 2, y = rect.y + rect.height / 2;
        if (!rect.width || !rect.height || !element.contains(document.elementFromPoint(x, y)))
          throw new Error('Click target is hidden or covered: ' + JSON.stringify({text:element.textContent,path:location.pathname,rect:rect.toJSON(),open:element.closest('details')?.open,cover:document.elementFromPoint(x,y)?.outerHTML.slice(0,300)}));
        return {x, y};
      })()`);
      await call('Input.dispatchMouseEvent', {type: 'mousePressed', button: 'left', clickCount: 1, ...point});
      await call('Input.dispatchMouseEvent', {type: 'mouseReleased', button: 'left', clickCount: 1, ...point});
      await delay(60);
    };
    const key = async (key, code, windowsVirtualKeyCode, modifiers = 0) => {
      const text = key === 'Enter' ? '\r' : key === ' ' ? ' ' : undefined;
      await call('Input.dispatchKeyEvent', {type: text ? 'keyDown' : 'rawKeyDown', key, code, windowsVirtualKeyCode, modifiers, text, unmodifiedText: text});
      await call('Input.dispatchKeyEvent', {type: 'keyUp', key, code, windowsVirtualKeyCode, modifiers});
      await delay(60);
    };
    const resize = (width, height = 900) => call('Emulation.setDeviceMetricsOverride', {width, height, deviceScaleFactor: 1, mobile: false});
    const summary = (index, mobile = false) => `document.querySelectorAll('${mobile ? '.mobile-nav' : '.site-navigation'} summary')[${index}]`;
    const openCount = "document.querySelectorAll('.site-navigation__group[open]').length";
    await call('Runtime.enable');
    await call('Page.enable');
    await resize(1440);
    await call('Page.navigate', {url: origin});
    await waitFor("document.querySelector('#main-content h1') && document.querySelectorAll('.site-navigation summary').length === 4", 'home loaded');

    for (const width of [1440, 1110]) {
      await resize(width);
      for (let index = 0; index < 4; index++) {
        await click(summary(index));
        assert.equal(await evaluate(openCount), 1, 'Only one menu may be open');
        assert.equal(await evaluate(`${summary(index)}.getAttribute('aria-expanded')`), 'true');
        assert(await evaluate(`(() => {const r=${summary(index)}.nextElementSibling.getBoundingClientRect();return r.left>=0 && r.right<=innerWidth;})()`), 'Dropdown stays within viewport');
      }
      await click(summary(3));
      assert.equal(await evaluate(openCount), 0, 'Clicking the same trigger closes it');
      await click(summary(0));
      await call('Input.dispatchMouseEvent', {type: 'mousePressed', button: 'left', clickCount: 1, x: 5, y: 150});
      await call('Input.dispatchMouseEvent', {type: 'mouseReleased', button: 'left', clickCount: 1, x: 5, y: 150});
      await waitFor(`${openCount} === 0`, 'outside click closes menu');
    }
    await evaluate(`${summary(0)}.focus()`);
    assert(await evaluate(`document.activeElement === ${summary(0)}`), 'Desktop summary receives keyboard focus');
    await key('Enter', 'Enter', 13);
    assert.equal(await evaluate(openCount), 1, 'Enter opens a menu');
    await key('Escape', 'Escape', 27);
    assert.equal(await evaluate(openCount), 0, 'Escape closes a menu');
    assert(await evaluate(`document.activeElement === ${summary(0)}`), 'Escape restores trigger focus');
    await key(' ', 'Space', 32);
    assert.equal(await evaluate(openCount), 1, 'Space opens a menu');
    await evaluate("document.querySelector('.actions>a').focus()");
    await waitFor(`${openCount} === 0`, 'moving focus outside closes menu');
    console.log('PASS: desktop exclusivity, toggle, outside click, keyboard and viewport positioning');

    const links = await evaluate("[...document.querySelectorAll('.site-navigation__group')].flatMap((group,index)=>[...group.querySelectorAll('a')].map(link=>({index,href:link.getAttribute('href')})))");
    for (const {index, href} of links) {
      await click(summary(index));
      await click(`document.querySelectorAll('.site-navigation .site-navigation__group')[${index}].querySelector('a[href="${href}"]')`);
      await waitFor(`location.pathname + location.hash === ${JSON.stringify(href)} && document.querySelector('#main-content h1') && !document.querySelector('#main-content .loading') && new URL(document.querySelector('link[rel="canonical"]').href).pathname === location.pathname`, href);
      assert.equal(await evaluate(openCount), 0, `Selection closes menu: ${href}`);
      assert.equal(await evaluate("!!document.querySelector('.route-error,.notfound')"), false, `Page renders: ${href}`);
      if (href.includes('#')) await waitFor("Math.abs(document.getElementById('circuits')?.getBoundingClientRect().top-132) < 5", 'circuit link scrolls to section');
    }
    await click("document.querySelector('.site-navigation__home')");
    await waitFor("location.pathname === '/' && !!document.querySelector('#main-content h1')", 'home link');
    await click(summary(1));
    await click("document.querySelector('.site-navigation__menu a[href=\"/tourism#circuits\"]')");
    await waitFor("location.hash === '#circuits' && !!document.getElementById('circuits') && Math.abs(document.getElementById('circuits').getBoundingClientRect().top-132)<5", 'cross-page circuit anchor');
    await evaluate("window.scrollTo({top:0,behavior:'instant'})");
    await click(summary(1));
    await click("document.querySelector('.site-navigation__menu a[href=\"/tourism#circuits\"]')");
    await waitFor("Math.abs(document.getElementById('circuits')?.getBoundingClientRect().top-132)<5", 'repeat same anchor');
    await click(summary(1));
    await click("document.querySelector('.site-navigation__menu a[href=\"/tourism\"]')");
    await waitFor("location.pathname === '/tourism' && !location.hash && scrollY === 0", 'tourism link returns from its section to page top');
    await click("document.querySelector('.actions>a')");
    await waitFor("location.pathname === '/search' && !!document.querySelector('.search-page input') && new URL(document.querySelector('link[rel=\"canonical\"]').href).pathname === '/search' && scrollY === 0", 'search link and new-page scroll');
    console.log(`PASS: all ${links.length} dropdown links, home, search and circuit anchor navigation`);

    for (const width of [390, 320]) {
      await resize(width, 844);
      await click("document.querySelector('.actions .menu')");
      await waitFor("!!document.querySelector('.mobile-nav')", 'mobile panel opens');
      assert(await evaluate("document.getElementById('root').inert && document.body.style.overflow === 'hidden'"), 'Background is inert and scroll locked');
      const panelSize = await evaluate("({rect:document.querySelector('.mobile-nav').getBoundingClientRect().toJSON(),width:document.documentElement.clientWidth,height:innerHeight})");
      assert(panelSize.rect.top === 0 && panelSize.rect.height === panelSize.height && panelSize.rect.width === panelSize.width, `Mobile panel fills viewport: ${JSON.stringify(panelSize)}`);
      for (let index = 0; index < 4; index++) {
        await click(summary(index, true));
        assert.equal(await evaluate(openCount), 1, `Only one mobile group opens (width ${width}, group ${index})`);
      }
      await key('Escape', 'Escape', 27);
      assert.equal(await evaluate(openCount), 0, 'First Escape closes group');
      assert(await evaluate("!!document.querySelector('.mobile-nav')"), 'Dialog remains after group dismissal');
      await key('Escape', 'Escape', 27);
      await waitFor("!document.querySelector('.mobile-nav') && !document.getElementById('root').inert", 'second Escape closes dialog');
      assert.equal(await evaluate("document.body.style.overflow"), '', 'Body scroll restored');
      assert.equal(await evaluate("document.documentElement.style.overflow"), '', 'Root scroll restored');
      assert(await evaluate("document.activeElement === document.querySelector('.actions .menu')"), 'Focus returns to hamburger');
      await click("document.querySelector('.actions .menu')");
      await evaluate("document.querySelector('.mobile-nav__header button').focus()");
      await key('Tab', 'Tab', 9, 8);
      assert(await evaluate(`document.activeElement === ${summary(3, true)}`), 'Shift+Tab wraps, excluding closed links');
      await key('Tab', 'Tab', 9);
      assert(await evaluate("document.activeElement === document.querySelector('.mobile-nav__header button')"), 'Tab wraps to first control');
      await click(summary(1, true));
      await click("document.querySelector('.mobile-nav a[href=\"/tourism#circuits\"]')");
      await waitFor("!document.querySelector('.mobile-nav') && !!document.getElementById('circuits') && Math.abs(document.getElementById('circuits').getBoundingClientRect().top-132)<5", 'mobile selection closes panel and navigates');
      await click("document.querySelector('.actions .menu')");
      await click("document.querySelector('.mobile-nav__header button')");
      assert.equal(await evaluate("!!document.querySelector('.mobile-nav')"), false, 'Mobile close button works');
      await click("document.querySelector('.actions .menu')");
      await resize(1440);
      await waitFor("!document.querySelector('.mobile-nav') && !document.getElementById('root').inert && document.body.style.overflow !== 'hidden'", 'desktop resize clears dialog');
    }
    assert.deepEqual(runtimeErrors, [], 'No uncaught runtime errors');
    console.log('PASS: mobile exclusivity, full-screen panel, focus trap, links, close, Escape and resize cleanup');
  } finally {
    await closeBrowser?.().catch(() => {});
    for (const {timeout} of pending.values()) clearTimeout(timeout);
    socket?.close();
    browser.kill();
  }
}

main().catch(error => {console.error(error); process.exitCode = 1;});
