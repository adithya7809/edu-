import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  ClipboardCheck, 
  Calendar as CalendarIcon, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Plus, 
  X,
  Clock,
  BarChart3,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Exam, Quiz, StudyPlan, AIReport } from '../types';
import { Calendar } from './Calendar';

interface AICenterProps {
  exams: Exam[];
  quizzes: Quiz[];
  studyPlans: StudyPlan[];
  aiReports: AIReport[];
  onAddQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => Promise<void>;
  onAddStudyPlan: (plan: Omit<StudyPlan, 'id' | 'createdAt'>) => Promise<void>;
  onAddAIReport: (report: Omit<AIReport, 'id' | 'createdAt'>) => Promise<void>;
  onDeleteQuiz: (id: string) => Promise<void>;
  onDeleteStudyPlan: (id: string) => Promise<void>;
  onDeleteAIReport: (id: string) => Promise<void>;
  onStartQuiz: (id: string) => void;
  onSendMessage?: (message: string) => void;
}

export const AICenter: React.FC<AICenterProps> = ({
  exams,
  quizzes,
  studyPlans,
  aiReports,
  onDeleteQuiz,
  onDeleteStudyPlan,
  onDeleteAIReport,
  onStartQuiz,
  onSendMessage
}) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'mocktests' | 'calendar'>('reports');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-brand-primary/10 rounded-xl border border-brand-primary/20">
            <Sparkles className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight uppercase">AI COMMAND <span className="text-brand-primary italic">CENTER</span></h1>
            <p className="text-[8px] font-bold text-white/30 uppercase tracking-[0.4em] mt-1">Advanced Intelligence & Analytics</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 w-fit">
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'reports' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <FileText className="w-3.5 h-3.5" />
            Reports
          </button>
          <button
            onClick={() => setActiveTab('mocktests')}
            className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'mocktests' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            Mock Tests
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'calendar' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            Calendar
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'reports' && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Report Generation Prompt */}
              <div className="lg:col-span-1 p-6 bg-white/5 rounded-3xl border border-white/10 flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 mb-4">
                  <BarChart3 className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="text-lg font-serif font-bold text-white mb-2">Generate Analysis</h3>
                <p className="text-[11px] text-white/30 mb-6 leading-relaxed">
                  Ask the AI Commander to analyze your current progress and generate a detailed report.
                </p>
                <div className="p-3 bg-brand-primary/5 rounded-xl border border-brand-primary/10 text-brand-primary text-[9px] font-bold uppercase tracking-widest italic">
                  "Commander, generate a detailed progress report."
                </div>
              </div>

              {/* Reports List */}
              <div className="lg:col-span-2 space-y-4">
                {aiReports.length === 0 ? (
                  <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl">
                    <FileText className="w-10 h-10 text-white/10 mb-3" />
                    <p className="text-[11px] text-white/20 font-bold uppercase tracking-widest">No reports yet</p>
                  </div>
                ) : (
                  aiReports.map(report => (
                    <motion.div
                      key={report.id}
                      className="p-6 bg-white/5 rounded-3xl border border-white/10 relative group"
                    >
                      <button 
                        onClick={() => onDeleteAIReport(report.id)}
                        className="absolute top-4 right-4 p-1.5 text-white/10 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-2.5 py-0.5 bg-brand-primary/10 text-brand-primary text-[8px] font-bold rounded-full uppercase tracking-widest border border-brand-primary/20">
                          {exams.find(e => e.id === report.examId)?.shortName || 'General'}
                        </span>
                        <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-xl font-serif font-bold text-white mb-3">{report.title}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                          <div className="flex items-center gap-2 mb-1.5 text-emerald-400">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Strengths</span>
                          </div>
                          <ul className="space-y-1">
                            {report.analysis.strengths.slice(0, 3).map((s, i) => (
                              <li key={i} className="text-[10px] text-white/50 flex items-start gap-1.5">
                                <CheckCircle2 className="w-2.5 h-2.5 mt-0.5 shrink-0" /> {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                          <div className="flex items-center gap-2 mb-1.5 text-amber-400">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Weaknesses</span>
                          </div>
                          <ul className="space-y-1">
                            {report.analysis.weaknesses.slice(0, 3).map((w, i) => (
                              <li key={i} className="text-[10px] text-white/50 flex items-start gap-1.5">
                                <div className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" /> {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-3 bg-brand-primary/5 rounded-xl border border-brand-primary/10">
                          <div className="flex items-center gap-2 mb-1.5 text-brand-primary">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Actions</span>
                          </div>
                          <ul className="space-y-1">
                            {report.analysis.recommendations.slice(0, 3).map((r, i) => (
                              <li key={i} className="text-[10px] text-white/50 flex items-start gap-1.5">
                                <ChevronRight className="w-2.5 h-2.5 mt-0.5 shrink-0" /> {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="text-[11px] text-white/40 leading-relaxed whitespace-pre-wrap border-t border-white/5 pt-4 line-clamp-3">
                        {report.content}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'mocktests' && (
          <motion.div
            key="mocktests"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Mock Test Generation Prompt */}
               <div className="lg:col-span-1 p-6 bg-white/5 rounded-3xl border border-white/10 flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 mb-4">
                  <ClipboardCheck className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="text-lg font-serif font-bold text-white mb-2">Create Mock Test</h3>
                <p className="text-[11px] text-white/30 mb-6 leading-relaxed">
                  Generate a full-length mock test based on your syllabus.
                </p>
                <div className="p-3 bg-brand-primary/5 rounded-xl border border-brand-primary/10 text-brand-primary text-[9px] font-bold uppercase tracking-widest italic mb-6">
                  "Commander, create a 20-question mock test."
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSendMessage?.("Commander, create a 20-question mock test for my upcoming Physics exam.")}
                  className="w-full py-3 bg-brand-primary text-brand-bg font-bold uppercase tracking-widest text-[9px] rounded-xl flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Launch AI Commander
                </motion.button>
              </div>

              {/* Mock Tests List */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizzes.filter(q => q.type === 'mock-test').length === 0 ? (
                  <div className="col-span-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl">
                    <ClipboardCheck className="w-10 h-10 text-white/10 mb-3" />
                    <p className="text-[11px] text-white/20 font-bold uppercase tracking-widest">No tests available</p>
                  </div>
                ) : (
                  quizzes.filter(q => q.type === 'mock-test').map(quiz => (
                    <motion.div
                      key={quiz.id}
                      className="p-6 bg-white/5 rounded-3xl border border-white/10 relative group flex flex-col"
                    >
                      <button 
                        onClick={() => onDeleteQuiz(quiz.id)}
                        className="absolute top-4 right-4 p-1.5 text-white/10 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                          <ClipboardCheck className="w-4 h-4 text-brand-primary" />
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest block">Mock Test</span>
                          <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest">
                            {quiz.questions.length} Questions
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-serif font-bold text-white mb-2">{quiz.title}</h3>
                      <p className="text-[11px] text-white/30 mb-6 flex-1 line-clamp-2">{quiz.description}</p>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-white/10 uppercase tracking-widest">
                          <Clock className="w-3 h-3" />
                          {quiz.questions.length * 2} Mins
                        </div>
                        <button 
                          onClick={() => onStartQuiz(quiz.id)}
                          className="px-4 py-2 bg-brand-primary text-white rounded-lg text-[9px] font-bold uppercase tracking-widest hover:scale-105 transition-all"
                        >
                          Start Test
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-primary/10 rounded-xl border border-brand-primary/20">
                    <CalendarIcon className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-white tracking-tight uppercase">AI STUDY CALENDAR</h2>
                    <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Smart Scheduling & Deadlines</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 sm:flex-none px-4 py-2 bg-brand-primary text-white rounded-lg text-[9px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-brand-primary/20">
                    Optimize
                  </button>
                </div>
              </div>

              <Calendar exams={exams} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
