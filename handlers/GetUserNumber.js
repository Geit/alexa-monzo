'use strict';
const monzo = require('../monzo');
const utils = require('../utils');

module.exports = function () {
  const monzoUser = monzo.monzoUser(utils.getAndValidiateMonzoAuthToken(this));
  if (!monzoUser) return;

  monzoUser.getProfile().then((profile) => {
    this.emit(':tell', `Your user number is ${profile.user_number}`);
  }).catch(utils.handleMonzoError.bind(this));
};
