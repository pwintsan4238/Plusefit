import React, { useState } from 'react';
import { MealItem } from '../../types';
import { X, Calendar, Sparkles, Plus, ArrowRight, Utensils, CheckCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  plannedMeals: MealItem[];
  onTrackAllToDiary: () => void;
}

export const MealPlannerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  plannedMeals,
  onTrackAllToDiary
}) => {
  const [selectedDay, setSelectedDay] = useState('Today (Thu)');
  const [autoBalanced, setAutoBalanced] = useState(false);

  if (!isOpen) return null;

  const days = [
    { name: 'Mon', date: 'Oct 26', cals: 1890 },
    { name: 'Tue', date: 'Oct 27', cals: 1910 },
    { name: 'Wed', date: 'Oct 28', cals: 1885 },
    { name: 'Today (Thu)', date: 'Oct 29', cals: 1901, isToday: true },
    { name: 'Fri', date: 'Oct 30', cals: 1920 },
    { name: 'Sat', date: 'Oct 31', cals: 1850 },
    { name: 'Sun', date: 'Nov 01', cals: 1900 },
  ];

  const handleAutoBalance = () => {
    setAutoBalanced(true);
    setTimeout(() => setAutoBalanced(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/45 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-800 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-50 flex items-center gap-2">
                Weekly Meal Planner
              </h2>
              <p className="text-xs text-slate-400">
                Precision macro & calorie optimization (Target: 1,900 kcal/day)
              </p>
            </div>
          </div>
          <button aria-label="Close"
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-50 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Days selector */}
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center gap-2 overflow-x-auto">
          {days.map(d => (
            <button
              key={d.name}
              onClick={() => setSelectedDay(d.name)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-center transition-all ${
                selectedDay === d.name
                  ? 'bg-amber-500/20 border border-amber-500/50 text-amber-800'
                  : 'bg-slate-800/60 hover:bg-slate-800 border border-slate-750 text-slate-300'
              }`}
            >
              <div className="text-xs font-semibold">{d.name}</div>
              <div className="text-xs font-mono text-slate-400">{d.cals} kcal</div>
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20">
            <div>
              <h4 className="text-sm font-bold text-amber-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Smart Calorie Target: 1,901 cals
              </h4>
              <p className="text-xs text-slate-400">
                Balanced for 135g Protein, 180g Carbs, 55g Fat, 28g Fibre
              </p>
            </div>
            <button
              onClick={handleAutoBalance}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-ink flex items-center gap-1.5 transition-colors shadow-sm"
            >
              {autoBalanced ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Balanced!
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Auto-Balance
                </>
              )}
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
              Planned Courses for {selectedDay}
            </h4>
            {plannedMeals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={meal.photoUrl}
                    alt={meal.name}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-700"
                  />
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                      {meal.category}
                    </span>
                    <h5 className="text-sm font-semibold text-slate-50">{meal.name}</h5>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{meal.calories} cals</span>
                      <span>•</span>
                      <span>{meal.prepTime}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-medium text-emerald-700">
                    {meal.macros.protein}g P
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <span className="text-xs text-slate-400">All planned meals total 1,901 calories</span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-50"
            >
              Close
            </button>
            <button
              onClick={() => {
                onTrackAllToDiary();
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-ink rounded-lg flex items-center gap-1.5 transition-colors"
            >
              Track All to Diary
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
