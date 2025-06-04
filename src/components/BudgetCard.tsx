
import React from 'react';

interface BudgetCardProps {
  category: string;
  spent: number;
  budget: number;
  icon: string;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ category, spent, budget, icon }) => {
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  const isOverBudget = percentage > 100;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-lg">
            {icon}
          </div>
          <span className="font-medium text-gray-900">{category}</span>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">
            ${spent.toFixed(2)} / ${budget.toFixed(2)}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-700'}`}>
            {percentage.toFixed(0)}% used
          </span>
          <span className={`${isOverBudget ? 'text-red-600' : 'text-gray-500'}`}>
            ${(budget - spent).toFixed(2)} left
          </span>
        </div>
        
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isOverBudget ? 'bg-red-500' : 'bg-gray-800'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
