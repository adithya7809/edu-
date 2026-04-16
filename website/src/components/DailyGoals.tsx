import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Plus, ListTodo } from 'lucide-react';
import { Goal } from '../types';

interface DailyGoalsProps {
  goals: Goal[];
  onAddGoal: (text: string) => void;
  onToggleGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
  onDeleteAllGoals: () => void;
}

export function DailyGoals({ goals, onAddGoal, onToggleGoal, onDeleteGoal, onDeleteAllGoals }: DailyGoalsProps) {
  const [newGoal, setNewGoal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.trim()) {
      onAddGoal(newGoal.trim());
      setNewGoal('');
    }
  };

  return (
    <div className="bg-brand-surface border border-white/10 rounded-[32px] p-6 sm:p-10 shadow-sm">
      <div className="flex items-center justify-between mb-8 sm:mb-10">
        <div className="flex items-center gap-3">
          <ListTodo className="w-6 h-6 text-brand-primary" />
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">Daily Objectives</h3>
        </div>
        {goals.length > 0 && (
          <button
            onClick={onDeleteAllGoals}
            className="text-[10px] font-bold text-red-500/60 hover:text-red-500 uppercase tracking-widest transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="What's the focus today?"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-base text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all shadow-sm"
        />
        <button
          type="submit"
          disabled={!newGoal.trim()}
          className="bg-brand-primary hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed text-white px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-xs sm:text-base shadow-lg shadow-brand-primary/20 uppercase tracking-widest"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Add Task</span>
        </button>
      </form>

      <div className="space-y-3">
        <AnimatePresence>
          {goals.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-white/40 text-sm font-bold uppercase tracking-widest text-center py-8"
            >
              No objectives set for today.
            </motion.p>
          ) : (
            goals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group border border-transparent hover:border-white/10 shadow-sm"
              >
                <div 
                  className="flex-1 flex items-center gap-4 cursor-pointer"
                  onClick={() => onToggleGoal(goal.id)}
                >
                  <button className="text-white/20 group-hover:text-brand-primary transition-colors">
                    {goal.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-brand-primary" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>
                  <span className={`text-base font-medium transition-all ${goal.completed ? 'text-white/30 line-through' : 'text-white'}`}>
                    {goal.text}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteGoal(goal.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 rounded-lg transition-all text-red-500/40 hover:text-red-500"
                >
                  <Plus className="w-4 h-4 rotate-45" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
