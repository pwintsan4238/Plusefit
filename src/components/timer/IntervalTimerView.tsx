import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  Bell,
  Settings2,
  Flame,
  CheckCircle2,
  Sliders,
  Sparkles
} from 'lucide-react';
import { playRoundStart, playCountdownPip, playBoxingBell, playWhistle, playSynthBeep, playSuccessChime } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface Props {
  onSessionComplete?: (caloriesBurned: number) => void;
}

export const IntervalTimerView: React.FC<Props> = ({ onSessionComplete }) => {
  // Configuration Settings (Prompt: rounds picker 10-50, active time, recovery time, alert sounds)
  const [rounds, setRounds] = useState<number>(20); // 10 to 50
  const [activeSeconds, setActiveSeconds] = useState<number>(45);
  const [recoverySeconds, setRecoverySeconds] = useState<number>(15);
  const [warmupSeconds] = useState<number>(10);
  const [alertSound, setAlertSound] = useState<'boxing_bell' | 'synth_beep' | 'whistle' | 'mute'>('boxing_bell');

  // Execution State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [phase, setPhase] = useState<'warmup' | 'work' | 'rest' | 'complete'>('work');
  const [timeRemaining, setTimeRemaining] = useState<number>(45);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState<number>(0);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);

  // Sync initial timer
  useEffect(() => {
    if (!isRunning && phase !== 'complete') {
      setTimeRemaining(activeSeconds);
    }
  }, [activeSeconds, isRunning, phase]);

  // Main Timer Interval Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTotalSecondsElapsed(prev => prev + 1);
        setTimeRemaining(prev => {
          // Play pips on 3, 2, 1
          if (prev <= 4 && prev > 1 && alertSound !== 'mute') {
            playCountdownPip();
          }

          if (prev <= 1) {
            handlePhaseAdvance();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, phase, currentRound, rounds, activeSeconds, recoverySeconds]);

  const handlePhaseAdvance = () => {
    playRoundStart(alertSound);

    if (phase === 'warmup') {
      setPhase('work');
      setTimeRemaining(activeSeconds);
    } else if (phase === 'work') {
      if (currentRound < rounds) {
        setPhase('rest');
        setTimeRemaining(recoverySeconds);
      } else {
        // Complete!
        setPhase('complete');
        setIsRunning(false);
        playSuccessChime();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        if (onSessionComplete) {
          const estimatedCals = Math.round((rounds * (activeSeconds + recoverySeconds) / 60) * 8.5);
          onSessionComplete(estimatedCals);
        }
      }
    } else if (phase === 'rest') {
      setCurrentRound(prev => prev + 1);
      setPhase('work');
      setTimeRemaining(activeSeconds);
    }
  };

  const handleStartPause = () => {
    if (phase === 'complete') {
      handleReset();
      return;
    }
    if (!isRunning) {
      playRoundStart(alertSound);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentRound(1);
    setPhase('work');
    setTimeRemaining(activeSeconds);
    setTotalSecondsElapsed(0);
  };

  const handleSkipPhase = () => {
    handlePhaseAdvance();
  };

  const previewSound = (sound: 'boxing_bell' | 'synth_beep' | 'whistle' | 'mute') => {
    if (sound === 'boxing_bell') playBoxingBell();
    else if (sound === 'whistle') playWhistle();
    else if (sound === 'synth_beep') playSynthBeep(true);
  };

  // Ring Calculation
  const maxPhaseTime = phase === 'work' ? activeSeconds : recoverySeconds;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = maxPhaseTime > 0 ? timeRemaining / maxPhaseTime : 0;
  const strokeDashoffset = circumference * (1 - progressRatio);

  const phaseColor =
    phase === 'work'
      ? 'text-emerald-400 stroke-emerald-400'
      : phase === 'rest'
      ? 'text-cyan-400 stroke-cyan-400'
      : phase === 'warmup'
      ? 'text-amber-400 stroke-amber-400'
      : 'text-purple-400 stroke-purple-400';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 text-emerald-50 selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Time Track
            </span>
            <span className="text-xs text-slate-400">HIIT / Tabata / Circuit Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Interval Timer
          </h1>
          <p className="text-xs text-slate-300">
            {rounds} Rounds • {activeSeconds}s Active / {recoverySeconds}s Recovery • Total: {Math.round((rounds * (activeSeconds + recoverySeconds)) / 60)} min
          </p>
        </div>

        <button
          onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 flex items-center gap-2 text-xs font-semibold transition-colors"
        >
          <Settings2 className="w-4 h-4 text-emerald-400" />
          <span>Timer Settings</span>
        </button>
      </div>

      {/* Settings Panel (Rounds picker 10-50, active time, recovery time, alert sounds) */}
      {showSettingsDrawer && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Interval Protocol Settings
            </h2>
            <button
              onClick={() => setShowSettingsDrawer(false)}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Done
            </button>
          </div>

          {/* Prompt requirement: Rounds picker (10–50) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Rounds Picker (10 – 50)
                </label>
                <p className="text-xs text-slate-400">Select total interval cycles</p>
              </div>
              <span className="text-xl font-mono font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                {rounds} Rounds
              </span>
            </div>

            {/* Quick Presets (10, 15, 20, 30, 40, 50) */}
            <div className="flex flex-wrap gap-2">
              {[10, 15, 20, 25, 30, 40, 50].map(r => (
                <button
                  key={r}
                  onClick={() => {
                    setRounds(r);
                    if (!isRunning) setCurrentRound(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                    rounds === r
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {r} Rds
                </button>
              ))}
            </div>

            {/* Slider 10 - 50 */}
            <input
              type="range"
              min="10"
              max="50"
              value={rounds}
              onChange={(e) => setRounds(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Active Time & Recovery Time Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Active Time */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-750 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Active Time (Work)
                  </label>
                  <p className="text-xs text-slate-400">High effort interval</p>
                </div>
                <span className="text-lg font-mono font-bold text-white">
                  {activeSeconds}s
                </span>
              </div>
              <div className="flex gap-1.5">
                {[20, 30, 45, 60, 90].map(sec => (
                  <button
                    key={sec}
                    onClick={() => setActiveSeconds(sec)}
                    className={`px-2.5 py-1 text-xs font-mono rounded-lg border ${
                      activeSeconds === sec
                        ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* Recovery Time */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-750 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Recovery Time (Rest)
                  </label>
                  <p className="text-xs text-slate-400">Catch breath & hydrate</p>
                </div>
                <span className="text-lg font-mono font-bold text-white">
                  {recoverySeconds}s
                </span>
              </div>
              <div className="flex gap-1.5">
                {[10, 15, 20, 30, 45].map(sec => (
                  <button
                    key={sec}
                    onClick={() => setRecoverySeconds(sec)}
                    className={`px-2.5 py-1 text-xs font-mono rounded-lg border ${
                      recoverySeconds === sec
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Prompt requirement: Alert sound settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-emerald-400" />
                Alert Sound Settings
              </label>
              <span className="text-xs text-slate-400">Synthesized audio cues</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'boxing_bell', label: 'Boxing Bell' },
                { id: 'whistle', label: 'Referee Whistle' },
                { id: 'synth_beep', label: 'Synth Beep' },
                { id: 'mute', label: 'Silent / Mute' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setAlertSound(item.id as any);
                    previewSound(item.id as any);
                  }}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    alertSound === item.id
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-white shadow-md shadow-emerald-500/10'
                      : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Timer Display Card (Mint Theme) */}
      <div className="relative p-8 sm:p-12 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
        
        {/* Glow ambient background */}
        <div className={`absolute inset-0 opacity-10 transition-colors duration-500 ${
          phase === 'work' ? 'bg-emerald-500' : phase === 'rest' ? 'bg-cyan-500' : 'bg-purple-500'
        }`} />

        {/* Phase Pill */}
        <div className="relative z-10 mb-4">
          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${
            phase === 'work'
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/20'
              : phase === 'rest'
              ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-500/20'
              : 'bg-purple-500/20 border-purple-500/40 text-purple-400'
          }`}>
            {phase === 'work' ? 'WORK PHASE' : phase === 'rest' ? 'REST & RECOVER' : 'SESSION COMPLETE'}
          </span>
        </div>

        {/* Big Circular Progress Gauge */}
        <div className="relative my-4 flex items-center justify-center select-none">
          <svg className="w-64 h-64 sm:w-72 sm:h-72 transform -rotate-90">
            {/* Background track */}
            <circle
              cx="144"
              cy="144"
              r={radius}
              className="text-slate-800"
              strokeWidth="12"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Active timer stroke */}
            <circle
              cx="144"
              cy="144"
              r={radius}
              className={`transition-all duration-300 ease-linear ${phaseColor}`}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Central Countdown Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-6xl sm:text-7xl font-black font-mono text-white tracking-tight">
              {timeRemaining}
              <span className="text-2xl font-light text-slate-400 ml-1">s</span>
            </span>
            <span className="text-sm font-mono font-bold text-emerald-400 mt-1">
              Round {currentRound} of {rounds}
            </span>
            <span className="text-xs text-slate-400 mt-1">
              Elapsed: {Math.floor(totalSecondsElapsed / 60)}:{(totalSecondsElapsed % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Big Controls */}
        <div className="relative z-10 flex items-center gap-4 mt-6">
          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleStartPause}
            className={`px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center gap-3 shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isRunning
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-500/30'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isRunning ? 'Pause' : 'Start'}</span>
          </button>

          <button
            onClick={handleSkipPhase}
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Skip to next phase"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Sound & Phase quick summary */}
        <div className="relative z-10 mt-8 pt-4 border-t border-slate-800/80 w-full flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-emerald-400" />
            Alert: {alertSound.replace('_', ' ')}
          </span>
          <span className="font-mono">
            {rounds - currentRound} rounds remaining
          </span>
        </div>
      </div>

    </div>
  );
};
