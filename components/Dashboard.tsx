
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Expense, Category } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface DashboardProps {
  expenses: Expense[];
}

const Dashboard: React.FC<DashboardProps> = ({ expenses }) => {
  const categoryData = useMemo(() => {
    const totals: Record<string, number> = {};
    expenses.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const totalSpent = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  
  const highestCategory = useMemo(() => {
    if (categoryData.length === 0) return 'N/A';
    return categoryData.reduce((prev, current) => (prev.value > current.value) ? prev : current).name;
  }, [categoryData]);

  const dailyBurnRate = useMemo(() => {
    if (expenses.length === 0) return 0;
    const today = new Date().getDate();
    return totalSpent / today;
  }, [totalSpent, expenses.length]);

  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between group hover:shadow-md transition-all">
          <span className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">Total Monthly Spend</span>
          <span className="text-4xl font-black text-slate-900 dark:text-white mt-2">₹{totalSpent.toLocaleString()}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between group hover:shadow-md transition-all">
          <span className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">Top Spending</span>
          <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400 mt-2">{highestCategory}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between group hover:shadow-md transition-all">
          <span className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">Daily Burn Rate</span>
          <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400 mt-2">₹{dailyBurnRate.toFixed(0)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 h-80 transition-colors">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Allocation</h3>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={categoryData}
                innerRadius={65}
                outerRadius={85}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#ccc'} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                  fontWeight: 'bold',
                  color: isDark ? '#f8fafc' : '#1e293b'
                }}
                itemStyle={{ color: isDark ? '#f8fafc' : '#1e293b' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 h-80 transition-colors">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Trend</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={expenses.slice(-7)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
              <XAxis 
                dataKey="date" 
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 700 }}
                tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: isDark ? '#334155' : '#f8fafc' }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                  fontWeight: 'bold' 
                }}
                labelFormatter={(str) => new Date(str).toLocaleDateString()} 
                itemStyle={{ color: isDark ? '#f8fafc' : '#1e293b' }}
              />
              <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
