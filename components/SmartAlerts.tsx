
import React, { useMemo } from 'react';
import { Expense, Category } from '../types';

interface SmartAlertsProps {
  expenses: Expense[];
}

const SmartAlerts: React.FC<SmartAlertsProps> = ({ expenses }) => {
  const alerts = useMemo(() => {
    const activeAlerts: { title: string; desc: string; severity: 'high' | 'medium' }[] = [];
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const weeklyTotals: Record<string, number> = {};
    expenses.forEach(e => {
      if (new Date(e.date) >= sevenDaysAgo) {
        weeklyTotals[e.category] = (weeklyTotals[e.category] || 0) + e.amount;
      }
    });

    if ((weeklyTotals[Category.Food] || 0) > 2000) {
      activeAlerts.push({
        title: 'Food Budget Breached',
        desc: `Weekly food spend hit ₹${weeklyTotals[Category.Food]}. That's above your safe limit!`,
        severity: 'high'
      });
    }

    if ((weeklyTotals[Category.Online] || 0) > 5000) {
      activeAlerts.push({
        title: 'Shopping Surge',
        desc: 'Significant online shopping volume detected this week.',
        severity: 'medium'
      });
    }

    const smallRepeats = expenses
      .filter(e => e.amount >= 20 && e.amount <= 100 && new Date(e.date) >= sevenDaysAgo)
      .length;
    if (smallRepeats > 10) {
      activeAlerts.push({
        title: 'Micro-leak Detected',
        desc: `You have ${smallRepeats} small transactions (<₹100) this week. Watch the loose change!`,
        severity: 'medium'
      });
    }

    return activeAlerts;
  }, [expenses]);

  if (alerts.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center">
        <i className="fa-solid fa-bell text-rose-500 mr-2"></i> Active Alerts
      </h2>
      <div className="space-y-3">
        {alerts.map((alert, idx) => (
          <div key={idx} className={`p-5 rounded-2xl border-l-4 transition-all ${
            alert.severity === 'high' 
              ? 'bg-rose-50 dark:bg-rose-900/10 border-rose-500 text-rose-900 dark:text-rose-100' 
              : 'bg-amber-50 dark:bg-amber-900/10 border-amber-500 text-amber-900 dark:text-amber-100'
          }`}>
            <h4 className="font-black text-base">{alert.title}</h4>
            <p className="text-sm mt-1.5 font-medium opacity-80">{alert.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartAlerts;
