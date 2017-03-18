'use strict';

const monzo = require('../monzo');
const t = require('../translator').translate;

module.exports = function () {
  const monzoUser = monzo.monzoUser(this);
  if (!monzoUser) return;

  monzoUser.getAccounts().then((accounts) => {
    monzoUser.getCards(accounts[0].id).then((cards) => {
      if (cards[0].status === 'ACTIVE') {
        monzoUser.setCardState(cards[0].id, false).then(() => {
          if (!this.event.session.new)
            this.emit(':ask', `${t(this.locale, 'CardFrozen')} ${t(this.locale, 'ContinueSessionPrompt')}`, t(this.locale, 'Reprompt'));
          else
            this.emit(':tell', t(this.locale, 'CardFrozen'));
        });
      } else if (!this.event.session.new) {
        this.emit(':ask', `${t(this.locale, 'CardAlreadyFrozen')} ${t(this.locale, 'ContinueSessionPrompt')}`, t(this.locale, 'Reprompt'));
      } else {
        this.emit(':tell', t(this.locale, 'CardAlreadyFrozen'));
      }
    });
  });
};
