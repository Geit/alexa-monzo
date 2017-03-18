'use strict';

const t = require('../translator').translate;

module.exports = function () {
  if (!this.event.session.new)
    this.emit(':ask', `${t(this.locale, 'HelpResponse')} ${t(this.locale, 'ContinueSessionPrompt')}`, t(this.locale, 'Reprompt'));
  else
    this.emit(':tell', t(this.locale, 'HelpResponse'));
};
