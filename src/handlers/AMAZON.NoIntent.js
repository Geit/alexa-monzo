import { translate as t } from '../translator';

export default function NoIntent() {
  this.emit(':tell', t(this.locale, 'CloseApplication'));
}
