import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft, Trophy, Timer } from 'lucide-react';
import { Quiz, Question } from '../types';

interface QuizModalProps {
  quiz: Quiz;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ quiz, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleSelectAnswer = (questionId: string, answerIndex: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
  };

  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const score = calculateScore();
  const percentage = Math.round((score / quiz.questions.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-brand-bg/95 backdrop-blur-xl"
    >
      <div className="max-w-xl w-full bg-brand-surface rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div>
            <span className="text-[9px] font-bold text-brand-primary uppercase tracking-[0.3em] mb-0.5 block">AI Quiz Engine</span>
            <h2 className="text-xl font-serif font-bold text-white tracking-tight">{quiz.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/20 hover:text-white transition-colors bg-white/5 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                    Question {currentQuestionIndex + 1} / {quiz.questions.length}
                  </span>
                  <div className="flex gap-1">
                    {quiz.questions.map((_, i) => (
                      <div 
                        key={i}
                        className={`h-0.5 w-3 rounded-full transition-all ${i === currentQuestionIndex ? 'bg-brand-primary w-6' : i < currentQuestionIndex ? 'bg-brand-primary/40' : 'bg-white/10'}`}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-serif font-bold text-white leading-snug">
                  {currentQuestion.text}
                </h3>

                <div className="grid gap-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswers[currentQuestion.id] === index;
                    return (
                      <button
                        key={index}
                        onClick={() => handleSelectAnswer(currentQuestion.id, index)}
                        className={`p-4 rounded-xl border text-left transition-all group relative overflow-hidden ${
                          isSelected 
                            ? 'bg-brand-primary/10 border-brand-primary text-white' 
                            : 'bg-white/5 border-transparent text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 relative z-10">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center border font-bold text-[10px] transition-all ${
                            isSelected ? 'bg-brand-primary border-brand-primary text-white' : 'border-white/10 text-white/30'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-sm font-medium">{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6"
              >
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full bg-brand-primary/10 flex items-center justify-center border-2 border-brand-primary/20">
                    <Trophy className="w-10 h-10 text-brand-primary" />
                  </div>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="absolute -top-1 -right-1 bg-brand-primary text-brand-bg font-bold px-2 py-0.5 rounded-full text-[10px]"
                  >
                    {percentage}%
                  </motion.div>
                </div>

                <div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-1">Quiz Completed!</h3>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                    Score: {score} / {quiz.questions.length}
                  </p>
                </div>

                <div className="grid gap-3 text-left max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {quiz.questions.map((q, i) => {
                    const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
                    return (
                      <div 
                        key={q.id}
                        className={`p-3 rounded-xl border ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-red-500/5 border-red-500/10'}`}
                      >
                        <div className="flex items-start gap-2">
                          {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
                          <div>
                            <p className="text-xs font-bold text-white mb-1">{i + 1}. {q.text}</p>
                            <p className="text-[10px] text-white/40">
                              Correct: <span className="text-emerald-500">{q.options[q.correctAnswer]}</span>
                              {!isCorrect && (
                                <> • Your answer: <span className="text-red-500">{q.options[selectedAnswers[q.id]] || 'None'}</span></>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3.5 bg-brand-primary text-brand-bg font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-brand-primary/10 uppercase tracking-widest text-[10px]"
                >
                  Back to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {!showResults && (
          <div className="px-6 py-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-1.5 text-white/30 hover:text-white disabled:opacity-0 transition-all font-bold uppercase tracking-widest text-[10px]"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Prev
            </button>
            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion.id] === undefined}
              className="flex items-center gap-1.5 bg-brand-primary text-brand-bg px-6 py-2.5 rounded-full font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {isLastQuestion ? 'Finish' : 'Next'}
              {!isLastQuestion && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
