import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft } from 'lucide-react';
import { Exam, Subject } from '../types';
import { DailyGoals } from './DailyGoals';
import { SubjectProgress } from './SubjectProgress';
import { PriorityList } from './PriorityList';
import { useState } from 'react';

interface ExamDetailModalProps {
  exam: Exam;
  onClose: () => void;
  onAddGoal: (text: string) => void;
  onToggleGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
  onDeleteAllGoals: (examId: string) => void;
  onToggleChapterTask: (examId: string, subjectId: string, chapterId: string, task: any) => void;
}

export function ExamDetailModal({
  exam,
  onClose,
  onAddGoal,
  onToggleGoal,
  onDeleteGoal,
  onDeleteAllGoals,
  onToggleChapterTask
}: ExamDetailModalProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const selectedSubject = selectedSubjectId 
    ? exam.subjects.find(s => s.id === selectedSubjectId) || null 
    : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-6"
      >
          <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-brand-surface rounded-3xl shadow-2xl w-full max-w-5xl h-full sm:h-auto sm:max-h-[85vh] flex flex-col overflow-hidden border border-white/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-brand-surface sticky top-0 z-10">
            <div className="flex items-center gap-3 sm:gap-4">
              {selectedSubject ? (
                <button
                  onClick={() => setSelectedSubjectId(null)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-brand-primary" />
                </button>
              ) : null}
              <div>
                <span className="text-[9px] sm:text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-0.5 block">{exam.shortName}</span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight leading-tight">
                  {selectedSubject ? `${exam.name} - ${selectedSubject.name}` : exam.name}
                </h2>
                <p className="text-[9px] sm:text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1.5">
                  {selectedSubject ? 'Chapter Priority List' : 'Overview & Goals'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-brand-primary" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
            <AnimatePresence mode="wait">
              {!selectedSubject ? (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-10"
                >
                  <DailyGoals
                    goals={exam.goals}
                    onAddGoal={onAddGoal}
                    onToggleGoal={onToggleGoal}
                    onDeleteGoal={onDeleteGoal}
                    onDeleteAllGoals={() => onDeleteAllGoals(exam.id)}
                  />
                  <SubjectProgress
                    subjects={exam.subjects}
                    onSelectSubject={(id) => setSelectedSubjectId(id)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="subject-details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {selectedSubject.chapters.length > 0 ? (
                    <PriorityList
                      examName={exam.shortName}
                      chapters={selectedSubject.chapters}
                      onToggleChapterTask={(chapterId, task) => onToggleChapterTask(exam.id, selectedSubject.id, chapterId, task)}
                    />
                  ) : (
                    <div className="text-center py-16 bg-white/5 border border-white/10 rounded-3xl">
                      <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">No chapters added yet.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
