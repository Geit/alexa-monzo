/* eslint-env mocha */
require('chai').should();
const lambdaTester = require('./lambdaTester');

describe('Unhandled', () => {
  it('should return a help message', () => {
    return lambdaTester.testEchoIntent('ABBC') // Intent doesn't exist
      .then((response) => {
        response.should.equal(`I'm sorry, I didn't know what to do with your request!`);
      });
  });
});
