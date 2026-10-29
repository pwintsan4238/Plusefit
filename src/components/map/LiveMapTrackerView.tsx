import React, { useState, useEffect, useRef } from 'react';
import { RunnerPosition } from '../../types';
import {
  MapPin,
  Play,
  Pause,
  RotateCcw,
  Users,
  Navigation,
  Compass,
  Zap,
  Heart,
  TrendingUp,
  Award,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { playRoundStart } from '../../utils/audio';

interface Props {
  initialRunners: RunnerPosition[];
  onAddCaloriesBurned: (cals: number) => void;
  onAddSteps: (steps: number) => void;
}

// 10 coordinates along Bangkok Lumphini to Benjakitti Forest Park (Green Mile Loop)
const BANGKOK_WAYPOINTS = [
  { x: 100, y: 350, name: 'Lumphini Park Lake Pier (สวนลุมพินี)' },
  { x: 160, y: 310, name: 'King Rama VI Monument' },
  { x: 230, y: 270, name: 'Sarasin Gate Overpass' },
  { x: 310, y: 230, name: 'The Green Mile Elevated Overpass (สะพานเขียว)' },
  { x: 390, y: 200, name: 'Wireless Road Skybridge' },
  { x: 470, y: 180, name: 'Khlong Phai Singto Canal Overpass' },
  { x: 550, y: 160, name: 'Benjakitti Forest Boardwalk (สวนเบญจกิติ)' },
  { x: 630, y: 130, name: 'Wetlands Skydeck & Mangroves' },
  { x: 710, y: 100, name: 'Lake Ratchada Promenade' },
  { x: 780, y: 80,  name: 'QSNCC Waterfront Amphitheatre' },
];

export const LiveMapTrackerView: React.FC<Props> = ({
  initialRunners,
  onAddCaloriesBurned,
  onAddSteps,
}) => {
  const [runners, setRunners] = useState<RunnerPosition[]>(initialRunners);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [distanceCoveredKm, setDistanceCoveredKm] = useState<number>(10.3); // 10.3 km
  const [locationName] = useState<string>('Bangkok, Thailand');
  const [courseName] = useState<string>('Lumphini to Benjakitti Green Mile (สะพานเขียว)');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(3214); // ~53 min
  const [currentPace] = useState<string>("5'12\" /km");
  const [userRunProgress, setUserRunProgress] = useState<number>(0.65); // along the route
  const [selectedRunner, setSelectedRunner] = useState<RunnerPosition | null>(initialRunners[0]);
  const [cheeredIds, setCheeredIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Live Tracking Simulation Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
        setDistanceCoveredKm(prev => {
          const nextDist = parseFloat((prev + 0.003).toFixed(2));
          return nextDist;
        });
        setUserRunProgress(prev => (prev >= 1 ? 0.05 : prev + 0.002));

        // Slightly animate positions of other runners
        setRunners(prevList =>
          prevList.map(r => {
            if (r.isCurrentUser) {
              return { ...r, distanceKm: parseFloat((r.distanceKm + 0.003).toFixed(2)) };
            }
            return {
              ...r,
              distanceKm: parseFloat((r.distanceKm + (Math.random() * 0.004)).toFixed(2)),
              heartRate: Math.floor(145 + Math.random() * 25)
            };
          })
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  const handleStartStopTracking = () => {
    if (!isTracking) {
      playRoundStart('whistle');
      setIsTracking(true);
      showToast('Live GPS Run Tracking Started in Bangkok!');
    } else {
      setIsTracking(false);
      onAddCaloriesBurned(45);
      onAddSteps(650);
      showToast('Run paused. 45 kcal logged to active stats!');
    }
  };

  const handleCheerRunner = (runner: RunnerPosition) => {
    setCheeredIds(prev => [...prev, runner.id]);
    showToast(`Sent cheers & high-five to ${runner.name}! 🙌`);
  };

  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs > 0 ? `${hrs}:` : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24 text-emerald-50 selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-full shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Header Info Banner: Location and Distance Covered (Bangkok, 10.3 km) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 animate-pulse" />
              Live Group Run • 10 Runners
            </span>
            <span className="text-xs text-slate-400">{courseName}</span>
          </div>

          <div className="flex items-baseline gap-3">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {locationName}
            </h1>
            <span className="text-2xl sm:text-3xl font-mono font-black text-emerald-400">
              {distanceCoveredKm} km
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-mono">
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              Pace: <strong className="text-white">{currentPace}</strong>
            </span>
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              Time: <strong className="text-white">{formatTime(elapsedSeconds)}</strong>
            </span>
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <strong className="text-white">154 bpm</strong>
            </span>
          </div>
        </div>

        {/* Start Now button to begin tracking */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={handleStartStopTracking}
            className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isTracking
                ? 'bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-rose-500/30'
                : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-500/30'
            }`}
          >
            {isTracking ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isTracking ? 'Pause Tracking' : 'Start Now'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Live Map Section */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-900 border border-emerald-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Bangkok Live Map: Green Mile & Parks Course
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            Lumphini ⇄ Benjakitti
          </span>
        </div>

        {/* Custom Styled Interactive SVG Map for Bangkok */}
        <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner select-none">
          <svg className="w-full h-full" viewBox="0 0 850 450" preserveAspectRatio="xMidYMid slice">
            <defs>
              {/* Neon Glow Filter */}
              <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>

            {/* Lumphini Park Green Reserve (West) */}
            <path
              d="M 20,200 C 60,180 180,220 200,320 C 220,400 120,440 30,420 Z"
              fill="#06281e"
              opacity="0.85"
            />
            {/* Lumphini Lake Water Body */}
            <ellipse cx="110" cy="320" rx="55" ry="35" fill="#042028" />
            <text x="75" y="325" fill="#34d399" fontSize="10" fontWeight="bold" opacity="0.8">Lumphini Lake</text>

            {/* Benjakitti Forest Park Wetlands & Lake (East) */}
            <path
              d="M 520,70 C 620,50 820,80 830,220 C 840,340 700,380 560,340 C 500,300 480,180 520,70 Z"
              fill="#062d22"
              opacity="0.85"
            />
            {/* Benjakitti Lake Ratchada */}
            <ellipse cx="710" cy="180" rx="60" ry="45" fill="#042028" />
            <text x="660" y="185" fill="#34d399" fontSize="10" fontWeight="bold" opacity="0.8">Lake Ratchada</text>

            {/* Khlong Phai Singto Canal (runs across middle under Green Mile) */}
            <path
              d="M 260,380 C 330,300 400,240 480,190"
              fill="none"
              stroke="#073847"
              strokeWidth="12"
              strokeLinecap="round"
              opacity="0.7"
            />
            <text x="330" y="320" fill="#38bdf8" fontSize="9" opacity="0.7" transform="rotate(-30 330,320)">Khlong Phai Singto Canal</text>

            {/* Bangkok City Street Grid lines (Wireless Rd, Rama IV, Sukhumvit, Ratchadaphisek) */}
            {[60, 120, 180, 240, 300, 360, 420].map(y => (
              <line key={y} x1="0" y1={y} x2="850" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="6 6" opacity="0.35" />
            ))}
            {[100, 200, 300, 400, 500, 600, 700, 800].map(x => (
              <line key={x} x1={x} y1="0" x2={x} y2="450" stroke="#1e293b" strokeWidth="1" strokeDasharray="6 6" opacity="0.35" />
            ))}

            {/* Bangkok Iconic Landmark Labels */}
            <text x="40" y="180" fill="#94a3b8" fontSize="11" fontWeight="bold">สวนลุมพินี • Lumphini Park</text>
            <text x="540" y="55" fill="#94a3b8" fontSize="11" fontWeight="bold">สวนเบญจกิติ • Benjakitti Forest Park</text>
            <text x="340" y="170" fill="#10b981" fontSize="10" fontWeight="bold">The Green Mile (สะพานเขียว)</text>
            <text x="650" y="270" fill="#64748b" fontSize="10">QSNCC National Convention Ctr</text>
            <text x="180" y="440" fill="#64748b" fontSize="10">Rama IV Road Corridor</text>

            {/* Highlighted Running Trail (The Elevated Green Mile: Lumphini ⇄ Benjakitti) */}
            <path
              d="M 100,350 C 160,310 230,270 310,230 S 430,190 550,160 S 680,120 780,80"
              fill="none"
              stroke="rgba(16, 185, 129, 0.25)"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M 100,350 C 160,310 230,270 310,230 S 430,190 550,160 S 680,120 780,80"
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="5"
              strokeLinecap="round"
              filter="url(#neon-glow)"
            />

            {/* Waypoint dots */}
            {BANGKOK_WAYPOINTS.map((wp, idx) => (
              <g key={idx}>
                <circle cx={wp.x} cy={wp.y} r="3.5" fill="#34d399" opacity="0.9" />
              </g>
            ))}

            {/* 10 Runners positions along Bangkok course */}
            {runners.map((runner, idx) => {
              const ratio = ((idx * 0.09) + (runner.isCurrentUser ? userRunProgress : 0.05)) % 0.95;
              const xPos = 100 + ratio * (780 - 100);
              const yPos = 350 - ratio * (350 - 80) + (Math.sin(ratio * 5) * 12);

              return (
                <g
                  key={runner.id}
                  transform={`translate(${xPos}, ${yPos})`}
                  className="cursor-pointer"
                  onClick={() => setSelectedRunner(runner)}
                >
                  {/* Pulsing radar for current user */}
                  {runner.isCurrentUser && (
                    <circle cx="0" cy="0" r="22" fill="none" stroke="#10b981" strokeWidth="2" className="animate-radar" />
                  )}

                  {/* Marker Pin Base */}
                  <circle
                    cx="0"
                    cy="0"
                    r={runner.isCurrentUser ? '16' : '13'}
                    fill={runner.isCurrentUser ? '#10b981' : '#0f172a'}
                    stroke={runner.isCurrentUser ? '#ffffff' : '#34d399'}
                    strokeWidth="2"
                  />

                  {/* Runner Initials or Avatar */}
                  <clipPath id={`clip-${runner.id}`}>
                    <circle cx="0" cy="0" r={runner.isCurrentUser ? '13' : '11'} />
                  </clipPath>
                  <image
                    href={runner.avatar}
                    x={runner.isCurrentUser ? '-13' : '-11'}
                    y={runner.isCurrentUser ? '-13' : '-11'}
                    width={runner.isCurrentUser ? '26' : '22'}
                    height={runner.isCurrentUser ? '26' : '22'}
                    clipPath={`url(#clip-${runner.id})`}
                    preserveAspectRatio="xMidYMid slice"
                  />

                  {/* Name tag pill */}
                  <g transform="translate(0, 22)">
                    <rect
                      x="-44"
                      y="-7"
                      width="88"
                      height="16"
                      rx="8"
                      fill="#020617"
                      stroke={runner.isCurrentUser ? '#10b981' : '#334155'}
                      strokeWidth="1"
                      opacity="0.95"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill={runner.isCurrentUser ? '#34d399' : '#f8fafc'}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {runner.name.split(' ')[0]}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Floating Live Telemetry Badge */}
          <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-mono text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE GPS • Bangkok Green Mile (สวนลุมพินี ⇄ สวนเบญจกิติ)</span>
          </div>

          <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-300">
            Tap runner marker to inspect telemetry
          </div>
        </div>

        {/* Group Run: 10 Runners List & Live Leaderboard */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" />
              Group Run Leaderboard ({runners.length} Runners)
            </h3>
            <span className="text-xs text-slate-400">Paceline average: 5'18" /km</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {runners.map((runner, index) => {
              const hasCheered = cheeredIds.includes(runner.id);
              return (
                <div
                  key={runner.id}
                  onClick={() => setSelectedRunner(runner)}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    runner.isCurrentUser
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                      : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-400 w-4">
                      #{index + 1}
                    </span>
                    <img
                      src={runner.avatar}
                      alt={runner.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <p className="text-xs font-bold text-white flex items-center gap-1">
                        {runner.name}
                        {runner.isCurrentUser && (
                          <span className="text-xs bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded">
                            YOU
                          </span>
                        )}
                      </p>
                      <p className="text-xs font-mono text-slate-400">
                        {runner.distanceKm} km • {runner.pace}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-emerald-400">
                      {runner.status}
                    </span>
                    {!runner.isCurrentUser && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheerRunner(runner);
                        }}
                        disabled={hasCheered}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          hasCheered
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400'
                        }`}
                        title="Send high five / cheer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Runner Detail Modal */}
      {selectedRunner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-emerald-50">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Runner Telemetry
              </span>
              <button
                onClick={() => setSelectedRunner(null)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={selectedRunner.avatar}
                alt={selectedRunner.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400/80 shadow-lg"
              />
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                  {selectedRunner.name}
                  {selectedRunner.isCurrentUser && (
                    <span className="text-xs bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                      YOU
                    </span>
                  )}
                </h3>
                <span className="text-xs text-slate-400 block">Bangkok • Lumphini ⇄ Benjakitti Green Mile (สะพานเขียว)</span>
                <span className="inline-block mt-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Status: {selectedRunner.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-xs text-slate-400 block">Distance</span>
                <span className="text-sm font-mono font-bold text-white">{selectedRunner.distanceKm} km</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-xs text-slate-400 block">Current Pace</span>
                <span className="text-sm font-mono font-bold text-emerald-400">{selectedRunner.pace}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-xs text-slate-400 block">Heart Rate</span>
                <span className="text-sm font-mono font-bold text-rose-400">{selectedRunner.heartRate} bpm</span>
              </div>
            </div>

            {!selectedRunner.isCurrentUser && (
              <button
                onClick={() => {
                  handleCheerRunner(selectedRunner);
                  setSelectedRunner(null);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Zap className="w-4 h-4 fill-current" />
                Send Cheer & High-Five
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
