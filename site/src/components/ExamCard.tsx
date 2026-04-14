import { motion } from 'motion/react';
import { Clock, Target, Crown } from 'lucide-react';
import { Exam } from '../types';
import React, { useEffect, useState } from 'react';

interface ExamCardProps {
  key?: React.Key;
  exam: Exam;
  onClick: () => void;
  currentTime: number;
}

export function ExamCard({ exam, onClick, currentTime }: ExamCardProps) {
  const target = new Date(exam.targetDate).getTime();
  const distance = target - currentTime;
  const isPremium = document.documentElement.getAttribute('data-is-premium') === 'true';

  const timeLeft = distance > 0 ? {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000)
  } : { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-brand-surface rounded-3xl p-5 sm:p-6 cursor-pointer relative overflow-hidden group border border-white/10 hover:border-brand-primary/30 transition-all shadow-xl flex flex-col items-start text-left"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Header */}
      <div className="mb-4 w-full relative z-10 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest block">{exam.shortName}</span>
            {isPremium && <Crown className="w-2.5 h-2.5 text-brand-primary" />}
          </div>
          <h2 className="text-lg font-serif font-bold text-white tracking-tight leading-tight line-clamp-1">{exam.name}</h2>
        </div>
        <div className="px-2 py-0.5 bg-brand-primary/10 rounded-lg border border-brand-primary/20">
          <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest">{exam.overallProgress}%</span>
        </div>
      </div>

      {/* Main Visual: Compact Progress + Time */}
      <div className="flex items-center gap-6 w-full relative z-10 mb-4">
        <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white/5"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="283"
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * exam.overallProgress) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-brand-primary"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white">{timeLeft.days}d</span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-2">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white/80 leading-none">{timeLeft.hours}</span>
            <span className="text-[7px] font-bold text-white/30 uppercase tracking-tighter">Hours</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white/80 leading-none">{timeLeft.minutes}</span>
            <span className="text-[7px] font-bold text-white/30 uppercase tracking-tighter">Mins</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-brand-primary leading-none">{timeLeft.seconds}</span>
            <span className="text-[7px] font-bold text-white/30 uppercase tracking-tighter">Secs</span>
          </div>
        </div>
      </div>

      {/* Footer: Target Date */}
      <div className="flex items-center gap-2 text-white/40 relative z-10 pt-4 border-t border-white/5 w-full">
        <Target className="w-3 h-3 text-brand-primary/60" />
        <span className="text-[9px] font-bold uppercase tracking-widest">Target: {new Date(exam.targetDate).toLocaleDateString()}</span>
      </div>
    </motion.div>
  );
}
