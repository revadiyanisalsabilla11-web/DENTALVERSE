import React, { createContext, useContext, useState, useEffect } from 'react';
import { TabType, Badge, DailyMission } from '../types/dentalverse';
import { triggerConfetti } from '../utils/confetti';
import { playStarSfx, playSuccessSfx } from '../utils/audio';

interface GameContextType {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  xp: number;
  level: number;
  levelProgress: number; // 0 to 100%
  streak: number;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  badges: Badge[];
  dailyMissions: DailyMission[];
  addXP: (amount: number, reason?: string) => void;
  unlockBadge: (badgeId: string) => void;
  completeMission: (missionId: string) => void;
  celebration: {
    isOpen: boolean;
    title: string;
    message: string;
    xpEarned: number;
    badgeName?: string;
  } | null;
  closeCelebration: () => void;
  triggerRewardPopup: (title: string, message: string, xpEarned: number, badgeName?: string) => void;
}

const INITIAL_BADGES: Badge[] = [
  {
    id: 'brush-master',
    name: 'Brush Master',
    icon: '🪥',
    description: 'Selesaikan tantangan Brush Cam dengan 4 area gigi bersih menyeluruh!',
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'smart-brusher',
    name: 'Smart Brusher',
    icon: '📷',
    description: 'Lakukan Smile Scan pertama untuk memeriksa senyum ceriamu!',
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'food-detective',
    name: 'Food Detective',
    icon: '🍎',
    description: 'Bantu Dental Buddy memisahkan makanan ramah gigi dan makanan bergula!',
    unlocked: false,
    rarity: 'common'
  },
  {
    id: 'germ-fighter',
    name: 'Germ Fighter',
    icon: '🦠',
    description: 'Kalahkan pasukan bakteri plak di mini-game Germ Battle!',
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'dental-explorer',
    name: 'Dental Explorer',
    icon: '🦷',
    description: 'Jelajahi seluruh zona Tooth World dan pelajari rahasia anatomi gigi!',
    unlocked: false,
    rarity: 'common'
  },
  {
    id: 'dental-hero',
    name: 'DENTAL HERO',
    icon: '🏆',
    description: 'Raih Level 5 dan buktikan kamu pahlawan penjaga senyum sehat sejati!',
    unlocked: false,
    rarity: 'legendary'
  }
];

const INITIAL_MISSIONS: DailyMission[] = [
  {
    id: 'mission-brush-cam',
    title: 'Coba sikat gigi dipantau Brush Cam',
    xpReward: 100,
    completed: false,
    icon: '📷',
    actionTab: 'brush-cam'
  },
  {
    id: 'mission-food-detective',
    title: 'Selesaikan 1 ronde Food Detective',
    xpReward: 60,
    completed: false,
    icon: '🍎',
    actionTab: 'games'
  },
  {
    id: 'mission-smile-scan',
    title: 'Periksa senyum berkilau dengan Smile Scan',
    xpReward: 50,
    completed: false,
    icon: '✨',
    actionTab: 'smile-scan'
  },
  {
    id: 'mission-quiz',
    title: 'Jawab Quiz Cerdas Gigi Sehat',
    xpReward: 70,
    completed: false,
    icon: '🧠',
    actionTab: 'quiz'
  }
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('dentalverse_xp');
    return saved ? parseInt(saved, 10) : 120; // start with encouraging initial points
  });
  const [streak] = useState<number>(() => {
    const saved = localStorage.getItem('dentalverse_streak');
    return saved ? parseInt(saved, 10) : 3;
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('dentalverse_badges');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_BADGES;
      }
    }
    return INITIAL_BADGES;
  });

  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>(() => {
    const saved = localStorage.getItem('dentalverse_missions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MISSIONS;
      }
    }
    return INITIAL_MISSIONS;
  });

  const [celebration, setCelebration] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    xpEarned: number;
    badgeName?: string;
  } | null>(null);

  // Sync XP to localStorage
  useEffect(() => {
    localStorage.setItem('dentalverse_xp', xp.toString());
  }, [xp]);

  // Sync Badges
  useEffect(() => {
    localStorage.setItem('dentalverse_badges', JSON.stringify(badges));
  }, [badges]);

  // Sync Missions
  useEffect(() => {
    localStorage.setItem('dentalverse_missions', JSON.stringify(dailyMissions));
  }, [dailyMissions]);

  // Level calculations: every 100 XP is a level
  const level = Math.max(1, Math.floor(xp / 100) + 1);
  const levelProgress = Math.min(100, xp % 100);

  // Check legendary badge if level >= 5
  useEffect(() => {
    if (level >= 5) {
      unlockBadge('dental-hero');
    }
  }, [level]);

  const addXP = (amount: number) => {
    setXp(prev => prev + amount);
    playStarSfx(!soundEnabled);
  };

  const unlockBadge = (badgeId: string) => {
    setBadges(prev => {
      const exists = prev.find(b => b.id === badgeId);
      if (exists && !exists.unlocked) {
        return prev.map(b =>
          b.id === badgeId ? { ...b, unlocked: true, unlockedAt: new Date().toLocaleDateString('id-ID') } : b
        );
      }
      return prev;
    });
  };

  const completeMission = (missionId: string) => {
    setDailyMissions(prev => {
      const found = prev.find(m => m.id === missionId);
      if (found && !found.completed) {
        addXP(found.xpReward);
        return prev.map(m => (m.id === missionId ? { ...m, completed: true } : m));
      }
      return prev;
    });
  };

  const triggerRewardPopup = (
    title: string,
    message: string,
    xpEarned: number,
    badgeName?: string
  ) => {
    triggerConfetti();
    playSuccessSfx(!soundEnabled);
    if (xpEarned > 0) {
      addXP(xpEarned);
    }
    setCelebration({
      isOpen: true,
      title,
      message,
      xpEarned,
      badgeName
    });
  };

  const closeCelebration = () => {
    setCelebration(null);
  };

  return (
    <GameContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        xp,
        level,
        levelProgress,
        streak,
        soundEnabled,
        setSoundEnabled,
        voiceEnabled,
        setVoiceEnabled,
        badges,
        dailyMissions,
        addXP,
        unlockBadge,
        completeMission,
        celebration,
        closeCelebration,
        triggerRewardPopup
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
