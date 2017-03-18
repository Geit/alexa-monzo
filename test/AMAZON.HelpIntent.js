/* eslint-env mocha */
require('chai').should();
const lambdaTester = require('./lambdaTester');

describe('AMAZON.HelpIntent', () => {
  it('should return a help message', () => {
    return lambdaTester.testEchoIntent('AMAZON.HelpIntent')
      .then((response) => {
        response.should.equal(`Hi, and thanks for using Monzo for Alexa! You can ask me various things about your Monzo Account.
  <p>Here's some examples for you:</p>
    <p>For your Monzo Balance, simply ask me "What's my balance".</p>
    <p>To find out how much you've spent today, ask "How much have I spent Today".</p>
    <p>You can also ask me more complicated questions about your spending, for example: "How much have I spent on Groceries in the past week".</p>
  `);
      });
  });
});
