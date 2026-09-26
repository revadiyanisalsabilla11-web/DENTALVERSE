import React from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Award, Flame, Sparkles, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { playClickSfx } from '../utils/audio';

export const AchievementsView: React.FC = () => {
  const { xp, level, levelProgress, streak, badges, dailyMissions, setCurrentTab, soundEnabled } = useGame();

  const handleGoMission = (tab: any) => {
    playClickSfx(!soundEnabled);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 mb-3">
          <Trophy className="w-4 h-4 text-amber-600" />
          <span className="text-xs sm:text-sm font-bold text-amber-800 uppercase tracking-wider">
            DENTAL HERO HEADQUARTERS
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 tracking-tight mb-2">
          Pusat Gelar, Badge & Hadiahmu!
        </h2>
        <p className="text-sm sm:text-base text-slate-600 font-medium">
          Setiap misi sikat gigi dan permainan edukasi membuatmu naik tingkat menuju Pahlawan Senyum Sejati.
        </p>
      </div>

      {/* Hero Level & XP Showcase Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border-4 border-slate-800 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Level Badge Mascot */}
          <div className="lg:col-span-4 flex flex-col items-center text-center">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-1 shadow-2xl mb-3 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[22px] flex flex-col items-center justify-center p-2">
                <span className="text-3xl sm:text-4xl mb-1">👑</span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Level</span>
                <span className="text-3xl font-black text-white tabular-nums">{level}</span>
              </div>
            </div>
            <h3 className="text-xl font-bold font-display text-white">
              {level >= 5 ? '🌟 DENTAL HERO MAHA BINTANG' : `DENTAL HERO LEVEL 0${level}`}
            </h3>
            <span className="text-xs text-sky-300 font-semibold mt-0.5">
              {unlockedCount} dari {badges.length} Badge Terbuka
            </span>
          </div>

          {/* Level Progress Bar & Stats */}
          <div className="lg:col-span-8 space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-2">
                <span className="text-teal-300 tracking-wider">
                  PROGRESS LEVEL BERIKUTNYA
                </span>
                <span className="text-amber-400 tabular-nums font-mono">
                  {levelProgress}% Menuju Level {level + 1}
                </span>
              </div>

              {/* Progress bar as requested in prompt */}
              <div className="w-full h-5 bg-slate-800 rounded-full overflow-hidden p-1 border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 via-sky-400 to-amber-400 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Total XP</span>
                </div>
                <span className="text-xl font-black text-amber-400 tabular-nums">{xp} XP</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mb-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>Daily Streak</span>
                </div>
                <span className="text-xl font-black text-orange-400 tabular-nums">{streak} Hari</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mb-1">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Piala Badge</span>
                </div>
                <span className="text-xl font-black text-emerald-400 tabular-nums">
                  {unlockedCount}/{badges.length}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 1: BADGES GRID */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold font-display text-slate-800 mb-6 flex items-center gap-2">
          <span>🏅 Koleksi Lencana Kehormatan</span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-teal-50 text-teal-800 border border-teal-200">
            {unlockedCount} Terbuka
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-5 rounded-3xl border-2 transition-all duration-200 ${
                badge.unlocked
                  ? 'bg-white border-amber-300 shadow-md hover:shadow-lg'
                  : 'bg-slate-50 border-slate-200/80 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xs ${
                    badge.unlocked
                      ? 'bg-gradient-to-tr from-amber-300 to-yellow-100 border-2 border-amber-300'
                      : 'bg-slate-200 text-slate-400 border-2 border-slate-300'
                  }`}
                >
                  {badge.unlocked ? badge.icon : <Lock className="w-6 h-6 text-slate-400" />}
                </div>

                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    badge.rarity === 'legendary'
                      ? 'bg-purple-100 text-purple-800'
                      : badge.rarity === 'epic'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-sky-100 text-sky-800'
                  }`}
                >
                  {badge.rarity}
                </span>
              </div>

              <h4 className="text-lg font-bold font-display text-slate-800 mb-1">
                {badge.name}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium mb-3">
                {badge.description}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                {badge.unlocked ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Terbuka ({badge.unlockedAt || 'Hari Ini'})
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Masih Terkunci
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: DAILY MISSIONS */}
      <div>
        <h3 className="text-2xl font-bold font-display text-slate-800 mb-6 flex items-center gap-2">
          <span>🎯 Misi Harian Pahlawan Gigi</span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-sky-50 text-sky-800 border border-sky-200">
            Diperbarui Setiap Hari
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dailyMissions.map((mission) => (
            <div
              key={mission.id}
              onClick={() => handleGoMission(mission.actionTab)}
              className={`p-5 rounded-3xl border-2 flex items-center justify-between gap-4 cursor-pointer transition-all ${
                mission.completed
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                  : 'bg-white border-slate-200/80 hover:border-teal-400 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2.5 rounded-2xl bg-white shadow-xs border border-slate-100">
                  {mission.icon}
                </span>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-800 leading-snug">
                    {mission.title}
                  </h4>
                  <span className="text-xs font-bold text-amber-600">
                    Hadiah: +{mission.xpReward} XP
                  </span>
                </div>
              </div>

              {mission.completed ? (
                <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-200/80 text-emerald-900 text-xs font-bold shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesai!</span>
                </div>
              ) : (
                <button className="flex items-center gap-1 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shrink-0 shadow-xs">
                  <span>Kerjakan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
