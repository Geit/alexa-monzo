module.exports = {
  // Accounts
  NumberOfAccountsWithMonzo: [
    `You have {count} accounts with Monzo, their balances are:`,
    `The balances on your {count} Monzo accounts are:`
  ],
  MultipleAccountBalanceWithName: `{name}'s account has a balance of {balance}.`,
  SingleAccountBalanceWithName: `The balance for {name}'s account is {balance}.`,

  // Spending History
  SpendingTotal: `You've spent a total of {amount} in the last {duration}.`,
  SpendingTotalWithCategory: `You've spent a total of {amount} on {category} in the last {duration}.`,
  NoSpending: [
    `You haven't spent anything in the last {duration}!`,
    `Looks like you haven't spent anything in the last {duration}.`,
    `Your spending in the last {duration} is zero.`
  ],
  NoSpendingWithCategory: [
    `You haven't spent anything on {category} in the last {duration}!`,
    `Looks like you haven't spent anything on {category} in the last {duration}.`,
    `Your spending on {category} in the last {duration} is zero.`
  ],

  SpendingToday: [
    `You've spent a total of {amount} today.`,
    `You've spent {amount} today`,
    `Today you've spent {amount}`
  ],
  NoSpendingToday: [
    `You haven't spent anything yet today!`,
    `You've spent nothing today!`
  ],

  // Card Freezing
  CardFrozen: `Your Monzo card has been frozen.`,
  CardAlreadyFrozen: `Your Monzo card is already frozen.`,

  CardUnfrozen: `Your Monzo card has been unfrozen.`,
  CardAlreadyUnfrozen: `Your Monzo card isn't frozen.`,

  // User Number
  UserNumber: `Your user number is {user_number}.`,

  // Generic
  LaunchWelcome: `Welcome to Monzo! What can I help you with today?`,
  LaunchHelp: `You can ask me things like "how much is my balance?" or "How much have I spent in the last week"`,
  CloseApplication: `Thanks for using Monzo for Alexa.`,
  ContinueSessionPrompt: [
    `Is there anything else I can help with?`,
    `Was there anything else I can help you with?`,
    `Can I assist you with anything else?`,
    `Is there anything else you'd like to know?`
  ],
  Reprompt: `You can ask me how much you've spent recently, or how you're doing with your targets.`,
  UnknownIntent: `I'm sorry, I didn't know what to do with your request!`,

  HelpResponse: `Hi, and thanks for using Monzo for Alexa! You can ask me various things about your Monzo Account.
  <p>Here's some examples for you:</p>
    <p>For your Monzo Balance, simply ask me "What's my balance".</p>
    <p>To find out how much you've spent today, ask "How much have I spent Today".</p>
    <p>You can also ask me more complicated questions about your spending, for example: "How much have I spent on Groceries in the past week".</p>
  `
};
