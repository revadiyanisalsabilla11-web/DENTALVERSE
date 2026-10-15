import React, { createContext, useContext, useState, useEffect } from 'react';
import { TabType, Badge, DailyMission, UserProfile, UserRole, SecurityAuditLog } from '../types/dentalverse';
import { INITIAL_USERS, INITIAL_AUDIT_LOGS } from '../data/initialUsers';
import { LEARNING_MODULES } from '../data/learningModules';
import { triggerConfetti } from '../utils/confetti';
import { playStarSfx, playSuccessSfx } from '../utils/audio';

interface SecurityConfirmation {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  isDestructive?: boolean;
  onConfirm: () => void;
}

interface GameContextType {
  // Navigation
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;

  // Auth & Roles
  isAuthenticated: boolean;
  currentUser: UserProfile;
  allUsers: UserProfile[];
  switchUserRole: (role: UserRole) => void;
  loginWithGoogle: (email?: string, name?: string, customRole?: UserRole, details?: Partial<UserProfile>) => void;
  logout: () => void;

  // Sequential Learning & Modules
  completedModules: string[];
  markModuleCompleted: (moduleId: string) => void;
  isModuleUnlocked: (moduleNumber: number) => boolean;
  isQuizUnlocked: boolean;

  // Gamification & XP
  xp: number;
  level: number;
  levelProgress: number;
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

  // Pre & Post Test Scores
  saveQuizScore: (score: number, type?: 'pre' | 'post') => void;
  markBrushCamCompleted: (rating?: number) => void;

  // Database Management (Admin / Super Admin / Kader)
  addUser: (userData: Omit<UserProfile, 'id'>) => void;
  updateUser: (id: string, updates: Partial<UserProfile>) => void;
  deleteUser: (id: string) => void;

  // Security & Audit
  auditLogs: SecurityAuditLog[];
  requestConfirmation: (options: {
    title: string;
    message: string;
    confirmLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }) => void;
  confirmationDialog: SecurityConfirmation | null;
  closeConfirmation: () => void;

  // Celebrations & Popups
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
    unlocked: true,
    rarity: 'epic'
  },
  {
    id: 'smart-brusher',
    name: 'Smart Brusher',
    icon: '📷',
    description: 'Lakukan Smile Scan pertama untuk memeriksa senyum ceriamu!',
    unlocked: true,
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
    description: 'Jelajahi seluruh zona Tooth World dan selesaikan modul anatomi gigi!',
    unlocked: true,
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
    id: 'mission-learning',
    title: 'Selesaikan 1 Modul Pembelajaran Bertahap',
    xpReward: 80,
    completed: false,
    icon: '📚',
    actionTab: 'learning-modules'
  },
  {
    id: 'mission-brush-cam',
    title: 'Sikat gigi berdampingan tutorial Brush Cam',
    xpReward: 100,
    completed: false,
    icon: '🎥',
    actionTab: 'brush-cam'
  },
  {
    id: 'mission-quiz',
    title: 'Kerjakan Post-Test Evaluasi Pengetahuan Gigi',
    xpReward: 90,
    completed: false,
    icon: '🧠',
    actionTab: 'quiz'
  },
  {
    id: 'mission-report',
    title: 'Cek Rapor Hasil Belajar & Simpan Berkas',
    xpReward: 50,
    completed: false,
    icon: '📄',
    actionTab: 'my-report'
  }
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<TabType>('home');

  // Mandatory Gmail Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('dentalverse_auth_logged_in') === 'true';
  });

  // Database of users
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('dentalverse_all_users_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  // Current active user (default to Revadiyani Salsabilla - Super Admin)
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedId = localStorage.getItem('dentalverse_active_user_id');
    if (savedId) {
      const match = allUsers.find(u => u.id === savedId);
      if (match) return match;
    }
    return allUsers[0] || INITIAL_USERS[0];
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>(() => {
    const saved = localStorage.getItem('dentalverse_audit_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_AUDIT_LOGS;
      }
    }
    return INITIAL_AUDIT_LOGS;
  });

  // Sound settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);

  // Gamification state derived/synced with active user
  const [xp, setXp] = useState<number>(() => currentUser.totalXp || 450);
  const [streak, setStreak] = useState<number>(() => currentUser.streakDays || 5);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>(INITIAL_MISSIONS);

  // Security confirmation state
  const [confirmationDialog, setConfirmationDialog] = useState<SecurityConfirmation | null>(null);

  // Celebration state
  const [celebration, setCelebration] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    xpEarned: number;
    badgeName?: string;
  } | null>(null);

  // Sync users to storage
  useEffect(() => {
    localStorage.setItem('dentalverse_all_users_v2', JSON.stringify(allUsers));
  }, [allUsers]);

  // Sync active user ID
  useEffect(() => {
    localStorage.setItem('dentalverse_active_user_id', currentUser.id);
    setXp(currentUser.totalXp);
    setStreak(currentUser.streakDays);
  }, [currentUser]);

  // Sync audit logs
  useEffect(() => {
    localStorage.setItem('dentalverse_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Calculate Level
  const level = Math.max(1, Math.floor(xp / 100) + 1);
  const levelProgress = Math.min(100, xp % 100);

  // Add Security Audit Log helper
  const addAuditLog = (action: SecurityAuditLog['action'], targetUser: string, details: string) => {
    const newLog: SecurityAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action,
      targetUser,
      details
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  // Helper to update current user state and keep allUsers in sync
  const updateActiveUserFields = (updates: Partial<UserProfile>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updates };
      setAllUsers(users => users.map(u => (u.id === prev.id ? updated : u)));
      return updated;
    });
  };

  // Sequential Learning helpers
  const completedModules = currentUser.modulesCompleted || [];

  const markModuleCompleted = (moduleId: string) => {
    if (!completedModules.includes(moduleId)) {
      const updated = [...completedModules, moduleId];
      const xpBonus = 60;
      const newXp = xp + xpBonus;
      setXp(newXp);
      updateActiveUserFields({
        modulesCompleted: updated,
        totalXp: newXp
      });
      playStarSfx(!soundEnabled);
      triggerRewardPopup(
        '🎉 MODUL BERHASIL DISELESAIKAN!',
        'Pengetahuan kesehatan gigimu semakin bertambah! Lanjutkan ke materi berikutnya.',
        xpBonus
      );
    }
  };

  const isModuleUnlocked = (moduleNumber: number): boolean => {
    if (moduleNumber === 1) return true;
    const prevModuleId = `mod-${moduleNumber - 1}`;
    return completedModules.includes(prevModuleId);
  };

  // The quiz is unlocked once the user has completed at least 2 modules
  const isQuizUnlocked = completedModules.length >= 2;

  const saveQuizScore = (score: number, type: 'pre' | 'post' = 'post') => {
    if (type === 'pre') {
      updateActiveUserFields({ preTestScore: score });
    } else {
      updateActiveUserFields({ postTestScore: score });
      completeMission('mission-quiz');
    }
  };

  const markBrushCamCompleted = (rating = 5) => {
    updateActiveUserFields({
      brushCamCompleted: true,
      brushCamRating: rating
    });
    unlockBadge('brush-master');
    completeMission('mission-brush-cam');
  };

  // Switch role quickly for evaluator convenience
  const switchUserRole = (targetRole: UserRole) => {
    const existing = allUsers.find(u => u.role === targetRole);
    if (existing) {
      setCurrentUser(existing);
    } else {
      // create or switch role
      const updated: UserProfile = {
        ...currentUser,
        role: targetRole,
        name: targetRole === 'super_admin' ? 'Revadiyani Salsabilla' : `Pengguna Role ${targetRole}`
      };
      setCurrentUser(updated);
      setAllUsers(prev => prev.map(u => (u.id === currentUser.id ? updated : u)));
    }
  };

  // Gmail / Google Login
  const loginWithGoogle = (
    email = 'revadiyanisalsabilla11@gmail.com',
    name = 'Revadiyani Salsabilla',
    customRole?: UserRole,
    details?: Partial<UserProfile>
  ) => {
    let match = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!match) {
      const determinedRole: UserRole = customRole || (
        email.toLowerCase().includes('admin') || email.toLowerCase() === 'revadiyanisalsabilla11@gmail.com'
          ? 'super_admin'
          : email.toLowerCase().includes('kader')
          ? 'kader'
          : email.toLowerCase().includes('evaluator') || email.toLowerCase().includes('viewer')
          ? 'viewer'
          : 'user'
      );

      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: name || email.split('@')[0],
        email,
        role: determinedRole,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        age: details?.age || 9,
        schoolGrade: details?.schoolGrade || 'Kelas 3 SD',
        region: details?.region || 'Posyandu Melati',
        preTestScore: details?.preTestScore ?? 60,
        postTestScore: details?.postTestScore ?? 0,
        modulesCompleted: details?.modulesCompleted || [],
        brushCamCompleted: false,
        brushCamRating: 0,
        streakDays: 1,
        totalXp: 100,
        lastActive: new Date().toISOString().replace('T', ' ').substring(0, 16),
        cadreNotes: ''
      };
      setAllUsers(prev => [newUser, ...prev]);
      match = newUser;
    }
    setCurrentUser(match);
    setIsAuthenticated(true);
    localStorage.setItem('dentalverse_auth_logged_in', 'true');
    localStorage.setItem('dentalverse_active_user_id', match.id);
    addAuditLog('CREATE', match.name, `Pengguna berhasil login via Akun Google Gmail (${match.email})`);
    playSuccessSfx(!soundEnabled);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('dentalverse_auth_logged_in');
    localStorage.removeItem('dentalverse_active_user_id');
    addAuditLog('UPDATE', currentUser.name, `Pengguna (${currentUser.email}) telah keluar / logout`);
  };

  // CRUD for Database
  const addUser = (userData: Omit<UserProfile, 'id'>) => {
    const newId = `user-${Date.now()}`;
    const fullUser: UserProfile = {
      ...userData,
      id: newId,
      lastActive: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setAllUsers(prev => [fullUser, ...prev]);
    addAuditLog('CREATE', fullUser.name, `Menambahkan pengguna baru (${fullUser.role}) di wilayah ${fullUser.region}`);
  };

  const updateUser = (id: string, updates: Partial<UserProfile>) => {
    const target = allUsers.find(u => u.id === id);
    if (!target) return;

    setAllUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updates } : u)));
    if (currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, ...updates }));
    }
    addAuditLog('UPDATE', target.name, `Memperbarui data: ${Object.keys(updates).join(', ')}`);
  };

  const deleteUser = (id: string) => {
    const target = allUsers.find(u => u.id === id);
    if (!target) return;

    setAllUsers(prev => prev.filter(u => u.id !== id));
    addAuditLog('DELETE', target.name, `Menghapus akun pengguna (${target.email})`);
  };

  // Security confirmation modal handler
  const requestConfirmation = (options: {
    title: string;
    message: string;
    confirmLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }) => {
    setConfirmationDialog({
      isOpen: true,
      title: options.title,
      message: options.message,
      confirmLabel: options.confirmLabel || 'Ya, Lanjutkan',
      isDestructive: options.isDestructive ?? true,
      onConfirm: () => {
        options.onConfirm();
        setConfirmationDialog(null);
      }
    });
  };

  const closeConfirmation = () => {
    setConfirmationDialog(null);
  };

  // Gamification helpers
  const addXP = (amount: number) => {
    const nextXp = xp + amount;
    setXp(nextXp);
    updateActiveUserFields({ totalXp: nextXp });
    playStarSfx(!soundEnabled);
  };

  const unlockBadge = (badgeId: string) => {
    setBadges(prev =>
      prev.map(b =>
        b.id === badgeId
          ? { ...b, unlocked: true, unlockedAt: new Date().toLocaleDateString('id-ID') }
          : b
      )
    );
  };

  const completeMission = (missionId: string) => {
    setDailyMissions(prev => {
      const match = prev.find(m => m.id === missionId);
      if (match && !match.completed) {
        addXP(match.xpReward);
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
        isAuthenticated,
        currentUser,
        allUsers,
        switchUserRole,
        loginWithGoogle,
        logout,
        completedModules,
        markModuleCompleted,
        isModuleUnlocked,
        isQuizUnlocked,
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
        saveQuizScore,
        markBrushCamCompleted,
        addUser,
        updateUser,
        deleteUser,
        auditLogs,
        requestConfirmation,
        confirmationDialog,
        closeConfirmation,
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
