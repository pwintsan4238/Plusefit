import React from 'react';
import {
  Home,
  Utensils,
  BookOpen,
  Dumbbell,
  Timer,
  Crown,
  Star,
  MapPin,
  Flame,
  Trophy,
  Compass,
  Zap
} from 'lucide-react';

export type ActiveTab = 'home' | 'map' | 'nutrition' | 'recipe' | 'workout' | 'timer' | 'premium';

interface Props {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  hasPremium: boolean;
  onOpenFavourites: () => void;
  pointsCount?: string;
  streakDays?: number;
}

export const Navigation: React.FC<Props> = ({
  activeTab,
  onTabChange,
  hasPremium,
  onOpenFavourites,
  pointsCount = '124k',
  streakDays = 20
}) => {
  // `label` is the full desktop name; `short` fits one line in the mobile bottom bar
  const navItems: { id: ActiveTab; label: string; short: string; icon: React.ReactNode; themeColor: string }[] = [
    { id: 'home', label: 'Home', short: 'Home', icon: <Home className="w-5 h-5" aria-hidden="true" />, themeColor: 'text-emerald-700' },
    { id: 'map', label: 'Live Map', short: 'Run', icon: <Compass className="w-5 h-5" aria-hidden="true" />, themeColor: 'text-emerald-700' },
    { id: 'nutrition', label: 'Daily Nutrition', short: 'Food', icon: <Utensils className="w-5 h-5" aria-hidden="true" />, themeColor: 'text-slate-100' },
    { id: 'recipe', label: 'Recipes', short: 'Recipes', icon: <BookOpen className="w-5 h-5" aria-hidden="true" />, themeColor: 'text-amber-800' },
    { id: 'workout', label: 'Abs Blaster', short: 'Workout', icon: <Dumbbell className="w-5 h-5" aria-hidden="true" />, themeColor: 'text-rose-700' },
    { id: 'timer', label: 'Interval Timer', short: 'Timer', icon: <Timer className="w-5 h-5" aria-hidden="true" />, themeColor: 'text-emerald-700' },
  ];

  return (
    <>
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <button
            type="button"
            onClick={() => onTabChange('home')}
            aria-label="PulseFit home"
            className="flex items-center gap-2 shrink-0 cursor-pointer select-none group rounded-xl text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-rose-500 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-emerald-700">
                <Zap className="w-4 h-4 fill-current" aria-hidden="true" />
              </div>
            </div>
            <div>
              <span className="font-black text-base tracking-tight text-slate-50 block leading-none">
                PULSE<span className="text-emerald-700">FIT</span>
              </span>
              <span className="text-xs uppercase font-bold tracking-widest text-slate-400 block md:hidden xl:block whitespace-nowrap leading-none mt-0.5">
                Nourish & Track
              </span>
            </div>
          </button>

          {/* Desktop Nav Tabs */}
          <nav aria-label="Main" className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors [&_svg]:w-4 [&_svg]:h-4 ${
                    isActive
                      ? item.id === 'workout'
                        ? 'bg-rose-500 text-ink shadow-md shadow-rose-500/20'
                        : item.id === 'nutrition' || item.id === 'recipe'
                        ? 'bg-slate-800 text-emerald-700 border border-slate-700'
                        : 'bg-emerald-400 text-ink shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-slate-50 hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Top Quick Badges: Streak, Points, Favourites, Premium */}
          <div className="flex items-center gap-2">
            {/* Streak */}
            <div className="hidden sm:flex md:hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-orange-800">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{streakDays}</span>
            </div>

            {/* Points */}
            <div className="hidden sm:flex md:hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-emerald-700">
              <Trophy className="w-3.5 h-3.5 text-emerald-700" />
              <span>{pointsCount}</span>
            </div>

            {/* Favourites Button */}
            <button
              onClick={onOpenFavourites}
              aria-label="Favourites"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-800 border border-slate-800 transition-colors"
              title="Favourites"
            >
              <Star className="w-4 h-4 text-amber-800" />
            </button>

            {/* Premium packages */}
            <button
              onClick={() => onTabChange('premium')}
              aria-current={activeTab === 'premium' ? 'page' : undefined}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-colors ${
                hasPremium
                  ? 'bg-slate-900 border border-amber-400/40 text-amber-800 hover:bg-slate-800'
                  : 'bg-amber-400 text-ink hover:bg-amber-300'
              }`}
            >
              <Crown className="w-4 h-4" aria-hidden="true" />
              <span>{hasPremium ? 'Premium' : <><span className="hidden sm:inline">Go </span>Premium</>}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Main"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-1 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] grid grid-cols-6"
      >
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center gap-0.5 min-h-12 py-1 rounded-xl transition-colors ${
                isActive
                  ? item.id === 'workout'
                    ? 'text-rose-700 font-bold'
                    : 'text-emerald-700 font-bold'
                  : 'text-slate-400 font-medium hover:text-slate-200'
              }`}
            >
              <span className={`px-3 py-1 rounded-full transition-colors ${isActive ? 'bg-slate-800' : ''}`}>
                {item.icon}
              </span>
              <span className="text-xs leading-tight whitespace-nowrap">{item.short}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
