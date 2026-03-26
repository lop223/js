const transactions = [
  { id: 1, amount: 100, type: 'income' },
  { id: 2, amount: 50, type: 'expense' },
  { id: 3, amount: 200, type: 'income' },
  { id: 4, amount: 80, type: 'expense' }
];

const sumIncome = transactions.filter(transaction => transaction.type === 'income').reduce((sum, a) => sum + a.amount, 0);
console.log(sumIncome);