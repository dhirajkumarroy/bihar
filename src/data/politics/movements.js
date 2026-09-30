import {politicalHistory} from './history';
// Reference canonical narratives rather than maintaining competing biographies.
export const movements=politicalHistory.filter(item=>['champaran-satyagraha','quit-india-bihar','land-reforms-bihar','jp-movement','social-change-bihar','jharkhand-formation'].includes(item.slug));
