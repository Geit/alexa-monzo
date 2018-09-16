import monzo from '../monzo';
import utils from '../utils';
import { translate as t } from '../translator';

export default function GetUserNumber() {
  const monzoUser = monzo.monzoUser(this);
  if (!monzoUser) return;

  monzoUser
    .getProfile()
    .then(profile => {
      if (!this.event.session.new)
        this.emit(
          ':ask',
          `${t(this.locale, 'UserNumber', { user_number: profile.user_number })}.  ${t(
            this.locale,
            'ContinueSessionPrompt'
          )}`,
          t(this.locale, 'Reprompt')
        );
      else this.emit(':tell', t(this.locale, 'UserNumber', { user_number: profile.user_number }));
    })
    .catch(utils.handleMonzoError.bind(this));
}
