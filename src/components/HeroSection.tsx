import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, Camera, ShieldCheck, Compass, Play, Volume2, Smile, ArrowRight } from 'lucide-react';
import { playClickSfx, playPopSfx, speakIndonesian } from '../utils/audio';

export const HeroSection: React.FC = () => {
  const { setCurrentTab, soundEnabled, voiceEnabled, streak, level, xp } = useGame();
  const [mascotBubble, setMascotBubble] = useState<string>(
    'Halo Teman Petualang! Ayo sikat gigimu agar kuman plak lari terbirit-birit! 🪥✨'
  );

  const mascotGreetings = [
    'Halo Teman Petualang! Ayo sikat gigimu agar kuman plak lari terbirit-birit! 🪥✨',
    'Tahukah kamu? Enamel gigi adalah bagian tubuh manusia yang paling keras! Lebih keras dari tulang lho! 💎',
    'Sudah sikat gigi 2x hari ini? Pagi setelah makan dan malam sebelum tidur ya! 🌙',
    'Yuk coba fitur Brush Cam! Aku akan dampingi kamu menyikat gigi sampai tuntas! 📷',
    'Senyum manismu adalah kekuatan supermu! Rawat selalu ya! ⭐'
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
    <section className="relative overflow-hidden py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      {/* Soft playful background decorations */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-teal-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-60 h-60 bg-yellow-100/60 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline and Action Buttons */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white shadow-xs border border-sky-100 mb-6">
              <span className="animate-spin text-base">✨</span>
              <span className="text-xs sm:text-sm font-bold text-sky-800 tracking-wide uppercase">
                Dental Adventure for Kids
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-sky-100 text-sky-700">
                Usia 6–12 Tahun
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-slate-900 tracking-tight leading-[1.15] mb-5">
              WELCOME TO{' '}
              <span className="bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent drop-shadow-xs">
                DENTALVERSE!
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-8">
              Petualangan seru untuk bikin senyum kamu makin sehat! Jelajahi dunia gigi digital, sikat gigi dipantau AI Brush Cam, dan taklukkan kuman plak!
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-8">
              {/* Button 1: MULAI PETUALANGAN */}
              <button
                onClick={() => handleAction('adventure')}
                className="group flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 text-white font-bold text-base sm:text-lg shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span className="text-2xl transform group-hover:scale-125 transition-transform">🦷</span>
                <span>MULAI PETUALANGAN</span>
                <ArrowRight className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Button 2: SCAN SENYUMKU */}
              <button
                onClick={() => handleAction('smile-scan')}
                className="group flex items-center justify-center gap-2.5 px-5 py-4 rounded-2xl bg-white border-2 border-amber-300 hover:border-amber-400 text-slate-800 font-bold text-base shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span className="text-2xl transform group-hover:rotate-12 transition-transform">📷</span>
                <span>SCAN SENYUMKU</span>
              </button>

              {/* Button 3: CEK CARA SIKAT GIGI */}
              <button
                onClick={() => handleAction('brushing-lab')}
                className="group flex items-center justify-center gap-2.5 px-5 py-4 rounded-2xl bg-white border-2 border-sky-300 hover:border-sky-400 text-slate-800 font-bold text-base shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span className="text-2xl transform group-hover:-rotate-12 transition-transform">🪥</span>
                <span>CEK CARA SIKAT GIGI</span>
              </button>
            </div>

            {/* Quick Hero Indicators */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto lg:mx-0 pt-4 border-t border-slate-200/80">
              <div className="bg-white/80 p-3 rounded-2xl border border-slate-200/70 text-center sm:text-left">
                <span className="text-xs text-slate-500 font-medium block">Level Petualang</span>
                <span className="text-lg font-black text-sky-600 tabular-nums">Level {level}</span>
              </div>
              <div className="bg-white/80 p-3 rounded-2xl border border-slate-200/70 text-center sm:text-left">
                <span className="text-xs text-slate-500 font-medium block">Total XP</span>
                <span className="text-lg font-black text-amber-500 tabular-nums">{xp} XP</span>
              </div>
              <div className="bg-white/80 p-3 rounded-2xl border border-slate-200/70 text-center sm:text-left">
                <span className="text-xs text-slate-500 font-medium block">Daily Streak</span>
                <span className="text-lg font-black text-orange-500 tabular-nums">{streak} Hari 🔥</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Mascot Character with Interactive Speech Bubble */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            {/* Interactive Speech Bubble */}
            <div className="relative mb-4 w-full max-w-md bg-white p-4 sm:p-5 rounded-3xl shadow-xl border-3 border-teal-300 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 font-bold text-sm">
                  🦷
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                      Dental Buddy Menyapa
                    </span>
                    <button
                      onClick={() => speakIndonesian(mascotBubble, !voiceEnabled)}
                      title="Dengarkan Suara"
                      className="text-teal-600 hover:text-teal-800 p-1"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                    "{mascotBubble}"
                  </p>
                </div>
              </div>

              {/* Triangle Tail */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[14px] border-t-white" />
            </div>

            {/* 3D Mascot Image with Clickable Reaction */}
            <div
              onClick={handleMascotClick}
              className="group relative cursor-pointer select-none"
              title="Klik Dental Buddy untuk menyapa!"
            >
              {/* Outer soft glow ring */}
              <div className="absolute -inset-4 bg-gradient-to-r from-sky-400/30 to-teal-400/30 rounded-full blur-xl group-hover:blur-2xl transition-all" />

              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden bg-white/90 p-3 shadow-2xl border-4 border-white group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/src/assets/images/mascot_dental_buddy_1790413498693.jpg"
                  alt="Dental Buddy 3D Mascot"
                  className="w-full h-full object-cover rounded-2xl"
                  referrerPolicy="no-referrer"
                />

                {/* Floating badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md py-1.5 px-3 rounded-xl border border-teal-200 text-center shadow-xs">
                  <span className="text-xs font-bold text-teal-800 flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                    Ketuk aku untuk tips seru!
                  </span>
                </div>
              </div>

              {/* Floating decorative elements */}
              <div className="absolute -top-3 -right-2 bg-yellow-300 border-2 border-white rounded-2xl px-3 py-1 shadow-md text-xs font-bold text-yellow-950 animate-bounce">
                ⭐ Gigi Kuat!
              </div>

              <div className="absolute -bottom-2 -left-2 bg-sky-400 border-2 border-white rounded-2xl px-3 py-1 shadow-md text-xs font-bold text-white">
                🪥 Bebas Plak!
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
