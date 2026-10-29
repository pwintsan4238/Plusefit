import React, { useState } from 'react';
import { X, Target, Sparkles, Check, Flame } from 'lucide-react';
import { MacroNutrients } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentDailyTarget: number;
  currentMacrosTotal: MacroNutrients;
  onSaveGoals: (newDailyTarget: number, newMacrosTotal: MacroNutrients) => void;
}

export const AdjustGoalsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentDailyTarget,
  currentMacrosTotal,
  onSaveGoals
}) => {
  const [dailyCalories, setDailyCalories] = useState<number>(currentDailyTarget);
  const [proteinGrams, setProteinGrams] = useState<number>(currentMacrosTotal.protein);
  const [carbsGrams, setCarbsGrams] = useState<number>(currentMacrosTotal.carbs);
  const [fatGrams, setFatGrams] = useState<number>(currentMacrosTotal.fat);
  const [fibreGrams, setFibreGrams] = useState<number>(currentMacrosTotal.fibre);

  if (!isOpen) return null;

  // Preset plans
  const applyPreset = (type: 'cutting' | 'maintenance' | 'muscle_gain' | 'low_carb') => {
    if (type === 'cutting') {
      setDailyCalories(1950);
      setProteinGrams(165);
      setCarbsGrams(160);
      setFatGrams(50);
      setFibreGrams(32);
    } else if (type === 'maintenance') {
      setDailyCalories(2400);
      setProteinGrams(160);
      setCarbsGrams(240);
      setFatGrams(70);
      setFibreGrams(35);
    } else if (type === 'muscle_gain') {
      setDailyCalories(2750);
      setProteinGrams(185);
      setCarbsGrams(310);
      setFatGrams(75);
      setFibreGrams(40);
    } else if (type === 'low_carb') {
      setDailyCalories(2100);
      setProteinGrams(175);
      setCarbsGrams(90);
      setFatGrams(95);
      setFibreGrams(30);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveGoals(dailyCalories, {
      protein: proteinGrams,
      carbs: carbsGrams,
      fat: fatGrams,
      fibre: fibreGrams,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/45 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-800 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-50">Adjust Nutrition Goals</h2>
              <p className="text-xs text-slate-400">Calibrate your daily calorie budget & target macros</p>
            </div>
          </div>
          <button aria-label="Close"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-50 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Goal Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => applyPreset('cutting')}
                className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-750 text-left transition-colors"
              >
                <div className="text-xs font-bold text-slate-50">Lean Cut</div>
                <div className="text-xs text-slate-400">1,950 kcal • High Protein</div>
              </button>
              <button
                type="button"
                onClick={() => applyPreset('maintenance')}
                className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-750 text-left transition-colors"
              >
                <div className="text-xs font-bold text-slate-50">Maintenance</div>
                <div className="text-xs text-slate-400">2,400 kcal • Balanced 40/30/30</div>
              </button>
              <button
                type="button"
                onClick={() => applyPreset('muscle_gain')}
                className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-750 text-left transition-colors"
              >
                <div className="text-xs font-bold text-slate-50">Hypertrophy Bulk</div>
                <div className="text-xs text-slate-400">2,750 kcal • Heavy Fuel</div>
              </button>
              <button
                type="button"
                onClick={() => applyPreset('low_carb')}
                className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-750 text-left transition-colors"
              >
                <div className="text-xs font-bold text-slate-50">Keto / Low-Carb</div>
                <div className="text-xs text-slate-400">2,100 kcal • High Fat</div>
              </button>
            </div>
          </div>

          {/* Daily Calorie Target */}
          <div className="space-y-2 p-3.5 rounded-xl bg-slate-800/40 border border-slate-750">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-800" />
                Daily Calorie Target (kcal)
              </label>
              <span className="text-lg font-mono font-bold text-slate-50">
                {dailyCalories} kcal
              </span>
            </div>
            <input
              type="range"
              min="1400"
              max="3800"
              step="50"
              value={dailyCalories}
              onChange={(e) => setDailyCalories(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
            />
          </div>

          {/* Individual Macros */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Macronutrient Targets (Grams)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
                <span className="text-xs font-bold uppercase text-rose-700 block">Protein</span>
                <input
                  type="number"
                  value={proteinGrams}
                  onChange={(e) => setProteinGrams(parseInt(e.target.value) || 0)}
                  className="w-full text-center bg-slate-900 border border-slate-700 rounded-lg py-1.5 text-sm font-mono font-bold text-slate-50 focus:outline-none focus:border-rose-400"
                />
                <span className="text-xs text-slate-400 text-center block">grams</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
                <span className="text-xs font-bold uppercase text-amber-800 block">Carbs</span>
                <input
                  type="number"
                  value={carbsGrams}
                  onChange={(e) => setCarbsGrams(parseInt(e.target.value) || 0)}
                  className="w-full text-center bg-slate-900 border border-slate-700 rounded-lg py-1.5 text-sm font-mono font-bold text-slate-50 focus:outline-none focus:border-amber-400"
                />
                <span className="text-xs text-slate-400 text-center block">grams</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
                <span className="text-xs font-bold uppercase text-cyan-700 block">Fat</span>
                <input
                  type="number"
                  value={fatGrams}
                  onChange={(e) => setFatGrams(parseInt(e.target.value) || 0)}
                  className="w-full text-center bg-slate-900 border border-slate-700 rounded-lg py-1.5 text-sm font-mono font-bold text-slate-50 focus:outline-none focus:border-cyan-400"
                />
                <span className="text-xs text-slate-400 text-center block">grams</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
                <span className="text-xs font-bold uppercase text-emerald-700 block">Fibre</span>
                <input
                  type="number"
                  value={fibreGrams}
                  onChange={(e) => setFibreGrams(parseInt(e.target.value) || 0)}
                  className="w-full text-center bg-slate-900 border border-slate-700 rounded-lg py-1.5 text-sm font-mono font-bold text-slate-50 focus:outline-none focus:border-emerald-400"
                />
                <span className="text-xs text-slate-400 text-center block">grams</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-ink font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Save Nutrition Targets
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
