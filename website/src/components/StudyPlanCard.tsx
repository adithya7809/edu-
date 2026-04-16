import React from 'react';
import { motion } from 'motion/react';
import { Calendar, CheckCircle2, X, ChevronRight, ListTodo } from 'lucide-react';
import { StudyPlan } from '../types';

interface StudyPlanCardProps {
  plan: StudyPlan;
  examName: string;
  onDelete: () => void;
}

export const StudyPlanCard: React.FC<StudyPlanCardProps> = ({ plan, examName, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 relative group h-full flex flex-col"
    >
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="absolute top-3 right-3 p-1.5 text-white/10 hover:text-red-400 transition-colors z-10"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
          <Calendar className="w-3.5 h-3.5 text-brand-primary" />
        </div>
        <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest">{examName}</span>
      </div>

      <h3 className="text-lg font-serif font-bold text-white mb-1">{plan.title}</h3>
      <p className="text-[11px] text-white/30 mb-4 line-clamp-2">{plan.description}</p>

      <div className="space-y-3 flex-1">
        {plan.dailyTasks.slice(0, 2).map((day, idx) => (
          <div key={idx} className="p-2.5 bg-white/[0.02] rounded-xl border border-white/5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Day {day.day}</span>
              <ListTodo className="w-3 h-3 text-brand-primary/30" />
            </div>
            <ul className="space-y-1">
              {day.tasks.slice(0, 2).map((task, tIdx) => (
                <li key={tIdx} className="text-[9px] text-white/50 flex items-start gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                  <span className="line-clamp-1">{task}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {plan.dailyTasks.length > 2 && (
          <div className="text-center">
            <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest">+{plan.dailyTasks.length - 2} more days</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest">
          {new Date(plan.createdAt).toLocaleDateString()}
        </span>
        <button className="text-[9px] font-bold text-brand-primary uppercase tracking-widest group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
          View Plan <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
};
