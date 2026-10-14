
import React, { useState } from 'react';
import { Category, Expense } from '../types';
import { CATEGORIES } from '../constants';

interface ExpenseFormProps {
  onAdd: (expense: Omit<Expense, 'id'>) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAdd }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !category) return;
    onAdd({
      amount: parseFloat(amount),
      category: category as Category,
      description,
      date: new Date(date).toISOString(),
    });
    setAmount('');
    setDescription('');
    setCategory("");
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden group transition-colors">
      <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 transition-opacity">
        <i className="fa-solid fa-hand-holding-dollar text-6xl -rotate-12 dark:text-white"></i>
      </div>
      
      <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center">
        <span className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mr-3">
          <i className="fa-solid fa-receipt"></i>
        </span>
        Log Expense
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2.5 ml-1">Spending Amount (₹)</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-black group-focus-within:text-emerald-500 transition-colors">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-black text-xl placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-inner"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2.5 ml-1">Select Category Type</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-bold appearance-none focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all cursor-pointer shadow-inner"
                required
              >
                <option value="" disabled className="dark:bg-slate-800">Select Category Type</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="dark:bg-slate-800">{cat}</option>
                ))}
              </select>
              <i className="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2.5 ml-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Afternoon Tea"
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-bold placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-inner"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2.5 ml-1">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Transaction Date</label>
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-bold focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-inner"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-5 bg-indigo-600 dark:bg-indigo-500 text-white font-black rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-600 active:scale-[0.97] transition-all shadow-xl shadow-indigo-100 dark:shadow-none uppercase tracking-[0.2em] text-xs flex items-center justify-center"
        >
          Add to Ledger <i className="fa-solid fa-plus-circle ml-3 text-lg"></i>
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
