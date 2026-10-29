import { Recipe, MealItem, WorkoutProgram, RunnerPosition, ShoppingItem } from '../types';

export const INITIAL_CALORIE_BUDGET = {
  dailyTarget: 2400,
  caloriesLeft: 1900,
  caloriesConsumed: 500,
  caloriesBurned: 640,
  macrosLeft: {
    protein: 135, // grams remaining
    carbs: 180,   // grams remaining
    fat: 55,      // grams remaining
    fibre: 28,    // grams remaining
  },
  macrosTotal: {
    protein: 160,
    carbs: 240,
    fat: 70,
    fibre: 35,
  }
};

export const DAILY_MEAL_PLAN: MealItem[] = [
  {
    id: 'meal-1',
    name: 'Avocado & Poached Egg Sourdough',
    category: 'Breakfast',
    calories: 480,
    prepTime: '12 min',
    photoUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80',
    description: 'Crispy artisanal sourdough topped with smashed Haas avocado, microgreens, chili flakes, and organic poached eggs.',
    macros: { protein: 24, carbs: 36, fat: 22, fibre: 8 },
    isFavourite: true,
  },
  {
    id: 'meal-2',
    name: 'Greek Yogurt Berry Chia Crunch',
    category: 'Morning Snack',
    calories: 220,
    prepTime: '5 min',
    photoUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80',
    description: 'Strained 0% Greek yogurt layered with wild blueberries, roasted pumpkin seeds, and chia pudding.',
    macros: { protein: 18, carbs: 24, fat: 4, fibre: 6 },
    isFavourite: false,
  },
  {
    id: 'meal-3',
    name: 'Grilled Lemon Herb Salmon & Quinoa',
    category: 'Lunch',
    calories: 585,
    prepTime: '20 min',
    photoUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80',
    description: 'Crispy skin wild-caught salmon fillet seasoned with thyme and Meyer lemon, served over fluffy tricolor quinoa and steamed asparagus.',
    macros: { protein: 44, carbs: 48, fat: 19, fibre: 8 },
    isFavourite: true,
  },
  {
    id: 'meal-4',
    name: 'Matcha Protein Almond Boost',
    category: 'Afternoon Snack',
    calories: 216,
    prepTime: '5 min',
    photoUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&auto=format&fit=crop&q=80',
    description: 'Ceremonial Uji matcha shaken with cold unsweetened almond milk, Madagascar vanilla whey isolate, and crushed ice.',
    macros: { protein: 22, carbs: 18, fat: 6, fibre: 4 },
    isFavourite: false,
  },
  {
    id: 'meal-5',
    name: 'Sesame Glazed Tofu & Edamame Soba',
    category: 'Dinner',
    calories: 400,
    prepTime: '18 min',
    photoUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    description: 'Pan-seared extra-firm organic tofu tossed in low-sodium tamari-ginger glaze with buckwheat noodles, edamame, and pak choi.',
    macros: { protein: 28, carbs: 52, fat: 11, fibre: 8 },
    isFavourite: true,
  }
];

export const RECIPES_DATA: Recipe[] = [
  {
    id: 'recipe-salmon-quinoa',
    name: 'Grilled Lemon Herb Salmon & Quinoa Bowl',
    caloriesPerServe: 585,
    prepTime: '10 min',
    cookTime: '12 min',
    totalTime: '22 min',
    photoUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1000&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 342,
    difficulty: 'Easy',
    servings: 1,
    macrosPerServe: {
      protein: 44,
      carbs: 48,
      fat: 19,
      fibre: 8,
    },
    description: 'A deeply nourishing, nutrient-dense bowl featuring seared wild salmon bursting with omega-3s, golden toasted quinoa, and fresh lemon-herb dressing.',
    tags: ['High Protein', 'Gluten Free', 'Heart Healthy', 'Under 30 Min'],
    isFavourite: true,
    ingredients: [
      {
        name: 'Wild Alaskan Salmon Fillet',
        baseAmount: 180,
        unit: 'g',
        category: 'Protein',
        prepNote: 'Pat dry with paper towels; skin on for maximum crispness',
        substitutions: 'Steelhead trout or pan-seared sea bass work beautifully.'
      },
      {
        name: 'Tricolor Quinoa (Cooked)',
        baseAmount: 150,
        unit: 'g',
        category: 'Pantry & Grains',
        prepNote: 'Simmered in vegetable broth with a pinch of sea salt',
        substitutions: 'Brown basmati rice or farro.'
      },
      {
        name: 'Fresh Asparagus Spears',
        baseAmount: 120,
        unit: 'g',
        category: 'Produce',
        prepNote: 'Tough woody ends trimmed, sliced on bias',
        substitutions: 'Broccolini or crisp sugar snap peas.'
      },
      {
        name: 'Extra Virgin Olive Oil',
        baseAmount: 10,
        unit: 'ml',
        category: 'Spices & Oils',
        prepNote: 'First cold pressed Spanish or Greek oil',
        substitutions: 'Avocado oil for higher heat searing.'
      },
      {
        name: 'Meyer Lemon (Zested & Juiced)',
        baseAmount: 1,
        unit: 'whole',
        category: 'Produce',
        prepNote: 'Zest before cutting and extracting fresh juice',
        substitutions: 'Regular Eureka lemon or lime.'
      },
      {
        name: 'Fresh Dill & Flat Leaf Parsley',
        baseAmount: 15,
        unit: 'g',
        category: 'Produce',
        prepNote: 'Roughly chopped leaves',
        substitutions: 'Fresh tarragon or chives.'
      },
      {
        name: 'Garlic Clove',
        baseAmount: 1,
        unit: 'clove',
        category: 'Produce',
        prepNote: 'Grated microplane fine',
        substitutions: '1/4 tsp garlic powder.'
      },
      {
        name: 'Flaky Sea Salt & Black Pepper',
        baseAmount: 2,
        unit: 'g',
        category: 'Spices & Oils',
        prepNote: 'Maldon salt and freshly cracked peppercorn',
        substitutions: 'Pink Himalayan salt.'
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Prep and Season Salmon',
        instruction: 'Pat the salmon dry with paper towel. Score skin lightly. Season both sides with flaky sea salt, cracked black pepper, and half the lemon zest.',
        timerSeconds: 120,
        chefTip: 'Ensuring the skin is thoroughly dry guarantees restaurant-level crispiness without sticking.'
      },
      {
        stepNumber: 2,
        title: 'Sear to Golden Perfection',
        instruction: 'Heat olive oil in a heavy stainless steel or cast iron skillet over medium-high until shimmering. Place salmon skin-side down, press gently for 10 seconds, then sear for 4-5 minutes undisturbed.',
        timerSeconds: 270,
        chefTip: 'Do not nudge the fish until the skin releases naturally from the pan.'
      },
      {
        stepNumber: 3,
        title: 'Flip and Baste with Herbs',
        instruction: 'Flip salmon carefully. Add grated garlic, remaining lemon juice, and fresh dill. Tilt pan and baste the salmon with aromatic juices for 2-3 minutes until internal temp hits 125°F (medium-rare).',
        timerSeconds: 150,
        chefTip: 'Carryover cooking will bring the salmon to the ideal 130°F while resting.'
      },
      {
        stepNumber: 4,
        title: 'Assemble Bowl & Dress',
        instruction: 'Spoon warm cooked quinoa into your wide bowl, lay the blistered asparagus alongside, gently place the crispy salmon atop, and drizzle remaining pan juices.',
        timerSeconds: 60,
        chefTip: 'Garnish with an extra wedge of charred lemon for vibrant table presentation.'
      }
    ]
  },
  {
    id: 'recipe-avocado-sourdough',
    name: 'Avocado & Poached Egg Protein Sourdough',
    caloriesPerServe: 480,
    prepTime: '5 min',
    cookTime: '7 min',
    totalTime: '12 min',
    photoUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 215,
    difficulty: 'Easy',
    servings: 1,
    macrosPerServe: {
      protein: 24,
      carbs: 36,
      fat: 22,
      fibre: 8,
    },
    description: 'Golden toasted slow-fermented sourdough slathered in coarse guacamole-style avocado and crowned with warm, runny-yolk poached eggs.',
    tags: ['Breakfast Classic', 'Vegetarian', 'High Fiber'],
    isFavourite: true,
    ingredients: [
      { name: 'Artisan Country Sourdough Slice', baseAmount: 2, unit: 'slices', category: 'Pantry & Grains' },
      { name: 'Ripe Haas Avocado', baseAmount: 1, unit: 'medium', category: 'Produce' },
      { name: 'Pasture-Raised Eggs', baseAmount: 2, unit: 'large', category: 'Dairy & Eggs' },
      { name: 'Red Pepper Flakes & Hemp Seeds', baseAmount: 5, unit: 'g', category: 'Spices & Oils' },
      { name: 'Lemon Juice', baseAmount: 5, unit: 'ml', category: 'Produce' }
    ],
    steps: [
      { stepNumber: 1, title: 'Toast Bread', instruction: 'Toast sourdough slices until deeply golden and firm.', timerSeconds: 180 },
      { stepNumber: 2, title: 'Mash Avocado', instruction: 'Mash ripe avocado with lemon juice, salt, and pepper leaving slight chunks.', timerSeconds: 90 },
      { stepNumber: 3, title: 'Poach Eggs', instruction: 'Gently slip eggs into simmering water with a dash of white vinegar for 3 minutes.', timerSeconds: 180 },
      { stepNumber: 4, title: 'Plate & Season', instruction: 'Spread avocado over toast, crown with poached eggs, and sprinkle red pepper flakes and hemp seeds.', timerSeconds: 60 }
    ]
  },
  {
    id: 'recipe-tofu-soba',
    name: 'Sesame Glazed Tofu & Edamame Soba',
    caloriesPerServe: 400,
    prepTime: '8 min',
    cookTime: '10 min',
    totalTime: '18 min',
    photoUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 184,
    difficulty: 'Easy',
    servings: 1,
    macrosPerServe: {
      protein: 28,
      carbs: 52,
      fat: 11,
      fibre: 8,
    },
    description: 'High-protein Japanese buckwheat soba noodles tossed in toasted sesame oil, crisp pan-seared organic tofu cubes, shelled edamame, and baby bok choy.',
    tags: ['Plant Based', 'High Fiber', 'Antioxidants', 'Quick Dinner'],
    isFavourite: false,
    ingredients: [
      { name: 'Organic Extra Firm Tofu', baseAmount: 180, unit: 'g', category: 'Protein', prepNote: 'Pressed and cut into 1-inch cubes', substitutions: 'Tempeh or edamame chunks.' },
      { name: '100% Buckwheat Soba Noodles', baseAmount: 80, unit: 'g', category: 'Pantry & Grains', prepNote: 'Boiled for 4 mins then rinsed in ice cold water', substitutions: 'Brown rice ramen or udon.' },
      { name: 'Shelled Edamame Beans', baseAmount: 70, unit: 'g', category: 'Produce', prepNote: 'Steamed tender green', substitutions: 'Green sweet peas.' },
      { name: 'Baby Bok Choy', baseAmount: 100, unit: 'g', category: 'Produce', prepNote: 'Halved lengthwise and flash steamed', substitutions: 'Broccolini or gai lan.' },
      { name: 'Toasted Sesame Oil & Tamari', baseAmount: 15, unit: 'ml', category: 'Spices & Oils', prepNote: 'Whisked with 1 tsp grated ginger', substitutions: 'Coconut aminos.' }
    ],
    steps: [
      { stepNumber: 1, title: 'Boil & Rinse Soba', instruction: 'Cook soba in boiling unsalted water for 4 minutes. Drain and rinse vigorously under cold water to remove starch.', timerSeconds: 240 },
      { stepNumber: 2, title: 'Crisp Tofu Cubes', instruction: 'Sear pressed tofu in hot sesame oil until all edges turn golden crisp.', timerSeconds: 300 },
      { stepNumber: 3, title: 'Toss with Glaze & Greens', instruction: 'Add steamed edamame, baby bok choy, and tamari ginger glaze. Toss over high heat for 90 seconds.', timerSeconds: 90 },
      { stepNumber: 4, title: 'Garnish and Serve', instruction: 'Assemble soba noodles in shallow bowl, top with sizzling glazed tofu, and scatter white toasted sesame seeds.', timerSeconds: 45 }
    ]
  }
];

export const WORKOUT_PROGRAM_ABS_BLASTER: WorkoutProgram = {
  id: 'workout-abs-blaster',
  title: 'Abs Blaster',
  subtitle: 'High-Density Core Sculpt & Rotational Power',
  durationMinutes: 25,
  caloriesKcal: 150,
  exerciseCount: 10,
  difficulty: 'Intermediate',
  focus: 'Core, Obliques & Deep Transverse Abdominis',
  bannerGradient: 'from-rose-500 via-pink-600 to-fuchsia-700',
  exercises: [
    {
      id: 'ex-1',
      name: 'Hollow Body Isometric Hold',
      category: 'Core',
      type: 'time',
      target: '60 Sec Hold',
      sets: 3,
      repsOrSeconds: 60,
      restSeconds: 30,
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&auto=format&fit=crop&q=80',
      intensity: 'High',
      equipment: 'Bodyweight / Mat',
      primaryMuscles: ['Transverse Abdominis', 'Rectus Abdominis'],
      formCues: ['Press your lumbar spine flush against the floor', 'Point toes and glue quads together', 'Keep arms extended directly by your ears'],
      mistakesToAvoid: ['Arching the lower back', 'Straining the neck by looking backwards'],
      instructions: ['Lie flat on your back with legs straight and arms extended overhead.', 'Contract your core to lift shoulder blades and feet 4-6 inches off the floor.', 'Hold the banana shape with deep nasal breaths.']
    },
    {
      id: 'ex-2',
      name: 'Dynamic Bicycle Crunches',
      category: 'Obliques',
      type: 'reps',
      target: '3 Sets x 15 Reps',
      sets: 3,
      repsOrSeconds: 15,
      restSeconds: 30,
      thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format&fit=crop&q=80',
      intensity: 'High',
      equipment: 'Bodyweight',
      primaryMuscles: ['External Obliques', 'Internal Obliques', 'Hip Flexors'],
      formCues: ['Rotate from the ribcage, not just pulling your elbow', 'Pause for 1 count on each extension', 'Keep chin tucked gently away from chest'],
      mistakesToAvoid: ['Yanking the neck forward with hands', 'Pedaling too quickly without muscle contraction'],
      instructions: ['Lie supine with fingertips lightly brushing temples.', 'Bring opposite elbow to opposite knee while extending the other leg straight.', 'Alternate sides rhythmically with deliberate contraction.']
    },
    {
      id: 'ex-3',
      name: 'Hanging Knee / Reverse Crunches',
      category: 'Lower Abs',
      type: 'reps',
      target: '3 Sets x 15 Reps',
      sets: 3,
      repsOrSeconds: 15,
      restSeconds: 35,
      thumbnail: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=500&auto=format&fit=crop&q=80',
      intensity: 'Medium',
      equipment: 'Pull-up Bar / Mat',
      primaryMuscles: ['Lower Rectus Abdominis', 'Pelvic Floor'],
      formCues: ['Curl pelvis toward your ribcage', 'Lower with a slow 3-second eccentric tempo', 'Avoid swinging momentum'],
      mistakesToAvoid: ['Kicking legs using hip flexor momentum', 'Dropping down abruptly'],
      instructions: ['Engage core and tilt pelvis upward, bringing knees toward your chest.', 'Squeeze at peak contraction for 1 second, then control the descent.']
    },
    {
      id: 'ex-4',
      name: 'Russian Twists with Control',
      category: 'Obliques',
      type: 'reps',
      target: '3 Sets x 20 Reps',
      sets: 3,
      repsOrSeconds: 20,
      restSeconds: 30,
      thumbnail: 'https://images.unsplash.com/photo-1544033527-b192daee1f5b?w=500&auto=format&fit=crop&q=80',
      intensity: 'High',
      equipment: 'Medicine Ball or Bodyweight',
      primaryMuscles: ['Internal Obliques', 'External Obliques'],
      formCues: ['Keep spine tall at a 45-degree angle', 'Anchor heels or hover feet for extra challenge', 'Track hands with your eyes to ensure full thoracic rotation'],
      mistakesToAvoid: ['Rounding the upper back', 'Only moving arms instead of twisting the torso'],
      instructions: ['Sit in a V-position with knees bent.', 'Rotate torso from side to side, tapping the floor beside your hip on each rep.']
    },
    {
      id: 'ex-5',
      name: 'High Plank Shoulder Taps',
      category: 'Core',
      type: 'reps',
      target: '3 Sets x 16 Reps',
      sets: 3,
      repsOrSeconds: 16,
      restSeconds: 25,
      thumbnail: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=500&auto=format&fit=crop&q=80',
      intensity: 'Medium',
      equipment: 'Bodyweight',
      primaryMuscles: ['Transverse Abdominis', 'Shoulder Stabilizers'],
      formCues: ['Widen feet slightly wider than hips for anti-rotational stability', 'Imagine balancing a cup of water on your lower back'],
      mistakesToAvoid: ['Rocking hips side to side', 'Sagging hips below spine line'],
      instructions: ['Start in a solid push-up plank.', 'Slowly tap opposite shoulder with hand while keeping your pelvis locked in place.']
    },
    {
      id: 'ex-6',
      name: 'Deadbug Core Integration',
      category: 'Core',
      type: 'reps',
      target: '3 Sets x 14 Reps',
      sets: 3,
      repsOrSeconds: 14,
      restSeconds: 25,
      thumbnail: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500&auto=format&fit=crop&q=80',
      intensity: 'Medium',
      equipment: 'Mat',
      primaryMuscles: ['Deep Stabilizers', 'Multifidus'],
      formCues: ['Maintain continuous abdominal brace', 'Exhale completely as limbs reach full extension'],
      mistakesToAvoid: ['Lower back peeling off mat', 'Rushing reps'],
      instructions: ['Lie on your back with knees at 90 degrees and arms pointing straight up.', 'Simultaneously lower opposite arm and opposite leg toward the floor. Return and switch.']
    },
    {
      id: 'ex-7',
      name: 'Side Plank Hip Dips & Reach',
      category: 'Obliques',
      type: 'reps',
      target: '3 Sets x 12 Reps',
      sets: 3,
      repsOrSeconds: 12,
      restSeconds: 30,
      thumbnail: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&auto=format&fit=crop&q=80',
      intensity: 'High',
      equipment: 'Mat',
      primaryMuscles: ['Quadratus Lumborum', 'Obliques'],
      formCues: ['Elbow directly under shoulder', 'Keep body in one unbroken diagonal line'],
      mistakesToAvoid: ['Hips drifting backwards', 'Dropping head'],
      instructions: ['In side plank, dip hips downward to lightly graze floor, then drive hips high toward the ceiling.']
    },
    {
      id: 'ex-8',
      name: 'Mountain Climbers Speed Burst',
      category: 'Full Body',
      type: 'time',
      target: '45 Sec Hold',
      sets: 3,
      repsOrSeconds: 45,
      restSeconds: 30,
      thumbnail: 'https://images.unsplash.com/photo-1434682881908-b0740ac3947a?w=500&auto=format&fit=crop&q=80',
      intensity: 'Extreme',
      equipment: 'Bodyweight',
      primaryMuscles: ['Core', 'Cardio Engine', 'Deltoids'],
      formCues: ['Keep weight shifted over wrists', 'Drive knees directly through center of chest'],
      mistakesToAvoid: ['Bouncing hips high in the air', 'Slacking on pace'],
      instructions: ['From plank, drive knees forward in a rapid, continuous sprint-like cadence.']
    },
    {
      id: 'ex-9',
      name: 'V-Up Jackknives',
      category: 'Abs',
      type: 'reps',
      target: '3 Sets x 15 Reps',
      sets: 3,
      repsOrSeconds: 15,
      restSeconds: 35,
      thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80',
      intensity: 'High',
      equipment: 'Mat',
      primaryMuscles: ['Upper & Lower Rectus Abdominis'],
      formCues: ['Reach for your shoelaces at the peak', 'Control the descent all the way back down'],
      mistakesToAvoid: ['Jerking arms to initiate movement', 'Bending knees excessively'],
      instructions: ['Simultaneously lift straight torso and straight legs into a crisp V-shape.']
    },
    {
      id: 'ex-10',
      name: 'Forearm Plank Extended Finisher',
      category: 'Core',
      type: 'time',
      target: '60 Sec Hold',
      sets: 1,
      repsOrSeconds: 60,
      restSeconds: 0,
      thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&auto=format&fit=crop&q=80',
      intensity: 'Extreme',
      equipment: 'Mat',
      primaryMuscles: ['Entire Core Cylinder', 'Glutes', 'Lats'],
      formCues: ['Squeeze glutes with maximum tension', 'Pull elbows toward toes isometrically'],
      mistakesToAvoid: ['Sagging lumbar spine', 'Holding your breath'],
      instructions: ['Assume forearm plank, lock in full-body tension, and breathe steadily through the final 60-second burn.']
    }
  ]
};

// 10 Runners in Bangkok Lumphini & Benjakitti Green Mile Group Run
export const INITIAL_GROUP_RUNNERS: RunnerPosition[] = [
  {
    id: 'runner-1',
    name: 'Jessica (You)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    pace: "5'12\" /km",
    distanceKm: 10.3,
    lat: 13.7315,
    lng: 100.5480,
    isCurrentUser: true,
    status: 'Cruising',
    heartRate: 154
  },
  {
    id: 'runner-2',
    name: 'Somchai Prasert',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    pace: "5'06\" /km",
    distanceKm: 10.6,
    lat: 13.7330,
    lng: 100.5520,
    status: 'Sprinting',
    heartRate: 168
  },
  {
    id: 'runner-3',
    name: 'Maya Chen',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    pace: "5'09\" /km",
    distanceKm: 10.4,
    lat: 13.7305,
    lng: 100.5460,
    status: 'Cruising',
    heartRate: 158
  },
  {
    id: 'runner-4',
    name: 'Natthawut Srisuk',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    pace: "5'16\" /km",
    distanceKm: 10.1,
    lat: 13.7290,
    lng: 100.5430,
    status: 'Running',
    heartRate: 150
  },
  {
    id: 'runner-5',
    name: 'Anong Rattanaporn',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80',
    pace: "5'11\" /km",
    distanceKm: 10.3,
    lat: 13.7320,
    lng: 100.5500,
    status: 'Cruising',
    heartRate: 156
  },
  {
    id: 'runner-6',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    pace: "5'22\" /km",
    distanceKm: 9.9,
    lat: 13.7280,
    lng: 100.5410,
    status: 'Running',
    heartRate: 147
  },
  {
    id: 'runner-7',
    name: 'Kanya Wattana',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    pace: "5'14\" /km",
    distanceKm: 10.2,
    lat: 13.7310,
    lng: 100.5475,
    status: 'Cruising',
    heartRate: 152
  },
  {
    id: 'runner-8',
    name: 'Liam O\'Connor',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    pace: "5'26\" /km",
    distanceKm: 9.8,
    lat: 13.7275,
    lng: 100.5395,
    status: 'Running',
    heartRate: 145
  },
  {
    id: 'runner-9',
    name: 'Thanakorn Lim',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    pace: "5'18\" /km",
    distanceKm: 10.0,
    lat: 13.7295,
    lng: 100.5445,
    status: 'Cruising',
    heartRate: 153
  },
  {
    id: 'runner-10',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    pace: "5'29\" /km",
    distanceKm: 9.7,
    lat: 13.7270,
    lng: 100.5380,
    status: 'Running',
    heartRate: 148
  }
];

export const INITIAL_SHOPPING_LIST: ShoppingItem[] = [
  { id: 'shop-1', name: 'Wild Alaskan Salmon Fillet', amount: 180, unit: 'g', category: 'Protein', isChecked: false, sourceRecipe: 'Salmon & Quinoa' },
  { id: 'shop-2', name: 'Tricolor Quinoa', amount: 150, unit: 'g', category: 'Pantry & Grains', isChecked: true, sourceRecipe: 'Salmon & Quinoa' },
  { id: 'shop-3', name: 'Fresh Asparagus Spears', amount: 120, unit: 'g', category: 'Produce', isChecked: false, sourceRecipe: 'Salmon & Quinoa' },
  { id: 'shop-4', name: 'Meyer Lemons', amount: 2, unit: 'whole', category: 'Produce', isChecked: false, sourceRecipe: 'Salmon & Quinoa' },
  { id: 'shop-5', name: 'Fresh Organic Dill', amount: 20, unit: 'g', category: 'Produce', isChecked: false, sourceRecipe: 'Salmon & Quinoa' },
  { id: 'shop-6', name: 'Haas Avocados', amount: 3, unit: 'whole', category: 'Produce', isChecked: true, sourceRecipe: 'Poached Egg Sourdough' },
  { id: 'shop-7', name: 'Artisan Country Sourdough', amount: 1, unit: 'loaf', category: 'Pantry & Grains', isChecked: false, sourceRecipe: 'Poached Egg Sourdough' },
  { id: 'shop-8', name: 'Pasture Raised Eggs (12-pack)', amount: 1, unit: 'carton', category: 'Dairy & Eggs', isChecked: false, sourceRecipe: 'Poached Egg Sourdough' },
  { id: 'shop-9', name: 'Greek 0% Yogurt', amount: 500, unit: 'g', category: 'Dairy & Eggs', isChecked: false, sourceRecipe: 'Morning Snack' },
  { id: 'shop-10', name: 'Ceremonial Matcha Powder', amount: 50, unit: 'g', category: 'Pantry & Grains', isChecked: false, sourceRecipe: 'Matcha Boost' }
];
