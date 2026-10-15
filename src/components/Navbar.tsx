import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { TabType, UserRole } from '../types/dentalverse';
import { 
  Sparkles, Volume2, VolumeX, Flame, Shield, 
  ChevronDown, LogOut, User, BarChart3, Database, BookOpen, Camera, FileText
} from 'lucide-react';
import { playClickSfx } from '../utils/audio';

export const Navbar: React.FC = () => {
  const { 
    currentTab, 
    setCurrentTab, 
    currentUser, 
    switchUserRole, 
    loginWithGoogle,
    logout,
    xp, 
    level, 
    streak, 
    soundEnabled, 
    setSoundEnabled 
  } = useGame();

  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const handleNav = (tab: TabType) => {
    playClickSfx(!soundEnabled);
    setCurrentTab(tab);
    setIsAccountMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isStaffOrAdmin = currentUser.role === 'super_admin' || currentUser.role === 'admin' || currentUser.role === 'kader' || currentUser.role === 'viewer';

  const navLinks: { id: TabType; label: string; icon?: string }[] = [
    { id: 'home', label: 'Beranda' },
    { id: 'learning-modules', label: 'Modul Bertahap' },
    { id: 'brush-cam', label: 'Brush Cam' },
    { id: 'quiz', label: 'Kuis Evaluasi' },
    { id: 'my-report', label: 'Rapor Saya' },
    { id: 'games', label: 'Arcade Games' },
    ...(isStaffOrAdmin ? [
      { id: 'admin-database' as TabType, label: 'Database' },
      { id: 'analytics-summary' as TabType, label: 'Rekap Data' }
    ] : [])
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100/90 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0"
        >
          <span className="text-2xl transform group-hover:rotate-12 transition-transform duration-200">🦷</span>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black font-display tracking-tight bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent leading-none">
              DENTALVERSE
            </span>
            <span className="text-[10px] font-bold text-teal-700 tracking-wider">KIDS ADVENTURE</span>
          </div>
        </button>

        {/* Clean Nav Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-bold text-slate-600">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`relative py-1.5 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-sky-600 font-black'
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

        {/* Right Action Icons & Google Account Menu */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Daily Streak */}
          <div
            title={`${streak} Hari Beruntun Merawat Gigi!`}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-600 text-xs font-bold"
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span className="tabular-nums">{streak}d</span>
          </div>

          {/* Level / XP Pill */}
          <button
            onClick={() => handleNav('achievements')}
            title="Klik untuk melihat Badge & Pencapaian"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 font-black text-xs shadow-xs hover:brightness-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-950" />
            <span>Lv.{level}</span>
            <span className="opacity-40">|</span>
            <span className="tabular-nums">{xp} XP</span>
          </button>

          {/* Audio Mute/Unmute */}
          <button
            onClick={() => setSoundEnabled(prev => !prev)}
            aria-label={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-sky-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Google Account Profile Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className="flex items-center gap-1.5 p-1 pl-2 pr-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all text-left"
            >
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-500 to-teal-400 text-white flex items-center justify-center text-xs font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-[11px] font-bold text-slate-900 leading-tight truncate max-w-[110px]">
                  {currentUser.name}
                </span>
                <span className="text-[9px] font-bold text-teal-700 uppercase">
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isAccountMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border-2 border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {currentUser.email}
                      </div>
                    </div>
                  </div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
                    Peran: {currentUser.role}
                  </span>
                </div>

                {/* Role Switcher for Testing & Demonstration */}
                <div className="mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Ganti Peran Uji Coba (RBAC):
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => switchUserRole('super_admin')}
                      className={`p-1.5 rounded-xl text-[10px] font-bold border transition-colors ${
                        currentUser.role === 'super_admin' ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      👑 Super Admin
                    </button>
                    <button
                      onClick={() => switchUserRole('admin')}
                      className={`p-1.5 rounded-xl text-[10px] font-bold border transition-colors ${
                        currentUser.role === 'admin' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      🛡️ Admin
                    </button>
                    <button
                      onClick={() => switchUserRole('kader')}
                      className={`p-1.5 rounded-xl text-[10px] font-bold border transition-colors ${
                        currentUser.role === 'kader' ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      🤝 Kader
                    </button>
                    <button
                      onClick={() => switchUserRole('user')}
                      className={`p-1.5 rounded-xl text-[10px] font-bold border transition-colors ${
                        currentUser.role === 'user' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      🧒 Siswa/Anak
                    </button>
                    <button
                      onClick={() => switchUserRole('viewer')}
                      className={`col-span-2 p-1.5 rounded-xl text-[10px] font-bold border transition-colors ${
                        currentUser.role === 'viewer' ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      👁️ Viewer / Pemantau Dinas
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <button
                    onClick={() => handleNav('my-report')}
                    className="w-full text-left p-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    <span>Rapor & Analisis Saya</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left p-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    <span>Keluar (Logout Akun Gmail)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
