import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, CheckCircle2, ListTodo, ChevronRight, Target, BookOpen } from 'lucide-react';
import { StudyPlan } from '../types';

interface StudyPlanModalProps {
  plan: StudyPlan;
  examName: string;
  onClose: () => void;
}

export const StudyPlanModal: React.FC<StudyPlanModalProps> = ({ plan, examName, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-brand-bg/95 backdrop-blur-xl"
    >
      <div className="max-w-2xl w-full bg-brand-surface rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
              <Calendar className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-brand-primary uppercase tracking-[0.3em] mb-0.5 block">{examName} Study Plan</span>
              <h2 className="text-xl font-serif font-bold text-white tracking-tight">{plan.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/20 hover:text-white transition-colors bg-white/5 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-3.5 h-3.5 text-brand-primary" />
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Plan Overview</span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">{plan.description}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-brand-primary" />
              Daily Schedule
            </h3>

            <div className="grid gap-3">
              {plan.dailyTasks.map((day, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 relative group hover:bg-white/[0.04] transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 text-[9px] font-bold text-brand-primary">
                        {day.day}
                      </div>
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Day {day.day}</span>
                    </div>
                    <div className="h-px flex-1 mx-3 bg-white/5" />
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/10 group-hover:text-brand-primary transition-colors" />
                  </div>

                  <ul className="space-y-2">
                    {day.tasks.map((task, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-2.5">
                        <div className="w-1 h-1 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                        <span className="text-xs text-white/60 leading-relaxed">{task}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-1.5">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-5 h-5 rounded-full border-2 border-brand-surface bg-brand-primary/20 flex items-center justify-center">
                  <BookOpen className="w-2.5 h-2.5 text-brand-primary" />
                </div>
              ))}
            </div>
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
              {plan.dailyTasks.length} Days
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-brand-primary text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-lg shadow-brand-primary/20"
          >
            Got it, Commander
          </button>
        </div>
      </div>
    </motion.div>
  );
};
