import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, Shield, Volume2, Award, ArrowRight } from 'lucide-react';
import { playClickSfx, playStarSfx, speakIndonesian } from '../utils/audio';

type ViewMode = 'types' | 'layers';

export const ToothWorld: React.FC = () => {
  const { soundEnabled, voiceEnabled, unlockBadge, addXP, triggerRewardPopup } = useGame();
  const [viewMode, setViewMode] = useState<ViewMode>('types');
  const [selectedToothId, setSelectedToothId] = useState<string>('incisor');
  const [selectedLayerId, setSelectedLayerId] = useState<string>('enamel');

  const toothTypes = [
    {
      id: 'incisor',
      name: 'Gigi Seri (Incisors)',
      superpower: '✂️ Pemotong Handal',
      count: '8 buah (4 atas, 4 bawah)',
      description: 'Gigi paling depan dengan tepi pipih dan tajam seperti gunting. Tugas utamanya adalah memotong gigitan makanan seperti apel atau roti lapis!',
      fact: 'Gigi seri adalah gigi pertama yang biasanya tumbuh saat kita masih bayi usia 6-10 bulan!',
      color: 'bg-sky-50 border-sky-300 text-sky-900',
      icon: '🦷'
    },
    {
      id: 'canine',
      name: 'Gigi Taring (Canines)',
      superpower: '🥩 Perobek Kuat',
      count: '4 buah (2 atas, 2 bawah)',
      description: 'Gigi runcing dan tajam di samping gigi seri. Memiliki akar paling panjang dan sangat kuat untuk mencengkeram dan merobek makanan berserat atau liat.',
      fact: 'Gigi taring sering disebut gigi vampir karena bentuknya yang runcing dan gagah!',
      color: 'bg-amber-50 border-amber-300 text-amber-900',
      icon: '🧛'
    },
    {
      id: 'molar',
      name: 'Gigi Geraham (Molars)',
      superpower: '🥣 Penggiling Super',
      count: '12-20 buah (termasuk geraham bungsu)',
      description: 'Gigi besar di bagian belakang mulut dengan permukaan lebar dan berlekuk-lekuk. Bekerja seperti lesung batu untuk menggilas dan menghaluskan makanan sampai lembut!',
      fact: 'Permukaan geraham punya celah mikro yang sangat perlu disikat teliti agar makanan tidak mengendap!',
      color: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      icon: '⚙️'
    }
  ];

  const toothLayers = [
    {
      id: 'enamel',
      name: 'Enamel (Email Gigi)',
      title: '💎 Perisai Sekeras Berlian',
      description: 'Lapisan putih terluar yang membungkus mahkota gigi. Ini adalah zat paling keras di seluruh tubuh manusia—bahkan lebih keras dari tulang rangka kita!',
      secret: 'Meskipun sangat keras, enamel bisa rapuh bila terus-menerus diserang asam dari bakteri pemakan gula.',
      color: 'border-cyan-400 bg-cyan-50'
    },
    {
      id: 'dentin',
      name: 'Dentin (Tulang Gigi)',
      title: '🛡️ Bantalan Pelindung Kuning',
      description: 'Lapisan tebal di bawah enamel. Dentin berwarna sedikit kekuningan dan memiliki ribuan terowongan mikroskopis yang menyambung langsung ke saraf!',
      secret: 'Jika enamel berlubang dan dentin terbuka, gigi akan terasa ngilu saat minum air es atau makan es krim!',
      color: 'border-yellow-400 bg-yellow-50'
    },
    {
      id: 'pulp',
      name: 'Pulpa (Pusat Kehidupan)',
      title: '❤️ Rumah Saraf & Pembuluh Darah',
      description: 'Bagian terdalam dan paling lunak dari gigi. Pulpa berisi serabut saraf yang merasakan suhu dan pembuluh darah yang memberi makan gigi agar tetap hidup sehat.',
      secret: 'Kuman yang mencapai pulpa akan menyebabkan sakit gigi berdenyut. Itulah kenapa kita harus menyikat gigi sebelum lubang membesar!',
      color: 'border-rose-400 bg-rose-50'
    }
  ];

  const currentTooth = toothTypes.find(t => t.id === selectedToothId) || toothTypes[0];
  const currentLayer = toothLayers.find(l => l.id === selectedLayerId) || toothLayers[0];

  const handleFinishTour = () => {
    addXP(40);
    unlockBadge('dental-explorer');
    triggerRewardPopup(
      '🦷 ANATOMI GIGI TERKUAK!',
      'Kamu telah mempelajari seluruh jenis dan lapisan pelindung gigi!',
      40,
      'Dental Explorer'
    );
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-sky-50 border border-sky-200 mb-3">
          <span className="text-lg">🦷</span>
          <span className="text-xs sm:text-sm font-bold text-sky-800 uppercase tracking-wider">
            ZONA TOOTH WORLD
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 tracking-tight mb-2">
          Kenali Jenis & Lapisan Ajaib Gigimu!
        </h2>
        <p className="text-sm sm:text-base text-slate-600 font-medium">
          Setiap gigi di mulutmu punya bentuk, senjata rahasia, dan struktur pelindung yang luar biasa.
        </p>
      </div>

      {/* Switcher Tab between Types & Layers */}
      <div className="flex justify-center mb-8">
        <div className="p-1.5 bg-slate-100 rounded-2xl flex items-center gap-2 border border-slate-200">
          <button
            onClick={() => {
              playClickSfx(!soundEnabled);
              setViewMode('types');
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              viewMode === 'types'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🦷 3 Jenis Gigi & Fungsinya
          </button>
          <button
            onClick={() => {
              playClickSfx(!soundEnabled);
              setViewMode('layers');
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              viewMode === 'layers'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            💎 3 Lapisan Perisai Gigi
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: TOOTH TYPES */}
      {viewMode === 'types' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Selector List */}
          <div className="lg:col-span-5 space-y-3">
            {toothTypes.map((tooth) => {
              const isSelected = tooth.id === selectedToothId;
              return (
                <div
                  key={tooth.id}
                  onClick={() => {
                    playClickSfx(!soundEnabled);
                    setSelectedToothId(tooth.id);
                  }}
                  className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? `${tooth.color} shadow-lg scale-[1.02]`
                      : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{tooth.icon}</span>
                    <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-white/90 border border-current">
                      {tooth.superpower}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold font-display">{tooth.name}</h4>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Jumlah: {tooth.count}</p>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Spotlight Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">
                  Kekuatan Utama
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-display text-slate-800">
                  {currentTooth.name}
                </h3>
              </div>
              <button
                onClick={() => speakIndonesian(`${currentTooth.name}. ${currentTooth.description}`, !voiceEnabled)}
                className="p-2.5 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-700 transition-colors"
                title="Dengarkan Penjelasan"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium mb-6">
              {currentTooth.description}
            </p>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 mb-6">
              <span className="font-bold block text-xs uppercase tracking-wider text-amber-800 mb-1">
                ⭐ Fakta Ajaib:
              </span>
              <p className="text-xs sm:text-sm font-medium">{currentTooth.fact}</p>
            </div>

            <button
              onClick={handleFinishTour}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Klaim Hadiah Penjelajah Gigi (+40 XP)</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: TOOTH LAYERS */}
      {viewMode === 'layers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Diagram / Selector */}
          <div className="lg:col-span-5 space-y-3">
            {toothLayers.map((layer) => {
              const isSelected = layer.id === selectedLayerId;
              return (
                <div
                  key={layer.id}
                  onClick={() => {
                    playClickSfx(!soundEnabled);
                    setSelectedLayerId(layer.id);
                  }}
                  className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? `${layer.color} shadow-lg scale-[1.02]`
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <h4 className="text-base sm:text-lg font-bold font-display text-slate-800">
                    {layer.name}
                  </h4>
                  <p className="text-xs font-semibold text-teal-700 mt-1">{layer.title}</p>
                </div>
              );
            })}
          </div>

          {/* Right: Spotlight */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">
                  Lapisan Anatomi
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-display text-slate-800">
                  {currentLayer.name}
                </h3>
              </div>
              <button
                onClick={() => speakIndonesian(`${currentLayer.name}. ${currentLayer.description}`, !voiceEnabled)}
                className="p-2.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-700 transition-colors"
                title="Dengarkan Suara"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <h4 className="text-lg font-bold text-teal-800 mb-3">{currentLayer.title}</h4>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium mb-6">
              {currentLayer.description}
            </p>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 mb-6">
              <span className="font-bold block text-xs uppercase tracking-wider text-teal-800 mb-1">
                🛡️ Rahasia Perawatan:
              </span>
              <p className="text-xs sm:text-sm font-medium">{currentLayer.secret}</p>
            </div>

            <button
              onClick={handleFinishTour}
              className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Klaim Hadiah Penjelajah (+40 XP)</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
