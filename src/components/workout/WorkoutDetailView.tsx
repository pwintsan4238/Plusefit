import React, { useState, useEffect } from 'react';
import { WorkoutProgram, Exercise } from '../../types';
import {
  Flame,
  Clock,
  Dumbbell,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  X,
  ChevronRight,
  ShieldAlert,
  Zap,
  Volume2,
  Sparkles,
  Trophy,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playRoundStart, playCountdownPip, playSuccessChime } from '../../utils/audio';

interface Props {
  program: WorkoutProgram;
  onWorkoutCompleted: (caloriesBurned: number) => void;
  /** Guided sessions need the Premium Workout package */
  isGuidedSessionLocked: boolean;
  onUnlockGuidedSession: () => void;
}

export const WorkoutDetailView: React.FC<Props> = ({
  program,
  onWorkoutCompleted,
  isGuidedSessionLocked,
  onUnlockGuidedSession
}) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isGuidedSessionActive, setIsGuidedSessionActive] = useState<boolean>(false);
  const [currentExIndex, setCurrentExIndex] = useState<number>(0);
  const [currentSet, setCurrentSet] = useState<number>(1);
  const [sessionPhase, setSessionPhase] = useState<'work' | 'rest'>('work');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [workoutComplete, setWorkoutComplete] = useState<boolean>(false);

  const activeExercise = program.exercises[currentExIndex];

  // Initialize timer when moving to a new exercise/phase
  useEffect(() => {
    if (isGuidedSessionActive && activeExercise) {
      if (sessionPhase === 'work') {
        const defaultSecs = activeExercise.type === 'time' ? activeExercise.repsOrSeconds : 45;
        setTimeRemaining(defaultSecs);
      } else {
        setTimeRemaining(activeExercise.restSeconds || 30);
      }
      setIsTimerRunning(true);
    }
  }, [currentExIndex, sessionPhase, isGuidedSessionActive]);

  // Guided timer ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGuidedSessionActive && isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 4 && prev > 1) {
            playCountdownPip();
          }
          if (prev === 1) {
            handlePhaseTransition();
          }
          return Math.max(0, prev - 1);
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGuidedSessionActive, isTimerRunning, timeRemaining]);

  const handlePhaseTransition = () => {
    playRoundStart('synth_beep');
    if (sessionPhase === 'work') {
      if (currentSet < activeExercise.sets) {
        setSessionPhase('rest');
      } else {
        // Move to next exercise
        if (currentExIndex < program.exercises.length - 1) {
          setCurrentExIndex(prev => prev + 1);
          setCurrentSet(1);
          setSessionPhase('work');
        } else {
          // Workout finished!
          finishWorkout();
        }
      }
    } else {
      // Rest finished, start next set
      setCurrentSet(prev => prev + 1);
      setSessionPhase('work');
    }
  };

  const handleSkipExercise = () => {
    if (currentExIndex < program.exercises.length - 1) {
      setCurrentExIndex(prev => prev + 1);
      setCurrentSet(1);
      setSessionPhase('work');
    } else {
      finishWorkout();
    }
  };

  const finishWorkout = () => {
    setIsTimerRunning(false);
    setWorkoutComplete(true);
    playSuccessChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onWorkoutCompleted(program.caloriesKcal);
  };

  const startGuidedSession = () => {
    setCurrentExIndex(0);
    setCurrentSet(1);
    setSessionPhase('work');
    setWorkoutComplete(false);
    setIsGuidedSessionActive(true);
    playRoundStart('boxing_bell');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 text-rose-50 selection:bg-rose-500 selection:text-white">

      {/* Main Programme Header Card - Vibrant Pink Aesthetic */}
      <div className="relative rounded-3xl overflow-hidden border border-rose-500/30 bg-gradient-to-br from-rose-950 via-slate-950 to-pink-950/80 p-6 sm:p-8 shadow-2xl shadow-rose-950/40">
        
        {/* Ambient neon pink glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-rose-500 text-slate-950 shadow-md shadow-rose-500/30">
                Core Signature Series
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30">
                {program.difficulty}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-lg">
              {program.title}
            </h1>
            <p className="text-sm sm:text-base text-rose-200/80 max-w-xl font-normal leading-relaxed">
              {program.subtitle}. High metabolic demand targeting deep transverse abdominis and oblique definition.
            </p>

            {/* Prompt Requirement: Workout summary: duration (25 min), calories (150 kcal), number of exercises (10) */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-rose-500/20 backdrop-blur-md">
                <Clock className="w-4 h-4 text-rose-400" />
                <span>Duration: <strong className="text-white font-mono font-bold">{program.durationMinutes} min</strong></span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-rose-500/20 backdrop-blur-md">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Burn: <strong className="text-white font-mono font-bold">{program.caloriesKcal} kcal</strong></span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-rose-500/20 backdrop-blur-md">
                <Dumbbell className="w-4 h-4 text-pink-400" />
                <span>Exercises: <strong className="text-white font-mono font-bold">{program.exerciseCount}</strong></span>
              </div>
            </div>
          </div>

          {/* Prompt requirement: Start Workout button for a guided session */}
          <div className="flex-shrink-0">
            <button
              onClick={isGuidedSessionLocked ? onUnlockGuidedSession : startGuidedSession}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-rose-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              {isGuidedSessionLocked
                ? <Lock className="w-5 h-5" aria-hidden="true" />
                : <Play className="w-5 h-5 fill-slate-950" aria-hidden="true" />}
              Start Workout
            </button>
            {isGuidedSessionLocked && (
              <p className="mt-2 text-xs text-rose-200/80 text-center sm:text-right">
                Guided sessions are part of Premium Workout
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Exercise List with Illustrations, Sets/Reps/Time, and Tap for Detail */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-rose-500/20 shadow-xl space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 border-b border-rose-500/20 pb-3">
          <div>
            <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              Exercise Circuit ({program.exercises.length})
            </h2>
            <p className="text-xs text-rose-300/70">
              Tap any exercise card for video cues, form corrections and muscle map
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-rose-400">
            Focus: {program.focus}
          </span>
        </div>

        {/* List of 10 Exercises */}
        <div className="space-y-3">
          {program.exercises.map((ex, index) => (
            <button
              type="button"
              key={ex.id}
              onClick={() => setSelectedExercise(ex)}
              className="group w-full text-left p-3 sm:p-3.5 rounded-2xl bg-slate-800/40 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-500/40 transition-colors cursor-pointer flex items-center justify-between gap-3 sm:gap-4"
            >
              <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                {/* Index badge */}
                <div className="hidden sm:flex w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono font-bold text-xs items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>

                {/* Illustration / Image Thumbnail */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-rose-500/20">
                  <img
                    src={ex.thumbnail}
                    alt={ex.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                </div>

                {/* Name & Primary Muscles */}
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                    <span className="sm:hidden font-mono text-rose-400 mr-1.5">{index + 1}.</span>
                    {ex.name}
                  </h3>
                  {/* On phones the sets/rest column moves under the name */}
                  <p className="sm:hidden text-xs font-mono font-bold text-rose-400 mt-0.5">
                    {ex.target} <span className="text-slate-400 font-normal">· Rest {ex.restSeconds}s</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-rose-200/60 mt-0.5">
                    <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">
                      {ex.category}
                    </span>
                    <span>{ex.primaryMuscles.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Prompt Requirement: Sets and reps or time for each exercise (3 Sets x 15 Reps, 60 Sec Hold) */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="hidden sm:block text-right">
                  <span className="text-xs sm:text-sm font-black font-mono text-rose-400 block tracking-tight">
                    {ex.target}
                  </span>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block">
                    Rest: {ex.restSeconds}s
                  </span>
                </div>

                <div className="w-8 h-8 rounded-xl bg-slate-800 group-hover:bg-rose-500/20 text-slate-400 group-hover:text-rose-300 flex items-center justify-center transition-colors">
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Guided Session Full-Screen Modal Player */}
      {isGuidedSessionActive && activeExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-slate-950 border border-rose-500/30 rounded-3xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                  {program.title} • Exercise {currentExIndex + 1} of {program.exercises.length}
                </span>
              </div>
              <button aria-label="Close"
                onClick={() => setIsGuidedSessionActive(false)}
                className="w-8 h-8 rounded-full bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {workoutComplete ? (
              /* Completion Celebration Screen */
              <div className="py-12 text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-rose-500/40">
                  <Trophy className="w-10 h-10 text-slate-950" />
                </div>
                <h3 className="text-3xl font-black text-white">Workout Crushed!</h3>
                <p className="text-sm text-rose-200/80 max-w-sm mx-auto">
                  You completed all 10 exercises of Abs Blaster and burned ~150 kcal.
                </p>
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 max-w-xs mx-auto text-xs text-rose-300 font-mono">
                  +150 kcal added to Active Stats!
                </div>
                <button
                  onClick={() => setIsGuidedSessionActive(false)}
                  className="px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-sm transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              /* Active Exercise Session View */
              <div className="py-6 space-y-6 text-center">
                
                {/* Status chip */}
                <div className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {sessionPhase === 'work' ? `Set ${currentSet} of ${activeExercise.sets} (Active)` : 'Rest Interval'}
                </div>

                {/* Big Timer */}
                <div className="space-y-1">
                  <div className="text-6xl sm:text-7xl font-black font-mono text-white tracking-tight">
                    {timeRemaining}
                    <span className="text-xl font-normal text-rose-400 ml-1">s</span>
                  </div>
                  <p className="text-xs font-mono text-rose-300 uppercase tracking-widest">
                    Target: {activeExercise.target}
                  </p>
                </div>

                {/* Exercise Preview Card */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-rose-500/20 flex items-center gap-4 text-left">
                  <img
                    src={activeExercise.thumbnail}
                    alt={activeExercise.name}
                    className="w-16 h-16 rounded-xl object-cover border border-rose-500/30"
                  />
                  <div>
                    <h4 className="text-base font-bold text-white">{activeExercise.name}</h4>
                    <p className="text-xs text-rose-200/70">{activeExercise.formCues[0]}</p>
                  </div>
                </div>

                {/* Next up preview */}
                {currentExIndex < program.exercises.length - 1 && (
                  <p className="text-xs text-slate-400">
                    Next: <strong className="text-rose-300">{program.exercises[currentExIndex + 1].name}</strong>
                  </p>
                )}

                {/* Quick Time Adjusters */}
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setTimeRemaining(prev => Math.max(5, prev - 15))}
                    className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-900 border border-slate-800 text-rose-300 hover:text-white hover:border-rose-500/40"
                  >
                    -15s
                  </button>
                  <button
                    onClick={() => handlePhaseTransition()}
                    className="px-3 py-1 text-xs font-bold rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30"
                  >
                    ✓ Complete {sessionPhase === 'work' ? 'Set' : 'Rest'}
                  </button>
                  <button
                    onClick={() => setTimeRemaining(prev => prev + 15)}
                    className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-900 border border-slate-800 text-rose-300 hover:text-white hover:border-rose-500/40"
                  >
                    +15s
                  </button>
                </div>

                {/* Main Controls */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <button
                    onClick={() => {
                      if (currentExIndex > 0) {
                        setCurrentExIndex(prev => prev - 1);
                        setCurrentSet(1);
                        setSessionPhase('work');
                      }
                    }}
                    disabled={currentExIndex === 0}
                    className="p-3 rounded-2xl bg-slate-900 text-slate-400 hover:text-white disabled:opacity-30"
                    title="Previous Exercise"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="px-6 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-rose-500/30"
                  >
                    {isTimerRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    <span>{isTimerRunning ? 'Pause' : 'Resume'}</span>
                  </button>

                  <button
                    onClick={handleSkipExercise}
                    className="p-3 rounded-2xl bg-slate-900 text-slate-300 hover:text-white"
                    title="Skip to Next"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Tap an exercise for more detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-950 border border-rose-500/30 rounded-3xl p-6 shadow-2xl space-y-5 text-rose-50 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Exercise Anatomy & Technique
              </span>
              <button aria-label="Close"
                onClick={() => setSelectedExercise(null)}
                className="w-8 h-8 rounded-full bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail */}
            <div className="relative h-48 rounded-2xl overflow-hidden border border-rose-500/30">
              <img
                src={selectedExercise.thumbnail}
                alt={selectedExercise.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="text-lg font-black text-white">{selectedExercise.name}</span>
                <span className="px-2.5 py-1 rounded-lg bg-rose-500 text-slate-950 font-mono font-black text-xs">
                  {selectedExercise.target}
                </span>
              </div>
            </div>

            {/* Primary Muscles */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">Primary Muscles Targeted</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedExercise.primaryMuscles.map(m => (
                  <span key={m} className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Form Cues */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Key Form Cues
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {selectedExercise.formCues.map((cue, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{cue}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mistakes to avoid */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                Common Mistakes to Avoid
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedExercise.mistakesToAvoid.map((mistake, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedExercise(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
              >
                Close Technique Guide
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
