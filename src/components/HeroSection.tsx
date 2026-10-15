import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { 
  Sparkles, Camera, ShieldCheck, ArrowRight, BookOpen, 
  Brain, FileText, Volume2, Flame, Award, Users
} from 'lucide-react';
import { playClickSfx, playPopSfx, speakIndonesian } from '../utils/audio';

export const HeroSection: React.FC = () => {
  const { 
    setCurrentTab, 
    soundEnabled, 
    voiceEnabled, 
    streak, 
    level, 
    xp, 
    currentUser,
    completedModules 
  } = useGame();

  const [spaceTheme, setSpaceTheme] = useState<'space_galaxy' | 'astronaut' | 'station'>('space_galaxy');

  const [mascotBubble, setMascotBubble] = useState<string>(
    'Halo Sobat Hero! Ayo mulai petualangan luar angkasa gigi di Modul Bertahap dan coba sikat gigi berdampingan tutorial di Brush Cam! 🚀✨'
  );

  const mascotGreetings = [
    'Halo Sobat Hero! Ayo mulai petualangan di Modul Bertahap dan coba sikat gigi berdampingan tutorial di Brush Cam! 🪥✨',
    'Tahukah kamu? Enamel gigi adalah zat terkeras di tubuh manusia, tapi tetap butuh sikat gigi 2 kali sehari! 💎',
    'Ingat rumus sakti 2-2-45°: 2 kali sehari, 2 menit penuh, dan sudut sikat 45 derajat! 📐',
    'Sikat gigimu malam sebelum tidur itu penting banget agar kuman plak tidak berpesta saat kamu bermimpi! 🌙',
    'Setelah belajar modul materi, jangan lupa kerjakan kuis evaluasi dan cetak rapor gigimu ya! 📄'
  ];

  const handleMascotClick = () => {
    playPopSfx(!soundEnabled);
    const randomIdx = Math.floor(Math.random() * mascotGreetings.length);
    const chosen = mascotGreetings[randomIdx];
    setMascotBubble(chosen);
    speakIndonesian(chosen, !voiceEnabled);
  };

  const handleAction = (tab: any) => {
    playClickSfx(!soundEnabled);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Soft background glow */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-teal-200/35 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & Primary Pathways */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white shadow-xs border border-sky-100 mb-4">
              <span className="text-base animate-spin">✨</span>
              <span className="text-xs sm:text-sm font-bold text-sky-800 tracking-wide uppercase">
                DENTALVERSE · Dental Adventure for Kids
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                Usia 6–12 Tahun
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display text-slate-900 tracking-tight leading-[1.15] mb-4">
              Petualangan Digital Menuju{' '}
              <span className="bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                Senyum Sehat Juara!
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed mb-6">
              Belajar kesehatan gigi secara bertahap, sikat gigi dipantau kamera berdampingan tutorial animasi, dan cetak rapor hasil belajarmu!
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
              <button
                onClick={() => handleAction('learning-modules')}
                className="group flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <BookOpen className="w-5 h-5 text-amber-200" />
                <span>MULAI BELAJAR BERTAHAP</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleAction('brush-cam')}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white border-2 border-sky-300 hover:border-sky-400 text-slate-800 font-bold text-sm shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Camera className="w-5 h-5 text-sky-600" />
                <span>BUKA BRUSH CAM 🎥</span>
              </button>

              <button
                onClick={() => handleAction('my-report')}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white border-2 border-amber-300 hover:border-amber-400 text-slate-800 font-bold text-sm shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <FileText className="w-5 h-5 text-amber-600" />
                <span>RAPOR SAYA 📄</span>
              </button>
            </div>

            {/* User Hero Metric Chips */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0 pt-3 border-t border-slate-200/80 text-center sm:text-left">
              <div className="bg-white/80 p-2.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Modul Selesai</span>
                <span className="text-base font-black text-teal-600 tabular-nums">
                  {completedModules.length} / 5 Modul
                </span>
              </div>

              <div className="bg-white/80 p-2.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Skor Post-Test</span>
                <span className="text-base font-black text-amber-500 tabular-nums">
                  {currentUser.postTestScore} / 100
                </span>
              </div>

              <div className="bg-white/80 p-2.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Poin Petualang</span>
                <span className="text-base font-black text-sky-600 tabular-nums">
                  {xp} XP ⭐
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Mascot Character & Speech Bubble */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* Interactive Speech Bubble */}
            <div className="relative mb-3 w-full max-w-md bg-white p-4 rounded-3xl shadow-xl border-3 border-teal-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 font-bold text-sm">
                  🦷
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                      Dental Buddy Sahabatmu
                    </span>
                    <button
                      onClick={() => speakIndonesian(mascotBubble, !voiceEnabled)}
                      title="Dengarkan Suara"
                      className="text-teal-600 hover:text-teal-800 p-0.5"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    "{mascotBubble}"
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-white" />
            </div>

            {/* 3D Space & Mascot Theme Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-white/90 backdrop-blur-md rounded-2xl border border-teal-200 mb-3 shadow-xs">
              <button
                type="button"
                onClick={() => setSpaceTheme('space_galaxy')}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                  spaceTheme === 'space_galaxy'
                    ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-sky-600'
                }`}
              >
                🌌 Galaksi Gigi 3D
              </button>
              <button
                type="button"
                onClick={() => setSpaceTheme('astronaut')}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                  spaceTheme === 'astronaut'
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-teal-600'
                }`}
              >
                🚀 Astronot Gigi
              </button>
              <button
                type="button"
                onClick={() => setSpaceTheme('station')}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                  spaceTheme === 'station'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-purple-600'
                }`}
              >
                🛰️ Stasiun Senyum
              </button>
            </div>

            {/* 3D Mascot / Space Illustration Display */}
            <div
              onClick={handleMascotClick}
              className="group relative cursor-pointer select-none"
              title="Klik untuk mendengarkan tips gigi luar angkasa!"
            >
              <div className="absolute -inset-3 bg-gradient-to-r from-sky-400/40 via-teal-400/30 to-purple-400/40 rounded-full blur-xl group-hover:blur-2xl transition-all" />

              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden bg-slate-900 p-2 shadow-2xl border-4 border-white group-hover:scale-105 transition-transform duration-300">
                <img
                  src={
                    spaceTheme === 'space_galaxy'
                      ? '/src/assets/images/dental_space_galaxy_1792076218171.jpg'
                      : spaceTheme === 'astronaut'
                      ? '/src/assets/images/dental_space_hero_1792076219545.jpg'
                      : '/src/assets/images/dental_space_station_1792076219087.jpg'
                  }
                  alt="3D Dental Outer Space Adventure"
                  className="w-full h-full object-cover rounded-2xl animate-in fade-in duration-300"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute bottom-3 left-3 right-3 bg-slate-950/85 backdrop-blur-md py-1.5 px-3 rounded-xl border border-white/20 text-center shadow-md">
                  <span className="text-[11px] font-bold text-teal-300 flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Dunia Luar Angkasa DENTALVERSE</span>
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
