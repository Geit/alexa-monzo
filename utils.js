'use strict';
// TO DO A lot of these probably shouldn't be in here...
const currencyDefinition = {
  'GBP': {
    majorCurrencyUnit (amount) {
      return amount === 1 ? 'pound' : 'pounds';
    },
    minorCurrencyUnit (amount) {
      return 'pence';
    }
  },
  'EUR': {
    majorCurrencyUnit (amount) {
      return amount === 1 ? 'euro' : 'euros';
    },
    minorCurrencyUnit (amount) {
      return amount === 1 ? 'cent' : 'cents';
    }
  },
  'USD': {
    majorCurrencyUnit (amount) {
      return amount === 1 ? 'dollar' : 'dollars';
    },
    minorCurrencyUnit (amount) {
      return amount === 1 ? 'cent' : 'cents';
    }
  }
};

// Surprised Alexa doesn't have a SSML say-as tag for currency, maybe it's undocumented?
// Update: 15th October: Alexa supports currencies! However there are some pitfalls with Amazon's approach
// It doesn't understand many currency symbols, and a null balance is read off simply as zero {majorCurrencyUnit}.
// For now, I'll stick with this approach.
module.exports.currencyToWords = function (amount, currency) {
  currency = currency || 'GBP';

  const amountParts = (amount / 100).toFixed(2).toString().split('.');

  const majorUnits = +amountParts[0];
  const minorUnits = +amountParts[1];

  const responseParts = [];
  if (majorUnits !== 0 || minorUnits === 0)
    responseParts.push(`${majorUnits} ${currencyDefinition[currency].majorCurrencyUnit(majorUnits)}`);

  if (minorUnits !== 0 || majorUnits === 0)
    responseParts.push(`${minorUnits} ${currencyDefinition[currency].minorCurrencyUnit(minorUnits)}`);

  return responseParts.join(' and ');
};

module.exports.handleMonzoError = function (reason) {
  if (reason.error && reason.error.code === 'unauthorized.bad_access_token') {
    this.emit(':tellWithLinkAccountCard', 'Your Monzo access token appears to be invalid, please regenerate it');
  } else {
    console.error(reason);
    this.emit(':tell', `Sorry. I wasn't able to reach Monzo at this time`);
  }
};

module.exports.getAndValidiateMonzoAuthToken = function (context) {
  return context.event.session.user.accessToken || context.emit(':tellWithLinkAccountCard', 'Please link your Monzo account in the Alexa App first') && false;
};

module.exports.properEnglishJoin = function (arr) {
  if (arr.length === 1)
    return arr[0];
  return [arr.slice(0, -1).join(', '), arr.slice(-1)[0]].join(arr.length < 2 ? '' : ', and ');
};
