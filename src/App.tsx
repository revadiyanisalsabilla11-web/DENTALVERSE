/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HeroSection } from './components/HeroSection';
import { LearningModulesView } from './components/LearningModulesView';
import { SmartBrushCam } from './components/SmartBrushCam';
import { SmileScanner } from './components/SmileScanner';
import { BrushingLab } from './components/BrushingLab';
import { MiniGamesHub } from './components/MiniGamesHub';
import { QuizSection } from './components/QuizSection';
import { UserReportView } from './components/UserReportView';
import { AdminDatabaseView } from './components/AdminDatabaseView';
import { AnalyticsSummaryView } from './components/AnalyticsSummaryView';
import { ToothWorld } from './components/ToothWorld';
import { DentalClinicExplorer } from './components/DentalClinicExplorer';
import { DentalLibrary } from './components/DentalLibrary';
import { AchievementsView } from './components/AchievementsView';
import { DentalBuddyWidget } from './components/DentalBuddyWidget';
import { CelebrationModal } from './components/CelebrationModal';
import { SecurityConfirmModal } from './components/SecurityConfirmModal';
import { GmailAuthScreen } from './components/GmailAuthScreen';
import { 
  BookOpen, Camera, Brain, FileText, Database, 
  BarChart3, Gamepad2, Sparkles, ArrowRight, ShieldCheck, Heart
} from 'lucide-react';
import { playClickSfx } from './utils/audio';

const HomeDashboard: React.FC = () => {
  const { setCurrentTab, currentUser, completedModules, soundEnabled } = useGame();

  const handleNav = (tab: any) => {
    playClickSfx(!soundEnabled);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isStaff = currentUser.role === 'super_admin' || currentUser.role === 'admin' || currentUser.role === 'kader' || currentUser.role === 'viewer';

  return (
    <div>
      <HeroSection />

      {/* 4 Primary Navigation Cards (Organized, Neat, Not Cluttered) */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block mb-1">
            Fitur Unggulan Terpadu
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-800">
            Jelajahi Dunia Kesehatan Gigi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pilih aktivitas yang ingin kamu lakukan hari ini secara teratur dan menyenangkan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Modul Bertahap */}
          <div
            onClick={() => handleNav('learning-modules')}
            className="group bg-white rounded-3xl p-6 border-2 border-slate-200/80 hover:border-teal-400 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 text-white flex items-center justify-center text-3xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                📚
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 mb-2 inline-block">
                Tahap Demi Tahap
              </span>
              <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-teal-600 transition-colors mb-1.5">
                Modul Bertahap
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                Pelajari 5 kurikulum gigi berurutan mulai dari anatomi hingga klinik ramah anak.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-teal-600 pt-3 border-t border-slate-100">
              <span>{completedModules.length} / 5 Selesai</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Brush Cam Dual Screen */}
          <div
            onClick={() => handleNav('brush-cam')}
            className="group bg-white rounded-3xl p-6 border-2 border-slate-200/80 hover:border-sky-400 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 text-white flex items-center justify-center text-3xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                🎥
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 mb-2 inline-block">
                Open Cam + Tutorial
              </span>
              <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-sky-600 transition-colors mb-1.5">
                Smart Brush Cam
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                Buka kamera sambil menyimak tutorial bergerak berdampingan untuk menyikat 4 area gigi.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-sky-600 pt-3 border-t border-slate-100">
              <span>Mulai Sesi Praktek</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Kuis Evaluasi */}
          <div
            onClick={() => handleNav('quiz')}
            className="group bg-white rounded-3xl p-6 border-2 border-slate-200/80 hover:border-amber-400 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-900 flex items-center justify-center text-3xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                🧠
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 mb-2 inline-block">
                Uji Pemahaman
              </span>
              <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-amber-600 transition-colors mb-1.5">
                Kuis Senyum Sehat
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                Kerjakan post-test evaluasi untuk mengukur peningkatan pengetahuan gigimu.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-amber-700 pt-3 border-t border-slate-100">
              <span>Nilai: {currentUser.postTestScore}/100</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Rapor & Hasil Belajar */}
          <div
            onClick={() => handleNav('my-report')}
            className="group bg-white rounded-3xl p-6 border-2 border-slate-200/80 hover:border-emerald-400 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center text-3xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                📄
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2 inline-block">
                Cetak & Unduh File
              </span>
              <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-emerald-600 transition-colors mb-1.5">
                Rapor & Rekomendasi
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                Lihat evaluasi lengkap, rekomendasi tindak lanjut, dan cetak sertifikat capaian.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-emerald-600 pt-3 border-t border-slate-100">
              <span>Cetak Laporan</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* Staff & Admin Console Quick Shortcut (If User has admin/kader role) */}
      {isStaff && (
        <section className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-teal-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center text-2xl">
                👑
              </div>
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                  Panel Manajemen Data ({currentUser.role.replace('_', ' ')})
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-display">
                  Kelola Database & Pantau Rekapitulasi Pembelajaran
                </h3>
                <p className="text-xs text-slate-300">
                  Akses database seluruh peserta didik, kelola hak akses pengguna, dan tinjau efektivitas N-Gain.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => handleNav('admin-database')}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-md whitespace-nowrap"
              >
                Buka Database Pengguna
              </button>
              <button
                onClick={() => handleNav('analytics-summary')}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 whitespace-nowrap"
              >
                Rekap Data & N-Gain
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Extra Arcade Games Teaser */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl p-3 bg-amber-50 rounded-2xl border border-amber-200">
              🎮
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-800">Mau Bermain Sambil Belajar Gigi?</h4>
              <p className="text-xs text-slate-500">
                Mainkan mini-game Food Detective, Germ Battle basmi plak kuman, dan Brush Rush!
              </p>
            </div>
          </div>
          <button
            onClick={() => handleNav('games')}
            className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs shadow-sm transition-all whitespace-nowrap"
          >
            Buka Dental Arcade ➔
          </button>
        </div>
      </section>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentTab, isAuthenticated } = useGame();

  if (!isAuthenticated) {
    return <GmailAuthScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50/70 via-white to-teal-50/50 pb-20 lg:pb-10 font-sans">
      {/* Top Bar with Gmail Account Profile & Switcher */}
      <Navbar />

      {/* Focused Main Content Workspace */}
      <main className="flex-1">
        {currentTab === 'home' && <HomeDashboard />}
        {currentTab === 'learning-modules' && <LearningModulesView />}
        {currentTab === 'brush-cam' && <SmartBrushCam />}
        {currentTab === 'quiz' && <QuizSection />}
        {currentTab === 'my-report' && <UserReportView />}
        {currentTab === 'admin-database' && <AdminDatabaseView />}
        {currentTab === 'analytics-summary' && <AnalyticsSummaryView />}
        {currentTab === 'smile-scan' && <SmileScanner />}
        {currentTab === 'brushing-lab' && <BrushingLab />}
        {currentTab === 'games' && <MiniGamesHub />}
        {currentTab === 'tooth-world' && <ToothWorld />}
        {currentTab === 'clinic' && <DentalClinicExplorer />}
        {currentTab === 'achievements' && <AchievementsView />}
      </main>

      {/* Global Interactive Widgets & Dialogs */}
      <DentalBuddyWidget />
      <CelebrationModal />
      <SecurityConfirmModal />
      <BottomNav />

      {/* Print-friendly footer */}
      <footer className="print:hidden mt-12 border-t border-slate-200/80 bg-white/80 py-6 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <span className="text-xl">🦷</span>
            <span className="font-bold text-slate-800 font-display text-sm">
              DENTALVERSE
            </span>
            <span aria-hidden="true">·</span>
            <span>Dental Adventure for Kids</span>
          </div>

          <div className="flex items-center gap-1 text-slate-600">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline" />
            <span>untuk Senyum Sehat Anak Indonesia</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Super Admin & Kader Database System · Fitur kamera adalah panduan pembiasaan edukatif
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
