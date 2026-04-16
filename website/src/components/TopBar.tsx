import { User, LogOut, Settings, GraduationCap, Crown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';

interface TopBarProps {
  userName: string;
  userPhoto: string | null;
  selectedExams: string[];
  onLogout: () => void;
  onManageExams: () => void;
  onNavigate: (view: 'dashboard' | 'performance' | 'ai-center') => void;
  currentView: 'dashboard' | 'performance' | 'ai-center';
  currentTheme: 'hardware' | 'minimal';
  onThemeChange: (theme: 'hardware' | 'minimal') => void;
}

export function TopBar({ 
  userName, 
  userPhoto, 
  selectedExams, 
  onLogout, 
  onManageExams, 
  onNavigate, 
  currentView,
  currentTheme,
  onThemeChange
}: TopBarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();

  return (
    <div className="flex justify-between items-center py-2 sm:py-4 px-3 sm:px-8 border-b border-white/10 bg-brand-bg sticky top-0 z-40">
      <div className="flex items-center gap-4 sm:gap-12">
        <div className="flex items-center gap-3 sm:gap-6 cursor-pointer group" onClick={() => onNavigate('dashboard')}>
          <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-[14px] sm:rounded-[20px] bg-white/10 flex items-center justify-center border-2 border-white/20 backdrop-blur-xl shadow-2xl group-hover:scale-110 transition-transform">
            <GraduationCap className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-serif font-bold tracking-tight text-white leading-tight flex items-center gap-2">
              Exams<span className="text-brand-primary italic">Cmd</span>
            </h1>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.3em] mt-1 hidden sm:block">Command Center</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => onNavigate('dashboard')}
            className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-all hover:text-brand-primary ${currentView === 'dashboard' ? 'text-brand-primary' : 'text-white/40'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => onNavigate('performance')}
            className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-all hover:text-brand-primary ${currentView === 'performance' ? 'text-brand-primary' : 'text-white/40'}`}
          >
            Performance
          </button>
          <button 
            onClick={() => onNavigate('ai-center')}
            className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-all hover:text-brand-primary ${currentView === 'ai-center' ? 'text-brand-primary' : 'text-white/40'}`}
          >
            AI Center
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 sm:gap-4 pl-2 pr-3 sm:pr-6 py-1.5 sm:py-2 rounded-full border-2 border-white/20 bg-white/10 hover:bg-white/20 transition-all backdrop-blur-xl shadow-2xl group"
          >
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-brand-primary flex items-center justify-center overflow-hidden border-2 border-white/20 shadow-xl transition-transform group-hover:scale-110">
              {userPhoto ? (
                <img src={userPhoto} alt={userName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              )}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-white block uppercase tracking-tight leading-none">{userName}</span>
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1 block">Active Session</span>
            </div>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowProfileMenu(false)}
                />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  className="absolute right-0 mt-4 w-64 bg-brand-surface rounded-[24px] shadow-2xl overflow-hidden z-50 p-2 border border-white/10"
                >
                  <div className="p-3 border-b border-white/10 mb-2">
                    <p className="text-[9px] text-white/40 font-bold uppercase tracking-[0.2em] mb-3">User Profile</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[14px] bg-white/5 flex items-center justify-center overflow-hidden border-2 border-white/10 shadow-inner">
                        {userPhoto ? (
                          <img src={userPhoto} alt={userName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <User className="w-5 h-5 text-brand-primary" />
                        )}
                      </div>
                      <div>
                        <p className="text-base font-serif font-bold text-white leading-tight">{userName}</p>
                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Student</p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Navigation (Hidden on MD but kept for structure if needed) */}
                  <div className="md:hidden p-3 border-b border-white/10 mb-2 space-y-1">
                    <p className="text-[9px] text-white/40 font-bold uppercase tracking-[0.2em] mb-3">Navigation</p>
                    <button 
                      onClick={() => { onNavigate('dashboard'); setShowProfileMenu(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${currentView === 'dashboard' ? 'bg-brand-primary text-white' : 'text-white/40 hover:bg-white/5'}`}
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={() => { onNavigate('performance'); setShowProfileMenu(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${currentView === 'performance' ? 'bg-brand-primary text-white' : 'text-white/40 hover:bg-white/5'}`}
                    >
                      Performance
                    </button>
                    <button 
                      onClick={() => { onNavigate('ai-center'); setShowProfileMenu(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${currentView === 'ai-center' ? 'bg-brand-primary text-white' : 'text-white/40 hover:bg-white/5'}`}
                    >
                      AI Center
                    </button>
                  </div>
                  
                  <div className="p-3 border-b border-white/10 mb-2">
                    <p className="text-[9px] text-white/40 font-bold uppercase tracking-[0.2em] mb-3">Active Exams</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedExams.map(exam => (
                        <span key={exam} className="px-2 py-1 bg-white/5 text-brand-primary text-[8px] font-bold rounded-full uppercase tracking-widest border border-white/10">
                          {exam}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 border-b border-white/10 mb-2">
                    <p className="text-[9px] text-white/40 font-bold uppercase tracking-[0.2em] mb-3">Interface Theme</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => onThemeChange('hardware')}
                        className={`px-2 py-1.5 rounded-lg text-[8px] font-bold uppercase tracking-widest transition-all border ${currentTheme === 'hardware' ? 'bg-brand-primary border-brand-primary text-white' : 'bg-white/5 border-white/10 text-white/40'}`}
                      >
                        Hardware
                      </button>
                      <button
                        onClick={() => onThemeChange('minimal')}
                        className={`px-2 py-1.5 rounded-lg text-[8px] font-bold uppercase tracking-widest transition-all border ${currentTheme === 'minimal' ? 'bg-brand-primary border-brand-primary text-white' : 'bg-white/5 border-white/10 text-white/40'}`}
                      >
                        Minimal
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button 
                      onClick={() => { onManageExams(); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-2 px-3 py-3 text-[10px] font-bold text-white/60 hover:text-brand-primary hover:bg-white/5 rounded-[16px] transition-all group"
                    >
                      <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                      MANAGE EXAMS
                    </button>
                    <button 
                      onClick={onLogout}
                      className="w-full flex items-center gap-2 px-3 py-3 text-[10px] font-bold text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-[16px] transition-all group"
                    >
                      <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      SIGN OUT
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
