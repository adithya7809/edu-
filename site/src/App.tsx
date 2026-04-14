import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { mockExams } from './data';
import { Exam, Chapter, Goal, Milestone, SiteSettings, Resource, Quiz, StudyPlan, AIReport, CalendarEvent } from './types';
import { ExamCard } from './components/ExamCard';
import { ExamDetailModal } from './components/ExamDetailModal';
import { QuizModal } from './components/QuizModal';
import { StudyPlanModal } from './components/StudyPlanModal';
import { StudyPlanCard } from './components/StudyPlanCard';
import { AICenter } from './components/AICenter';
import { TopBar } from './components/TopBar';
import { CommonChapters } from './components/CommonChapters';
import { Performance } from './components/Performance';
import { Calendar } from './components/Calendar';
import { AIChatBox } from './components/AIChatBox';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  signOut, 
  onAuthStateChanged, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  onSnapshot, 
  deleteDoc, 
  query,
  where,
  getDocs,
  FirebaseUser 
} from './firebase';
import { LogIn, GraduationCap, CheckCircle2, LayoutGrid, Settings, AlertCircle, BookOpen, X, Trophy, ChevronRight, Calendar as CalendarIcon, ClipboardCheck, Search, ArrowUpDown } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<{ name: string; selectedExams: string[]; theme?: 'hardware' | 'minimal'; currentView?: 'dashboard' | 'performance' | 'ai-center'; selectedExamId?: string } | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({ siteName: 'ExamsCmd', welcomeMessage: 'WELCOME BACK,', primaryColor: '#00FF00' });
  const [resources, setResources] = useState<Resource[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [aiReports, setAIReports] = useState<AIReport[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [chapterProgress, setChapterProgress] = useState<Record<string, any>>({});
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [activeStudyPlanId, setActiveStudyPlanId] = useState<string | null>(null);
  const [externalMessage, setExternalMessage] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [showExamSelection, setShowExamSelection] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const [loginError, setLoginError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'performance' | 'ai-center'>('dashboard');
  const [theme, setTheme] = useState<'hardware' | 'minimal'>('hardware');
  const [examSearchQuery, setExamSearchQuery] = useState('');
  const [examSortBy, setExamSortBy] = useState<'priority' | 'progress-high' | 'progress-low' | 'nearest-date'>('priority');
  const location = useLocation();

  // Theme Switcher
  useEffect(() => {
    if (theme === 'minimal') {
      document.documentElement.setAttribute('data-theme', 'minimal');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  const handleThemeChange = async (newTheme: 'hardware' | 'minimal') => {
    setTheme(newTheme);
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), { theme: newTheme });
      } catch (error) {
        console.error("Error updating theme:", error);
      }
    }
  };

  // Global Timer for synchronization
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Initial fetch to handle new user creation
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          const newProfile = { 
            name: firebaseUser.displayName || 'User', 
            selectedExams: [], 
            theme: 'hardware' as const, 
            currentView: 'dashboard' as const, 
            selectedExamId: null 
          };
          await setDoc(userRef, newProfile);
          setUserProfile(newProfile);
          setTheme('hardware');
          setCurrentView('dashboard');
          setSelectedExamId(null);
          setShowExamSelection(true);
        }
      } else {
        setUserProfile(null);
        setExams(mockExams);
        setTheme('hardware');
        setCurrentView('dashboard');
        setSelectedExamId(null);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Real-time User Profile Listener
  useEffect(() => {
    if (!user) return;

    const userUnsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data() as any;
        setUserProfile(data);
        if (data.theme === 'hardware' || data.theme === 'minimal') setTheme(data.theme);
        if (data.currentView === 'dashboard' || data.currentView === 'performance' || data.currentView === 'ai-center') setCurrentView(data.currentView);
        if (data.selectedExamId) setSelectedExamId(data.selectedExamId);
      }
    }, (error) => {
      console.error('Firestore Error (userProfile):', error);
    });

    return () => userUnsubscribe();
  }, [user]);

  const handleExamSelect = async (id: string | null) => {
    setSelectedExamId(id);
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), { selectedExamId: id });
      } catch (error) {
        console.error("Error updating selected exam:", error);
      }
    }
  };

  // Sync Progress and Goals from Firestore
  useEffect(() => {
    if (!user || !isAuthReady) return;

    const progressUnsubscribe = onSnapshot(collection(db, 'users', user.uid, 'chapterProgress'), (snapshot) => {
      const progressMap: Record<string, any> = {};
      snapshot.docs.forEach(doc => {
        progressMap[doc.id] = doc.data();
      });
      setChapterProgress(progressMap);
    }, (error) => {
      console.error('Firestore Error (chapterProgress):', error);
    });

    const goalsUnsubscribe = onSnapshot(collection(db, 'users', user.uid, 'goals'), (snapshot) => {
      const goalsByExam: Record<string, Goal[]> = {};
      snapshot.docs.forEach(doc => {
        const goal = { id: doc.id, ...doc.data() } as Goal;
        if (!goalsByExam[goal.examId]) goalsByExam[goal.examId] = [];
        goalsByExam[goal.examId].push(goal);
      });

      setExams(prevExams => {
        const baseExams = prevExams.length > 0 ? prevExams : mockExams;
        return baseExams.map(exam => ({
          ...exam,
          goals: goalsByExam[exam.id] || []
        }));
      });
    }, (error) => {
      console.error('Firestore Error (goals):', error);
    });

    const examsUnsubscribe = onSnapshot(collection(db, 'users', user.uid, 'exams'), (snapshot) => {
      const examsData: Record<string, any> = {};
      snapshot.docs.forEach(doc => {
        examsData[doc.id] = doc.data();
      });

      setExams(prevExams => {
        const baseExams = prevExams.length > 0 ? prevExams : mockExams;
        return baseExams.map(exam => {
          const savedExam = examsData[exam.id];
          if (savedExam) {
            return { ...exam, ...savedExam };
          }
          return exam;
        });
      });
    }, (error) => {
      console.error('Firestore Error (exams):', error);
    });

    const settingsUnsubscribe = onSnapshot(doc(db, 'users', user.uid, 'config', 'settings'), (doc) => {
      if (doc.exists()) {
        setSiteSettings(doc.data() as SiteSettings);
      }
    }, (error) => {
      console.error('Firestore Error (settings):', error);
    });

    const resourcesUnsubscribe = onSnapshot(collection(db, 'users', user.uid, 'resources'), (snapshot) => {
      const res = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Resource));
      setResources(res.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }, (error) => {
      console.error('Firestore Error (resources):', error);
    });

    const quizzesUnsubscribe = onSnapshot(collection(db, 'users', user.uid, 'quizzes'), (snapshot) => {
      const qz = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Quiz));
      setQuizzes(qz.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }, (error) => {
      console.error('Firestore Error (quizzes):', error);
    });

    const studyPlansUnsubscribe = onSnapshot(collection(db, 'users', user.uid, 'studyPlans'), (snapshot) => {
      const sp = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as StudyPlan));
      setStudyPlans(sp.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }, (error) => {
      console.error('Firestore Error (studyPlans):', error);
    });

    const aiReportsUnsubscribe = onSnapshot(collection(db, 'users', user.uid, 'aiReports'), (snapshot) => {
      const ar = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AIReport));
      setAIReports(ar.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }, (error) => {
      console.error('Firestore Error (aiReports):', error);
    });

    const calendarEventsUnsubscribe = onSnapshot(collection(db, 'users', user.uid, 'calendarEvents'), (snapshot) => {
      const events = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CalendarEvent));
      setCalendarEvents(events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    }, (error) => {
      console.error('Firestore Error (calendarEvents):', error);
    });

    return () => {
      progressUnsubscribe();
      goalsUnsubscribe();
      examsUnsubscribe();
      settingsUnsubscribe();
      resourcesUnsubscribe();
      quizzesUnsubscribe();
      studyPlansUnsubscribe();
      aiReportsUnsubscribe();
      calendarEventsUnsubscribe();
    };
  }, [user, isAuthReady]);

  // Calculate overall progress
  const examsWithProgress = React.useMemo(() => {
    if (!exams || exams.length === 0) return [];
    
    return exams.map(exam => {
      if (!exam || !exam.subjects) return exam;
      
      let totalExamTasks = 0;
      let completedExamTasks = 0;

      const updatedSubjects = exam.subjects.map(subject => {
        if (!subject || !subject.chapters) return subject;
        
        let totalSubjectTasks = 0;
        let completedSubjectTasks = 0;

        const updatedChapters = subject.chapters.map(chapter => {
          if (!chapter) return chapter;
          
          const compositeId = `${exam.id}_${subject.id}_${chapter.id}`;
          const progress = chapterProgress[compositeId] || {};
          
          const mergedChapter = {
            ...chapter,
            theory: progress.theory ?? chapter.theory,
            dpp: progress.dpp ?? chapter.dpp,
            chapterTest: progress.chapterTest ?? chapter.chapterTest,
            revision1: progress.revision1 ?? chapter.revision1,
            revision2: progress.revision2 ?? chapter.revision2,
          };

          const tasks = [mergedChapter.theory, mergedChapter.dpp, mergedChapter.chapterTest, mergedChapter.revision1, mergedChapter.revision2];
          totalSubjectTasks += tasks.length;
          completedSubjectTasks += tasks.filter(Boolean).length;

          return mergedChapter;
        });

        const subjectProgress = totalSubjectTasks > 0 ? Math.round((completedSubjectTasks / totalSubjectTasks) * 100) : 0;
        
        totalExamTasks += totalSubjectTasks;
        completedExamTasks += completedSubjectTasks;

        return { ...subject, chapters: updatedChapters, progress: subjectProgress };
      });

      const overallProgress = totalExamTasks > 0 ? Math.round((completedExamTasks / totalExamTasks) * 100) : 0;
      
      return { ...exam, subjects: updatedSubjects, overallProgress };
    });
  }, [exams, chapterProgress]);

  const commonChapterGroups = React.useMemo(() => {
    const selectedExams = examsWithProgress.filter(e => userProfile?.selectedExams?.includes(e.id));
    if (selectedExams.length < 2) return [];

    const groups: Record<string, any> = {};

    selectedExams.forEach(exam => {
      exam.subjects.forEach(subject => {
        subject.chapters.forEach(chapter => {
          // Only include high-priority chapters for "Common High-Yield Topics"
          if (chapter.priority > 2) return;

          const key = `${subject.name.toLowerCase()}:${chapter.name.toLowerCase()}`;
          if (!groups[key]) {
            groups[key] = {
              name: chapter.name,
              subjectName: subject.name,
              exams: []
            };
          }
          groups[key].exams.push({
            examId: exam.id,
            examName: exam.shortName,
            subjectId: subject.id,
            chapter
          });
        });
      });
    });

    return Object.values(groups)
      .filter((g: any) => g.exams.length > 1)
      .sort((a: any, b: any) => b.exams.length - a.exams.length);
  }, [examsWithProgress, userProfile?.selectedExams]);

  const handleLogin = async () => {
    setLoginError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.code === 'auth/unauthorized-domain') {
        setLoginError('Unauthorized Domain: Please add your Netlify domain to the "Authorized domains" list in the Firebase Console (Authentication > Settings > Authorized domains).');
      } else if (error.code === 'auth/popup-closed-by-user') {
        // Silently handle user closing popup
      } else if (error.code === 'auth/popup-blocked') {
        setLoginError('Popup Blocked: Your browser blocked the login popup. Please allow popups or try the redirect login.');
      } else {
        setLoginError(`Login failed: ${error.message}`);
      }
    }
  };

  const handleRedirectLogin = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      setLoginError(`Redirect login failed: ${error.message}`);
    }
  };

  const handleViewChange = async (view: 'dashboard' | 'performance' | 'ai-center') => {
    setCurrentView(view);
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), { currentView: view });
      } catch (error) {
        console.error("Error updating view:", error);
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setSelectedExamId(null);
  };

  const toggleChapterTask = async (examId: string, subjectId: string, chapterId: string, taskKey: keyof Chapter) => {
    if (!user) return;

    const exam = exams.find(e => e.id === examId);
    const subject = exam?.subjects.find(s => s.id === subjectId);
    const chapter = subject?.chapters.find(c => c.id === chapterId);

    if (chapter) {
      const currentVal = chapter[taskKey];
      if (typeof currentVal === 'boolean') {
        const targetValue = !currentVal;
        
        // Find all exams that have this same chapter (by name and subject name)
        const updates: Promise<any>[] = [];
        exams.forEach(e => {
          e.subjects.forEach(s => {
            if (s.name.toLowerCase() === subject?.name.toLowerCase()) {
              s.chapters.forEach(c => {
                if (c.name.toLowerCase() === chapter.name.toLowerCase()) {
                  const compositeId = `${e.id}_${s.id}_${c.id}`;
                  updates.push(setDoc(doc(db, 'users', user.uid, 'chapterProgress', compositeId), { [taskKey]: targetValue }, { merge: true }));
                }
              });
            }
          });
        });
        await Promise.all(updates);
      }
    }
  };

  const setChapterTask = async (examId: string, subjectId: string, chapterId: string, taskKey: keyof Chapter, value: boolean) => {
    if (!user) return;
    
    const exam = exams.find(e => e.id === examId);
    const subject = exam?.subjects.find(s => s.id === subjectId);
    const chapter = subject?.chapters.find(c => c.id === chapterId);

    if (chapter && subject) {
      const updates: Promise<any>[] = [];
      exams.forEach(e => {
        e.subjects.forEach(s => {
          if (s.name.toLowerCase() === subject.name.toLowerCase()) {
            s.chapters.forEach(c => {
              if (c.name.toLowerCase() === chapter.name.toLowerCase()) {
                const compositeId = `${e.id}_${s.id}_${c.id}`;
                updates.push(setDoc(doc(db, 'users', user.uid, 'chapterProgress', compositeId), { [taskKey]: value }, { merge: true }));
              }
            });
          }
        });
      });
      await Promise.all(updates);
    }
  };

  const addGoal = async (examId: string, text: string) => {
    if (!user) return;
    const goalsRef = collection(db, 'users', user.uid, 'goals');
    await setDoc(doc(goalsRef), {
      text,
      completed: false,
      examId,
      createdAt: new Date().toISOString()
    });
  };

  const toggleGoal = async (goalId: string) => {
    if (!user) return;
    const goalRef = doc(db, 'users', user.uid, 'goals', goalId);
    const goalDoc = await getDoc(goalRef);
    if (goalDoc.exists()) {
      await updateDoc(goalRef, { completed: !goalDoc.data().completed });
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'goals', goalId));
  };

  const addMilestone = async (examId: string, milestone: Omit<Milestone, 'id'>) => {
    if (!user) return;
    const examRef = doc(db, 'users', user.uid, 'exams', examId);
    const examDoc = await getDoc(examRef);
    const currentMilestones = examDoc.exists() ? (examDoc.data().milestones || []) : [];
    
    const newMilestone = {
      ...milestone,
      id: Math.random().toString(36).substr(2, 9)
    };

    await setDoc(examRef, { 
      milestones: [...currentMilestones, newMilestone] 
    }, { merge: true });
  };

  const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
    if (!user) return;
    const settingsRef = doc(db, 'users', user.uid, 'config', 'settings');
    await setDoc(settingsRef, { ...siteSettings, ...settings }, { merge: true });
  };

  const saveResource = async (resource: Omit<Resource, 'id' | 'createdAt'>) => {
    if (!user) return;
    const resourcesRef = collection(db, 'users', user.uid, 'resources');
    await setDoc(doc(resourcesRef), {
      ...resource,
      createdAt: new Date().toISOString()
    });
  };

  const addQuiz = async (quiz: Omit<Quiz, 'id' | 'createdAt'>) => {
    if (!user) return;
    console.log('Saving quiz to Firestore:', quiz);
    const quizzesRef = collection(db, 'users', user.uid, 'quizzes');
    await setDoc(doc(quizzesRef), {
      ...quiz,
      createdAt: new Date().toISOString()
    });
    console.log('Quiz saved successfully');
  };

  const deleteQuiz = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'quizzes', id));
  };

  const addStudyPlan = async (plan: Omit<StudyPlan, 'id' | 'createdAt'>) => {
    if (!user) return;
    const plansRef = collection(db, 'users', user.uid, 'studyPlans');
    await setDoc(doc(plansRef), {
      ...plan,
      createdAt: new Date().toISOString()
    });
  };

  const deleteStudyPlan = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'studyPlans', id));
  };

  const addAIReport = async (report: Omit<AIReport, 'id' | 'createdAt'>) => {
    if (!user) return;
    const reportsRef = collection(db, 'users', user.uid, 'aiReports');
    await setDoc(doc(reportsRef), {
      ...report,
      createdAt: new Date().toISOString()
    });
  };

  const deleteAIReport = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'aiReports', id));
  };

  const addCalendarEvent = async (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => {
    if (!user) return;
    const id = Math.random().toString(36).substr(2, 9);
    const newEvent: CalendarEvent = {
      ...event,
      id,
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'users', user.uid, 'calendarEvents', id), newEvent);
    } catch (error) {
      console.error("Error adding calendar event:", error);
    }
  };

  const deleteCalendarEvent = async (eventId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'calendarEvents', eventId));
    } catch (error) {
      console.error("Error deleting calendar event:", error);
    }
  };

  const deleteResource = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'resources', id));
  };

  const deleteAllGoals = async (examId: string) => {
    if (!user) return;
    const goalsRef = collection(db, 'users', user.uid, 'goals');
    const q = query(goalsRef, where('examId', '==', examId));
    const querySnapshot = await getDocs(q);
    const deletes = querySnapshot.docs.map(d => deleteDoc(d.ref));
    await Promise.all(deletes);
  };

  const handleSelectExams = async (examIds: string[]) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid), { selectedExams: examIds });
    setUserProfile(prev => prev ? { ...prev, selectedExams: examIds } : null);
    setShowExamSelection(false);
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-brand-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative elements inspired by the image */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] aspect-square bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] aspect-square bg-brand-primary/10 rounded-full blur-3xl" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10"
        >
          <div className="text-left">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white uppercase">{siteSettings.siteName}</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-bold text-white leading-tight sm:leading-[0.9] tracking-tighter mb-8">
              MASTER YOUR <br />
              <span className="italic opacity-90 text-brand-primary">SYLLABUS.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-white/80 font-medium max-w-md leading-relaxed mb-12">
              A professional-grade tracking system for serious aspirants. 
              Precision monitoring across all your devices.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleLogin}
                className="px-8 py-4 bg-brand-primary text-white font-bold rounded-full flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-2xl shadow-brand-primary/20"
              >
                <LogIn className="w-5 h-5" />
                GET STARTED
              </button>
              
              {loginError && (
                <button
                  onClick={handleRedirectLogin}
                  className="px-8 py-4 border border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all"
                >
                  TRY REDIRECT
                </button>
              )}
            </div>

            {loginError && (
              <div className="mt-8 p-4 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl text-white/90 text-sm text-left max-w-md">
                <p className="font-bold text-white mb-1">Login Issue Detected</p>
                {loginError}
              </div>
            )}
          </div>

          <div className="hidden lg:block relative">
            <div className="aspect-[4/5] bg-white/10 backdrop-blur-sm rounded-[40px] border border-white/20 overflow-hidden shadow-2xl relative group">
              <img 
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000" 
                alt="Study" 
                className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-transparent" />
              
              <div className="absolute bottom-10 left-10 right-10">
                <div className="p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Live Status</p>
                      <p className="text-lg font-bold text-white">System Operational</p>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 2, delay: 0.5 }}
                      className="h-full bg-brand-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (showExamSelection || (userProfile && (!userProfile.selectedExams || userProfile.selectedExams.length === 0))) {
    return (
      <div className="min-h-screen bg-brand-bg p-6 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-4xl sm:text-7xl font-serif font-bold text-white mb-6 tracking-tight leading-tight">
              Select Your <span className="text-brand-primary italic">Exams</span>
            </h2>
            <p className="text-white/60 text-sm sm:text-lg font-medium uppercase tracking-[0.3em]">
              Choose the challenges you're conquering
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {mockExams.map(exam => {
              const isSelected = userProfile?.selectedExams?.includes(exam.id);
              return (
                <motion.button
                  key={exam.id}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const current = userProfile?.selectedExams || [];
                    const next = current.includes(exam.id) 
                      ? current.filter(id => id !== exam.id)
                      : [...current, exam.id];
                    setUserProfile(prev => prev ? { ...prev, selectedExams: next } : null);
                  }}
                  className={`p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border-4 text-left transition-all duration-300 relative overflow-hidden group shadow-2xl ${
                    isSelected 
                      ? 'bg-brand-surface border-brand-primary text-white' 
                      : 'bg-white/5 border-transparent text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4 sm:mb-6 relative z-10">
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold text-brand-primary uppercase tracking-widest mb-2 block">{exam.shortName}</span>
                      <span className="text-2xl sm:text-3xl font-serif font-bold tracking-tight block mb-4 line-clamp-2">{exam.name}</span>
                      <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${isSelected ? 'text-brand-primary/60' : 'text-white/40'}`}>
                        Complete syllabus tracking & weightage
                      </p>
                    </div>
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      isSelected 
                        ? 'bg-brand-primary border-brand-primary text-white' 
                        : 'border-white/20 text-transparent'
                    }`}>
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>
                  {isSelected && (
                    <motion.div 
                      layoutId="selected-glow"
                      className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <button
              disabled={!userProfile?.selectedExams?.length}
              onClick={() => handleSelectExams(userProfile?.selectedExams || [])}
              className="bg-brand-primary hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed text-white px-10 sm:px-16 py-4 sm:py-6 rounded-full font-bold text-lg sm:text-xl transition-all shadow-2xl shadow-brand-primary/40 uppercase tracking-[0.2em]"
            >
              Start Studying
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  const selectedExams = examsWithProgress.filter(e => userProfile?.selectedExams?.includes(e.id));
  const activeExam = examsWithProgress.find(e => e.id === selectedExamId);

  const filteredAndSortedExams = React.useMemo(() => {
    const queryText = examSearchQuery.trim().toLowerCase();
    const filtered = selectedExams.filter((exam) => {
      if (!queryText) return true;
      return (
        exam.name.toLowerCase().includes(queryText) ||
        exam.shortName.toLowerCase().includes(queryText)
      );
    });

    return [...filtered].sort((a, b) => {
      if (examSortBy === 'progress-high') return b.overallProgress - a.overallProgress;
      if (examSortBy === 'progress-low') return a.overallProgress - b.overallProgress;
      if (examSortBy === 'nearest-date') return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
      return a.priority - b.priority;
    });
  }, [selectedExams, examSearchQuery, examSortBy]);

  const nextExamDeadline = React.useMemo(() => {
    if (selectedExams.length === 0) return null;

    const upcoming = [...selectedExams].sort(
      (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
    )[0];

    const deadlineDate = new Date(upcoming.targetDate);
    const daysLeft = Math.ceil((deadlineDate.getTime() - currentTime) / (1000 * 60 * 60 * 24));

    return { upcoming, daysLeft };
  }, [selectedExams, currentTime]);

  return (
    <div className="min-h-screen bg-brand-bg text-white font-sans selection:bg-brand-primary/30">
      <TopBar 
        userName={userProfile?.name || user.displayName || 'User'} 
        userPhoto={user.photoURL}
        selectedExams={selectedExams.map(e => e.shortName)}
        onLogout={handleLogout}
        onManageExams={() => setShowExamSelection(true)}
        onNavigate={handleViewChange}
        currentView={currentView}
        currentTheme={theme}
        onThemeChange={handleThemeChange}
      />
      
      <main className="max-w-7xl mx-auto px-6 sm:px-12 py-12 sm:py-20">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* ... existing dashboard content ... */}
              <header className="mb-8 sm:mb-16">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
                >
                  <div>
                    <p className="text-[9px] sm:text-[10px] font-bold text-white/40 uppercase tracking-[0.4em] mb-3">Preparation Command Center</p>
                    <h2 className="text-2xl sm:text-5xl lg:text-7xl font-serif font-bold text-white tracking-tighter leading-[0.85]">
                      {siteSettings.welcomeMessage} <br />
                      <span className="text-brand-primary italic">{userProfile?.name || user.displayName || 'COMMANDER'}</span>
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-3 sm:px-6 sm:py-4 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Active Exams</p>
                      <p className="text-xl sm:text-2xl font-bold text-white">{selectedExams.length}</p>
                    </div>
                    <div className="px-4 py-3 sm:px-6 sm:py-4 bg-brand-primary/10 backdrop-blur-xl rounded-full border border-brand-primary/20 shadow-2xl">
                      <p className="text-[9px] font-bold text-brand-primary uppercase tracking-widest mb-1">Overall Progress</p>
                      <p className="text-xl sm:text-2xl font-bold text-brand-primary">
                        {selectedExams.length > 0 
                          ? Math.round(selectedExams.reduce((acc, curr) => acc + curr.overallProgress, 0) / selectedExams.length)
                          : 0}%
                      </p>
                    </div>
                    {nextExamDeadline && (
                      <div className="px-4 py-3 sm:px-6 sm:py-4 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Next Deadline</p>
                        <p className="text-sm sm:text-base font-bold text-white">
                          {nextExamDeadline.upcoming.shortName} · {nextExamDeadline.daysLeft >= 0 ? `${nextExamDeadline.daysLeft} days` : 'Passed'}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
                <div className="h-1 w-full bg-white/5 rounded-full mt-8 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-brand-primary to-transparent opacity-50"
                  />
                </div>
              </header>

              <CommonChapters 
                groups={commonChapterGroups} 
                onSetTask={setChapterTask} 
                selectedExams={selectedExams.map(e => e.shortName)}
              />

              {quizzes.filter(q => q.type === 'mock-test').length > 0 && (
                <section className="mt-8 sm:mt-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-1.5 bg-white/5 rounded-lg border border-white/10">
                      <ClipboardCheck className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-serif font-bold text-white tracking-tight uppercase">Full-Length Mock Tests</h2>
                      <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Simulated Exam Environment</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quizzes.filter(q => q.type === 'mock-test').map(quiz => (
                      <motion.div
                        key={quiz.id}
                        whileHover={{ scale: 1.01, y: -2 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setActiveQuizId(quiz.id)}
                        className="p-5 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 relative group text-left flex flex-col h-full cursor-pointer"
                      >
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteQuiz(quiz.id); }}
                          className="absolute top-3 right-3 p-1.5 text-white/10 hover:text-red-400 transition-colors z-10"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-lg bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                            <ClipboardCheck className="w-3.5 h-3.5 text-brand-primary" />
                          </div>
                          <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest">{quiz.questions.length} Questions</span>
                        </div>
                        <h3 className="text-lg font-serif font-bold text-white mb-1 line-clamp-1">{quiz.title}</h3>
                        <p className="text-[11px] text-white/30 line-clamp-2 mb-4 flex-1">{quiz.description}</p>
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                          <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">
                            {new Date(quiz.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                            Start Test <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {quizzes.filter(q => q.type === 'practice').length > 0 && (
                <section className="mt-8 sm:mt-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-1.5 bg-white/5 rounded-lg border border-white/10">
                      <Trophy className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-serif font-bold text-white tracking-tight uppercase">AI Practice Quizzes</h2>
                      <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-0.5">AI-Generated Assessment</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quizzes.filter(q => q.type === 'practice').map(quiz => (
                      <motion.div
                        key={quiz.id}
                        whileHover={{ scale: 1.01, y: -2 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setActiveQuizId(quiz.id)}
                        className="p-5 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 relative group text-left flex flex-col h-full cursor-pointer"
                      >
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteQuiz(quiz.id); }}
                          className="absolute top-3 right-3 p-1.5 text-white/10 hover:text-red-400 transition-colors z-10"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-lg bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />
                          </div>
                          <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest">{quiz.questions.length} Questions</span>
                        </div>
                        <h3 className="text-lg font-serif font-bold text-white mb-1 line-clamp-1">{quiz.title}</h3>
                        <p className="text-[11px] text-white/30 line-clamp-2 mb-4 flex-1">{quiz.description}</p>
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                          <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">
                            {new Date(quiz.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                            Start Quiz <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {studyPlans.length > 0 && (
                <section className="mt-8 sm:mt-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-1.5 bg-white/5 rounded-lg border border-white/10">
                      <CalendarIcon className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-serif font-bold text-white tracking-tight uppercase">AI Study Plans</h2>
                      <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Personalized Preparation Schedules</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {studyPlans.map(plan => {
                      const exam = exams.find(e => e.id === plan.examId);
                      return (
                        <div key={plan.id} onClick={() => setActiveStudyPlanId(plan.id)} className="cursor-pointer">
                          <StudyPlanCard 
                            plan={plan} 
                            examName={exam?.shortName || 'Exam'} 
                            onDelete={() => deleteStudyPlan(plan.id)} 
                          />
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {resources.length > 0 && (
                <section className="mt-8 sm:mt-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-1.5 bg-white/5 rounded-lg border border-white/10">
                      <BookOpen className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-serif font-bold text-white tracking-tight uppercase">AI Study Resources</h2>
                      <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-0.5">AI-Generated Prep Content</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resources.map(res => (
                      <motion.div
                        key={res.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 relative group"
                      >
                        <button 
                          onClick={() => deleteResource(res.id)}
                          className="absolute top-3 right-3 p-1.5 text-white/10 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest mb-1 block">{res.type}</span>
                        <h3 className="text-lg font-serif font-bold text-white mb-2">{res.title}</h3>
                        <div className="text-[11px] text-white/40 leading-relaxed whitespace-pre-wrap line-clamp-4">
                          {res.content}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              <section className="mt-8 sm:mt-10">
                <Calendar 
                  exams={selectedExams} 
                  customEvents={calendarEvents}
                  onAddEvent={addCalendarEvent}
                  onDeleteEvent={deleteCalendarEvent}
                />
              </section>

              <section className="mt-8 sm:mt-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-white/5 rounded-lg border border-white/10">
                      <LayoutGrid className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-serif font-bold text-white tracking-tight">MY EXAMS</h2>
                      <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Individual Progress Tracking</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 flex flex-col sm:flex-row gap-3">
                  <label className="flex-1 flex items-center gap-2 px-4 py-3 bg-white/5 rounded-2xl border border-white/10">
                    <Search className="w-4 h-4 text-white/40" />
                    <input
                      value={examSearchQuery}
                      onChange={(e) => setExamSearchQuery(e.target.value)}
                      placeholder="Search exams by name..."
                      className="w-full bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
                    />
                  </label>
                  <label className="sm:w-64 flex items-center gap-2 px-4 py-3 bg-white/5 rounded-2xl border border-white/10">
                    <ArrowUpDown className="w-4 h-4 text-white/40" />
                    <select
                      value={examSortBy}
                      onChange={(e) => setExamSortBy(e.target.value as 'priority' | 'progress-high' | 'progress-low' | 'nearest-date')}
                      className="w-full bg-transparent text-sm text-white focus:outline-none"
                    >
                      <option className="bg-brand-bg" value="priority">Sort: Priority</option>
                      <option className="bg-brand-bg" value="nearest-date">Sort: Nearest Exam Date</option>
                      <option className="bg-brand-bg" value="progress-high">Sort: Progress High to Low</option>
                      <option className="bg-brand-bg" value="progress-low">Sort: Progress Low to High</option>
                    </select>
                  </label>
                </div>

                {filteredAndSortedExams.length === 0 ? (
                  <div className="p-6 text-sm text-white/60 bg-white/5 border border-white/10 rounded-3xl">
                    No exams matched your search. Try a different keyword.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAndSortedExams.map((exam) => (
                      <ExamCard 
                        key={exam.id} 
                        exam={exam} 
                        onClick={() => handleExamSelect(exam.id)}
                        currentTime={currentTime}
                      />
                    ))}
                  </div>
                )}
              </section>
            </motion.div>
          ) : currentView === 'performance' ? (
            <Performance exams={selectedExams} />
          ) : (
            <AICenter 
              exams={selectedExams} 
              quizzes={quizzes}
              studyPlans={studyPlans}
              aiReports={aiReports}
              onAddQuiz={addQuiz}
              onAddStudyPlan={addStudyPlan}
              onAddAIReport={addAIReport}
              onDeleteQuiz={deleteQuiz}
              onDeleteStudyPlan={deleteStudyPlan}
              onDeleteAIReport={deleteAIReport}
              onStartQuiz={setActiveQuizId}
              onSendMessage={setExternalMessage}
            />
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {activeExam && (
          <ExamDetailModal
            exam={activeExam}
            onClose={() => handleExamSelect(null)}
            onToggleChapterTask={(examId, subjectId, chapterId, task) => toggleChapterTask(examId, subjectId, chapterId, task)}
            onAddGoal={(text) => addGoal(activeExam.id, text)}
            onToggleGoal={toggleGoal}
            onDeleteGoal={deleteGoal}
            onDeleteAllGoals={deleteAllGoals}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeQuizId && quizzes.find(q => q.id === activeQuizId) && (
          <QuizModal
            quiz={quizzes.find(q => q.id === activeQuizId)!}
            onClose={() => setActiveQuizId(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeStudyPlanId && studyPlans.find(p => p.id === activeStudyPlanId) && (
          <StudyPlanModal
            plan={studyPlans.find(p => p.id === activeStudyPlanId)!}
            examName={exams.find(e => e.id === studyPlans.find(p => p.id === activeStudyPlanId)?.examId)?.shortName || 'Exam'}
            onClose={() => setActiveStudyPlanId(null)}
          />
        )}
      </AnimatePresence>

      <AIChatBox 
        exams={selectedExams}
        onAddGoal={addGoal}
        onToggleGoal={toggleGoal}
        onSetChapterTask={setChapterTask}
        onAddMilestone={addMilestone}
        onUpdateSettings={updateSiteSettings}
        onSaveResource={saveResource}
        onAddQuiz={addQuiz}
        onAddStudyPlan={addStudyPlan}
        onAddAIReport={addAIReport}
        onSelectExams={handleSelectExams}
        externalMessage={externalMessage}
        onClearExternalMessage={() => setExternalMessage(null)}
      />
    </div>
  );
}
