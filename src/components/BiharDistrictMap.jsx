export default function BiharDistrictMap() {
  return (
    <figure className="district-map">
      <div className="district-map__frame">
        <img
          src="/assets/bihar-districts-heritage.svg"
          alt="बिहार के सभी 38 जिलों की सीमाओं और नामों वाला मानचित्र"
          loading="lazy"
        />
      </div>
      <figcaption>
        <span>बिहार के 38 जिलों का प्रशासनिक मानचित्र</span>
        <a
          href="https://commons.wikimedia.org/wiki/File:Bihar_districts.svg"
          target="_blank"
          rel="noreferrer"
        >
          स्रोत · Wikimedia Commons (CC BY-SA 4.0)
        </a>
      </figcaption>
    </figure>
  );
}
