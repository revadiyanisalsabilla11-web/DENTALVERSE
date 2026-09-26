import React from 'react';
import { useGame } from '../context/GameContext';
import { TabType } from '../types/dentalverse';
import { Sparkles, Volume2, VolumeX, Flame } from 'lucide-react';
import { playClickSfx } from '../utils/audio';

export const Navbar: React.FC = () => {
  const { currentTab, setCurrentTab, xp, level, streak, soundEnabled, setSoundEnabled } = useGame();

  const handleNav = (tab: TabType) => {
    playClickSfx(!soundEnabled);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks: { id: TabType; label: string }[] = [
    { id: 'home', label: 'Beranda' },
    { id: 'adventure', label: 'Peta Petualangan' },
    { id: 'brush-cam', label: 'Brush Cam' },
    { id: 'brushing-lab', label: 'Lab Sikat 3D' },
    { id: 'games', label: 'Mini Games' },
    { id: 'library', label: 'Perpustakaan Gigi' },
    { id: 'quiz', label: 'Quiz Seru' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-sky-100/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <span className="text-2xl transform group-hover:rotate-12 transition-transform duration-200">🦷</span>
          <span className="text-xl sm:text-2xl font-black font-display tracking-tight bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
            DENTALVERSE
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`relative py-1.5 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-sky-600 font-bold'
                    : 'text-slate-600 hover:text-sky-600'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (Level/XP & Audio toggle) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Daily Streak Indicator */}
          <div
            title={`${streak} Hari Beruntun Merawat Gigi!`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-600 text-xs font-bold shadow-xs"
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-pulse" />
            <span className="tabular-nums">{streak} Hari</span>
          </div>

          {/* Level & XP Badge */}
          <button
            onClick={() => handleNav('achievements')}
            title="Klik untuk lihat Badge & Pencapaianmu"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 font-bold text-xs sm:text-sm shadow-sm hover:brightness-105 transition-all transform active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-900" />
            <span>Lv. <span className="tabular-nums">{level}</span></span>
            <span className="opacity-40">|</span>
            <span className="text-amber-950 font-black tabular-nums">{xp} XP</span>
          </button>

          {/* Audio Toggle */}
          <button
            onClick={() => setSoundEnabled(prev => !prev)}
            aria-label={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-sky-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
