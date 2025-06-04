
import React from 'react';
import { Trash2 } from 'lucide-react';

interface ExpenseCardProps {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  onDelete: (id: string) => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ 
  id, 
  amount, 
  category, 
  description, 
  date, 
  onDelete 
}) => {
  const categoryIcons: { [key: string]: string } = {
    'Food': '🍕',
    'Transport': '🚗',
    'Education': '📚',
    'Entertainment': '🎬',
    'Shopping': '🛍️',
    'Bills': '💡',
    'Other': '📦'
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-3 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-lg">
            {categoryIcons[category] || '📦'}
          </div>
          <div>
            <p className="font-medium text-gray-900">{description}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{category}</span>
              <span>•</span>
              <span>{date}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-lg text-gray-900">
            ${amount.toFixed(2)}
          </span>
          <button
            onClick={() => onDelete(id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
