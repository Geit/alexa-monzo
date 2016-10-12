'use strict';
const Alexa = require('alexa-sdk');

exports.handler = function (event, context, callback) {
  const alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};

// TO-DO Make an autoloader for this
const handlers = {
  GetBalance: require('./handlers/GetBalance.js'),
  GetSpendingHistory: require('./handlers/GetSpendingHistory.js'),
  GetSpendingToday: require('./handlers/GetSpendingToday.js'),
  GetTargets: require('./handlers/GetTargets.js'),
  Unhandled: require('./handlers/Unhandled.js')
};
