import React, { useState } from 'react';
import {
  Flame,
  Footprints,
  Trophy,
  Zap,
  Play,
  ArrowRight,
  Sparkles,
  MapPin,
  Timer,
  TrendingUp,
  Droplets,
  Heart,
  ChevronRight,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { WorkoutProgram } from '../../types';

interface Props {
  userName?: string;
  pointsCount: string; // e.g. "124k"
  streakDays: number;  // e.g. 20
  caloriesBurned: number;
  caloriesTarget: number;
  stepCount: number;
  stepTarget: number;
  todayWorkout: WorkoutProgram;
  onStartTodayWorkout: () => void;
  onNavigateToLiveMap: () => void;
  onNavigateToIntervalTimer: () => void;
  onNavigateToNutrition: () => void;
}

export const HomeDashboardView: React.FC<Props> = ({
  userName = 'Jessica',
  pointsCount = '124k',
  streakDays = 20,
  caloriesBurned = 640,
  caloriesTarget = 750,
  stepCount = 8420,
  stepTarget = 10000,
  todayWorkout,
  onStartTodayWorkout,
  onNavigateToLiveMap,
  onNavigateToIntervalTimer,
  onNavigateToNutrition
}) => {
  const [waterGlasses, setWaterGlasses] = useState<number>(6);
  const [motivationalLineIndex, setMotivationalLineIndex] = useState<number>(0);

  const motivationalQuotes = [
    "Stay relentless—your core power and tempo pace are peaking today.",
    "Small daily disciplines compound into astonishing athletic breakthroughs.",
    "Hydrate, focus, and let today's 25-minute Abs Blaster set the tone.",
    "Bangkok sunrise awaits. Lumphini to Benjakitti Green Mile group run is rolling at 5'12\"/km."
  ];

  const currentQuote = motivationalQuotes[motivationalLineIndex];

  const calProgress = Math.min(100, Math.round((caloriesBurned / caloriesTarget) * 100));
  const stepProgress = Math.min(100, Math.round((stepCount / stepTarget) * 100));

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 text-emerald-50 selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Welcome Bar: Personal Greeting ("Hey, Jessica") + Points Counter ("124k") + Streak Chip ("20") */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Mint neon ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            {/* Streak or quick stat chip (20) */}
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/30 flex items-center gap-1.5 shadow-sm">
              <Flame className="w-3.5 h-3.5 fill-orange-400" />
              {streakDays} Day Streak
            </span>

            {/* Points or followers counter (124k) */}
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-emerald-400" />
              {pointsCount} Points
            </span>
          </div>

          {/* Personal greeting: "Hey, Jessica" */}
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2">
            Hey, {userName}
            <Sparkles className="w-6 h-6 text-amber-400" />
          </h1>

          {/* Motivational line */}
          <p
            onClick={() => setMotivationalLineIndex((prev) => (prev + 1) % motivationalQuotes.length)}
            className="text-xs sm:text-sm text-slate-300 max-w-lg cursor-pointer hover:text-emerald-300 transition-colors flex items-center gap-1.5"
            title="Tap to cycle motivational lines"
          >
            <span>“{currentQuote}”</span>
          </p>
        </div>

        {/* Quick Profile Level Badge */}
        <div className="relative z-10 flex items-center gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg">
            LVL 14
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">Club Rank</span>
            <span className="text-sm font-bold text-white block">Elite Tier #4</span>
            <span className="text-xs font-mono text-emerald-400 block">+2,400 pts this week</span>
          </div>
        </div>
      </div>

      {/* Today's Workout Card with "Start" Button (Abs Blaster) */}
      <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-900 border border-rose-500/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-5 overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500 text-slate-950">
              Today's Session
            </span>
            <span className="text-xs text-rose-300/80 font-mono">
              {todayWorkout.durationMinutes} min • {todayWorkout.caloriesKcal} kcal
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {todayWorkout.title}
          </h2>
          <p className="text-xs text-slate-300 max-w-md">
            10 high-density exercises focusing on transverse abdominis, bicycle crunches, and hollow holds.
          </p>
        </div>

        {/* Prompt requirement: Start button for today’s workout */}
        <button
          onClick={onStartTodayWorkout}
          className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-rose-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0 z-10"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          Start Today’s Workout
        </button>
      </div>

      {/* Active Stats: Calories Burned & Step Count */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Active Stats: Calories Burned */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Calories Burned
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-black text-white">
              {caloriesBurned}
            </span>
            <span className="text-xs font-mono text-slate-400">
              / {caloriesTarget} kcal
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
              style={{ width: `${calProgress}%` }}
            />
          </div>
          <div className="text-xs font-mono text-emerald-400">
            {calProgress}% of daily active target
          </div>
        </div>

        {/* Active Stats: Step Count */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Daily Step Count
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Footprints className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-black text-white">
              {stepCount.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-slate-400">
              / {stepTarget.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${stepProgress}%` }}
            />
          </div>
          <div className="text-xs font-mono text-emerald-400">
            {stepProgress}% completed (~6.5 km)
          </div>
        </div>

        {/* Water Intake Tracker */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Hydration Intake
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-black text-white">
              {waterGlasses}
            </span>
            <span className="text-xs font-mono text-slate-400">
              / 8 glasses
            </span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(8)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setWaterGlasses(idx + 1)}
                className={`relative h-5 flex-1 rounded transition-colors before:absolute before:-inset-y-3 before:inset-x-0 before:content-[''] ${
                  idx < waterGlasses ? 'bg-cyan-400' : 'bg-slate-800'
                }`}
                title={`Log ${idx + 1} glasses`}
              />
            ))}
          </div>
          <div className="text-xs font-mono text-cyan-400">
            {(waterGlasses * 250)} ml of 2,000 ml target
          </div>
        </div>

        {/* Active Heart Rate & Recovery */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Resting Heart Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center">
              <Heart className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-black text-white">
              56
            </span>
            <span className="text-xs font-mono text-slate-400">
              bpm (Optimal)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-emerald-500 w-4/5" />
          </div>
          <div className="text-xs font-mono text-emerald-400">
            Recovery score: 94% (High)
          </div>
        </div>

      </div>

      {/* Two Prominent Quick Action Hub Cards: Track Activity (Live Map) and Time Track (Interval Timer) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Track Activity Card (Mint / Map) */}
        <div
          onClick={onNavigateToLiveMap}
          className="group p-6 rounded-3xl bg-slate-900/90 hover:bg-slate-850 border border-emerald-500/30 hover:border-emerald-500/60 shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Track Activity
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-800 group-hover:bg-emerald-500 text-slate-400 group-hover:text-slate-950 flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">
              Live Map & Bangkok Group Run
            </h3>
            <p className="text-xs text-slate-300">
              Track 10.3 km course with 10 live friend positions along Lumphini-Benjakitti Green Mile (สะพานเขียว).
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-emerald-400">
            <span>Location: Bangkok, Thailand</span>
            <span>10 Friends Active</span>
          </div>
        </div>

        {/* Time Track Card (Mint / Interval Timer) */}
        <div
          onClick={onNavigateToIntervalTimer}
          className="group p-6 rounded-3xl bg-slate-900/90 hover:bg-slate-850 border border-emerald-500/30 hover:border-emerald-500/60 shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5" />
                Time Track
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-800 group-hover:bg-emerald-500 text-slate-400 group-hover:text-slate-950 flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">
              HIIT & Circuit Interval Timer
            </h3>
            <p className="text-xs text-slate-300">
              10–50 rounds picker with active/recovery intervals and boxing bell/whistle sound cues.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-emerald-400">
            <span>20 Rounds Default</span>
            <span>Synthesizer Audio</span>
          </div>
        </div>

      </div>

    </div>
  );
};
