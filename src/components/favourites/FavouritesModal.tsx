import React from 'react';
import { Recipe, MealItem } from '../../types';
import { X, Star, Flame, Clock, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  favouriteRecipes: Recipe[];
  favouriteMeals: MealItem[];
  onSelectRecipe: (id: string) => void;
}

export const FavouritesModal: React.FC<Props> = ({
  isOpen,
  onClose,
  favouriteRecipes,
  favouriteMeals,
  onSelectRecipe
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Your Favourites</h3>
              <p className="text-xs text-slate-400">Quick access to starred healthy recipes and planned meals</p>
            </div>
          </div>
          <button aria-label="Close"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
            Saved Recipes ({favouriteRecipes.length})
          </h4>
          {favouriteRecipes.map(recipe => (
            <div
              key={recipe.id}
              onClick={() => {
                onSelectRecipe(recipe.id);
                onClose();
              }}
              className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={recipe.photoUrl}
                  alt={recipe.name}
                  className="w-12 h-12 rounded-lg object-cover border border-slate-700"
                />
                <div>
                  <h5 className="text-xs font-bold text-white line-clamp-1">{recipe.name}</h5>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-400" />
                      {recipe.caloriesPerServe} cals
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {recipe.cookTime}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}

          {favouriteRecipes.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-xs">
              No recipes saved to favourites yet. Tap the ★ on any recipe to save it!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-750 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
