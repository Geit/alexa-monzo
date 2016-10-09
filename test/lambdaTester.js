const intentResponder = require('../index');

module.exports.testLambdaEvent = function (event, successCallback, errorCallback) {
  intentResponder.handler(event,
    {
      succeed (response) {
        successCallback(response.response.outputSpeech.ssml.match(/<speak> (.*) <\/speak>/)[1]);
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
        'accessToken': process.argv[2]
      },
      'new': true
    },
    'request': {
      'type': 'IntentRequest',
      'locale': 'en-GB',
      'timestamp': '2016-10-08T21:40:16Z',
      'intent': {
        'name': intentName,
        'slots': {}
      }
    },
    'version': '1.0'
  };
};
