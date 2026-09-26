import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, RotateCcw, Award } from 'lucide-react';
import { playPopSfx, playBrushSwoosh, playStarSfx } from '../utils/audio';

interface Germ {
  id: number;
  x: number; // percentage
  y: number; // percentage
  size: number;
  cleaned: boolean;
  name: string;
  emoji: string;
}

const INITIAL_GERMS: Germ[] = [
  { id: 1, x: 22, y: 35, size: 40, cleaned: false, name: 'Plaqy', emoji: '👾' },
  { id: 2, x: 42, y: 28, size: 44, cleaned: false, name: 'Sugary', emoji: '🦠' },
  { id: 3, x: 68, y: 32, size: 42, cleaned: false, name: 'Acid Bug', emoji: '🫧' },
  { id: 4, x: 30, y: 62, size: 38, cleaned: false, name: 'Goo-Goo', emoji: '👾' },
  { id: 5, x: 55, y: 68, size: 46, cleaned: false, name: 'Sweet-Tooth', emoji: '🦠' },
  { id: 6, x: 76, y: 60, size: 38, cleaned: false, name: 'Sticky', emoji: '👾' },
  { id: 7, x: 48, y: 48, size: 50, cleaned: false, name: 'King Plaque', emoji: '👑' },
  { id: 8, x: 18, y: 50, size: 36, cleaned: false, name: 'Snack Bug', emoji: '🫧' }
];

export const GermBattleGame: React.FC = () => {
  const { soundEnabled, unlockBadge, triggerRewardPopup } = useGame();
  const [germs, setGerms] = useState<Germ[]>(INITIAL_GERMS);
  const [foamBubbles, setFoamBubbles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  const cleanedCount = germs.filter(g => g.cleaned).length;
  const percentageCleaned = Math.round((cleanedCount / germs.length) * 100);

  const cleanGerm = (id: number, x: number, y: number) => {
    const germ = germs.find(g => g.id === id);
    if (!germ || germ.cleaned) return;

    playBrushSwoosh(!soundEnabled);
    playPopSfx(!soundEnabled);

    // add foam bubbles at coordinates
    setFoamBubbles(prev => [
      ...prev.slice(-12),
      { id: Date.now() + Math.random(), x, y }
    ]);

    setGerms(prev =>
      prev.map(g => (g.id === id ? { ...g, cleaned: true } : g))
    );

    // check if all cleaned
    if (cleanedCount + 1 >= germs.length) {
      setTimeout(() => {
        setIsVictory(true);
        playStarSfx(!soundEnabled);
        unlockBadge('germ-fighter');
        triggerRewardPopup(
          '🦠 GERM BATTLE VICTORY!',
          'Gigi kembali bersih bersinar 100%! Pasukan kuman plak berhasil dibersihkan!',
          50,
          'Germ Fighter'
        );
      }, 400);
    }
  };

  const handleReset = () => {
    setGerms(INITIAL_GERMS.map(g => ({ ...g, cleaned: false })));
    setFoamBubbles([]);
    setIsVictory(false);
  };

  return (
    <div className="py-6 px-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-purple-50 border border-purple-200 mb-2">
          <span className="text-lg">🦠</span>
          <span className="text-xs sm:text-sm font-bold text-purple-800 uppercase tracking-wider">
            GERM BATTLE MINI-GAME
          </span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black font-display text-slate-800">
          Basmi Plak & Kuman Manis!
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
          Arahkan dan klik/sentuh sikat gigimu ke setiap kuman lucu untuk menggosok dan membusainya sampai bersih!
        </p>
      </div>

      {/* Main Game Stage */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border-2 border-slate-200">
        
        {/* HUD Meter */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 mb-5">
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Status Kebersihan:</span>
            <span className="text-lg sm:text-xl font-black text-teal-600 tabular-nums">
              GERM CLEANED: {percentageCleaned}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
              ⭐ +50 XP
            </span>
            <button
              onClick={handleReset}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
              title="Reset Permainan"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Big Tooth Canvas with Cute Germs */}
        <div className="relative aspect-[16/10] w-full max-w-2xl mx-auto bg-gradient-to-b from-sky-100 to-teal-50 rounded-3xl border-4 border-white shadow-inner overflow-hidden select-none flex items-center justify-center p-4">
          
          {/* Giant Shiny Enamel Tooth SVG in Background */}
          <svg viewBox="0 0 400 320" className="w-full h-full drop-shadow-md">
            <path
              d="M 120 70 C 80 70, 70 120, 80 200 C 90 260, 140 290, 160 290 C 180 290, 190 240, 200 240 C 210 240, 220 290, 240 290 C 260 290, 310 260, 320 200 C 330 120, 320 70, 280 70 C 240 70, 220 100, 200 100 C 180 100, 160 70, 120 70 Z"
              fill="#ffffff"
              stroke="#bae6fd"
              strokeWidth="6"
            />
            {/* Tooth eyes & smile */}
            <circle cx="170" cy="160" r="10" fill="#0f172a" />
            <circle cx="230" cy="160" r="10" fill="#0f172a" />
            <circle cx="173" cy="157" r="3.5" fill="#ffffff" />
            <circle cx="233" cy="157" r="3.5" fill="#ffffff" />
            {/* Rosy cheeks */}
            <circle cx="150" cy="175" r="12" fill="#fda4af" opacity="0.6" />
            <circle cx="250" cy="175" r="12" fill="#fda4af" opacity="0.6" />
            {/* Happy Smile */}
            <path d="M 180 185 Q 200 210 220 185" fill="none" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
            {/* Sparkle badge */}
            <path d="M 130 110 L 135 125 L 150 130 L 135 135 L 130 150 L 125 135 L 110 130 L 125 125 Z" fill="#facc15" />
          </svg>

          {/* Germs Overlay */}
          {germs.map((germ) => {
            if (germ.cleaned) return null;
            return (
              <button
                key={germ.id}
                onClick={() => cleanGerm(germ.id, germ.x, germ.y)}
                style={{ top: `${germ.y}%`, left: `${germ.x}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group hover:scale-125 transition-transform duration-150 active:scale-90"
                title={`Klik untuk bersihkan ${germ.name}!`}
              >
                <div className="relative flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl animate-bounce drop-shadow-md">
                    {germ.emoji}
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-slate-900/80 text-white uppercase tracking-wider mt-0.5 shadow-xs">
                    {germ.name}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Foam Bubbles on brush */}
          {foamBubbles.map((bubble) => (
            <div
              key={bubble.id}
              style={{ top: `${bubble.y}%`, left: `${bubble.x}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none text-2xl animate-ping"
            >
              🫧
            </div>
          ))}

          {/* Victory Splash Overlay */}
          {isVictory && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
              <div className="text-6xl mb-3 animate-bounce">✨😁✨</div>
              <h4 className="text-2xl font-black font-display text-slate-800 mb-1">
                Gigi Bersih 100%!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mb-4 max-w-sm">
                Semua kuman plak berhasil dibersihkan! Enamel gigimu kembali putih berkilau dan sehat terlindungi!
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md"
              >
                Mainkan Lagi 🪥
              </button>
            </div>
          )}
        </div>

        {/* Bottom Tip */}
        <div className="mt-4 text-center text-xs text-slate-500 font-medium">
          💡 <strong>Tips Rahasia:</strong> Kuman plak memakan gula dari makananmu dan mengeluarkan asam perusak gigi. Sikat gigi 2 menit memusnahkan mereka!
        </div>
      </div>
    </div>
  );
};
