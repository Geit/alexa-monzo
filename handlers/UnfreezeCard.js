'use strict';

const monzo = require('../monzo');
const t = require('../translator').translate;

module.exports = function () {
  const monzoUser = monzo.monzoUser(this);
  if (!monzoUser) return;

  monzoUser.getAccounts().then((accounts) => {
    monzoUser.getCards(accounts[0].id).then((cards) => {
      if (cards[0].status === 'INACTIVE') {
        monzoUser.setCardState(cards[0].id, true).then(() => {
          if (!this.event.session.new)
            this.emit(':ask', `${t(this.locale, 'CardUnfrozen')} ${t(this.locale, 'ContinueSessionPrompt')}`);
          else
            this.emit(':tell', t(this.locale, 'CardUnfrozen'));
        });
      } else if (!this.event.session.new) {
        this.emit(':ask', `${t(this.locale, 'CardAlreadyUnfrozen')} ${t(this.locale, 'ContinueSessionPrompt')}`);
      } else {
        this.emit(':tell', t(this.locale, 'CardAlreadyUnfrozen'));
      }
    });
  });
};
