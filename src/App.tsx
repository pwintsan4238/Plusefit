/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  INITIAL_CALORIE_BUDGET,
  DAILY_MEAL_PLAN,
  RECIPES_DATA,
  WORKOUT_PROGRAM_ABS_BLASTER,
  INITIAL_GROUP_RUNNERS,
  INITIAL_SHOPPING_LIST
} from './data/mockData';
import {
  MealItem,
  Recipe,
  FoodDiaryEntry,
  ShoppingItem,
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
import { ShoppingListModal } from './components/shopping/ShoppingListModal';
import { MealPlannerModal } from './components/planner/MealPlannerModal';
import { FavouritesModal } from './components/favourites/FavouritesModal';

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('nutrition');

  // User Profile
  const [userName, setUserName] = useState<string>('Jessica');
  const [pointsCount] = useState<string>('124k');
  const [streakDays] = useState<number>(20);

  // Nutrition & Budget State
  const [dailyTarget, setDailyTarget] = useState<number>(2400);
  const [macrosTotal, setMacrosTotal] = useState<MacroNutrients>(INITIAL_CALORIE_BUDGET.macrosTotal);
  const [plannedMeals, setPlannedMeals] = useState<MealItem[]>(DAILY_MEAL_PLAN);

  // Date index: 0 = Today, 1 = Yesterday, 2 = Tomorrow, 3 = Saturday, 4 = Sunday
  const [currentDateIndex, setCurrentDateIndex] = useState<number>(0);

  // Multi-day Diary Map
  const [diaryByDay, setDiaryByDay] = useState<Record<number, FoodDiaryEntry[]>>({
    0: [
      {
        id: 'diary-init-1',
        mealCategory: 'Breakfast',
        name: 'Cold Pressed Green Juice & Almonds',
        calories: 220,
        portion: '300ml bottle + 15 almonds',
        macros: { protein: 6, carbs: 18, fat: 14, fibre: 4 },
        timeLogged: '07:45 AM'
      }
    ],
    1: [
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
    ],
    2: [],
    3: [],
    4: []
  });

  // Active Stats State
  const [caloriesBurned, setCaloriesBurned] = useState<number>(640);
  const [stepCount, setStepCount] = useState<number>(8420);

  // Recipes State
  const [recipes, setRecipes] = useState<Recipe[]>(RECIPES_DATA);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('recipe-salmon-quinoa');
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState<boolean>(false);

  // Shopping List State
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(INITIAL_SHOPPING_LIST);
  const [isShoppingOpen, setIsShoppingOpen] = useState<boolean>(false);

  // Meal Planner & Favourites Modals
  const [isMealPlannerOpen, setIsMealPlannerOpen] = useState<boolean>(false);
  const [isFavouritesOpen, setIsFavouritesOpen] = useState<boolean>(false);

  // Computed for current day
  const currentEntries = diaryByDay[currentDateIndex] || [];
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
      [currentDateIndex]: [newEntry, ...(prev[currentDateIndex] || [])]
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
      [currentDateIndex]: [...newEntries, ...(prev[currentDateIndex] || [])]
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
      [currentDateIndex]: [fullEntry, ...(prev[currentDateIndex] || [])]
    }));
  };

  // 4. Delete diary entry
  const handleDeleteDiaryEntry = (id: string) => {
    setDiaryByDay(prev => ({
      ...prev,
      [currentDateIndex]: (prev[currentDateIndex] || []).filter(d => d.id !== id)
    }));
  };

  // 5. Clear day's diary
  const handleClearDiary = () => {
    setDiaryByDay(prev => ({
      ...prev,
      [currentDateIndex]: []
    }));
  };

  // 6. Copy day
  const handleCopyDay = () => {
    const sourceDay = currentDateIndex === 0 ? 1 : 0;
    const itemsToCopy = (diaryByDay[sourceDay] || []).map((item, idx) => ({
      ...item,
      id: `diary-copy-${Date.now()}-${idx}`,
      timeLogged: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    setDiaryByDay(prev => ({
      ...prev,
      [currentDateIndex]: [...itemsToCopy, ...(prev[currentDateIndex] || [])]
    }));
  };

  // 7. Save custom nutrition goals
  const handleSaveGoals = (newDailyTarget: number, newMacrosTotal: MacroNutrients) => {
    setDailyTarget(newDailyTarget);
    setMacrosTotal(newMacrosTotal);
  };

  // 8. Toggle favourite recipe
  const handleToggleFavouriteRecipe = (recipeId: string) => {
    setRecipes(prev =>
      prev.map(r => (r.id === recipeId ? { ...r, isFavourite: !r.isFavourite } : r))
    );
  };

  // 9. Add ingredients to shopping list
  const handleAddIngredientsToShoppingList = (recipe: Recipe, servings: number) => {
    const rescaleFactor = servings / (recipe.servings || 1);
    const newItems: ShoppingItem[] = recipe.ingredients.map((ing, idx) => ({
      id: `shop-${Date.now()}-${idx}`,
      name: ing.name,
      amount: parseFloat((ing.baseAmount * rescaleFactor).toFixed(1)),
      unit: ing.unit,
      category: ing.category,
      isChecked: false,
      sourceRecipe: recipe.name.split(' ')[0]
    }));

    setShoppingItems(prev => [...newItems, ...prev]);
  };

  // 10. Shopping list toggle & delete
  const handleToggleShoppingItem = (id: string) => {
    setShoppingItems(prev =>
      prev.map(i => (i.id === id ? { ...i, isChecked: !i.isChecked } : i))
    );
  };

  const handleDeleteShoppingItem = (id: string) => {
    setShoppingItems(prev => prev.filter(i => i.id !== id));
  };

  const handleAddShoppingItem = (name: string, amount: number, unit: string, category: string) => {
    const newItem: ShoppingItem = {
      id: `shop-${Date.now()}`,
      name,
      amount,
      unit,
      category,
      isChecked: false
    };
    setShoppingItems(prev => [newItem, ...prev]);
  };

  const handleClearCheckedShopping = () => {
    setShoppingItems(prev => prev.filter(i => !i.isChecked));
  };

  // 11. Workout completion handler
  const handleWorkoutCompleted = (calsBurned: number) => {
    setCaloriesBurned(prev => prev + calsBurned);
  };

  // Open recipe modal
  const handleSelectRecipe = (id: string) => {
    setSelectedRecipeId(id);
    setIsRecipeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Universal Top Header & Responsive Bottom Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        shoppingCount={shoppingItems.filter(i => !i.isChecked).length}
        onOpenShopping={() => setIsShoppingOpen(true)}
        onOpenFavourites={() => setIsFavouritesOpen(true)}
        pointsCount={pointsCount}
        streakDays={streakDays}
      />

      {/* Main View Area with fluid transitions */}
      <main className="flex-1 px-4 py-6 max-w-6xl mx-auto w-full">
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
            onStartTodayWorkout={() => setActiveTab('workout')}
            onNavigateToLiveMap={() => setActiveTab('map')}
            onNavigateToIntervalTimer={() => setActiveTab('timer')}
            onNavigateToNutrition={() => setActiveTab('nutrition')}
          />
        )}

        {activeTab === 'nutrition' && (
          <DailyNutritionView
            plannedMeals={plannedMeals}
            diaryEntries={currentEntries}
            calorieBudget={currentCalorieBudget}
            currentDateIndex={currentDateIndex}
            onDateIndexChange={setCurrentDateIndex}
            onQuickAddPlannedMeal={handleQuickAddPlannedMeal}
            onTrackAllToDiary={handleTrackAllToDiary}
            onOpenMealPlanner={() => setIsMealPlannerOpen(true)}
            onOpenShoppingList={() => setIsShoppingOpen(true)}
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
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Featured Chef Recipes
                </span>
                <h2 className="text-xl font-black text-white">Culinary Nutrition Lab</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {recipes.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRecipeId(r.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedRecipeId === r.id
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
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
                onClose={() => setActiveTab('nutrition')}
                onToggleFavourite={handleToggleFavouriteRecipe}
                onAddToDiary={handleAddDiaryEntry}
                onAddIngredientsToShoppingList={handleAddIngredientsToShoppingList}
              />
            </div>
          </div>
        )}

        {activeTab === 'workout' && (
          <WorkoutDetailView
            program={WORKOUT_PROGRAM_ABS_BLASTER}
            onWorkoutCompleted={handleWorkoutCompleted}
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
        onAddIngredientsToShoppingList={handleAddIngredientsToShoppingList}
      />

      {/* Shopping List Modal */}
      <ShoppingListModal
        isOpen={isShoppingOpen}
        onClose={() => setIsShoppingOpen(false)}
        items={shoppingItems}
        onToggleItem={handleToggleShoppingItem}
        onDeleteItem={handleDeleteShoppingItem}
        onAddItem={handleAddShoppingItem}
        onClearChecked={handleClearCheckedShopping}
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
