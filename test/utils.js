/* eslint-env mocha */
require('chai').should();
const utils = require('../utils');

describe('Currency to Words', () => {
  describe('Converting pounds sterling', () => {
    it('should return valid currency strings', () => {
      utils.currencyToWords(2020, 'GBP').should.equal('20 pounds and 20 pence');
      utils.currencyToWords(10, 'GBP').should.equal('10 pence');
      utils.currencyToWords(100, 'GBP').should.equal('1 pound');
      utils.currencyToWords(15000, 'GBP').should.equal('150 pounds');
      utils.currencyToWords(0, 'GBP').should.equal('0 pounds and 0 pence');
    });
  });
  describe('Converting euros', () => {
    it('should return valid currency strings', () => {
      utils.currencyToWords(2020, 'EUR').should.equal('20 euros and 20 cents');
      utils.currencyToWords(10, 'EUR').should.equal('10 cents');
      utils.currencyToWords(101, 'EUR').should.equal('1 euro and 1 cent');
      utils.currencyToWords(15000, 'EUR').should.equal('150 euros');
      utils.currencyToWords(0, 'EUR').should.equal('0 euros and 0 cents');
    });
  });
  describe('Converting dollars', () => {
    it('should return valid currency strings', () => {
      utils.currencyToWords(2020, 'USD').should.equal('20 dollars and 20 cents');
      utils.currencyToWords(10, 'USD').should.equal('10 cents');
      utils.currencyToWords(101, 'USD').should.equal('1 dollar and 1 cent');
      utils.currencyToWords(15000, 'USD').should.equal('150 dollars');
      utils.currencyToWords(0, 'USD').should.equal('0 dollars and 0 cents');
    });
  });
  describe('No currency defined', () => {
    it('should return pounds sterling', () => {
      utils.currencyToWords(2020).should.equal('20 pounds and 20 pence');
    });
  });
});
