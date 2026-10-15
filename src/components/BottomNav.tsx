import React from 'react';
import { useGame } from '../context/GameContext';
import { TabType } from '../types/dentalverse';
import { Home, BookOpen, Camera, Brain, FileText, Database } from 'lucide-react';
import { playClickSfx } from '../utils/audio';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, currentUser, soundEnabled } = useGame();

  const handleNav = (tab: TabType) => {
    playClickSfx(!soundEnabled);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isStaff = currentUser.role === 'super_admin' || currentUser.role === 'admin' || currentUser.role === 'kader';

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Beranda', icon: <Home className="w-5 h-5" /> },
    { id: 'learning-modules', label: 'Modul', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'brush-cam', label: 'Brush Cam', icon: <Camera className="w-5 h-5" /> },
    { id: 'quiz', label: 'Kuis', icon: <Brain className="w-5 h-5" /> },
    { id: isStaff ? 'admin-database' : 'my-report', label: isStaff ? 'Database' : 'Rapor', icon: isStaff ? <Database className="w-5 h-5" /> : <FileText className="w-5 h-5" /> }
  ];

  return (
    <nav className="print:hidden lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all ${
                isActive
                  ? 'text-sky-600 font-bold scale-105'
                  : 'text-slate-500 hover:text-sky-600'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-sky-100 text-sky-600' : ''
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
