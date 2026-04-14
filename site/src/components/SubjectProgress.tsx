import { motion } from 'motion/react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Subject } from '../types';

interface SubjectProgressProps {
  subjects: Subject[];
  onSelectSubject: (subjectId: string) => void;
}

export function SubjectProgress({ subjects, onSelectSubject }: SubjectProgressProps) {
  return (
    <div className="bg-brand-surface border border-white/10 rounded-[32px] p-6 sm:p-10 shadow-sm">
      <div className="flex items-center gap-3 mb-8 sm:mb-10">
        <BookOpen className="w-6 h-6 text-brand-primary" />
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">Subject Mastery</h3>
      </div>

      <div className="space-y-4">
        {subjects.map((subject) => (
          <motion.div
            key={subject.id}
            whileHover={{ scale: 1.01, x: 4 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelectSubject(subject.id)}
            className="group bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer hover:border-white/30 transition-all flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-6 flex-1">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <BookOpen className="w-6 h-6 text-white/40 group-hover:text-white transition-colors" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-white/60 group-hover:text-white transition-colors">{subject.name}</span>
                  <span className="text-base font-bold text-brand-primary">{subject.progress}%</span>
                </div>
                
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-brand-primary rounded-full"
                  />
                </div>
              </div>
            </div>
            
            <ChevronRight className="w-6 h-6 text-white/20 group-hover:text-white ml-6 transition-colors" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
