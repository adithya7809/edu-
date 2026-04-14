import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles, Calendar, Target, BookOpen, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Exam, Chapter, Goal, Milestone, SiteSettings, Resource, Quiz, StudyPlan, AIReport } from '../types';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface AIChatBoxProps {
  exams: Exam[];
  onAddGoal: (examId: string, text: string) => Promise<void>;
  onToggleGoal: (goalId: string) => Promise<void>;
  onSetChapterTask: (examId: string, subjectId: string, chapterId: string, taskKey: keyof Chapter, value: boolean) => Promise<void>;
  onAddMilestone?: (examId: string, milestone: Omit<Milestone, 'id'>) => Promise<void>;
  onUpdateSettings?: (settings: Partial<SiteSettings>) => Promise<void>;
  onSaveResource?: (resource: Omit<Resource, 'id' | 'createdAt'>) => Promise<void>;
  onAddQuiz?: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => Promise<void>;
  onAddStudyPlan?: (plan: Omit<StudyPlan, 'id' | 'createdAt'>) => Promise<void>;
  onAddAIReport?: (report: Omit<AIReport, 'id' | 'createdAt'>) => Promise<void>;
  onSelectExams?: (examIds: string[]) => Promise<void>;
  externalMessage?: string | null;
  onClearExternalMessage?: () => void;
}

export const AIChatBox: React.FC<AIChatBoxProps> = ({ 
  exams, 
  onAddGoal, 
  onToggleGoal, 
  onSetChapterTask,
  onAddMilestone,
  onUpdateSettings,
  onSaveResource,
  onAddQuiz,
  onAddStudyPlan,
  onAddAIReport,
  onSelectExams,
  externalMessage,
  onClearExternalMessage
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('examscmd_chat_history');
    return saved ? JSON.parse(saved) : [
      { role: 'model', content: "AI Commander active. How can I assist your prep?" }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 340, height: 480 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (externalMessage) {
      setIsOpen(true);
      setIsMinimized(false);
      setInput(externalMessage);
      onClearExternalMessage?.();
    }
  }, [externalMessage]);

  useEffect(() => {
    if (isOpen && input === externalMessage && input !== '' && !isLoading) {
      handleSend();
    }
  }, [isOpen, input, externalMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    // Save chat history to localStorage
    localStorage.setItem('examscmd_chat_history', JSON.stringify(messages));
  }, [messages]);

  const clearHistory = () => {
    const initialMessage: Message[] = [
      { role: 'model', content: "AI Commander active. How can I assist your prep?" }
    ];
    setMessages(initialMessage);
    localStorage.setItem('examscmd_chat_history', JSON.stringify(initialMessage));
  };

  // Resizing logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeRef.current) return;
      const newWidth = Math.max(280, window.innerWidth - e.clientX - 24);
      const newHeight = Math.max(300, window.innerHeight - e.clientY - 100);
      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    const startResizing = (e: React.MouseEvent) => {
      e.preventDefault();
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };

    if (resizeRef.current) {
      resizeRef.current.onmousedown = (e: any) => startResizing(e);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Prepare context about the app
      const systemInstruction = `
        You are the AI Commander for ExamsCmd, a high-performance study tracking application.
        
        CRITICAL: Your mission is to help the user manage their entire exam preparation through this chat interface.
        You can "make changes to the website" by outputting specific [ACTION: ...] blocks.
        
        STYLE GUIDELINES:
        - Be concise, technical, and encouraging.
        - Use ### Headers for main sections.
        - Use **bold text** for key terms and dates.
        - Use bulleted lists for all lists.
        - Use horizontal rules ( --- ) to separate distinct parts.
        
        CAPABILITIES (Website Changes):
        1. **Manage Goals**: Add or toggle goals for any exam.
        2. **Schedule Milestones**: Add revision, mock tests, or exam dates to the calendar.
        3. **Update Progress**: Mark theory, DPP, or tests as done for any chapter.
        4. **Generate Content**: Create mock tests, study plans, and performance reports.
        5. **Tweak UI**: Change the site name or welcome message.
        6. **Select Exams**: Change which exams are currently tracked on the dashboard.
        
        CURRENT APP STATE:
        Exams: ${exams.map(e => `
          ${e.name} (ID: ${e.id}, Short: ${e.shortName}) 
          - Target Date: ${e.targetDate}
          - Progress: ${e.overallProgress}%
          - Syllabus: ${e.subjects.map(s => `
            ${s.name} (ID: ${s.id}): ${s.chapters.map(c => `${c.name} (ID: ${c.id}, Priority: ${c.priority}, Weight: ${c.weightage}, Theory: ${c.theory ? 'Done' : 'Pending'}, DPP: ${c.dpp ? 'Done' : 'Pending'})`).join(', ')}
          `).join('; ')}
        `).join('\n')}
        Goals: ${exams.flatMap(e => e.goals.map(g => `${e.shortName}: ${g.text} (${g.completed ? 'Done' : 'Pending'}, ID: ${g.id})`)).join(', ')}
        
        ACTION BLOCKS (Include at the end of your response):
        - [ACTION: {"type": "add_goal", "examId": "...", "text": "..."}]
        - [ACTION: {"type": "toggle_goal", "goalId": "..."}]
        - [ACTION: {"type": "add_milestone", "examId": "...", "text": "...", "date": "YYYY-MM-DD", "milestoneType": "revision"}]
        - [ACTION: {"type": "update_site_settings", "siteName": "...", "welcomeMessage": "..."}]
        - [ACTION: {"type": "save_resource", "title": "...", "content": "...", "resourceType": "note"}]
        - [ACTION: {"type": "create_quiz", "title": "...", "description": "...", "quizType": "practice|mock-test", "questions": [{"text": "...", "options": ["...", "..."], "correctAnswer": 0}]}]
        - [ACTION: {"type": "save_study_plan", "examId": "...", "title": "...", "description": "...", "dailyTasks": [{"day": 1, "tasks": ["..."]}]}]
        - [ACTION: {"type": "save_ai_report", "examId": "...", "title": "...", "content": "...", "analysis": {"strengths": ["..."], "weaknesses": ["..."], "recommendations": ["..."]}}]
        - [ACTION: {"type": "update_chapter_progress", "examId": "...", "subjectId": "...", "chapterId": "...", "taskKey": "theory|dpp|chapterTest|revision1|revision2", "value": true|false}]
        - [ACTION: {"type": "select_exams", "examIds": ["..."]}]
        
        CRITICAL RULES FOR ACTION BLOCKS:
        1. ALWAYS include the FULL [ACTION: ...] block at the VERY END of your response.
        2. The JSON inside the block MUST be valid and complete. Never truncate the JSON.
        3. If you generate a 20-question mock test, ensure the JSON contains ALL 20 questions.
        4. Do NOT use markdown code blocks (\`\`\`json) for the action block.
        5. The action block MUST start with "[ACTION: " and end with "]".
        6. To save tokens for the JSON, keep your conversational response brief and focused.
        
        Example of a correct Mock Test Action:
        [ACTION: {"type": "create_quiz", "title": "Physics Mock", "description": "Full syllabus", "quizType": "mock-test", "questions": [{"text": "Q1", "options": ["A", "B", "C", "D"], "correctAnswer": 0}, ... (all 20 questions) ...]}]
        
        IMPORTANT: If the user asks to "change the website" or "update my progress", identify the correct IDs from the state above and issue the action.
      `;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({
            role: m.role === 'model' ? 'assistant' : 'user',
            content: m.content
          })).concat([{ role: 'user', content: userMessage }]),
          systemInstruction: systemInstruction
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from AI Function');
      }

      const data = await response.json();
      const content = data.text;
      if (content) {
        console.log('AI Response received, length:', content.length);
        
        // Robust action parsing using bracket counting
        const actionMarker = '[ACTION:';
        let searchIndex = 0;
        let hasActions = false;

        while (true) {
          const startIndex = content.indexOf(actionMarker, searchIndex);
          if (startIndex === -1) break;

          let depth = 1;
          let endIndex = -1;
          const jsonStart = startIndex + actionMarker.length;

          for (let i = jsonStart; i < content.length; i++) {
            if (content[i] === '[') depth++;
            else if (content[i] === ']') {
              depth--;
              if (depth === 0) {
                endIndex = i;
                break;
              }
            }
          }

          if (endIndex !== -1) {
            hasActions = true;
            searchIndex = endIndex + 1;
            try {
              setIsProcessingAction(true);
              let jsonStr = content.substring(jsonStart, endIndex).trim();
              console.log('Attempting to parse action JSON:', jsonStr.substring(0, 100) + '...');
              
              // Basic cleanup for common AI mistakes
              if (jsonStr.endsWith(',') || jsonStr.endsWith(',}')) {
                jsonStr = jsonStr.replace(/,(\s*[}\]])$/, '$1');
              }
              
              const action = JSON.parse(jsonStr);
              console.log('Parsed action type:', action.type);
              let actionName = '';
            
            if (action.type === 'add_goal') {
              actionName = 'Goal Added';
              await onAddGoal(action.examId, action.text);
            } else if (action.type === 'toggle_goal') {
              actionName = 'Goal Updated';
              await onToggleGoal(action.goalId);
            } else if (action.type === 'add_milestone') {
              actionName = 'Milestone Added';
              await onAddMilestone?.(action.examId, { 
                text: action.text, 
                date: action.date, 
                type: action.milestoneType as any 
              });
            } else if (action.type === 'update_site_settings') {
              actionName = 'Settings Updated';
              await onUpdateSettings?.({
                siteName: action.siteName,
                welcomeMessage: action.welcomeMessage
              });
            } else if (action.type === 'save_resource') {
              actionName = 'Resource Saved';
              await onSaveResource?.({
                title: action.title,
                content: action.content,
                type: action.resourceType as any
              });
            } else if (action.type === 'create_quiz') {
              console.log('Creating quiz action detected:', action);
              actionName = action.quizType === 'mock-test' ? 'Mock Test Created' : 'Quiz Created';
              await onAddQuiz?.({
                title: action.title,
                description: action.description,
                type: (action.quizType as any) || 'practice',
                questions: (action.questions || []).map((q: any) => ({
                  ...q,
                  id: Math.random().toString(36).substr(2, 9)
                }))
              });
              console.log('onAddQuiz called successfully');
            } else if (action.type === 'save_study_plan') {
              actionName = 'Study Plan Saved';
              await onAddStudyPlan?.({
                examId: action.examId,
                title: action.title,
                description: action.description,
                dailyTasks: action.dailyTasks
              });
            } else if (action.type === 'save_ai_report') {
              actionName = 'Report Saved';
              await onAddAIReport?.({
                examId: action.examId,
                title: action.title,
                content: action.content,
                analysis: action.analysis
              });
            } else if (action.type === 'update_chapter_progress') {
              actionName = 'Progress Updated';
              await onSetChapterTask(action.examId, action.subjectId, action.chapterId, action.taskKey, action.value);
            } else if (action.type === 'select_exams') {
              actionName = 'Exams Updated';
              await onSelectExams?.(action.examIds);
            }

            if (actionName) {
              setActionSuccess(actionName);
              setTimeout(() => setActionSuccess(null), 3000);
            }
          } catch (e) {
            console.error('Failed to parse action:', e);
            setActionSuccess('Error: Invalid Action Data');
            setTimeout(() => setActionSuccess(null), 5000);
          } finally {
            setIsProcessingAction(false);
          }
        } else if (depth > 0) {
          // Truncated!
          console.warn('Detected truncated action block');
          setActionSuccess('Error: Response Truncated');
          setTimeout(() => setActionSuccess(null), 5000);
          break;
        } else {
          break;
        }
      }

      // Remove action blocks from display content robustly
      let displayContent = content;
      const actionMarkerForRemoval = '[ACTION:';
      let removalSearchIndex = 0;
      const blocksToRemove: string[] = [];

      while (true) {
        const start = displayContent.indexOf(actionMarkerForRemoval, removalSearchIndex);
        if (start === -1) break;

        let depth = 1;
        let end = -1;
        for (let i = start + actionMarkerForRemoval.length; i < displayContent.length; i++) {
          if (displayContent[i] === '[') depth++;
          else if (displayContent[i] === ']') {
            depth--;
            if (depth === 0) {
              end = i;
              break;
            }
          }
        }

        if (end !== -1) {
          blocksToRemove.push(displayContent.substring(start, end + 1));
          removalSearchIndex = end + 1;
        } else {
          break;
        }
      }

      blocksToRemove.forEach(block => {
        displayContent = displayContent.replace(block, '');
      });
      displayContent = displayContent.trim();

      setMessages(prev => [
        ...prev, 
        { role: 'model', content: displayContent }
      ]);
    } else {
      throw new Error('Invalid response from AI');
    }
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I encountered an error. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          if (isOpen && isMinimized) {
            setIsMinimized(false);
          } else {
            setIsOpen(!isOpen);
          }
        }}
        className="fixed bottom-6 right-6 w-12 h-12 bg-brand-primary rounded-full shadow-2xl flex items-center justify-center z-50 border border-white/20"
      >
        {isOpen ? <Bot className="text-white w-5 h-5" /> : <MessageSquare className="text-white w-5 h-5" />}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-brand-primary rounded-full border-2 border-brand-bg flex items-center justify-center"
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          </motion.div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, x: 0 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              width: isMinimized ? 240 : size.width,
              height: isMinimized ? 48 : size.height
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-6 bg-brand-surface/98 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden z-50"
            style={{ 
              maxWidth: 'calc(100vw - 48px)',
              maxHeight: 'calc(100vh - 120px)'
            }}
          >
            {/* Resize Handle (Top Left) */}
            {!isMinimized && (
              <div 
                ref={resizeRef}
                className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-[60] flex items-center justify-center group"
              >
                <div className="w-1 h-1 bg-white/20 rounded-full group-hover:bg-brand-primary transition-colors" />
              </div>
            )}

            {/* Header */}
            <div 
              className={`px-4 py-3 border-b border-white/5 flex items-center justify-between cursor-pointer select-none ${isMinimized ? 'bg-brand-primary/10' : 'bg-white/[0.02]'}`}
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${isMinimized ? 'bg-brand-primary/20 border-brand-primary/30' : 'bg-white/5 border-white/10'}`}>
                  <Bot className={`w-3.5 h-3.5 ${isMinimized ? 'text-brand-primary' : 'text-white/60'}`} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-[10px] font-bold text-white uppercase tracking-widest leading-none">AI Commander</h3>
                  {!isMinimized && (
                    <span className="text-[8px] font-bold text-emerald-500/80 uppercase tracking-tighter mt-0.5">System Active</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isMinimized && messages.length > 1 && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); clearHistory(); }}
                    className="p-1 text-white/20 hover:text-red-400 transition-colors"
                    title="Clear Chat History"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                  className="p-1 text-white/20 hover:text-white transition-colors"
                >
                  {isMinimized ? <Sparkles className="w-3 h-3" /> : <div className="w-3 h-0.5 bg-current rounded-full" />}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                  className="p-1 text-white/20 hover:text-red-400 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-black/20">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-2 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`p-3 rounded-xl text-xs leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-brand-primary/90 text-white font-medium shadow-lg shadow-brand-primary/10'
                            : 'bg-white/5 text-white/80 border border-white/5'
                        }`}>
                          {msg.role === 'user' ? (
                            msg.content
                          ) : (
                            <div className="markdown-body">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex gap-1">
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 rounded-full bg-brand-primary" />
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 rounded-full bg-brand-primary" />
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 rounded-full bg-brand-primary" />
                      </div>
                    </div>
                  )}

                  {isProcessingAction && (
                    <div className="flex justify-center">
                      <div className="bg-brand-primary/10 border border-brand-primary/20 px-4 py-2 rounded-full flex items-center gap-2">
                        <RefreshCw className="w-3 h-3 text-brand-primary animate-spin" />
                        <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest">Saving to Account...</span>
                      </div>
                    </div>
                  )}

                  {actionSuccess && (
                    <div className="flex justify-center">
                      <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">{actionSuccess}</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                <div className="px-4 py-2 flex gap-1.5 overflow-x-auto scrollbar-hide border-t border-white/5 bg-white/[0.01]">
                  {[
                    { icon: Target, label: 'Goal', text: 'Suggest a study goal' },
                    { icon: BookOpen, label: 'Prep', text: 'Explain a topic' },
                    { icon: Calendar, label: 'Plan', text: 'Check my schedule' }
                  ].map((btn, i) => (
                    <button 
                      key={i}
                      onClick={() => setInput(btn.text)}
                      className="shrink-0 px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 text-[9px] font-bold text-white/40 uppercase tracking-wider flex items-center gap-1.5 transition-all"
                    >
                      <btn.icon className="w-2.5 h-2.5" /> {btn.label}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 bg-white/[0.02] border-t border-white/5">
                  <div className="relative flex items-center gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Command..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/30 transition-all"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="absolute right-1.5 top-1.5 w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3 px-1">
                    <span className="text-[7px] font-bold text-white/10 uppercase tracking-[0.3em]">Hardware v2.0</span>
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-2 h-2 text-brand-primary/40" />
                      <span className="text-[7px] font-bold text-white/10 uppercase tracking-widest">NVIDIA Llama 3.1</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
