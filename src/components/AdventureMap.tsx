import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { TabType } from '../types/dentalverse';
import { Compass, Sparkles, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { playClickSfx, playPopSfx } from '../utils/audio';

interface Zone {
  id: TabType;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  badgeLabel: string;
  description: string;
  xpValue: string;
  position: { top: string; left: string }; // for interactive map overlay
}

export const AdventureMap: React.FC = () => {
  const { setCurrentTab, soundEnabled } = useGame();
  const [selectedZone, setSelectedZone] = useState<TabType | null>(null);

  const zones: Zone[] = [
    {
      id: 'tooth-world',
      title: 'TOOTH WORLD',
      subtitle: 'Kenali Jenis & Kekuatan Gigi',
      icon: '🦷',
      color: 'from-blue-400 to-indigo-500',
      badgeLabel: 'Anatomi Ajaib',
      description: 'Kenali Gigi Seri pemotong, Gigi Taring perobek, dan Geraham penghalus makanan!',
      xpValue: '+40 XP',
      position: { top: '24%', left: '22%' }
    },
    {
      id: 'brushing-lab',
      title: 'BRUSHING LAB',
      subtitle: 'Simulasi Sikat Gigi 3D',
      icon: '🪥',
      color: 'from-teal-400 to-emerald-500',
      badgeLabel: 'Teknik Juara',
      description: 'Putar mulut 3D, pelajari sudut 45 derajat dan bersihkan 5 area gigi dengan sempurna!',
      xpValue: '+60 XP',
      position: { top: '32%', left: '52%' }
    },
    {
      id: 'brush-cam',
      title: 'SMART CAMERA',
      subtitle: 'Brush Cam AI Interaktif',
      icon: '📷',
      color: 'from-cyan-400 to-sky-500',
      badgeLabel: 'Fitur Utama',
      description: 'Pegang sikat gigimu di depan kamera! Brush Cam akan memandu 4 area gigimu!',
      xpValue: '+100 XP',
      position: { top: '20%', left: '78%' }
    },
    {
      id: 'games',
      title: 'FOOD DETECTIVE',
      subtitle: 'Teman vs Musuh Gigi',
      icon: '🍎',
      color: 'from-amber-400 to-orange-500',
      badgeLabel: 'Mini Game Seru',
      description: 'Pilah makanan manis pencetus asam dan buah segar pelindung enamel gigi!',
      xpValue: '+50 XP',
      position: { top: '65%', left: '26%' }
    },
    {
      id: 'games',
      title: 'GERM BATTLE',
      subtitle: 'Basmi Pasukan Plak',
      icon: '🦠',
      color: 'from-purple-400 to-pink-500',
      badgeLabel: 'Laga Kuman',
      description: 'Gunakan sikat virtualmu untuk menggosok plak sampai busanya melimpah!',
      xpValue: '+50 XP',
      position: { top: '60%', left: '60%' }
    },
    {
      id: 'clinic',
      title: 'DENTAL CLINIC',
      subtitle: 'Sahabat Dokter Gigi',
      icon: '🏥',
      color: 'from-rose-400 to-red-500',
      badgeLabel: 'Kenali Alat Keren',
      description: 'Hilangkan takut ke dokter gigi! Coba kursi terbang, kaca cilik, dan sinar biru ajaib.',
      xpValue: '+40 XP',
      position: { top: '78%', left: '80%' }
    },
    {
      id: 'achievements',
      title: 'DENTAL HERO',
      subtitle: 'Koleksi Badge & Reward',
      icon: '🏆',
      color: 'from-yellow-400 to-amber-500',
      badgeLabel: 'Pusat Medali',
      description: 'Kumpulkan semua piala, pantau rekor sikat gigimu, dan capai Level Tertinggi!',
      xpValue: 'Rewards',
      position: { top: '48%', left: '38%' }
    }
  ];

  const handleZoneClick = (tab: TabType) => {
    playClickSfx(!soundEnabled);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-teal-50 border border-teal-200/80 mb-3">
          <Compass className="w-4 h-4 text-teal-600 animate-spin" />
          <span className="text-xs sm:text-sm font-bold text-teal-800 uppercase tracking-wider">
            Peta Pulau Dentalverse
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 tracking-tight mb-3">
          Jelajahi 7 Zona Petualangan Gigi!
        </h2>
        <p className="text-sm sm:text-base text-slate-600 font-medium">
          Setiap zona memiliki misi rahasia, pengetahuan seru, dan hadiah XP untuk menaikkan level Dental Hero-mu!
        </p>
      </div>

      {/* Interactive Map Visual Stage */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white mb-10 bg-slate-900">
        <div className="relative aspect-[16/9] w-full max-h-[520px] overflow-hidden">
          <img
            src="/src/assets/images/world_map_island_1790413511236.jpg"
            alt="Dentalverse Adventure Island Map"
            className="w-full h-full object-cover brightness-[0.92] hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />

          {/* Ambient Overlay Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-900/30 pointer-events-none" />

          {/* Interactive Floating Hotspots on Map */}
          {zones.map((zone, idx) => (
            <div
              key={idx}
              style={{ top: zone.position.top, left: zone.position.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
            >
              <button
                onClick={() => handleZoneClick(zone.id)}
                onMouseEnter={() => {
                  setSelectedZone(zone.id);
                  playPopSfx(!soundEnabled);
                }}
                className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white shadow-xl border-3 border-amber-300 group-hover:scale-125 group-hover:border-teal-400 transition-all duration-200"
              >
                <span className="text-2xl sm:text-3xl">{zone.icon}</span>
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-teal-500 text-[10px] text-white font-bold items-center justify-center">
                    ★
                  </span>
                </span>
              </button>

              {/* Pin tooltip label */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none whitespace-nowrap z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-bold shadow-lg border border-slate-700 flex items-center gap-1.5">
                  <span>{zone.title}</span>
                  <span className="text-amber-400 font-extrabold">{zone.xpValue}</span>
                </div>
                <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
              </div>
            </div>
          ))}

          {/* Bottom Banner on Map */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 bg-white/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/60 shadow-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center text-xl shrink-0">
                🗺️
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                  Klik ikon pada peta atau kartu di bawah!
                </h4>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Selesaikan semua zona untuk membuka Gelar Pahlawan Senyum Sejati.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleZoneClick('brush-cam')}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md whitespace-nowrap"
            >
              Coba Brush Cam 📷
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Clickable Adventure Zone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {zones.map((zone, index) => (
          <div
            key={index}
            onClick={() => handleZoneClick(zone.id)}
            className="group relative bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200/80 hover:border-teal-400 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden"
          >
            {/* Top Row: Icon + XP Badge */}
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${zone.color} text-white flex items-center justify-center text-3xl shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-200`}
              >
                {zone.icon}
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {zone.badgeLabel}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {zone.xpValue}
                </span>
              </div>
            </div>

            {/* Zone Titles */}
            <h3 className="text-xl font-bold font-display text-slate-900 group-hover:text-teal-600 transition-colors mb-1">
              {zone.title}
            </h3>
            <p className="text-xs font-semibold text-teal-600 mb-2.5">
              {zone.subtitle}
            </p>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-4">
              {zone.description}
            </p>

            {/* Action Kicker */}
            <div className="flex items-center text-xs font-bold text-slate-800 group-hover:text-teal-600 gap-1.5 pt-3 border-t border-slate-100">
              <span>Buka Zona Ini</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
