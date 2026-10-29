import React, { useState } from 'react';
import { FoodDiaryEntry, MacroNutrients } from '../../types';
import { X, Search, Plus, Utensils, Flame, Sparkles, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category: 'Breakfast' | 'Morning Snack' | 'Lunch' | 'Afternoon Snack' | 'Dinner' | 'Evening Treat';
  onAddFood: (entry: Omit<FoodDiaryEntry, 'id' | 'timeLogged'>) => void;
}

interface CommonFood {
  name: string;
  portion: string;
  calories: number;
  macros: MacroNutrients;
  category: string;
  photoUrl?: string;
}

const COMMON_FOODS: CommonFood[] = [
  {
    name: 'Scrambled Eggs (3 eggs) with Olive Oil',
    portion: '3 large eggs',
    calories: 260,
    macros: { protein: 21, carbs: 2, fat: 19, fibre: 0 },
    category: 'Breakfast',
    photoUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'Rolled Oats with Berries & Honey',
    portion: '1 medium bowl (60g dry)',
    calories: 310,
    macros: { protein: 11, carbs: 58, fat: 5, fibre: 8 },
    category: 'Breakfast',
    photoUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'Whey Isolate Protein Shake',
    portion: '1 scoop (30g) + water',
    calories: 120,
    macros: { protein: 26, carbs: 2, fat: 1, fibre: 0 },
    category: 'Morning Snack',
    photoUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'Greek Yogurt 0% with Honey & Chia',
    portion: '200g bowl',
    calories: 190,
    macros: { protein: 22, carbs: 18, fat: 3, fibre: 4 },
    category: 'Morning Snack',
    photoUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'Grilled Herb Chicken Breast & Jasmine Rice',
    portion: '180g chicken + 150g rice',
    calories: 520,
    macros: { protein: 48, carbs: 54, fat: 8, fibre: 3 },
    category: 'Lunch',
    photoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'Tuna Salad on Seeded Rye',
    portion: '2 open sandwiches',
    calories: 410,
    macros: { protein: 34, carbs: 36, fat: 12, fibre: 6 },
    category: 'Lunch',
    photoUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'Fuji Apple with Natural Peanut Butter',
    portion: '1 apple + 2 tbsp PB',
    calories: 275,
    macros: { protein: 8, carbs: 32, fat: 16, fibre: 6 },
    category: 'Afternoon Snack',
    photoUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'Roasted Almonds & Dried Cranberries',
    portion: '40g handful',
    calories: 210,
    macros: { protein: 6, carbs: 18, fat: 14, fibre: 4 },
    category: 'Afternoon Snack',
    photoUrl: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'Wild Salmon Fillet with Sweet Potato',
    portion: '180g salmon + 200g potato',
    calories: 560,
    macros: { protein: 42, carbs: 46, fat: 18, fibre: 6 },
    category: 'Dinner',
    photoUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'Lean Grass-Fed Beef Bowl with Quinoa',
    portion: '150g beef + 150g quinoa',
    calories: 590,
    macros: { protein: 46, carbs: 42, fat: 22, fibre: 5 },
    category: 'Dinner',
    photoUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'Casein Chocolate Protein Pudding',
    portion: '1 scoop + almond milk',
    calories: 140,
    macros: { protein: 25, carbs: 4, fat: 2, fibre: 1 },
    category: 'Evening Treat',
    photoUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'Warm Chamomile Tea with 85% Dark Chocolate',
    portion: '1 cup tea + 2 squares chocolate',
    calories: 120,
    macros: { protein: 2, carbs: 10, fat: 9, fibre: 3 },
    category: 'Evening Treat',
    photoUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=300&auto=format&fit=crop&q=80'
  }
];

export const AddFoodModal: React.FC<Props> = ({
  isOpen,
  onClose,
  category,
  onAddFood
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'custom'>('quick');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom Food Form State
  const [customName, setCustomName] = useState('');
  const [customPortion, setCustomPortion] = useState('1 serving');
  const [customCalories, setCustomCalories] = useState('250');
  const [customProtein, setCustomProtein] = useState('20');
  const [customCarbs, setCustomCarbs] = useState('25');
  const [customFat, setCustomFat] = useState('8');
  const [customFibre, setCustomFibre] = useState('4');

  if (!isOpen) return null;

  const filteredFoods = COMMON_FOODS.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCommonFood = (food: CommonFood) => {
    onAddFood({
      name: food.name,
      mealCategory: category,
      calories: food.calories,
      portion: food.portion,
      macros: food.macros,
      photoUrl: food.photoUrl
    });
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    onAddFood({
      name: customName.trim(),
      mealCategory: category,
      calories: parseInt(customCalories) || 200,
      portion: customPortion.trim() || '1 serving',
      macros: {
        protein: parseInt(customProtein) || 0,
        carbs: parseInt(customCarbs) || 0,
        fat: parseInt(customFat) || 0,
        fibre: parseInt(customFibre) || 0,
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[88vh] flex flex-col bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {category}
            </span>
            <h2 className="text-lg font-bold text-white mt-1">Log Food Entry</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Quick Pick vs Custom Entry */}
        <div className="px-5 pt-3 flex gap-2 border-b border-slate-800 bg-slate-900/50">
          <button
            onClick={() => setActiveTab('quick')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'quick'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Quick Select Database
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'custom'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Custom Food Entry
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'quick' ? (
            <div className="space-y-3">
              {/* Search bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search foods (e.g., eggs, salmon, protein, oats)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
              </div>

              {/* Food list */}
              <div className="space-y-2">
                {filteredFoods.map((food, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectCommonFood(food)}
                    className="group p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      {food.photoUrl ? (
                        <img
                          src={food.photoUrl}
                          alt={food.name}
                          className="w-11 h-11 rounded-lg object-cover border border-slate-700"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                          <Utensils className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {food.name}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {food.portion}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-0.5">
                          <span className="text-rose-400">{food.macros.protein}g P</span>
                          <span>•</span>
                          <span className="text-amber-400">{food.macros.carbs}g C</span>
                          <span>•</span>
                          <span className="text-cyan-400">{food.macros.fat}g F</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs font-mono font-bold text-white">
                        {food.calories} cals
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500 text-emerald-400 group-hover:text-slate-950 flex items-center justify-center transition-colors">
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </div>
                  </div>
                ))}

                {filteredFoods.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    No matching food found. Try another search or switch to "Custom Food Entry".
                  </div>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Food Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Homemade Turkey Chili"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Portion Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1 bowl (300g)"
                    value={customPortion}
                    onChange={(e) => setCustomPortion(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Total Calories (kcal)
                  </label>
                  <input
                    type="number"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Macro breakdown */}
              <div className="space-y-1 pt-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Macronutrients (Grams)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-center space-y-1">
                    <span className="text-[10px] font-bold uppercase text-rose-400 block">Protein</span>
                    <input
                      type="number"
                      value={customProtein}
                      onChange={(e) => setCustomProtein(e.target.value)}
                      className="w-full text-center bg-slate-900 border border-slate-700 rounded py-1 text-xs font-mono text-white focus:outline-none focus:border-rose-400"
                    />
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-center space-y-1">
                    <span className="text-[10px] font-bold uppercase text-amber-400 block">Carbs</span>
                    <input
                      type="number"
                      value={customCarbs}
                      onChange={(e) => setCustomCarbs(e.target.value)}
                      className="w-full text-center bg-slate-900 border border-slate-700 rounded py-1 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-center space-y-1">
                    <span className="text-[10px] font-bold uppercase text-cyan-400 block">Fat</span>
                    <input
                      type="number"
                      value={customFat}
                      onChange={(e) => setCustomFat(e.target.value)}
                      className="w-full text-center bg-slate-900 border border-slate-700 rounded py-1 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-center space-y-1">
                    <span className="text-[10px] font-bold uppercase text-emerald-400 block">Fibre</span>
                    <input
                      type="number"
                      value={customFibre}
                      onChange={(e) => setCustomFibre(e.target.value)}
                      className="w-full text-center bg-slate-900 border border-slate-700 rounded py-1 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Log Custom Food Entry
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
