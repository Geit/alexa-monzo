import MonzoUser from '../monzo';
import { currencyToWords } from '../utils';
import { translate as t } from '../translator';

export default {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return request.type === 'IntentRequest' && request.intent.name === 'GetSpendingToday';
  },

  async handle(handlerInput) {
    const { responseBuilder } = handlerInput;
    const monzoUser = new MonzoUser(handlerInput);

    if (!monzoUser.isValid()) return responseBuilder.getResponse();

    const accounts = await monzoUser.getAccounts();

    const enhanceWithBalance = async account => {
      const balance = await monzoUser.getBalance(account.id);
      return {
        ...account,
        balance,
      };
    };

    const accountsWithBalance = await Promise.all(accounts.map(enhanceWithBalance));

    const amountSpentToday = accountsWithBalance.reduce((acc, cur) => acc + cur.balance.spend_today, 0);

    if (amountSpentToday < 0)
      responseBuilder.speak(
        t(this.locale, 'SpendingToday', {
          amount: currencyToWords(Math.abs(amountSpentToday), accountsWithBalance[0].balance.currency),
        })
      );
    else responseBuilder.speak(t(this.locale, 'NoSpendingToday'));

    return responseBuilder.getResponse();
  },
};
