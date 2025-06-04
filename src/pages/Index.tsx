
import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, DollarSign, Target } from 'lucide-react';
import ExpenseCard from '@/components/ExpenseCard';
import ExpenseForm from '@/components/ExpenseForm';
import BudgetCard from '@/components/BudgetCard';
import SpendingChart from '@/components/SpendingChart';
import { 
  Expense, 
  Budget, 
  generateExpenseId, 
  getTotalSpent, 
  getThisMonthExpenses, 
  generateChartData, 
  calculateCategoryTotals 
} from '@/utils/expenseUtils';

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'budget'>('overview');

  const budgets: Budget[] = [
    { category: 'Food', amount: 300 },
    { category: 'Transport', amount: 100 },
    { category: 'Entertainment', amount: 150 },
    { category: 'Shopping', amount: 200 }
  ];

  const categoryIcons: { [key: string]: string } = {
    'Food': '🍕',
    'Transport': '🚗',
    'Education': '📚',
    'Entertainment': '🎬',
    'Shopping': '🛍️',
    'Bills': '💡',
    'Other': '📦'
  };

  // Load expenses from localStorage on component mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExpense,
      id: generateExpenseId()
    };
    setExpenses(prev => [expense, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const thisMonthExpenses = getThisMonthExpenses(expenses);
  const totalSpent = getTotalSpent(thisMonthExpenses);
  const chartData = generateChartData(thisMonthExpenses);
  const categoryTotals = calculateCategoryTotals(thisMonthExpenses);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-gray-900 to-gray-700 text-white p-6 rounded-2xl">
          <div className="flex items-center space-x-3 mb-2">
            <DollarSign size={24} />
            <span className="text-sm opacity-80">This Month</span>
          </div>
          <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
        </div>
        
        <div className="bg-white border border-gray-100 p-6 rounded-2xl">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp size={24} className="text-gray-600" />
            <span className="text-sm text-gray-600">Expenses</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{thisMonthExpenses.length}</div>
        </div>
      </div>

      {/* Spending Chart */}
      <SpendingChart data={chartData} />

      {/* Recent Expenses */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
          <button
            onClick={() => setActiveTab('expenses')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            View All
          </button>
        </div>
        
        {expenses.slice(0, 3).length > 0 ? (
          <div className="space-y-3">
            {expenses.slice(0, 3).map(expense => (
              <div key={expense.id} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-sm">
                    {categoryIcons[expense.category]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{expense.description}</p>
                    <p className="text-xs text-gray-500">{expense.category}</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900">${expense.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">💰</div>
            <p>No expenses yet</p>
            <p className="text-sm">Tap the + button to add your first expense</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderExpenses = () => (
    <div className="space-y-4">
      {expenses.length > 0 ? (
        expenses.map(expense => (
          <ExpenseCard
            key={expense.id}
            {...expense}
            onDelete={handleDeleteExpense}
          />
        ))
      ) : (
        <div className="text-center py-16 text-gray-500">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No expenses yet</h3>
          <p className="mb-6">Start tracking your spending by adding your first expense</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all duration-200"
          >
            Add First Expense
          </button>
        </div>
      )}
    </div>
  );

  const renderBudget = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Budget Overview</h3>
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-gray-900 mb-1">
            ${budgets.reduce((total, budget) => total + budget.amount, 0).toFixed(2)}
          </div>
          <p className="text-gray-500">Total Budget</p>
        </div>
      </div>

      <div className="space-y-4">
        {budgets.map(budget => (
          <BudgetCard
            key={budget.category}
            category={budget.category}
            spent={categoryTotals[budget.category] || 0}
            budget={budget.amount}
            icon={categoryIcons[budget.category]}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ExpenseTracker</h1>
            <p className="text-sm text-gray-500">Manage your spending</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-black text-white p-3 rounded-full hover:bg-gray-800 transition-all duration-200 shadow-lg"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-100 px-6">
        <div className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'expenses', label: 'Expenses', icon: DollarSign },
            { id: 'budget', label: 'Budget', icon: Target }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 border-b-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={20} />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'expenses' && renderExpenses()}
        {activeTab === 'budget' && renderBudget()}
      </div>

      {/* Expense Form Modal */}
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddExpense}
      />
    </div>
  );
};

export default Index;
