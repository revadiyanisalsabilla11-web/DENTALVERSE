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
          
          {/* Card 1: Modul Bertahap (Purple/Violet Theme) */}
          <div
            onClick={() => handleNav('learning-modules')}
            className="group bg-gradient-to-br from-purple-50/70 via-white to-indigo-50/40 rounded-3xl p-6 border-2 border-purple-200/90 hover:border-purple-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center text-3xl shadow-md shadow-purple-500/25 mb-4 group-hover:scale-110 transition-transform">
                📚
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 mb-2 inline-block">
                Tahap Demi Tahap
              </span>
              <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-purple-600 transition-colors mb-1.5">
                Modul Bertahap
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                Pelajari 5 kurikulum gigi berurutan mulai dari anatomi hingga klinik ramah anak.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-black text-purple-600 pt-3 border-t border-purple-100">
              <span>{completedModules.length} / 5 Selesai</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Brush Cam Dual Screen (Electric Sky Blue Theme) */}
          <div
            onClick={() => handleNav('brush-cam')}
            className="group bg-gradient-to-br from-sky-50/70 via-white to-blue-50/40 rounded-3xl p-6 border-2 border-sky-200/90 hover:border-sky-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white flex items-center justify-center text-3xl shadow-md shadow-sky-500/25 mb-4 group-hover:scale-110 transition-transform">
                🎥
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 mb-2 inline-block">
                Open Cam + Tutorial
              </span>
              <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-sky-600 transition-colors mb-1.5">
                Smart Brush Cam
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                Buka kamera sambil menyimak tutorial bergerak berdampingan untuk menyikat 4 area gigi.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-black text-sky-600 pt-3 border-t border-sky-100">
              <span>Mulai Sesi Praktek</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Kuis Evaluasi (Sunny Amber / Golden Orange Theme) */}
          <div
            onClick={() => handleNav('quiz')}
            className="group bg-gradient-to-br from-amber-50/70 via-white to-yellow-50/40 rounded-3xl p-6 border-2 border-amber-200/90 hover:border-amber-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl shadow-md shadow-amber-500/25 mb-4 group-hover:scale-110 transition-transform">
                🧠
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 mb-2 inline-block">
                Uji Pemahaman
              </span>
              <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-amber-600 transition-colors mb-1.5">
                Kuis Senyum Sehat
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                Kerjakan post-test evaluasi untuk mengukur peningkatan pengetahuan gigimu.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-black text-amber-600 pt-3 border-t border-amber-100">
              <span>Nilai: {currentUser.postTestScore}/100</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Rapor & Hasil Belajar (Sweet Strawberry Pink Theme) */}
          <div
            onClick={() => handleNav('my-report')}
            className="group bg-gradient-to-br from-pink-50/70 via-white to-rose-50/40 rounded-3xl p-6 border-2 border-pink-200/90 hover:border-pink-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center text-3xl shadow-md shadow-pink-500/25 mb-4 group-hover:scale-110 transition-transform">
                📄
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-800 border border-pink-200 mb-2 inline-block">
                Cetak & Unduh File
              </span>
              <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-pink-600 transition-colors mb-1.5">
                Rapor & Rekomendasi
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                Lihat evaluasi lengkap, rekomendasi tindak lanjut, dan cetak sertifikat capaian.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs font-black text-pink-600 pt-3 border-t border-pink-100">
              <span>Cetak Laporan</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* 3D Dental Space Cartoon Gallery Section */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border-4 border-purple-400/30 relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 font-bold text-xs uppercase tracking-wider mb-2 border border-pink-400/30">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                Galeri Visual 3D Luar Angkasa
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
                Dunia 3D Kartun DENTALVERSE
              </h3>
              <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl">
                Jelajahi visual animasi 3D kartun bertema petualangan gigi luar angkasa yang dirancang khusus untuk memotivasi anak merawat senyum sehat!
              </p>
            </div>

            <button
              onClick={() => handleNav('brush-cam')}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-md hover:scale-105 transition-all self-start sm:self-auto cursor-pointer"
            >
              🎥 Buka Brush Cam Kosmik
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
            {/* 3D Image 1 */}
            <div
              onClick={() => handleNav('brush-cam')}
              className="group bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-amber-400 transition-all duration-300 cursor-pointer shadow-lg hover:-translate-y-1"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src="/src/assets/images/dental_space_hero_1792076219545.jpg"
                  alt="Maskot Astronot Gigi 3D"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] shadow-sm">
                  🚀 Astronot Gigi
                </span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                  Maskot Dental Buddy Kosmik
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Karakter gigi 3D berpakaian astronot siap memandumu menyikat 4 sudut gigi di Brush Cam.
                </p>
              </div>
            </div>

            {/* 3D Image 2 */}
            <div
              onClick={() => handleNav('learning-modules')}
              className="group bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-sky-400 transition-all duration-300 cursor-pointer shadow-lg hover:-translate-y-1"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src="/src/assets/images/dental_space_galaxy_1792076218171.jpg"
                  alt="Galaksi Gigi 3D"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-sky-400 text-slate-950 font-black text-[10px] shadow-sm">
                  🌌 Galaksi Gigi
                </span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-sm text-white group-hover:text-sky-300 transition-colors">
                  Penjelajahan Planet Gigi
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Terbang bersama roket sikat gigi melewati nebula bersih dan planet geraham bercincin benang gigi.
                </p>
              </div>
            </div>

            {/* 3D Image 3 */}
            <div
              onClick={() => handleNav('quiz')}
              className="group bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-pink-400 transition-all duration-300 cursor-pointer shadow-lg hover:-translate-y-1"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src="/src/assets/images/dental_space_station_1792076219087.jpg"
                  alt="Stasiun Senyum Luar Angkasa 3D"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-pink-400 text-slate-950 font-black text-[10px] shadow-sm">
                  🛰️ Stasiun Senyum
                </span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-sm text-white group-hover:text-pink-300 transition-colors">
                  Galactic Dental Clinic
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Pusat evaluasi kuis dan sertifikat senyum sehat berbentuk gigi raksasa di luar angkasa.
                </p>
              </div>
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
