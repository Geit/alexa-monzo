/* eslint-env mocha */
const chai = require('chai');
const should = chai.should();
const lambdaTester = require('./lambdaTester');

// This is an attempt to test an alexa application, it doesn't yet function correctly.
describe('GetBalance', () => {
  describe('with no slots defined', () => {
    it('should do something', (done) => {
      lambdaTester.testLambdaEvent(lambdaTester.generateEventForIntent('GetSpendingToday'), (response) => {
        response.should.equal('Your Monzo access token appears to be invalid, please regenerate it');
        done();
      }, (error) => {
        console.log(error);
      });
    });
  });
});
