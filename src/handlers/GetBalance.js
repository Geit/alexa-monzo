import monzo from '../monzo';
import { buildAccountName, currencyToWords } from '../utils';
import { translate as t } from '../translator';

export default {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;

    return request.type === 'IntentRequest' && request.intent.name === 'GetBalance';
  },

  async handle({ responseBuilder, requestEnvelope }) {
    const monzoUser = monzo.monzoUser(requestEnvelope);
    if (!monzoUser) return;

    const responseParts = [];

    const enhanceWithBalance = async account => {
      const balance = await monzoUser.getBalance(account.id);
      return {
        ...account,
        balance,
      };
    };

    const accounts = await Promise.all(
      (await monzoUser.getAccounts()).filter(({ closed }) => !closed).map(enhanceWithBalance)
    );

    if (accounts.length > 1) {
      responseParts.push(t('en-gb', 'NumberOfAccountsWithMonzo', { count: accounts.length }));
      accounts.forEach(account => {
        responseParts.push(
          t('en-gb', 'MultipleAccountBalanceWithName', {
            name: buildAccountName(account),
            balance: currencyToWords(account.balance.balance, account.balance.currency),
          })
        );
      });
    } else {
      responseParts.push(
        t('en-gb', 'SingleAccountBalanceWithName', {
          name: buildAccountName(accounts[0]),
          balance: currencyToWords(accounts[0].balance.balance, accounts[0].balance.currency),
        })
      );
    }
    if (!requestEnvelope.session.new)
      this.emit(':ask', `${responseParts.join(' ')} ${t('en-gb', 'ContinueSessionPrompt')}`, t('en-gb', 'Reprompt'));
    else return responseBuilder.speak(responseParts.join(' ')).getResponse();
  },
};
