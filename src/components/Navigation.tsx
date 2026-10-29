import React from 'react';
import {
  Home,
  Utensils,
  BookOpen,
  Dumbbell,
  Timer,
  ShoppingBag,
  Star,
  MapPin,
  Flame,
  Trophy,
  Compass
} from 'lucide-react';

export type ActiveTab = 'home' | 'map' | 'nutrition' | 'recipe' | 'workout' | 'timer';

interface Props {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  shoppingCount: number;
  onOpenShopping: () => void;
  onOpenFavourites: () => void;
  pointsCount?: string;
  streakDays?: number;
}

export const Navigation: React.FC<Props> = ({
  activeTab,
  onTabChange,
  shoppingCount,
  onOpenShopping,
  onOpenFavourites,
  pointsCount = '124k',
  streakDays = 20
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; themeColor: string }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" />, themeColor: 'text-emerald-400' },
    { id: 'map', label: 'Live Map', icon: <Compass className="w-4 h-4" />, themeColor: 'text-emerald-400' },
    { id: 'nutrition', label: 'Daily Nutrition', icon: <Utensils className="w-4 h-4" />, themeColor: 'text-slate-100' },
    { id: 'recipe', label: 'Recipe Detail', icon: <BookOpen className="w-4 h-4" />, themeColor: 'text-amber-400' },
    { id: 'workout', label: 'Abs Blaster', icon: <Dumbbell className="w-4 h-4" />, themeColor: 'text-rose-400' },
    { id: 'timer', label: 'Interval Timer', icon: <Timer className="w-4 h-4" />, themeColor: 'text-emerald-400' },
  ];

  return (
    <>
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div
            onClick={() => onTabChange('home')}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-rose-500 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-xs text-white">
                P⚡N
              </div>
            </div>
            <div>
              <span className="font-black text-base tracking-tight text-white block leading-none">
                PULSE<span className="text-emerald-400">FIT</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block leading-none mt-0.5">
                Nourish & Track
              </span>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? item.id === 'workout'
                        ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20'
                        : item.id === 'nutrition' || item.id === 'recipe'
                        ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                        : 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Top Quick Badges: Streak, Points, Shopping, Favourites */}
          <div className="flex items-center gap-2">
            {/* Streak */}
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-orange-400">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{streakDays}</span>
            </div>

            {/* Points */}
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-emerald-400">
              <Trophy className="w-3.5 h-3.5 text-emerald-400" />
              <span>{pointsCount}</span>
            </div>

            {/* Favourites Button */}
            <button
              onClick={onOpenFavourites}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 transition-colors"
              title="Favourites"
            >
              <Star className="w-4 h-4 text-amber-400" />
            </button>

            {/* Shopping List Basket Button */}
            <button
              onClick={onOpenShopping}
              className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
              title="Shopping List Basket"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              {shoppingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                  {shoppingCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-3 py-2 flex items-center justify-around">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all ${
                isActive
                  ? item.id === 'workout'
                    ? 'text-rose-400 font-bold'
                    : 'text-emerald-400 font-bold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-slate-800' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
