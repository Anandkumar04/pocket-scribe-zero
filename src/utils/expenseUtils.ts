
export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Budget {
  category: string;
  amount: number;
}

export const calculateCategoryTotals = (expenses: Expense[]) => {
  const totals: { [key: string]: number } = {};
  
  expenses.forEach(expense => {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
  });
  
  return totals;
};

export const generateChartData = (expenses: Expense[]) => {
  const categoryTotals = calculateCategoryTotals(expenses);
  const colors = [
    '#1f2937', '#374151', '#4b5563', '#6b7280', 
    '#9ca3af', '#d1d5db', '#e5e7eb'
  ];
  
  return Object.entries(categoryTotals).map(([category, value], index) => ({
    name: category,
    value,
    color: colors[index % colors.length]
  }));
};

export const getTotalSpent = (expenses: Expense[]) => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const getThisMonthExpenses = (expenses: Expense[]) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && 
           expenseDate.getFullYear() === currentYear;
  });
};

export const generateExpenseId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};
