/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  INITIAL_CALORIE_BUDGET,
  DAILY_MEAL_PLAN,
  RECIPES_DATA,
  WORKOUT_PROGRAM_ABS_BLASTER,
  INITIAL_GROUP_RUNNERS
} from './data/mockData';
import {
  MealItem,
  Recipe,
  FoodDiaryEntry,
  RunnerPosition,
  MacroNutrients
} from './types';
import { Navigation, ActiveTab } from './components/Navigation';
import { HomeDashboardView } from './components/home/HomeDashboardView';
import { DailyNutritionView } from './components/nutrition/DailyNutritionView';
import { RecipeDetailModal } from './components/recipe/RecipeDetailModal';
import { WorkoutDetailView } from './components/workout/WorkoutDetailView';
import { LiveMapTrackerView } from './components/map/LiveMapTrackerView';
import { IntervalTimerView } from './components/timer/IntervalTimerView';
import { MealPlannerModal } from './components/planner/MealPlannerModal';
import { FavouritesModal } from './components/favourites/FavouritesModal';
import { PremiumView } from './components/premium/PremiumView';
import { CheckoutModal } from './components/premium/CheckoutModal';
import { usePersistentState } from './hooks/usePersistentState';
import { PackageId, PlanId, Purchases, hasActiveAccess, activatePurchase } from './data/premium';
import { dateKeyForOffset } from './utils/dates';

const TABS: ActiveTab[] = ['home', 'map', 'nutrition', 'recipe', 'workout', 'timer', 'premium'];

function readTabFromHash(): ActiveTab {
  const hash = window.location.hash.slice(1) as ActiveTab;
  return TABS.includes(hash) ? hash : 'nutrition';
}

// Sample entries shown on first launch
const SAMPLE_TODAY: FoodDiaryEntry[] = [
  {
    id: 'diary-init-1',
    mealCategory: 'Breakfast',
    name: 'Cold Pressed Green Juice & Almonds',
    calories: 220,
    portion: '300ml bottle + 15 almonds',
    macros: { protein: 6, carbs: 18, fat: 14, fibre: 4 },
    timeLogged: '07:45 AM'
  }
];
const SAMPLE_YESTERDAY: FoodDiaryEntry[] = [
  {
    id: 'diary-yest-1',
    mealCategory: 'Breakfast',
    name: 'Avocado & Poached Egg Sourdough',
    calories: 480,
    portion: '1 serve',
    macros: { protein: 24, carbs: 36, fat: 22, fibre: 8 },
    timeLogged: '08:15 AM'
  },
  {
    id: 'diary-yest-2',
    mealCategory: 'Lunch',
    name: 'Grilled Lemon Herb Salmon & Quinoa',
    calories: 585,
    portion: '1 serve',
    macros: { protein: 44, carbs: 48, fat: 19, fibre: 8 },
    timeLogged: '01:00 PM'
  }
];

/**
 * First-load diary. Older versions saved days by slot (0 = today, 1 = yesterday, 2 = tomorrow,
 * 3/4 = the two days after); move those onto real dates relative to today.
 */
function initialDiary(): Record<string, FoodDiaryEntry[]> {
  const LEGACY_SLOT_OFFSETS = [0, -1, 1, 2, 3];
  try {
    const raw = window.localStorage.getItem('pulsefit:v1:diaryByDay');
    if (raw) {
      const legacy = JSON.parse(raw) as Record<string, FoodDiaryEntry[]>;
      const migrated: Record<string, FoodDiaryEntry[]> = {};
      LEGACY_SLOT_OFFSETS.forEach((offset, slot) => {
        if (legacy[slot]?.length) migrated[dateKeyForOffset(offset)] = legacy[slot];
      });
      window.localStorage.removeItem('pulsefit:v1:diaryByDay');
      return migrated;
    }
  } catch {
    // Unreadable old data: start fresh
  }
  return { [dateKeyForOffset(0)]: SAMPLE_TODAY, [dateKeyForOffset(-1)]: SAMPLE_YESTERDAY };
}

export default function App() {
  // Navigation active tab, mirrored in the URL hash so refresh, Back and shared links keep the tab
  const [activeTab, setActiveTab] = useState<ActiveTab>(readTabFromHash);

  useEffect(() => {
    const onHashChange = () => setActiveTab(readTabFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const goToTab = (tab: ActiveTab) => {
    if (tab !== activeTab) window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // User Profile
  const [userName, setUserName] = usePersistentState<string>('userName', 'Jessica');
  const [pointsCount] = useState<string>('124k');
  const [streakDays] = useState<number>(20);

  // Nutrition & Budget State
  const [dailyTarget, setDailyTarget] = usePersistentState<number>('dailyTarget', 2400);
  const [macrosTotal, setMacrosTotal] = usePersistentState<MacroNutrients>('macrosTotal', INITIAL_CALORIE_BUDGET.macrosTotal);
  const [plannedMeals, setPlannedMeals] = usePersistentState<MealItem[]>('plannedMeals', DAILY_MEAL_PLAN);

  // Selected diary day as an offset from today (0 = today, -1 = yesterday)
  const [dayOffset, setDayOffset] = useState<number>(0);
  const dateKey = dateKeyForOffset(dayOffset);

  // Food diary keyed by calendar date (YYYY-MM-DD)
  const [diaryByDay, setDiaryByDay] = usePersistentState<Record<string, FoodDiaryEntry[]>>('diaryByDate', initialDiary);

  // Active Stats State
  const [caloriesBurned, setCaloriesBurned] = usePersistentState<number>('caloriesBurned', 640);
  const [stepCount, setStepCount] = usePersistentState<number>('stepCount', 8420);

  // Recipes State (only favourite ids are saved, so recipe content stays in sync with mockData)
  const [favouriteRecipeIds, setFavouriteRecipeIds] = usePersistentState<string[]>(
    'favouriteRecipeIds',
    () => RECIPES_DATA.filter(r => r.isFavourite).map(r => r.id)
  );
  const recipes: Recipe[] = RECIPES_DATA.map(r => ({ ...r, isFavourite: favouriteRecipeIds.includes(r.id) }));
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('recipe-salmon-quinoa');
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState<boolean>(false);

  // Premium packages: purchases are saved locally; a payment stays 'pending' until it's verified
  const [purchases, setPurchases] = usePersistentState<Purchases>('purchases', {});
  const [checkout, setCheckout] = useState<{ packageId: PackageId; planId: PlanId } | null>(null);
  const hasWorkoutPremium = hasActiveAccess(purchases.workout);
  const hasDietPremium = hasActiveAccess(purchases.diet);

  /** Runs `action` if the package is unlocked, otherwise opens checkout for it */
  const requirePackage = (packageId: PackageId, action: () => void) => {
    if (hasActiveAccess(purchases[packageId])) action();
    else if (purchases[packageId]?.status === 'pending') goToTab('premium');
    else setCheckout({ packageId, planId: 'full' });
  };

  // Meal Planner & Favourites Modals
  const [isMealPlannerOpen, setIsMealPlannerOpen] = useState<boolean>(false);
  const [isFavouritesOpen, setIsFavouritesOpen] = useState<boolean>(false);

  // Computed for current day
  const currentEntries = diaryByDay[dateKey] || [];
  const currentConsumed = currentEntries.reduce((sum, item) => sum + item.calories, 0);
  const currentCaloriesLeft = Math.max(0, dailyTarget - currentConsumed);

  const currentProteinConsumed = currentEntries.reduce((sum, item) => sum + item.macros.protein, 0);
  const currentCarbsConsumed = currentEntries.reduce((sum, item) => sum + item.macros.carbs, 0);
  const currentFatConsumed = currentEntries.reduce((sum, item) => sum + item.macros.fat, 0);
  const currentFibreConsumed = currentEntries.reduce((sum, item) => sum + item.macros.fibre, 0);

  const currentCalorieBudget = {
    dailyTarget,
    caloriesLeft: currentCaloriesLeft,
    caloriesConsumed: currentConsumed,
    caloriesBurned,
    macrosTotal,
    macrosLeft: {
      protein: Math.max(0, macrosTotal.protein - currentProteinConsumed),
      carbs: Math.max(0, macrosTotal.carbs - currentCarbsConsumed),
      fat: Math.max(0, macrosTotal.fat - currentFatConsumed),
      fibre: Math.max(0, macrosTotal.fibre - currentFibreConsumed),
    }
  };

  // Current active recipe
  const currentRecipe = recipes.find(r => r.id === selectedRecipeId) || recipes[0];

  // 1. Quick add single planned meal into food diary
  const handleQuickAddPlannedMeal = (meal: MealItem) => {
    const newEntry: FoodDiaryEntry = {
      id: `diary-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      mealCategory: meal.category,
      name: meal.name,
      calories: meal.calories,
      portion: '1 serving',
      macros: meal.macros,
      timeLogged: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      photoUrl: meal.photoUrl
    };

    setDiaryByDay(prev => ({
      ...prev,
      [dateKey]: [newEntry, ...(prev[dateKey] || [])]
    }));
  };

  // 2. Prompt requirement: “Track All To Food Diary”: log every planned meal in one tap
  const handleTrackAllToDiary = () => {
    const newEntries: FoodDiaryEntry[] = plannedMeals.map((meal, idx) => ({
      id: `diary-all-${Date.now()}-${idx}`,
      mealCategory: meal.category,
      name: meal.name,
      calories: meal.calories,
      portion: '1 serving',
      macros: meal.macros,
      timeLogged: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      photoUrl: meal.photoUrl
    }));

    setDiaryByDay(prev => ({
      ...prev,
      [dateKey]: [...newEntries, ...(prev[dateKey] || [])]
    }));
  };

  // 3. Add custom diary entry
  const handleAddDiaryEntry = (entry: Omit<FoodDiaryEntry, 'id' | 'timeLogged'>) => {
    const fullEntry: FoodDiaryEntry = {
      ...entry,
      id: `diary-custom-${Date.now()}`,
      timeLogged: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setDiaryByDay(prev => ({
      ...prev,
      [dateKey]: [fullEntry, ...(prev[dateKey] || [])]
    }));
  };

  // 4. Delete diary entry
  const handleDeleteDiaryEntry = (id: string) => {
    setDiaryByDay(prev => ({
      ...prev,
      [dateKey]: (prev[dateKey] || []).filter(d => d.id !== id)
    }));
  };

  // 5. Clear day's diary
  const handleClearDiary = () => {
    setDiaryByDay(prev => ({
      ...prev,
      [dateKey]: []
    }));
  };

  // 6. Copy the previous calendar day into the selected day
  const handleCopyDay = () => {
    const sourceDay = dateKeyForOffset(dayOffset - 1);
    const itemsToCopy = (diaryByDay[sourceDay] || []).map((item, idx) => ({
      ...item,
      id: `diary-copy-${Date.now()}-${idx}`,
      timeLogged: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    setDiaryByDay(prev => ({
      ...prev,
      [dateKey]: [...itemsToCopy, ...(prev[dateKey] || [])]
    }));
  };

  // 7. Save custom nutrition goals
  const handleSaveGoals = (newDailyTarget: number, newMacrosTotal: MacroNutrients) => {
    setDailyTarget(newDailyTarget);
    setMacrosTotal(newMacrosTotal);
  };

  // 8. Toggle favourite recipe
  const handleToggleFavouriteRecipe = (recipeId: string) => {
    setFavouriteRecipeIds(prev =>
      prev.includes(recipeId) ? prev.filter(id => id !== recipeId) : [...prev, recipeId]
    );
  };

  // 9. Workout completion handler
  const handleWorkoutCompleted = (calsBurned: number) => {
    setCaloriesBurned(prev => prev + calsBurned);
  };

  // Open recipe modal
  const handleSelectRecipe = (id: string) => {
    setSelectedRecipeId(id);
    setIsRecipeModalOpen(true);
  };

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100 flex flex-col font-sans">
      <a
        href="#main"
        onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-xl focus:bg-emerald-400 focus:text-ink focus:font-bold"
      >
        Skip to content
      </a>

      {/* Universal Top Header & Responsive Bottom Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={goToTab}
        hasPremium={hasWorkoutPremium || hasDietPremium}
        onOpenFavourites={() => setIsFavouritesOpen(true)}
        pointsCount={pointsCount}
        streakDays={streakDays}
      />

      {/* Main View Area with fluid transitions */}
      <main id="main" tabIndex={-1} className="flex-1 px-4 pt-6 pb-28 md:pb-10 max-w-6xl mx-auto w-full focus:outline-none">
        {activeTab === 'home' && (
          <HomeDashboardView
            userName={userName}
            pointsCount={pointsCount}
            streakDays={streakDays}
            caloriesBurned={caloriesBurned}
            caloriesTarget={750}
            stepCount={stepCount}
            stepTarget={10000}
            todayWorkout={WORKOUT_PROGRAM_ABS_BLASTER}
            onStartTodayWorkout={() => goToTab('workout')}
            onNavigateToLiveMap={() => goToTab('map')}
            onNavigateToIntervalTimer={() => goToTab('timer')}
            onNavigateToNutrition={() => goToTab('nutrition')}
          />
        )}

        {activeTab === 'nutrition' && (
          <DailyNutritionView
            plannedMeals={plannedMeals}
            diaryEntries={currentEntries}
            calorieBudget={currentCalorieBudget}
            dayOffset={dayOffset}
            onDayOffsetChange={setDayOffset}
            onQuickAddPlannedMeal={handleQuickAddPlannedMeal}
            onTrackAllToDiary={handleTrackAllToDiary}
            onOpenMealPlanner={() => requirePackage('diet', () => setIsMealPlannerOpen(true))}
            isMealPlannerLocked={!hasDietPremium}
            onOpenFavourites={() => setIsFavouritesOpen(true)}
            onSelectRecipe={handleSelectRecipe}
            onAddDiaryEntry={handleAddDiaryEntry}
            onDeleteDiaryEntry={handleDeleteDiaryEntry}
            onClearDiary={handleClearDiary}
            onCopyDay={handleCopyDay}
            onSaveGoals={handleSaveGoals}
          />
        )}

        {activeTab === 'recipe' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Featured Chef Recipes
                </span>
                <h2 className="text-xl font-black text-slate-50">Culinary Nutrition Lab</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {recipes.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRecipeId(r.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedRecipeId === r.id
                        ? 'bg-amber-500 text-ink shadow-md shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-300 hover:text-slate-50'
                    }`}
                  >
                    {r.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Embedded Recipe Detail Component */}
            <div className="p-1">
              <RecipeDetailModal
                recipe={currentRecipe}
                isOpen={true}
                onClose={() => goToTab('nutrition')}
                onToggleFavourite={handleToggleFavouriteRecipe}
                onAddToDiary={handleAddDiaryEntry}
                isCookModeLocked={!hasDietPremium}
                onUnlockCookMode={() => requirePackage('diet', () => {})}
              />
            </div>
          </div>
        )}

        {activeTab === 'workout' && (
          <WorkoutDetailView
            program={WORKOUT_PROGRAM_ABS_BLASTER}
            onWorkoutCompleted={handleWorkoutCompleted}
            isGuidedSessionLocked={!hasWorkoutPremium}
            onUnlockGuidedSession={() => requirePackage('workout', () => {})}
          />
        )}

        {activeTab === 'premium' && (
          <PremiumView
            purchases={purchases}
            onBuy={(packageId, planId) => setCheckout({ packageId, planId })}
            onDemoApprove={import.meta.env.DEV ? (packageId) => setPurchases(prev => {
              const purchase = prev[packageId];
              return purchase ? { ...prev, [packageId]: activatePurchase(purchase) } : prev;
            }) : undefined}
          />
        )}

        {activeTab === 'map' && (
          <LiveMapTrackerView
            initialRunners={INITIAL_GROUP_RUNNERS}
            onAddCaloriesBurned={(cals) => {
              setCaloriesBurned(prev => prev + cals);
            }}
            onAddSteps={(steps) => setStepCount(prev => prev + steps)}
          />
        )}

        {activeTab === 'timer' && (
          <IntervalTimerView
            onSessionComplete={(cals) => {
              setCaloriesBurned(prev => prev + cals);
            }}
          />
        )}
      </main>

      {/* Standalone Recipe Detail Modal (Accessible from any Meal Card) */}
      <RecipeDetailModal
        recipe={currentRecipe}
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        onToggleFavourite={handleToggleFavouriteRecipe}
        onAddToDiary={handleAddDiaryEntry}
        isCookModeLocked={!hasDietPremium}
        onUnlockCookMode={() => {
          setIsRecipeModalOpen(false);
          requirePackage('diet', () => {});
        }}
      />

      {/* Premium checkout (KBZPay / WavePay / CB Pay transfer) */}
      <CheckoutModal
        packageId={checkout?.packageId ?? null}
        initialPlan={checkout?.planId}
        onClose={() => setCheckout(null)}
        onSubmit={(purchase) => setPurchases(prev => ({ ...prev, [purchase.packageId]: purchase }))}
      />

      {/* Meal Planner Modal */}
      <MealPlannerModal
        isOpen={isMealPlannerOpen}
        onClose={() => setIsMealPlannerOpen(false)}
        plannedMeals={plannedMeals}
        onTrackAllToDiary={handleTrackAllToDiary}
      />

      {/* Favourites Modal */}
      <FavouritesModal
        isOpen={isFavouritesOpen}
        onClose={() => setIsFavouritesOpen(false)}
        favouriteRecipes={recipes.filter(r => r.isFavourite)}
        favouriteMeals={plannedMeals.filter(m => m.isFavourite)}
        onSelectRecipe={handleSelectRecipe}
      />
    </div>
  );
}
