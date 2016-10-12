const intentResponder = require('../index');
// TO DO Promisfy and simplify calling mechanism
module.exports.testLambdaEvent = function (event, successCallback, errorCallback) {
  return intentResponder.handler(event,
    {
      succeed (response) {
        successCallback();
      },
      fail: errorCallback
    });
};

module.exports.generateEventForIntent = function (intentName, slots) {
  slots = slots || {};
  return {
    'session': {
      'application': {
        'applicationId': 'amzn1.ask.skill.cb254b3a-36e7-49ff-82cb-23dfb06f9e8f'
      },
      'attributes': {},
      'user': {
        'userId': 'Tester',
        'accessToken': 'testingToken'
      },
      'new': true
    },
    'request': {
      'type': 'IntentRequest',
      'locale': 'en-GB',
      'timestamp': '2016-10-08T21:40:16Z',
      'intent': {
        'name': intentName,
        slots
      }
    },
    'version': '1.0'
  };
};

module.exports.testEchoIntent = function (intentName, slots) {
  return new Promise((resolve, reject) => {
    intentResponder.handler(this.generateEventForIntent(intentName, slots), {
      succeed (response) {
        resolve(response.response.outputSpeech.ssml.match(/<speak> (.*) <\/speak>/)[1]);
      },
      fail (response) {
        reject(response);
      }
    });
  });
};
