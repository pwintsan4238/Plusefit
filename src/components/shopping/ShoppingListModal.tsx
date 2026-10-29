import React, { useState } from 'react';
import { ShoppingItem } from '../../types';
import { X, Check, Trash2, Plus, ShoppingBag, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: ShoppingItem[];
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (name: string, amount: number, unit: string, category: string) => void;
  onClearChecked: () => void;
}

export const ShoppingListModal: React.FC<Props> = ({
  isOpen,
  onClose,
  items,
  onToggleItem,
  onDeleteItem,
  onAddItem,
  onClearChecked
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('1');
  const [newItemUnit, setNewItemUnit] = useState('unit');
  const [newItemCategory, setNewItemCategory] = useState('Produce');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const categories = ['Produce', 'Protein', 'Dairy & Eggs', 'Pantry & Grains', 'Spices & Oils'];
  const checkedCount = items.filter(i => i.isChecked).length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddItem(newItemName.trim(), parseFloat(newItemAmount) || 1, newItemUnit, newItemCategory);
    setNewItemName('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Shopping List
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal">
                  {items.length} items
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {checkedCount} of {items.length} items collected
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          {/* Quick Actions */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Custom Item
            </button>
            {checkedCount > 0 && (
              <button
                onClick={onClearChecked}
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Checked ({checkedCount})
              </button>
            )}
          </div>

          {/* Add Item Inline Form */}
          {isAdding && (
            <form onSubmit={handleCreate} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Item name (e.g. Baby Spinach)"
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  className="sm:col-span-2 px-3 py-1.5 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
                <div className="flex gap-1">
                  <input
                    type="number"
                    step="any"
                    value={newItemAmount}
                    onChange={e => setNewItemAmount(e.target.value)}
                    className="w-16 px-2 py-1.5 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white text-center focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    value={newItemUnit}
                    onChange={e => setNewItemUnit(e.target.value)}
                    placeholder="unit"
                    className="w-full px-2 py-1.5 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <select
                  value={newItemCategory}
                  onChange={e => setNewItemCategory(e.target.value)}
                  className="px-2 py-1 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg"
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Grouped Items */}
          {categories.map(category => {
            const catItems = items.filter(i => i.category === category);
            if (catItems.length === 0) return null;

            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
                  <span>{category}</span>
                  <span>{catItems.length}</span>
                </div>
                <div className="space-y-1.5">
                  {catItems.map(item => (
                    <div
                      key={item.id}
                      onClick={() => onToggleItem(item.id)}
                      className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        item.isChecked
                          ? 'bg-slate-900/40 border-slate-800/60 text-slate-500'
                          : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-800 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                            item.isChecked
                              ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                              : 'border-slate-600 group-hover:border-slate-400'
                          }`}
                        >
                          {item.isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${item.isChecked ? 'line-through text-slate-500' : 'text-white'}`}>
                            {item.name}
                          </p>
                          {item.sourceRecipe && (
                            <p className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                              From {item.sourceRecipe}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-medium text-slate-300">
                          {item.amount} {item.unit}
                        </span>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onDeleteItem(item.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {items.length === 0 && (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <ShoppingBag className="w-10 h-10 mx-auto stroke-1 opacity-50" />
              <p className="text-sm">Your shopping basket is empty.</p>
              <p className="text-xs text-slate-600">Add ingredients directly from any recipe!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <span>Synced with your weekly nutrition meal plan</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
