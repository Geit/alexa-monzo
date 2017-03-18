'use strict';

const Alexa = require('alexa-sdk');

// TO-DO Make an autoloader for this
const handlers = {
  GetBalance: require('./handlers/GetBalance.js'),
  GetSpendingHistory: require('./handlers/GetSpendingHistory.js'),
  GetSpendingToday: require('./handlers/GetSpendingToday.js'),
  GetTargets: require('./handlers/GetTargets.js'),
  GetUserNumber: require('./handlers/GetUserNumber.js'),
  FreezeCard: require('./handlers/FreezeCard.js'),
  UnfreezeCard: require('./handlers/UnfreezeCard.js'),
  LaunchRequest: require('./handlers/LaunchRequest.js'),
  Unhandled: require('./handlers/Unhandled.js'),
  'AMAZON.NoIntent': require('./handlers/AMAZON.NoIntent.js'),
  'AMAZON.CancelIntent': require('./handlers/AMAZON.NoIntent.js'),
  'AMAZON.HelpIntent': require('./handlers/AMAZON.HelpIntent.js')
};

exports.handler = function (event, context, callback) {
  const alexa = Alexa.handler(event, context);
  if (process.env.NODE_ENV === 'test')
    alexa.appId = 'testSkill';
  // Reenable the below to enable dynamo db caching of Monzo API requests
  // else
  //  alexa.dynamoDBTableName = 'alexaMonzoCacheTable';
  alexa.registerHandlers(handlers);
  alexa.execute();
};
