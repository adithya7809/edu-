import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CheckCircle2, Circle, ChevronDown, ChevronUp, Atom, Calculator, FlaskConical, Crown } from 'lucide-react';
import { Chapter } from '../types';

interface CommonChapterGroup {
  name: string;
  subjectName: string;
  exams: {
    examId: string;
    examName: string;
    subjectId: string;
    chapter: Chapter;
  }[];
}

interface CommonChaptersProps {
  groups: CommonChapterGroup[];
  onSetTask: (examId: string, subjectId: string, chapterId: string, task: keyof Chapter, value: boolean) => void;
  selectedExams: string[];
}

const SubjectSection: React.FC<{
  subjectName: string;
  groups: CommonChapterGroup[];
  onSetTask: CommonChaptersProps['onSetTask'];
}> = ({ subjectName, groups, onSetTask }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getIcon = () => {
    switch (subjectName.toLowerCase()) {
      case 'physics': return <Atom className="w-6 h-6 text-blue-600" />;
      case 'mathematics': return <Calculator className="w-6 h-6 text-purple-600" />;
      case 'chemistry': return <FlaskConical className="w-6 h-6 text-brand-primary" />;
      default: return <BookOpen className="w-6 h-6 text-brand-primary" />;
    }
  };

  const getAccentColor = () => {
    switch (subjectName.toLowerCase()) {
      case 'physics': return 'border-blue-500/20 hover:border-blue-500/40';
      case 'mathematics': return 'border-purple-500/20 hover:border-purple-500/40';
      case 'chemistry': return 'border-brand-primary/20 hover:border-brand-primary/40';
      default: return 'border-white/10 hover:border-white/20';
    }
  };

  const isPremium = document.documentElement.getAttribute('data-is-premium') === 'true';

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between p-4 sm:p-6 bg-brand-surface border border-white/10 rounded-[24px] sm:rounded-[32px] hover:bg-white/5 transition-all group relative overflow-hidden shadow-sm"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-3 sm:gap-6 relative z-10">
          <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 group-hover:border-white/20 transition-all">
            {getIcon()}
          </div>
          <div className="text-left">
            <p className="text-[9px] sm:text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] mb-1">Common High-Yield Topics</p>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
              {subjectName}
              <span className="text-[9px] font-bold text-white/40 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-widest">
                {groups.length.toString().padStart(2, '0')} Topics
              </span>
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="hidden sm:flex -space-x-3">
            {groups.slice(0, 3).map((g, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-brand-surface border-2 border-white/10 flex items-center justify-center text-[10px] font-bold text-white/40 shadow-sm">
                {g.name[0]}
              </div>
            ))}
            {groups.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                +{groups.length - 3}
              </div>
            )}
          </div>
          <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
            {isCollapsed ? <ChevronDown className="w-5 h-5 text-white" /> : <ChevronUp className="w-5 h-5 text-white" />}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 pb-2">
              {groups.map((group, idx) => (
                <motion.div
                  key={`${group.subjectName}-${group.name}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`bg-brand-surface border rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 hover:shadow-xl transition-all shadow-sm ${getAccentColor()}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="max-w-[70%]">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                        <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest flex items-center gap-1">
                          High Priority
                          {isPremium && <Crown className="w-2 h-2" />}
                        </span>
                      </div>
                      <h4 className="text-lg font-serif font-bold text-white leading-tight tracking-tight">{group.name}</h4>
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {group.exams.map(e => (
                        <span key={e.examId} className="px-2 py-0.5 bg-white/5 text-brand-primary/60 text-[9px] rounded-full font-bold uppercase tracking-widest border border-white/10">
                          {e.examName}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-2 sm:gap-3">
                    {(['theory', 'dpp', 'chapterTest', 'revision1', 'revision2'] as const).map((task) => {
                      const isCompleted = group.exams.every(e => e.chapter[task]);
                      const someCompleted = group.exams.some(e => e.chapter[task]);

                      return (
                        <button
                          key={task}
                          onClick={() => {
                            const targetValue = !isCompleted;
                            const firstExam = group.exams[0];
                            if (firstExam) {
                              onSetTask(firstExam.examId, firstExam.subjectId, firstExam.chapter.id, task, targetValue);
                            }
                          }}
                          className={`flex flex-col items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all border-2 ${
                            isCompleted 
                              ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary' 
                              : someCompleted
                              ? 'bg-brand-primary/5 border-brand-primary/10 text-brand-primary/50'
                              : 'bg-white/5 border-transparent text-white/20 hover:bg-white/10 hover:border-white/10'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Circle className="w-4 h-4 sm:w-5 sm:h-5" />}
                          <span className="text-[7px] sm:text-[9px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em] leading-none">
                            {task === 'chapterTest' ? 'Test' : task.replace('revision', 'R')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const CommonChapters: React.FC<CommonChaptersProps> = ({ groups, onSetTask, selectedExams }) => {
  if (groups.length === 0) return null;

  const examNames = selectedExams.join(', ');

  // Group by subject
  const subjects = ['Physics', 'Mathematics', 'Chemistry'];
  const groupedBySubject = subjects.map(subject => ({
    name: subject,
    groups: groups.filter(g => g.subjectName.toLowerCase() === subject.toLowerCase())
  })).filter(s => s.groups.length > 0);

  return (
    <section className="mt-12 sm:mt-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-white/5 rounded-xl border border-white/10">
          <BookOpen className="w-5 h-5 text-brand-primary" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            COMMON HIGH-YIELD TOPICS
          </h2>
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Chapters appearing in multiple selected exams</p>
        </div>
      </div>

      <div className="space-y-6">
        {groupedBySubject.map(subject => (
          <SubjectSection
            key={subject.name}
            subjectName={subject.name}
            groups={subject.groups}
            onSetTask={onSetTask}
          />
        ))}
      </div>
    </section>
  );
};
