export type TabType = 
  | 'home'
  | 'adventure'
  | 'brush-cam'
  | 'smile-scan'
  | 'brushing-lab'
  | 'games'
  | 'tooth-world'
  | 'clinic'
  | 'library'
  | 'quiz'
  | 'achievements';

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

export interface ToothInfo {
  id: string;
  name: string;
  aka: string;
  count: string;
  role: string;
  superpower: string;
  description: string;
  icon: string;
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
}
