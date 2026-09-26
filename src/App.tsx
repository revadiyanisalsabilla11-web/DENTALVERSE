/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HeroSection } from './components/HeroSection';
import { AdventureMap } from './components/AdventureMap';
import { SmartBrushCam } from './components/SmartBrushCam';
import { SmileScanner } from './components/SmileScanner';
import { BrushingLab } from './components/BrushingLab';
import { MiniGamesHub } from './components/MiniGamesHub';
import { ToothWorld } from './components/ToothWorld';
import { DentalClinicExplorer } from './components/DentalClinicExplorer';
import { DentalLibrary } from './components/DentalLibrary';
import { QuizSection } from './components/QuizSection';
import { AchievementsView } from './components/AchievementsView';
import { DentalBuddyWidget } from './components/DentalBuddyWidget';
import { CelebrationModal } from './components/CelebrationModal';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentTab, setCurrentTab } = useGame();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50/70 via-white to-teal-50/50 pb-20 lg:pb-10">
      {/* Top Bar */}
      <Navbar />

      {/* Main Content Area based on Active Tab */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <>
            <HeroSection />
            <AdventureMap />
            {/* Quick Preview of Flagship Brush Cam */}
            <div className="py-4">
              <SmartBrushCam />
            </div>
            {/* Quick Interactive Library */}
            <div className="py-4">
              <DentalLibrary />
            </div>
          </>
        )}

        {currentTab === 'adventure' && <AdventureMap />}
        {currentTab === 'brush-cam' && <SmartBrushCam />}
        {currentTab === 'smile-scan' && <SmileScanner />}
        {currentTab === 'brushing-lab' && <BrushingLab />}
        {currentTab === 'games' && <MiniGamesHub />}
        {currentTab === 'tooth-world' && <ToothWorld />}
        {currentTab === 'clinic' && <DentalClinicExplorer />}
        {currentTab === 'library' && <DentalLibrary />}
        {currentTab === 'quiz' && <QuizSection />}
        {currentTab === 'achievements' && <AchievementsView />}
      </main>

      {/* Global Interactive Elements */}
      <DentalBuddyWidget />
      <CelebrationModal />
      <BottomNav />

      {/* Clean Kid-Friendly Footer */}
      <footer className="mt-16 border-t border-slate-200/80 bg-white/70 py-8 px-4 text-center">
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
            Fitur kamera adalah simulasi edukasi kebiasaan menyikat gigi · Bukan diagnosis medis
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
