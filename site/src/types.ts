export interface Chapter {
  id: string;
  name: string;
  weightage: string;
  priority: 1 | 2 | 3 | 4;
  theory: boolean;
  dpp: boolean;
  chapterTest: boolean;
  revision1: boolean;
  revision2: boolean;
}

export interface Subject {
  id: string;
  name: string;
  progress: number;
  chapters: Chapter[];
}

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  examId: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  type: 'practice' | 'mock-test';
  createdAt: string;
}

export interface Resource {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'link' | 'guide';
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  welcomeMessage: string;
  primaryColor: string;
}

export interface Milestone {
  id: string;
  text: string;
  date: string;
  type: 'exam' | 'revision' | 'mock-test';
}

export interface DailyTask {
  day: number;
  tasks: string[];
}

export interface StudyPlan {
  id: string;
  examId: string;
  title: string;
  description: string;
  dailyTasks: DailyTask[];
  createdAt: string;
}

export interface AIReport {
  id: string;
  examId: string;
  title: string;
  content: string;
  analysis: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  text: string;
  date: string;
  type: 'exam' | 'revision' | 'mock-test' | 'custom';
  createdAt: string;
}

export interface Exam {
  id: string;
  name: string;
  shortName: string;
  targetDate: string;
  overallProgress: number;
  priority: number;
  subjects: Subject[];
  goals: Goal[];
  milestones?: Milestone[];
  quizzes?: Quiz[];
  studyPlans?: StudyPlan[];
  aiReports?: AIReport[];
}
