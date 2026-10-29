import React, { useState } from 'react';
import { MealItem, FoodDiaryEntry, Recipe, MacroNutrients } from '../../types';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
  MoreHorizontal,
  ShoppingBag,
  Star,
  Check,
  CheckCircle2,
  Utensils,
  Flame,
  ArrowUpRight,
  Trash2,
  Sparkles,
  Info,
  Sliders,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AddFoodModal } from './AddFoodModal';
import { AdjustGoalsModal } from './AdjustGoalsModal';
import { ExportSummaryModal } from './ExportSummaryModal';

interface Props {
  plannedMeals: MealItem[];
  diaryEntries: FoodDiaryEntry[];
  calorieBudget: {
    dailyTarget: number;
    caloriesLeft: number;
    caloriesConsumed: number;
    caloriesBurned: number;
    macrosLeft: MacroNutrients;
    macrosTotal: MacroNutrients;
  };
  currentDateIndex: number;
  onDateIndexChange: (idx: number) => void;
  onQuickAddPlannedMeal: (meal: MealItem) => void;
  onTrackAllToDiary: () => void;
  onOpenMealPlanner: () => void;
  onOpenShoppingList: () => void;
  onOpenFavourites: () => void;
  onSelectRecipe: (recipeId: string) => void;
  onAddDiaryEntry: (entry: Omit<FoodDiaryEntry, 'id' | 'timeLogged'>) => void;
  onDeleteDiaryEntry: (id: string) => void;
  onClearDiary: () => void;
  onCopyDay: () => void;
  onSaveGoals: (newDailyTarget: number, newMacrosTotal: MacroNutrients) => void;
}

export const DailyNutritionView: React.FC<Props> = ({
  plannedMeals,
  diaryEntries,
  calorieBudget,
  currentDateIndex,
  onDateIndexChange,
  onQuickAddPlannedMeal,
  onTrackAllToDiary,
  onOpenMealPlanner,
  onOpenShoppingList,
  onOpenFavourites,
  onSelectRecipe,
  onAddDiaryEntry,
  onDeleteDiaryEntry,
  onClearDiary,
  onCopyDay,
  onSaveGoals
}) => {
  const [showCalendarPicker, setShowCalendarPicker] = useState<boolean>(false);
  const [showDiaryMenu, setShowDiaryMenu] = useState<boolean>(false);
  const [addFoodCategory, setAddFoodCategory] = useState<'Breakfast' | 'Morning Snack' | 'Lunch' | 'Afternoon Snack' | 'Dinner' | 'Evening Treat' | null>(null);
  const [showAdjustGoals, setShowAdjustGoals] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const daysList = [
    { label: 'Today', dateString: 'Thursday, Oct 29', dayOffset: 0 },
    { label: 'Yesterday', dateString: 'Wednesday, Oct 28', dayOffset: -1 },
    { label: 'Tomorrow', dateString: 'Friday, Oct 30', dayOffset: 1 },
    { label: 'Saturday', dateString: 'Saturday, Oct 31', dayOffset: 2 },
    { label: 'Sunday', dateString: 'Sunday, Nov 01', dayOffset: 3 },
  ];

  const currentDay = daysList[currentDateIndex] || daysList[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTrackAll = () => {
    onTrackAllToDiary();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    showToast('Logged all 5 planned meals (1,901 cals) to Food Diary!');
  };

  const handleQuickAdd = (meal: MealItem) => {
    onQuickAddPlannedMeal(meal);
    showToast(`Added ${meal.name} (+${meal.calories} cals) to Diary!`);
  };

  // Meal categories for "Track My Day" food diary
  const diaryCategories: Array<'Breakfast' | 'Morning Snack' | 'Lunch' | 'Afternoon Snack' | 'Dinner' | 'Evening Treat'> = [
    'Breakfast',
    'Morning Snack',
    'Lunch',
    'Afternoon Snack',
    'Dinner',
    'Evening Treat'
  ];

  // Calorie ring calculations
  // Daily budget target, calories left = 1900
  const caloriesLeft = calorieBudget.caloriesLeft;
  const targetCals = calorieBudget.dailyTarget;
  const consumedCals = calorieBudget.caloriesConsumed;
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.min(1, Math.max(0, consumedCals / targetCals));
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 text-slate-100">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-full shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Top Header Bar: Date Switcher + Diary Options + Shopping Basket + Favourites */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        
        {/* Date switcher (‹ Today ›) with calendar modal */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-2 py-1.5 rounded-xl border border-slate-700/80">
          <button
            onClick={() => onDateIndexChange(Math.max(0, currentDateIndex - 1))}
            disabled={currentDateIndex === 0}
            className="p-1 rounded-lg hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowCalendarPicker(!showCalendarPicker)}
            className="flex items-center gap-2 px-2.5 py-1 text-xs font-semibold text-white hover:text-emerald-400 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentDay.label}</span>
            <span className="text-slate-400 font-normal">({currentDay.dateString})</span>
          </button>

          <button
            onClick={() => onDateIndexChange(Math.min(daysList.length - 1, currentDateIndex + 1))}
            disabled={currentDateIndex === daysList.length - 1}
            className="p-1 rounded-lg hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick actions: Basket, Favourites, Menu (•••) */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={onOpenShoppingList}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 hover:text-white flex items-center gap-1.5 text-xs font-medium transition-colors"
            title="Shopping List"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>Shopping</span>
          </button>

          <button
            onClick={onOpenFavourites}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-750 text-slate-200 hover:text-amber-400 flex items-center gap-1.5 text-xs font-medium transition-colors"
            title="Favourites"
          >
            <Star className="w-4 h-4 text-amber-400" />
            <span>Favourites</span>
          </button>

          {/* Diary Options Menu (•••) */}
          <div className="relative">
            <button
              onClick={() => setShowDiaryMenu(!showDiaryMenu)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Diary Options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showDiaryMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 p-1.5 rounded-xl bg-slate-900 border border-slate-750 shadow-2xl z-40 text-xs space-y-1 animate-in fade-in duration-150">
                <button
                  onClick={() => {
                    onCopyDay();
                    setShowDiaryMenu(false);
                    showToast('Copied previous day’s meals to today!');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Copy Previous Day
                </button>
                <button
                  onClick={() => {
                    setShowAdjustGoals(true);
                    setShowDiaryMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2"
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  Adjust Macro Goals
                </button>
                <button
                  onClick={() => {
                    setShowExportModal(true);
                    setShowDiaryMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  Export Daily Nutrition
                </button>
                <button
                  onClick={onOpenMealPlanner}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2"
                >
                  <Utensils className="w-3.5 h-3.5 text-teal-400" />
                  Meal Planner Hub
                </button>
                <div className="my-1 border-t border-slate-800" />
                <button
                  onClick={() => {
                    onClearDiary();
                    setShowDiaryMenu(false);
                    showToast('Cleared today’s food diary entries.');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-500/20 text-rose-300 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  Clear Today’s Diary
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Calendar picker popup */}
      {showCalendarPicker && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-750 shadow-xl grid grid-cols-2 sm:grid-cols-5 gap-2 animate-in fade-in duration-150">
          {daysList.map((d, idx) => (
            <button
              key={d.label}
              onClick={() => {
                onDateIndexChange(idx);
                setShowCalendarPicker(false);
              }}
              className={`p-3 rounded-xl text-left border transition-all ${
                currentDateIndex === idx
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-white'
                  : 'bg-slate-800/50 border-slate-800 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <span className="text-xs font-bold block">{d.label}</span>
              <span className="text-[11px] text-slate-400">{d.dateString}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Nutrition Top Grid: Daily Calorie Budget Ring & Macros Left */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Calorie Budget Ring Card (Showing Calories Left: 1900) */}
        <div
          onClick={() => setShowAdjustGoals(true)}
          className="md:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col items-center justify-center relative overflow-hidden cursor-pointer hover:border-slate-700 transition-all group"
          title="Click to adjust daily budget"
        >
          <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />
          
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Daily Calorie Budget
            </span>
            <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
              {targetCals} kcal goal ✎
            </span>
          </div>

          {/* SVG Calorie Ring */}
          <div className="relative my-3 flex items-center justify-center">
            <svg className="w-48 h-48 transform -rotate-90">
              {/* Background circle track */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                className="text-slate-800"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Animated Progress ring */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                className="text-emerald-400 transition-all duration-700 ease-out"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Inner Ring Text - Prompt: "a ring showing calories left (1900)" */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
              <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
                {caloriesLeft}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mt-0.5">
                Calories Left
              </span>
              <span className="text-[11px] text-slate-400 mt-1">
                {consumedCals} consumed
              </span>
            </div>
          </div>

          <div className="w-full pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Left: <strong className="text-white font-mono">{caloriesLeft}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Burned: <strong className="text-white font-mono">{calorieBudget.caloriesBurned}</strong></span>
            </div>
          </div>
        </div>

        {/* Macros Left for the day: protein, carbs, fat and fibre */}
        <div className="md:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  Macros Left for the Day
                </h3>
                <p className="text-xs text-slate-400">Accurately calibrated for optimal lean mass retention</p>
              </div>
              <button
                onClick={onOpenMealPlanner}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Meal Planner</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4 Macro Bars: Protein, Carbs, Fat, Fibre */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              
              {/* Protein */}
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-750 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Protein</span>
                  <span className="text-xs font-mono font-bold text-white">
                    {calorieBudget.macrosLeft.protein}g left
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, ((calorieBudget.macrosTotal.protein - calorieBudget.macrosLeft.protein) / calorieBudget.macrosTotal.protein) * 100)}%`
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Target: {calorieBudget.macrosTotal.protein}g</span>
                  <span>{Math.round(((calorieBudget.macrosTotal.protein - calorieBudget.macrosLeft.protein) / calorieBudget.macrosTotal.protein) * 100)}%</span>
                </div>
              </div>

              {/* Carbs */}
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-750 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Carbs</span>
                  <span className="text-xs font-mono font-bold text-white">
                    {calorieBudget.macrosLeft.carbs}g left
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, ((calorieBudget.macrosTotal.carbs - calorieBudget.macrosLeft.carbs) / calorieBudget.macrosTotal.carbs) * 100)}%`
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Target: {calorieBudget.macrosTotal.carbs}g</span>
                  <span>{Math.round(((calorieBudget.macrosTotal.carbs - calorieBudget.macrosLeft.carbs) / calorieBudget.macrosTotal.carbs) * 100)}%</span>
                </div>
              </div>

              {/* Fat */}
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-750 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Fat</span>
                  <span className="text-xs font-mono font-bold text-white">
                    {calorieBudget.macrosLeft.fat}g left
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, ((calorieBudget.macrosTotal.fat - calorieBudget.macrosLeft.fat) / calorieBudget.macrosTotal.fat) * 100)}%`
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Target: {calorieBudget.macrosTotal.fat}g</span>
                  <span>{Math.round(((calorieBudget.macrosTotal.fat - calorieBudget.macrosLeft.fat) / calorieBudget.macrosTotal.fat) * 100)}%</span>
                </div>
              </div>

              {/* Fibre */}
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-750 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Fibre</span>
                  <span className="text-xs font-mono font-bold text-white">
                    {calorieBudget.macrosLeft.fibre}g left
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, ((calorieBudget.macrosTotal.fibre - calorieBudget.macrosLeft.fibre) / calorieBudget.macrosTotal.fibre) * 100)}%`
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Target: {calorieBudget.macrosTotal.fibre}g</span>
                  <span>{Math.round(((calorieBudget.macrosTotal.fibre - calorieBudget.macrosLeft.fibre) / calorieBudget.macrosTotal.fibre) * 100)}%</span>
                </div>
              </div>

            </div>
          </div>

          {/* Quick link to Meal Planner bottom bar */}
          <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-500" />
              Need to rebalance macros?
            </span>
            <button
              onClick={onOpenMealPlanner}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Open Meal Planner →
            </button>
          </div>
        </div>
      </div>

      {/* Daily Meal Plan Section (1901 cals) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-white tracking-tight">
                Daily Meal Plan
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                1901 cals
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Curated chef meals with prep time, macros and one-tap diary tracking
            </p>
          </div>

          {/* Prompt requirement: “Track All To Food Diary”: log every planned meal in one tap */}
          <button
            onClick={handleTrackAll}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15 transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            Track All To Food Diary
          </button>
        </div>

        {/* Meal cards showing meal, calories, prep time, photo, quick-add + button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plannedMeals.map((meal) => {
            const isAlreadyTracked = diaryEntries.some(e => e.name === meal.name);

            return (
              <div
                key={meal.id}
                className="group relative rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Photo & quick-add + button */}
                  <div
                    className="relative h-36 w-full overflow-hidden bg-slate-950 cursor-pointer"
                    onClick={() => onSelectRecipe(meal.name.includes('Salmon') ? 'recipe-salmon-quinoa' : 'recipe-avocado-sourdough')}
                  >
                    <img
                      src={meal.photoUrl}
                      alt={meal.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-black/30" />
                    
                    {/* Category badge */}
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-amber-400 border border-white/10">
                      {meal.category}
                    </span>

                    {/* Quick-add planned meal with its + button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickAdd(meal);
                      }}
                      className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 ${
                        isAlreadyTracked
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-emerald-500/90 hover:bg-emerald-400 text-slate-950'
                      }`}
                      title={isAlreadyTracked ? `Logged! Tap to add another serve` : `Quick-add ${meal.name} to Diary`}
                    >
                      {isAlreadyTracked ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-5 h-5 stroke-[2.5]" />}
                    </button>

                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-xs text-slate-200">
                      <span className="font-mono font-bold text-white flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                        {meal.calories} cals
                      </span>
                      <span className="text-[11px] text-slate-300 bg-slate-900/70 px-1.5 py-0.5 rounded">
                        {meal.prepTime}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-3.5 space-y-2">
                    <h4
                      onClick={() => onSelectRecipe(meal.name.includes('Salmon') ? 'recipe-salmon-quinoa' : 'recipe-avocado-sourdough')}
                      className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {meal.name}
                    </h4>
                    
                    {/* Macros breakdown pill */}
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                      <span className="text-rose-400">{meal.macros.protein}g P</span>
                      <span>•</span>
                      <span className="text-amber-400">{meal.macros.carbs}g C</span>
                      <span>•</span>
                      <span className="text-cyan-400">{meal.macros.fat}g F</span>
                      <span>•</span>
                      <span className="text-emerald-400">{meal.macros.fibre}g Fib</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Footer with Recipe link */}
                <div className="px-3.5 pb-3 pt-1 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onSelectRecipe(meal.name.includes('Salmon') ? 'recipe-salmon-quinoa' : 'recipe-avocado-sourdough')}
                    className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    View Recipe
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleQuickAdd(meal)}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    {isAlreadyTracked ? 'Log Again' : '+ Log'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Food Diary (“Track My Day”) with an add button for each meal (Breakfast, Morning Snack and so on) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              Food Diary
              <span className="text-xs font-normal text-slate-400">“Track My Day”</span>
            </h2>
            <p className="text-xs text-slate-400">
              Logged today: {diaryEntries.reduce((acc, curr) => acc + curr.calories, 0)} kcal across {diaryEntries.length} items
            </p>
          </div>
        </div>

        {/* Categories: Breakfast, Morning Snack, Lunch, Afternoon Snack, Dinner, Evening Treat */}
        <div className="space-y-4">
          {diaryCategories.map((cat) => {
            const catEntries = diaryEntries.filter(e => e.mealCategory === cat);
            const catCals = catEntries.reduce((sum, item) => sum + item.calories, 0);

            return (
              <div key={cat} className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-3">
                {/* Header row for category + add button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      {cat}
                    </span>
                    {catCals > 0 && (
                      <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        {catCals} cals
                      </span>
                    )}
                  </div>

                  {/* Add button for each meal */}
                  <button
                    onClick={() => setAddFoodCategory(cat)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 border border-slate-700 flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>

                {/* Logged foods list for this category */}
                {catEntries.length > 0 ? (
                  <div className="space-y-1.5">
                    {catEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          {entry.photoUrl ? (
                            <img
                              src={entry.photoUrl}
                              alt=""
                              className="w-8 h-8 rounded-md object-cover border border-slate-700"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center text-slate-400">
                              <Utensils className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-white">{entry.name}</p>
                            <p className="text-[10px] text-slate-400">
                              {entry.portion} • {entry.timeLogged}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-white">
                            {entry.calories} cals
                          </span>
                          <button
                            onClick={() => onDeleteDiaryEntry(entry.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic pl-1">
                    No items tracked yet for {cat}. Tap + Add to log.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Food Modal */}
      {addFoodCategory && (
        <AddFoodModal
          isOpen={true}
          category={addFoodCategory}
          onClose={() => setAddFoodCategory(null)}
          onAddFood={(entry) => {
            onAddDiaryEntry(entry);
            showToast(`Logged ${entry.name} (${entry.calories} cals) to ${entry.mealCategory}!`);
          }}
        />
      )}

      {/* Adjust Goals Modal */}
      <AdjustGoalsModal
        isOpen={showAdjustGoals}
        onClose={() => setShowAdjustGoals(false)}
        currentDailyTarget={calorieBudget.dailyTarget}
        currentMacrosTotal={calorieBudget.macrosTotal}
        onSaveGoals={(target, macros) => {
          onSaveGoals(target, macros);
          showToast(`Updated daily calorie budget to ${target} kcal!`);
        }}
      />

      {/* Export Summary Modal */}
      <ExportSummaryModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        dateLabel={currentDay.label + ' (' + currentDay.dateString + ')'}
        entries={diaryEntries}
        calorieBudget={calorieBudget}
      />

    </div>
  );
};
