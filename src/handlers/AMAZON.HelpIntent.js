import { translate as t } from '../translator';

export default function HelpIntent() {
  if (!this.event.session.new)
    this.emit(
      ':ask',
      `${t(this.locale, 'HelpResponse')} ${t(this.locale, 'ContinueSessionPrompt')}`,
      t(this.locale, 'Reprompt')
    );
  else this.emit(':tell', t(this.locale, 'HelpResponse'));
}
