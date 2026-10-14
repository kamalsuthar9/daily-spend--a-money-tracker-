
import React, { useState, useEffect } from 'react';
import { Expense, LeakInsight } from '../types';
import { analyzeExpenses } from '../services/geminiService';

interface LeakInsightsProps {
  expenses: Expense[];
}

const LeakInsights: React.FC<LeakInsightsProps> = ({ expenses }) => {
  const [insights, setInsights] = useState<LeakInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const getInsights = async () => {
    setLoading(true);
    const result = await analyzeExpenses(expenses);
    setInsights(result);
    setLoading(false);
  };

  useEffect(() => {
    if (expenses.length > 0) {
      getInsights();
    }
  }, [expenses.length]);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
          <i className="fa-solid fa-wand-magic-sparkles text-amber-500 mr-2"></i> Leak Detection
        </h2>
        <button 
          onClick={getInsights} 
          disabled={loading}
          className="text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 px-4 py-2 rounded-xl transition-all"
        >
          {loading ? 'Analyzing...' : 'Refresh AI'}
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array(2).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="rounded-xl bg-slate-200 dark:bg-slate-700 h-10 w-10"></div>
              <div className="flex-1 space-y-3 py-1">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
              </div>
            </div>
          ))
        ) : insights.length > 0 ? (
          insights.map((insight, index) => (
            <div 
              key={index} 
              className={`p-5 rounded-2xl border flex items-start space-x-4 transition-all transform hover:scale-[1.01] ${
                insight.type === 'leak' ? 'bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/30' : 
                insight.type === 'warning' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30' : 
                'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30'
              }`}
            >
              <div className={`mt-1 p-2.5 rounded-xl ${
                insight.type === 'leak' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' : 
                insight.type === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 
                'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              }`}>
                <i className={`fa-solid ${
                  insight.type === 'leak' ? 'fa-faucet-drip' : 
                  insight.type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-info'
                }`}></i>
              </div>
              <div className="flex-1">
                <h4 className={`font-black ${
                  insight.type === 'leak' ? 'text-rose-900 dark:text-rose-100' : 
                  insight.type === 'warning' ? 'text-amber-900 dark:text-amber-100' : 
                  'text-blue-900 dark:text-blue-100'
                }`}>
                  {insight.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium mt-1">{insight.message}</p>
                {insight.potentialSaving && (
                  <p className="text-xs mt-3 font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    Potential Savings: ₹{insight.potentialSaving}/mo
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-slate-400 dark:text-slate-600 italic font-medium">
            No leaks detected yet. Start tracking!
          </div>
        )}
      </div>
    </div>
  );
};

export default LeakInsights;
