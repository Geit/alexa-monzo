const monzo = require('../monzo');
const _ = require('underscore');
const utils = require('../utils');

module.exports = function () {
  const monzoUser = monzo.monzoUser(utils.getAndValidiateMonzoAuthToken(this));
  if (!monzoUser) return;

  monzoUser.getAccounts().then((accounts) => {
    monzoUser.getTargets(accounts[0].id).then((targets) => {
      if (!targets.targets.length)
        return this.emit(':tell', `You don't have any targets, Set some up in the Monzo App!`);

      // TODO maybe give special treatment to the "total" target
      const targetBuckets = _.groupBy(targets.targets, 'status');
      if (targetBuckets['OKAY'] && targetBuckets['OKAY'].length === targets.targets.length) {
        this.emit(':tell', `You're currently within all your targets for this ${targets.interval_type}`);
      } else {
        const responseParts = [];
        if (targetBuckets['EXCEEDED'] && targetBuckets['EXCEEDED'].length)
          responseParts.push(`You've exceeded your target for the following categories: ${_.pluck(targetBuckets['EXCEEDED'], 'name').join(' ').replace('_', ' ')}.`);

        if (targetBuckets['WARNING'] && targetBuckets['WARNING'].length)
          responseParts.push(`You're close to exceeding your target for these categories: ${_.pluck(targetBuckets['WARNING'], 'name').join(' ').replace('_', ' ')}.`);

        if (targetBuckets['OKAY'] && targetBuckets['OKAY'].length)
          responseParts.push(`You're still on target for the following categories: ${_.pluck(targetBuckets['OKAY'], 'name').join(' ').replace('_', ' ')}`);

        this.emit(':tell', responseParts.join(' '));
      }
    });
  }).catch(utils.andleMonzoError.bind(this));
};
