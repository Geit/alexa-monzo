process.env.NODE_ENV = 'test';
const intentResponder = require('../index');

module.exports.generateEventForIntent = function (intentName, slots, dontIncludeAccessToken) {
  slots = slots || {};
  const accessToken = dontIncludeAccessToken ? null : 'testingToken';
  return {
    session: {
      application: {
        applicationId: 'testSkill'
      },
      attributes: {},
      user: {
        userId: 'Tester',
        accessToken
      },
      new: true
    },
    request: {
      type: 'IntentRequest',
      locale: 'en-GB',
      timestamp: '2016-10-08T21:40:16Z',
      intent: {
        name: intentName,
        slots
      }
    },
    version: '1.0'
  };
};

module.exports.testEchoIntent = function (intentName, slots, dontIncludeAccessToken) {
  return new Promise((resolve, reject) => {
    intentResponder.handler(this.generateEventForIntent(intentName, slots, dontIncludeAccessToken), {
      succeed (response) {
        resolve(response.response.outputSpeech.ssml.match(/<speak> ([\s\S]*) <\/speak>/)[1]);
      },
      fail (response) {
        reject(response);
      }
    });
  });
};
