'use strict';

const monzo = require('../monzo');
const t = require('../translator').translate;

module.exports = function () {
  const monzoUser = monzo.monzoUser(this);
  if (!monzoUser) return;

  // This forces the accounts to be cached on the user's next request
  monzoUser.getAccounts().then((accounts) => {
    this.emit(':ask', t(this.locale, 'LaunchWelcome'), t(this.locale, 'LaunchHelp'));
  });
};
