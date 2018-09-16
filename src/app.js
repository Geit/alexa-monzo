import 'source-map-support/register';
import GetBalance from './handlers/GetBalance';
import FreezeCard from './handlers/FreezeCard';
import GetSpendingToday from './handlers/GetSpendingToday';

const Alexa = require('ask-sdk-v1adapter');

// TO-DO Make an autoloader for this
// const handlers = {
//   GetSpendingHistory: require('./handlers/GetSpendingHistory.js'),
//   GetSpendingToday: require('./handlers/GetSpendingToday.js'),
//   GetTargets: require('./handlers/GetTargets.js'),
//   GetUserNumber: require('./handlers/GetUserNumber.js'),
//   FreezeCard: require('./handlers/FreezeCard.js'),
//   UnfreezeCard: require('./handlers/UnfreezeCard.js'),
//   LaunchRequest: require('./handlers/LaunchRequest.js'),
//   Unhandled: require('./handlers/Unhandled.js'),
//   'AMAZON.NoIntent': require('./handlers/AMAZON.NoIntent.js'),
//   'AMAZON.CancelIntent': require('./handlers/AMAZON.NoIntent.js'),
//   'AMAZON.HelpIntent': require('./handlers/AMAZON.HelpIntent.js'),
// };

export function handler(event, context) {
  const alexa = Alexa.handler(event, context);
  if (process.env.NODE_ENV === 'test') alexa.appId = 'testSkill';
  // Reenable the below to enable dynamo db caching of Monzo API requests
  // else
  //  alexa.dynamoDBTableName = 'alexaMonzoCacheTable';
  // alexa.registerHandlers(handlers);
  alexa.registerV2Handlers(GetBalance, FreezeCard, GetSpendingToday);
  alexa.execute();
}
