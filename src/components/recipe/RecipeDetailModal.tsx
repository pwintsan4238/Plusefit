import React, { useState } from 'react';
import { Recipe, FoodDiaryEntry } from '../../types';
import {
  X,
  Star,
  Clock,
  Flame,
  Users,
  ChevronDown,
  ChevronUp,
  ChefHat,
  Lock,
  PlusCircle,
  Play,
  Volume2,
  Check,
  CheckCircle2,
  Timer as TimerIcon
} from 'lucide-react';

interface Props {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavourite: (recipeId: string) => void;
  onAddToDiary: (entry: Omit<FoodDiaryEntry, 'id' | 'timeLogged'>) => void;
  /** Cook Mode needs the Premium Diet package */
  isCookModeLocked: boolean;
  onUnlockCookMode: () => void;
}

export const RecipeDetailModal: React.FC<Props> = ({
  recipe,
  isOpen,
  onClose,
  onToggleFavourite,
  onAddToDiary,
  isCookModeLocked,
  onUnlockCookMode,
}) => {
  const [servings, setServings] = useState<number>(1);
  const [expandedIngredient, setExpandedIngredient] = useState<string | null>(null);
  const [isCookMode, setIsCookMode] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [showDiarySlotPicker, setShowDiarySlotPicker] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<'Breakfast' | 'Morning Snack' | 'Lunch' | 'Afternoon Snack' | 'Dinner' | 'Evening Treat'>('Lunch');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [showCookingComplete, setShowCookingComplete] = useState<boolean>(false);

  // Sync servings when recipe changes
  React.useEffect(() => {
    if (recipe) {
      setServings(recipe.servings || 1);
      setActiveStepIndex(0);
      setIsCookMode(false);
      setActiveTimer(null);
      setIsTimerRunning(false);
      setCheckedIngredients([]);
      setShowCookingComplete(false);
    }
  }, [recipe]);

  // Cook mode countdown timer
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && activeTimer !== null && activeTimer > 0) {
      interval = setInterval(() => {
        setActiveTimer(prev => {
          if (prev === 1) {
            import('../../utils/audio').then(a => a.playWhistle());
          }
          return prev !== null && prev > 0 ? prev - 1 : 0;
        });
      }, 1000);
    } else if (activeTimer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, activeTimer]);

  if (!isOpen || !recipe) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const rescaleFactor = servings / (recipe.servings || 1);
  const caloriesTotal = Math.round(recipe.caloriesPerServe * servings);
  const proteinTotal = Math.round(recipe.macrosPerServe.protein * servings);
  const carbsTotal = Math.round(recipe.macrosPerServe.carbs * servings);
  const fatTotal = Math.round(recipe.macrosPerServe.fat * servings);
  const fibreTotal = Math.round(recipe.macrosPerServe.fibre * servings);

  const toggleExpand = (name: string) => {
    setExpandedIngredient(expandedIngredient === name ? null : name);
  };

  const handleSpeakStep = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartStepTimer = (seconds: number) => {
    setActiveTimer(seconds);
    setIsTimerRunning(true);
  };

  const handleConfirmDiaryAdd = () => {
    onAddToDiary({
      name: recipe.name,
      mealCategory: selectedSlot,
      calories: Math.round(recipe.caloriesPerServe * servings),
      portion: `${servings} serve${servings > 1 ? 's' : ''}`,
      macros: {
        protein: proteinTotal,
        carbs: carbsTotal,
        fat: fatTotal,
        fibre: fibreTotal,
      },
      photoUrl: recipe.photoUrl
    });
    setShowDiarySlotPicker(false);
    showToast(`Added to ${selectedSlot} (${caloriesTotal} cals)!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-ink/45 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Toast alert */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-emerald-500 text-ink font-semibold text-xs rounded-full shadow-lg flex items-center gap-1.5 animate-in slide-in-from-top-3 duration-200">
            <CheckCircle2 className="w-4 h-4" />
            {toastMessage}
          </div>
        )}

        {/* Top Header / Image Area */}
        <div className="relative h-64 sm:h-72 w-full flex-shrink-0 bg-slate-950">
          <img
            src={recipe.photoUrl}
            alt={recipe.name}
            className="w-full h-full object-cover object-center brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-black/60" />

          {/* Top buttons */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center gap-1">
                <ChefHat className="w-3.5 h-3.5 text-amber-800" />
                {recipe.difficulty}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/50 backdrop-blur-md border border-white/10 text-emerald-400">
                ★ {recipe.rating} ({recipe.reviewsCount})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavourite(recipe.id)}
                className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
                  recipe.isFavourite
                    ? 'bg-amber-500 border-amber-400 text-ink shadow-lg shadow-amber-500/20'
                    : 'bg-black/50 border-white/10 text-white hover:bg-black/70'
                }`}
                title="Favourite recipe"
              >
                <Star className={`w-4 h-4 ${recipe.isFavourite ? 'fill-current' : ''}`} />
              </button>
              <button aria-label="Close"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 border border-white/10 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Recipe Title & Key Stats in Header */}
          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-50 leading-tight drop-shadow-md">
              {recipe.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-1.5 font-medium bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-md border border-slate-700/60">
                <Flame className="w-4 h-4 text-orange-800" />
                <span className="font-bold text-slate-50">{recipe.caloriesPerServe}</span> cals / serve
              </div>
              <div className="flex items-center gap-1.5 font-medium bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-md border border-slate-700/60">
                <Clock className="w-4 h-4 text-cyan-700" />
                <span>Cook: <strong className="text-slate-50">{recipe.cookTime}</strong> (Prep {recipe.prepTime})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">

          {/* Cook Mode Switch Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                isCookMode ? 'bg-amber-500 text-ink' : 'bg-slate-700 text-slate-300'
              }`}>
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-50 flex items-center gap-1.5">
                  Hands-Free Cook Mode
                  {isCookModeLocked && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-400/15 text-amber-800 text-xs font-bold">
                      <Lock className="w-3 h-3" aria-hidden="true" /> Premium
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-400">Step-by-step view with smart kitchen timers & audio guidance</p>
              </div>
            </div>
            <button
              onClick={() => (isCookModeLocked ? onUnlockCookMode() : setIsCookMode(!isCookMode))}
              role="switch"
              aria-checked={isCookMode}
              aria-label="Hands-Free Cook Mode"
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors before:absolute before:-inset-2.5 before:content-[''] ${
                isCookMode ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isCookMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Hands-Free Cook Mode Dedicated View */}
          {isCookMode ? (
            <div className="space-y-4 p-4 rounded-xl bg-gradient-to-b from-amber-500/10 via-slate-800/60 to-slate-900 border border-amber-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                  Step {activeStepIndex + 1} of {recipe.steps.length}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSpeakStep(recipe.steps[activeStepIndex].instruction)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-50 text-xs flex items-center gap-1"
                    title="Read aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-cyan-700" />
                    Read
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-50">
                  {recipe.steps[activeStepIndex].title}
                </h3>
                <p className="text-base text-slate-200 leading-relaxed font-normal">
                  {recipe.steps[activeStepIndex].instruction}
                </p>
                {recipe.steps[activeStepIndex].chefTip && (
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800">
                    <strong>Chef Note:</strong> {recipe.steps[activeStepIndex].chefTip}
                  </div>
                )}
              </div>

              {/* Step Timer if available */}
              {recipe.steps[activeStepIndex].timerSeconds && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-700">
                  <div className="flex items-center gap-2">
                    <TimerIcon className="w-4 h-4 text-cyan-700" />
                    <span className="text-xs text-slate-400">Recommended Timer</span>
                    <span className="text-sm font-mono font-bold text-slate-50">
                      {activeTimer !== null
                        ? `${Math.floor(activeTimer / 60)}:${(activeTimer % 60).toString().padStart(2, '0')}`
                        : `${Math.floor(recipe.steps[activeStepIndex].timerSeconds! / 60)}:${(recipe.steps[activeStepIndex].timerSeconds! % 60).toString().padStart(2, '0')}`}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (isTimerRunning) {
                        setIsTimerRunning(false);
                      } else {
                        handleStartStepTimer(activeTimer !== null && activeTimer > 0 ? activeTimer : recipe.steps[activeStepIndex].timerSeconds!);
                      }
                    }}
                    className="px-3 py-1 text-xs font-semibold rounded-lg bg-cyan-500/20 text-cyan-700 hover:bg-cyan-500/30 flex items-center gap-1"
                  >
                    <Play className="w-3 h-3" />
                    {isTimerRunning ? 'Pause' : 'Start Timer'}
                  </button>
                </div>
              )}

              {/* Step Navigation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex(prev => Math.max(0, prev - 1))}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 disabled:opacity-40 text-slate-300 hover:text-slate-50"
                >
                  Previous Step
                </button>
                <div className="flex gap-1.5">
                  {recipe.steps.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        idx === activeStepIndex ? 'bg-amber-400' : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
                {activeStepIndex === recipe.steps.length - 1 ? (
                  <button
                    onClick={() => {
                      import('canvas-confetti').then(c => c.default({ particleCount: 60, spread: 60 }));
                      import('../../utils/audio').then(a => a.playSuccessChime());
                      setShowDiarySlotPicker(true);
                      showToast('Culinary dish ready! Choose meal slot to log.');
                    }}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 text-ink hover:bg-emerald-400 flex items-center gap-1 shadow-md"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    Done Cooking!
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveStepIndex(prev => Math.min(recipe.steps.length - 1, prev + 1))}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 text-ink hover:bg-amber-400"
                  >
                    Next Step
                  </button>
                )}
              </div>
            </div>
          ) : null}

          {/* Macro Breakdown per serve */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Macro Breakdown (Per Serve & Total)
              </h3>
              <span className="text-xs text-slate-500">
                {servings} {servings === 1 ? 'serving' : 'servings'} selected
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-750 text-center">
                <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider block">Protein</span>
                <span className="text-lg font-bold text-slate-50 font-mono">{proteinTotal}g</span>
                <span className="text-xs text-slate-400 block">({recipe.macrosPerServe.protein}g / serv)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-750 text-center">
                <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block">Carbs</span>
                <span className="text-lg font-bold text-slate-50 font-mono">{carbsTotal}g</span>
                <span className="text-xs text-slate-400 block">({recipe.macrosPerServe.carbs}g / serv)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-750 text-center">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Fat</span>
                <span className="text-lg font-bold text-slate-50 font-mono">{fatTotal}g</span>
                <span className="text-xs text-slate-400 block">({recipe.macrosPerServe.fat}g / serv)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-750 text-center">
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">Fibre</span>
                <span className="text-lg font-bold text-slate-50 font-mono">{fibreTotal}g</span>
                <span className="text-xs text-slate-400 block">({recipe.macrosPerServe.fibre}g / serv)</span>
              </div>
            </div>
          </div>

          {/* Serving Size Control (– 1 serve +) that rescales recipe */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <div>
              <h4 className="text-sm font-semibold text-slate-50 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-700" />
                Serving Size Rescaling
              </h4>
              <p className="text-xs text-slate-400">All ingredient amounts and calories auto-scale dynamically</p>
            </div>

            {/* Stepper (– 1 serve +) */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1 shadow-inner">
              <button
                onClick={() => setServings(prev => Math.max(1, prev - 1))}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-50 font-bold flex items-center justify-center transition-colors disabled:opacity-40"
                disabled={servings <= 1}
              >
                –
              </button>
              <div className="px-3 min-w-[5rem] text-center">
                <span className="text-sm font-bold text-emerald-700 font-mono">{servings}</span>
                <span className="text-xs text-slate-300 ml-1">serve{servings > 1 ? 's' : ''}</span>
              </div>
              <button
                onClick={() => setServings(prev => Math.min(12, prev + 1))}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-50 font-bold flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Ingredient List with Amounts & Expandable details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Ingredients ({recipe.ingredients.length} items)
              </h3>
              <span className="text-xs text-slate-500">Tap row to view substitutions & culinary tips</span>
            </div>

            <div className="space-y-2">
              {recipe.ingredients.map((ing) => {
                const scaledAmount = Number((ing.baseAmount * rescaleFactor).toFixed(1));
                const isExpanded = expandedIngredient === ing.name;

                return (
                  <div
                    key={ing.name}
                    className={`border rounded-xl transition-all ${
                      checkedIngredients.includes(ing.name)
                        ? 'bg-slate-900/40 border-slate-800/80 text-slate-500'
                        : 'bg-slate-800/30 hover:bg-slate-800/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div
                      onClick={() => toggleExpand(ing.name)}
                      className="p-3 flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCheckedIngredients(prev =>
                              prev.includes(ing.name)
                                ? prev.filter(n => n !== ing.name)
                                : [...prev, ing.name]
                            );
                          }}
                          className={`relative before:absolute before:-inset-2 before:content-[''] shrink-0 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                            checkedIngredients.includes(ing.name)
                              ? 'bg-emerald-500 border-emerald-500 text-ink'
                              : 'border-slate-600 hover:border-slate-400'
                          }`}
                          title="Check off ingredient"
                        >
                          {checkedIngredients.includes(ing.name) && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                        <div>
                          <p className={`text-sm font-medium ${checkedIngredients.includes(ing.name) ? 'line-through text-slate-500' : 'text-slate-50'}`}>
                            {ing.name}
                          </p>
                          <span className="text-xs text-slate-500">{ing.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-mono font-bold ${checkedIngredients.includes(ing.name) ? 'text-slate-500' : 'text-emerald-700'}`}>
                          {scaledAmount} {ing.unit}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <div className="px-4 pb-3 pt-1 border-t border-slate-800/80 bg-slate-900/60 text-xs space-y-1.5 animate-in fade-in duration-150">
                        {ing.prepNote && (
                          <p className="text-slate-300">
                            <span className="font-semibold text-slate-400">Prep:</span> {ing.prepNote}
                          </p>
                        )}
                        {ing.substitutions && (
                          <p className="text-amber-800">
                            <span className="font-semibold text-amber-800">Substitutions:</span> {ing.substitutions}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Standard Steps list */}
          {!isCookMode && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Preparation & Cooking Method
              </h3>
              <div className="space-y-3">
                {recipe.steps.map((step) => (
                  <div key={step.stepNumber} className="flex gap-3.5 p-3 rounded-xl bg-slate-800/20 border border-slate-800">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {step.stepNumber}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-slate-50">{step.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{step.instruction}</p>
                      {step.chefTip && (
                        <p className="text-xs text-amber-800 italic">Tip: {step.chefTip}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex flex-col sm:flex-row items-center justify-end gap-3">
          <div className="w-full sm:w-auto flex items-center gap-2">
            {showDiarySlotPicker ? (
              <div className="flex items-center gap-1.5 w-full">
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value as any)}
                  className="px-2.5 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-slate-50 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Morning Snack">Morning Snack</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Afternoon Snack">Afternoon Snack</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Evening Treat">Evening Treat</option>
                </select>
                <button
                  onClick={handleConfirmDiaryAdd}
                  className="px-3 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-ink rounded-xl flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Log
                </button>
                <button
                  onClick={() => setShowDiarySlotPicker(false)}
                  className="px-2.5 py-2 text-xs text-slate-400 hover:text-slate-50"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDiarySlotPicker(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-ink text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/10"
              >
                <PlusCircle className="w-4 h-4" />
                Add Recipe to Food Diary ({caloriesTotal} kcal)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
