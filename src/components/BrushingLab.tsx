import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Play, Pause, Volume2, Camera, Star, Rotate3d, CheckCircle2, Sparkles, ArrowRight, Clock } from 'lucide-react';
import { playClickSfx, playStarSfx, playBrushSwoosh, speakIndonesian } from '../utils/audio';

type MouthSection = 'front' | 'back' | 'inner' | 'chewing' | 'tongue';

interface SectionDetail {
  id: MouthSection;
  title: string;
  angle: string;
  technique: string;
  tips: string;
  duration: string;
  color: string;
}

const SECTIONS: SectionDetail[] = [
  {
    id: 'front',
    title: 'Gigi Depan (Incisors & Canines)',
    angle: 'Sudut 45° menghadap gusi',
    technique: 'Gerakan melingkar lembut seperti membuat lingkaran donat kecil.',
    tips: 'Jangan menyikat terlalu keras agar gusi tidak lecet dan enamel tetap kuat!',
    duration: '30 detik',
    color: 'border-sky-400 bg-sky-50 text-sky-800'
  },
  {
    id: 'back',
    title: 'Gigi Belakang (Molars)',
    angle: 'Sudut 45° di sepanjang garis gusi luar',
    technique: 'Gerakan memutar pendek dari gusi ke arah mahkota gigi.',
    tips: 'Pastikan sikat menjangkau gigi geraham paling belakang di sudut pipi.',
    duration: '30 detik',
    color: 'border-teal-400 bg-teal-50 text-teal-800'
  },
  {
    id: 'inner',
    title: 'Bagian Dalam (Inner Surface)',
    angle: 'Sikat dimiringkan vertikal / tegak lurus',
    technique: 'Tarik sikat dari atas ke bawah perlahan menyapu sela-sela gigi dalam.',
    tips: 'Kuman plak suka sembunyi di belakang gigi bawah tempat air liur menggenang!',
    duration: '30 detik',
    color: 'border-indigo-400 bg-indigo-50 text-indigo-800'
  },
  {
    id: 'chewing',
    title: 'Permukaan Kunyah (Occlusal)',
    angle: 'Bulu sikat rata di atas parit gigi',
    technique: 'Gosok maju dan mundur dengan mantap.',
    tips: 'Gigi geraham punya lembah dan celah kecil tempat sisa makanan bersarang!',
    duration: '20 detik',
    color: 'border-purple-400 bg-purple-50 text-purple-800'
  },
  {
    id: 'tongue',
    title: 'Pembersihan Lidah (Tongue)',
    angle: 'Sikat mendatar di permukaan lidah',
    technique: 'Sapukan sikat sangat lembut dari arah pangkal lidah ke ujung depan.',
    tips: 'Lidah yang bersih mencegah bau mulut dan membuat kuman tidak menempel lagi!',
    duration: '10 detik',
    color: 'border-pink-400 bg-pink-50 text-pink-800'
  }
];

export const BrushingLab: React.FC = () => {
  const { setCurrentTab, soundEnabled, voiceEnabled, addXP, triggerRewardPopup } = useGame();
  const [activeSection, setActiveSection] = useState<MouthSection>('front');
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);
  const [mouthRotation, setMouthRotation] = useState<number>(0); // degrees
  const [foamLevel, setFoamLevel] = useState<number>(0);

  // Challenge Mode State (2 minute timer)
  const [isChallengeActive, setIsChallengeActive] = useState<boolean>(false);
  const [challengeTimeLeft, setChallengeTimeLeft] = useState<number>(120);

  const currentDetail = SECTIONS.find(s => s.id === activeSection) || SECTIONS[0];

  // Play demo loop animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingDemo) {
      interval = setInterval(() => {
        setFoamLevel(prev => (prev >= 100 ? 20 : prev + 20));
        playBrushSwoosh(!soundEnabled);
      }, 500);
    } else {
      setFoamLevel(0);
    }
    return () => clearInterval(interval);
  }, [isPlayingDemo, soundEnabled]);

  // Challenge mode 2-minute timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isChallengeActive) {
      timer = setInterval(() => {
        setChallengeTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsChallengeActive(false);
            addXP(80);
            triggerRewardPopup(
              '⭐ 2-MINUTE HERO!',
              'Hebat! Kamu berhasil menyelesaikan tantangan sikat gigi 2 menit penuh dengan sempurna!',
              80,
              'Time Champion'
            );
            return 120;
          }
          if (prev % 30 === 0) {
            playStarSfx(!soundEnabled);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isChallengeActive, soundEnabled, addXP, triggerRewardPopup]);

  const handleSelectSection = (sec: MouthSection) => {
    playClickSfx(!soundEnabled);
    setActiveSection(sec);
    setIsPlayingDemo(false);
    // rotate mouth model slightly to present that part
    if (sec === 'front') setMouthRotation(0);
    if (sec === 'back') setMouthRotation(35);
    if (sec === 'inner') setMouthRotation(-30);
    if (sec === 'chewing') setMouthRotation(15);
    if (sec === 'tongue') setMouthRotation(-10);
  };

  const handleListen = () => {
    speakIndonesian(
      `Bagian ${currentDetail.title}. Posisi sikat: ${currentDetail.angle}. Teknik: ${currentDetail.technique}`,
      !voiceEnabled
    );
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-teal-50 border border-teal-200 mb-3">
          <Rotate3d className="w-4 h-4 text-teal-600" />
          <span className="text-xs sm:text-sm font-bold text-teal-800 uppercase tracking-wider">
            LAB SIKAT GIGI 3D INTERAKTIF
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 tracking-tight mb-2">
          Eksplorasi & Kuasai Cara Sikat Gigi
        </h2>
        <p className="text-sm sm:text-base text-slate-600 font-medium">
          Putar model mulut interaktif, pilih area gigi, dan tonton teknik menyikat yang benar agar gigimu bebas dari lubang dan plak!
        </p>
      </div>

      {/* Main Interactive Stage & Control Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
        
        {/* Interactive 3D Mouth Visualizer (Col 7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-xl border-2 border-slate-200/90 relative overflow-hidden flex flex-col items-center">
          
          {/* Top rotation controller pill */}
          <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Rotate3d className="w-4 h-4 text-teal-600" />
              Rotasi Model: <span className="tabular-nums font-mono text-slate-800">{mouthRotation}°</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMouthRotation(prev => prev - 20)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                ⟲ Putar Kiri
              </button>
              <button
                onClick={() => setMouthRotation(0)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                Depan
              </button>
              <button
                onClick={() => setMouthRotation(prev => prev + 20)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                Putar Kanan ⟳
              </button>
            </div>
          </div>

          {/* 3D/Interactive Mouth SVG Model */}
          <div
            style={{
              transform: `perspective(600px) rotateY(${mouthRotation}deg) rotateX(${
                activeSection === 'chewing' ? 25 : 0
              }deg)`,
              transition: 'transform 0.4s ease-out'
            }}
            className="relative w-72 h-72 sm:w-84 sm:h-84 flex items-center justify-center my-4"
          >
            {/* Soft Mouth Gums Base */}
            <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl select-none">
              <defs>
                <linearGradient id="gumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#fb7185" />
                </linearGradient>
                <linearGradient id="toothGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#f0f9ff" />
                </linearGradient>
                <linearGradient id="tongueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>

              {/* Upper Gum Arch */}
              <path
                d="M 50 130 C 50 40, 250 40, 250 130 C 230 115, 70 115, 50 130 Z"
                fill="url(#gumGrad)"
                stroke="#e11d48"
                strokeWidth="2"
              />

              {/* Lower Gum Arch */}
              <path
                d="M 50 170 C 50 260, 250 260, 250 170 C 230 185, 70 185, 50 170 Z"
                fill="url(#gumGrad)"
                stroke="#e11d48"
                strokeWidth="2"
              />

              {/* Tongue in center */}
              <ellipse
                cx="150"
                cy="185"
                rx="65"
                ry="45"
                fill="url(#tongueGrad)"
                className={`cursor-pointer transition-all duration-300 ${
                  activeSection === 'tongue' ? 'stroke-4 stroke-amber-300 scale-105' : 'stroke-rose-600'
                }`}
                onClick={() => handleSelectSection('tongue')}
              />
              {/* Tongue midline */}
              <path d="M 150 155 Q 150 185 150 215" stroke="#be123c" strokeWidth="2.5" strokeLinecap="round" />

              {/* Upper Teeth Row */}
              {/* Left Molars */}
              <rect
                x="56"
                y="110"
                width="24"
                height="22"
                rx="6"
                fill="url(#toothGrad)"
                stroke={activeSection === 'back' ? '#0284c7' : '#cbd5e1'}
                strokeWidth={activeSection === 'back' ? '3' : '1.5'}
                className="cursor-pointer"
                onClick={() => handleSelectSection('back')}
              />
              <rect
                x="82"
                y="100"
                width="22"
                height="24"
                rx="6"
                fill="url(#toothGrad)"
                stroke={activeSection === 'back' ? '#0284c7' : '#cbd5e1'}
                strokeWidth={activeSection === 'back' ? '3' : '1.5'}
                className="cursor-pointer"
                onClick={() => handleSelectSection('back')}
              />

              {/* Upper Front Teeth */}
              <rect
                x="108"
                y="94"
                width="19"
                height="27"
                rx="5"
                fill="url(#toothGrad)"
                stroke={activeSection === 'front' ? '#0284c7' : '#cbd5e1'}
                strokeWidth={activeSection === 'front' ? '3' : '1.5'}
                className="cursor-pointer"
                onClick={() => handleSelectSection('front')}
              />
              <rect
                x="130"
                y="92"
                width="20"
                height="29"
                rx="5"
                fill="url(#toothGrad)"
                stroke={activeSection === 'front' ? '#0284c7' : '#cbd5e1'}
                strokeWidth={activeSection === 'front' ? '3' : '1.5'}
                className="cursor-pointer"
                onClick={() => handleSelectSection('front')}
              />
              <rect
                x="152"
                y="92"
                width="20"
                height="29"
                rx="5"
                fill="url(#toothGrad)"
                stroke={activeSection === 'front' ? '#0284c7' : '#cbd5e1'}
                strokeWidth={activeSection === 'front' ? '3' : '1.5'}
                className="cursor-pointer"
                onClick={() => handleSelectSection('front')}
              />
              <rect
                x="174"
                y="94"
                width="19"
                height="27"
                rx="5"
                fill="url(#toothGrad)"
                stroke={activeSection === 'front' ? '#0284c7' : '#cbd5e1'}
                strokeWidth={activeSection === 'front' ? '3' : '1.5'}
                className="cursor-pointer"
                onClick={() => handleSelectSection('front')}
              />

              {/* Right Molars */}
              <rect
                x="196"
                y="100"
                width="22"
                height="24"
                rx="6"
                fill="url(#toothGrad)"
                stroke={activeSection === 'back' ? '#0284c7' : '#cbd5e1'}
                strokeWidth={activeSection === 'back' ? '3' : '1.5'}
                className="cursor-pointer"
                onClick={() => handleSelectSection('back')}
              />
              <rect
                x="220"
                y="110"
                width="24"
                height="22"
                rx="6"
                fill="url(#toothGrad)"
                stroke={activeSection === 'back' ? '#0284c7' : '#cbd5e1'}
                strokeWidth={activeSection === 'back' ? '3' : '1.5'}
                className="cursor-pointer"
                onClick={() => handleSelectSection('back')}
              />

              {/* Lower Teeth Row */}
              <rect
                x="60"
                y="168"
                width="24"
                height="22"
                rx="6"
                fill="url(#toothGrad)"
                stroke={activeSection === 'chewing' ? '#7c3aed' : '#cbd5e1'}
                strokeWidth={activeSection === 'chewing' ? '3' : '1.5'}
                className="cursor-pointer"
                onClick={() => handleSelectSection('chewing')}
              />
              <rect
                x="86"
                y="174"
                width="22"
                height="24"
                rx="6"
                fill="url(#toothGrad)"
                stroke={activeSection === 'chewing' ? '#7c3aed' : '#cbd5e1'}
                strokeWidth={activeSection === 'chewing' ? '3' : '1.5'}
                className="cursor-pointer"
                onClick={() => handleSelectSection('chewing')}
              />
              <rect
                x="110"
                y="178"
                width="18"
                height="25"
                rx="5"
                fill="url(#toothGrad)"
                stroke={activeSection === 'inner' ? '#4f46e5' : '#cbd5e1'}
                strokeWidth={activeSection === 'inner' ? '3' : '1.5'}
                className="cursor-pointer"
                onClick={() => handleSelectSection('inner')}
              />
              <rect
                x="130"
                y="180"
                width="19"
                height="26"
                rx="5"
                fill="url(#toothGrad)"
                stroke={activeSection === 'inner' ? '#4f46e5' : '#cbd5e1'}
                strokeWidth={activeSection === 'inner' ? '3' : '1.5'}
                className="cursor-pointer"
                onClick={() => handleSelectSection('inner')}
              />
              <rect
                x="151"
                y="180"
                width="19"
                height="26"
                rx="5"
                fill="url(#toothGrad)"
                stroke={activeSection === 'inner' ? '#4f46e5' : '#cbd5e1'}
                strokeWidth={activeSection === 'inner' ? '3' : '1.5'}
                className="cursor-pointer"
                onClick={() => handleSelectSection('inner')}
              />
              <rect
                x="172"
                y="178"
                width="18"
                height="25"
                rx="5"
                fill="url(#toothGrad)"
                stroke={activeSection === 'inner' ? '#4f46e5' : '#cbd5e1'}
                strokeWidth={activeSection === 'inner' ? '3' : '1.5'}
                className="cursor-pointer"
                onClick={() => handleSelectSection('inner')}
              />
              <rect
                x="192"
                y="174"
                width="22"
                height="24"
                rx="6"
                fill="url(#toothGrad)"
                stroke={activeSection === 'chewing' ? '#7c3aed' : '#cbd5e1'}
                strokeWidth={activeSection === 'chewing' ? '3' : '1.5'}
                className="cursor-pointer"
                onClick={() => handleSelectSection('chewing')}
              />
              <rect
                x="216"
                y="168"
                width="24"
                height="22"
                rx="6"
                fill="url(#toothGrad)"
                stroke={activeSection === 'chewing' ? '#7c3aed' : '#cbd5e1'}
                strokeWidth={activeSection === 'chewing' ? '3' : '1.5'}
                className="cursor-pointer"
                onClick={() => handleSelectSection('chewing')}
              />
            </svg>

            {/* Animated Toothbrush Overlay when Demo is Playing */}
            {isPlayingDemo && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-bounce">
                <div className="relative text-5xl transform -rotate-45">
                  🪥
                  {/* Foam bubbles */}
                  <div className="absolute -top-3 -right-2 text-2xl animate-ping">🫧</div>
                  <div className="absolute bottom-0 -left-2 text-xl animate-pulse">✨</div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Action Bar on Model */}
          <div className="w-full flex flex-wrap items-center justify-center gap-2.5 pt-4 border-t border-slate-100">
            {/* ▶️ PLAY DEMO */}
            <button
              onClick={() => setIsPlayingDemo(!isPlayingDemo)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              {isPlayingDemo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlayingDemo ? 'Hentikan Demo' : '▶️ PLAY DEMO'}</span>
            </button>

            {/* 🔊 LISTEN */}
            <button
              onClick={handleListen}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold text-xs sm:text-sm transition-all active:scale-95"
            >
              <Volume2 className="w-4 h-4" />
              <span>🔊 LISTEN</span>
            </button>

            {/* 📷 TRY WITH CAMERA */}
            <button
              onClick={() => {
                playClickSfx(!soundEnabled);
                setCurrentTab('brush-cam');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>📷 TRY WITH CAMERA</span>
            </button>

            {/* ⭐ CHALLENGE MODE */}
            <button
              onClick={() => {
                setIsChallengeActive(!isChallengeActive);
                playClickSfx(!soundEnabled);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all active:scale-95 ${
                isChallengeActive
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
              }`}
            >
              <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>
                {isChallengeActive ? `Waktu: ${challengeTimeLeft}s` : '⭐ CHALLENGE 2 MENIT'}
              </span>
            </button>
          </div>
        </div>

        {/* Section Selector & Step-by-Step Deck (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xl font-bold font-display text-slate-800">
            Pilih Bagian Mulut yang Mau Dipelajari:
          </h3>

          {/* Section Buttons */}
          <div className="space-y-2.5">
            {SECTIONS.map((sec) => {
              const isSelected = sec.id === activeSection;
              return (
                <div
                  key={sec.id}
                  onClick={() => handleSelectSection(sec.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? `${sec.color} shadow-md scale-[1.01]`
                      : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm sm:text-base flex items-center gap-2">
                      <span className="text-lg">
                        {sec.id === 'front' && '😁'}
                        {sec.id === 'back' && '🦷'}
                        {sec.id === 'inner' && '🔄'}
                        {sec.id === 'chewing' && '⚡'}
                        {sec.id === 'tongue' && '👅'}
                      </span>
                      {sec.title}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-white/80 border border-current">
                      {sec.duration}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-current/20 space-y-2 text-xs leading-relaxed animate-in fade-in duration-150">
                      <div>
                        <span className="font-bold block text-slate-900">📐 Sudut Sikat:</span>
                        <span>{sec.angle}</span>
                      </div>
                      <div>
                        <span className="font-bold block text-slate-900">🔄 Gerakan Tepat:</span>
                        <span>{sec.technique}</span>
                      </div>
                      <div className="bg-white/80 p-2 rounded-xl border border-current/30 text-slate-800">
                        <span className="font-bold">💡 Tips Super: </span>
                        <span>{sec.tips}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
