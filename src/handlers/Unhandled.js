import { translate as t } from '../translator';

export default function UnhandledIntent() {
  this.emit(':tell', t(this.locale, 'UnknownIntent'));
}
