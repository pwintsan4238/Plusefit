export interface MacroNutrients {
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
  fibre: number;   // in grams
}

export interface MealItem {
  id: string;
  name: string;
  category: 'Breakfast' | 'Morning Snack' | 'Lunch' | 'Afternoon Snack' | 'Dinner' | 'Evening Treat';
  calories: number;
  prepTime: string;
  photoUrl: string;
  macros: MacroNutrients;
  servings?: number;
  description?: string;
  isFavourite?: boolean;
}

export interface Ingredient {
  name: string;
  baseAmount: number;
  unit: string;
  category: 'Produce' | 'Protein' | 'Dairy & Eggs' | 'Pantry & Grains' | 'Spices & Oils';
  prepNote?: string;
  substitutions?: string;
}

export interface Recipe {
  id: string;
  name: string;
  caloriesPerServe: number;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  photoUrl: string;
  rating: number;
  reviewsCount: number;
  difficulty: 'Easy' | 'Medium' | 'Challenging';
  servings: number;
  macrosPerServe: MacroNutrients;
  description: string;
  ingredients: Ingredient[];
  steps: {
    stepNumber: number;
    title: string;
    instruction: string;
    timerSeconds?: number;
    chefTip?: string;
  }[];
  isFavourite: boolean;
  tags: string[];
}

export interface FoodDiaryEntry {
  id: string;
  mealCategory: 'Breakfast' | 'Morning Snack' | 'Lunch' | 'Afternoon Snack' | 'Dinner' | 'Evening Treat';
  name: string;
  calories: number;
  portion: string;
  macros: MacroNutrients;
  timeLogged: string;
  photoUrl?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'Abs' | 'Core' | 'Obliques' | 'Lower Abs' | 'Full Body';
  type: 'reps' | 'time';
  target: string; // e.g., "3 Sets x 15 Reps" or "60 Sec Hold"
  sets: number;
  repsOrSeconds: number;
  restSeconds: number;
  thumbnail: string;
  instructions: string[];
  formCues: string[];
  mistakesToAvoid: string[];
  primaryMuscles: string[];
  equipment: string;
  intensity: 'Medium' | 'High' | 'Extreme';
}

export interface WorkoutProgram {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  caloriesKcal: number;
  exerciseCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  focus: string;
  bannerGradient: string;
  exercises: Exercise[];
}

export interface RunnerPosition {
  id: string;
  name: string;
  avatar: string;
  pace: string;
  distanceKm: number;
  lat: number;
  lng: number;
  isCurrentUser?: boolean;
  status: 'Running' | 'Cruising' | 'Sprinting';
  heartRate: number;
}

export interface IntervalTimerConfig {
  rounds: number;
  activeSeconds: number;
  recoverySeconds: number;
  warmupSeconds: number;
  alertSound: 'boxing_bell' | 'synth_beep' | 'whistle' | 'mute';
}
