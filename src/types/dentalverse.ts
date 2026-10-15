export type TabType = 
  | 'home'
  | 'adventure'
  | 'learning-modules'
  | 'brush-cam'
  | 'smile-scan'
  | 'brushing-lab'
  | 'games'
  | 'quiz'
  | 'my-report'
  | 'achievements'
  | 'admin-database'
  | 'analytics-summary'
  | 'tooth-world'
  | 'clinic'
  | 'library';

export type UserRole = 'super_admin' | 'admin' | 'kader' | 'user' | 'viewer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  age: number;
  schoolGrade: string; // e.g. "Kelas 3 SD"
  region: string; // e.g. "Posyandu Melati / Jakarta Selatan"
  preTestScore: number; // 0 - 100
  postTestScore: number; // 0 - 100
  modulesCompleted: string[]; // module IDs
  brushCamCompleted: boolean;
  brushCamRating: number; // 1 - 5 stars
  streakDays: number;
  totalXp: number;
  lastActive: string;
  cadreNotes?: string;
}

export interface LearningModule {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  color: string;
  durationMinutes: number;
  content: {
    summary: string;
    keyPoints: string[];
    deepDive: string;
    funFact: string;
    audioText: string;
  };
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'ROLE_CHANGE' | 'RESET_PROGRESS';
  targetUser: string;
  details: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface DailyMission {
  id: string;
  title: string;
  xpReward: number;
  completed: boolean;
  icon: string;
  actionTab: TabType;
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'friend' | 'limit';
  emoji: string;
  fact: string;
  color: string;
}

export interface ClinicTool {
  id: string;
  name: string;
  friendlyName: string;
  purpose: string;
  funFact: string;
  icon: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tip: string;
  category: string;
}
