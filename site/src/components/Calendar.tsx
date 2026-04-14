import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  eachDayOfInterval,
  isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Target, Flag, AlertCircle, Plus, Trash2, X } from 'lucide-react';
import { Exam, CalendarEvent } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CalendarProps {
  exams: Exam[];
  customEvents?: CalendarEvent[];
  onAddEvent?: (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => void;
  onDeleteEvent?: (id: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ exams, customEvents = [], onAddEvent, onDeleteEvent }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEventText, setNewEventText] = useState('');
  const [newEventType, setNewEventType] = useState<'custom' | 'revision' | 'mock-test'>('custom');

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const allMilestones = [
    ...exams.flatMap(exam => {
      const milestones = exam.milestones || [];
      return [
        ...milestones,
        { id: `target-${exam.id}`, text: `${exam.shortName} Target`, date: exam.targetDate, type: 'exam' as const }
      ];
    }),
    ...customEvents.map(e => ({ ...e, isCustom: true }))
  ];

  const getMilestonesForDay = (day: Date) => {
    return allMilestones.filter(m => isSameDay(new Date(m.date), day));
  };

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setShowAddModal(true);
  };

  const handleAddEvent = () => {
    if (selectedDay && newEventText.trim() && onAddEvent) {
      onAddEvent({
        text: newEventText.trim(),
        date: format(selectedDay, 'yyyy-MM-dd'),
        type: newEventType
      });
      setNewEventText('');
      setShowAddModal(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
      <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-brand-primary/10 rounded-xl border border-brand-primary/20">
            <CalendarIcon className="w-4 h-4 text-brand-primary" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-white tracking-tight uppercase">Study Timeline</h2>
            <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mt-0.5">Milestones & Deadlines</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <div className="flex gap-1">
            <button 
              onClick={prevMonth}
              className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={nextMonth}
              className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-white/10">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={`${day}-${index}`} className="py-2 text-center text-[9px] font-bold text-white/20 uppercase tracking-widest border-r border-white/10 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayMilestones = getMilestonesForDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          
          return (
            <div 
              key={day.toString()} 
              onClick={() => handleDayClick(day)}
              className={`min-h-[70px] sm:min-h-[90px] p-1.5 border-r border-b border-white/10 last:border-r-0 relative group transition-colors cursor-pointer ${!isCurrentMonth ? 'bg-black/20' : 'hover:bg-white/[0.02]'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-[9px] font-mono font-bold ${isToday(day) ? 'text-brand-primary' : isCurrentMonth ? 'text-white/40' : 'text-white/10'}`}>
                  {format(day, 'd')}
                </span>
                {isToday(day) && (
                  <div className="w-1 h-1 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(0,255,0,0.5)]" />
                )}
              </div>

              <div className="space-y-0.5">
                {dayMilestones.map(m => (
                  <motion.div 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={m.id}
                    className={`px-1 py-0.5 rounded-md text-[7px] font-bold uppercase tracking-tight flex items-center justify-between gap-1 border group/item relative ${
                      m.type === 'exam' 
                        ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                        : m.type === 'mock-test'
                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                        : 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary'
                    }`}
                  >
                    <div className="flex items-center gap-1 truncate">
                      {m.type === 'exam' ? <Target className="w-1.5 h-1.5" /> : m.type === 'mock-test' ? <AlertCircle className="w-1.5 h-1.5" /> : <Flag className="w-1.5 h-1.5" />}
                      <span className="truncate">{m.text}</span>
                    </div>
                    {onDeleteEvent && (m as any).isCustom && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Delete this event?')) {
                            onDeleteEvent(m.id);
                          }
                        }}
                        className="p-0.5 hover:text-red-400 transition-all sm:opacity-0 sm:group-hover/item:opacity-100"
                      >
                        <Trash2 className="w-2 h-2" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAddModal && selectedDay && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-brand-bg/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-surface border border-white/10 rounded-2xl p-5 w-full max-w-sm shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-serif font-bold text-white uppercase tracking-widest">
                  Add Event - {format(selectedDay, 'MMM d')}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-white/20 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1.5 block">Event Description</label>
                  <input 
                    type="text"
                    value={newEventText}
                    onChange={(e) => setNewEventText(e.target.value)}
                    placeholder="e.g., Physics Revision"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-brand-primary/50 transition-colors"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1.5 block">Event Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['custom', 'revision', 'mock-test'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setNewEventType(type)}
                        className={`py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border transition-all ${
                          newEventType === type 
                            ? 'bg-brand-primary/20 border-brand-primary text-brand-primary' 
                            : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAddEvent}
                  disabled={!newEventText.trim()}
                  className="w-full py-2.5 bg-brand-primary text-brand-bg font-bold rounded-xl text-[10px] uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50"
                >
                  Add to Timeline
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
