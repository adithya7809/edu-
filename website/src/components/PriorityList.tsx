import { Chapter } from '../types';
import { motion } from 'motion/react';
import { CheckSquare, Square } from 'lucide-react';

interface PriorityListProps {
  examName: string;
  chapters: Chapter[];
  onToggleChapterTask: (chapterId: string, task: keyof Chapter) => void;
}

export function PriorityList({ examName, chapters, onToggleChapterTask }: PriorityListProps) {
  const getPriorityColor = (priority: 1 | 2 | 3 | 4) => {
    switch (priority) {
      case 1: return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 2: return 'text-brand-primary bg-brand-primary/10 border-brand-primary/20';
      case 3: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 4: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-white/40 bg-white/5 border-white/10';
    }
  };

  const renderCheckbox = (chapter: Chapter, task: keyof Chapter) => {
    const isChecked = chapter[task] as boolean;
    return (
      <button
        onClick={() => onToggleChapterTask(chapter.id, task)}
        className="p-3 hover:bg-white/5 rounded-xl transition-colors group"
      >
        {isChecked ? (
          <CheckSquare className="w-6 h-6 text-brand-primary" />
        ) : (
          <Square className="w-6 h-6 text-white/20 group-hover:text-brand-primary transition-colors" />
        )}
      </button>
    );
  };

  return (
    <div className="bg-brand-surface border border-white/10 rounded-[32px] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-6 text-xs font-bold text-white/40 uppercase tracking-widest min-w-[250px]">Chapter name</th>
              <th className="p-6 text-xs font-bold text-white/40 uppercase tracking-widest whitespace-nowrap">Weightage</th>
              <th className="p-6 text-xs font-bold text-white/40 uppercase tracking-widest whitespace-nowrap">Priority</th>
              <th className="p-6 text-xs font-bold text-white/40 uppercase tracking-widest text-center min-w-[120px]">Theory & PSS</th>
              <th className="p-6 text-xs font-bold text-white/40 uppercase tracking-widest text-center min-w-[80px]">DPP</th>
              <th className="p-6 text-xs font-bold text-white/40 uppercase tracking-widest text-center min-w-[150px]">Chapter Test / {examName} QB</th>
              <th className="p-6 text-xs font-bold text-white/40 uppercase tracking-widest text-center min-w-[90px]">Rev 1</th>
              <th className="p-6 text-xs font-bold text-white/40 uppercase tracking-widest text-center min-w-[90px]">Rev 2</th>
            </tr>
          </thead>
          <tbody>
            {chapters.map((chapter, index) => (
              <motion.tr
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                key={chapter.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="p-6 text-base font-bold text-white">{chapter.name}</td>
                <td className="p-6 text-sm text-white/60 font-medium whitespace-nowrap">{chapter.weightage}</td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest whitespace-nowrap ${getPriorityColor(chapter.priority)}`}>
                    Priority {chapter.priority}
                  </span>
                </td>
                <td className="p-6 text-center">{renderCheckbox(chapter, 'theory')}</td>
                <td className="p-6 text-center">{renderCheckbox(chapter, 'dpp')}</td>
                <td className="p-6 text-center">{renderCheckbox(chapter, 'chapterTest')}</td>
                <td className="p-6 text-center">{renderCheckbox(chapter, 'revision1')}</td>
                <td className="p-6 text-center">{renderCheckbox(chapter, 'revision2')}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
