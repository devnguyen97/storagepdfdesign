import I18n from 'react-native-i18n';
import en from './file/en.json';
import fr from './file/fr.json';
import de from './file/de.json';
import th from './file/th.json';
import nl from './file/nl.json';


I18n.fallbacks = true;
I18n.translations = {
    en,
    fr,
    de,
    th,
    nl
};


export default I18n;

