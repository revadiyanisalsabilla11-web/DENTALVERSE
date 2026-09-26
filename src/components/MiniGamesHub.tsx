import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { FoodDetectiveGame } from './FoodDetectiveGame';
import { GermBattleGame } from './GermBattleGame';
import { Sparkles, Gamepad2, Timer, CheckCircle2, RotateCcw } from 'lucide-react';
import { playClickSfx, playStarSfx } from '../utils/audio';

type ActiveGame = 'hub' | 'food' | 'germ' | 'match' | 'puzzle' | 'brush-rush';

export const MiniGamesHub: React.FC = () => {
  const { soundEnabled, addXP, triggerRewardPopup } = useGame();
  const [activeGame, setActiveGame] = useState<ActiveGame>('hub');

  // Match the Tooth Game State
  const [matchState, setMatchState] = useState<{
    selectedTooth: string | null;
    matchedPairs: string[];
  }>({
    selectedTooth: null,
    matchedPairs: []
  });

  // Brush Rush State
  const [brushRushState, setBrushRushState] = useState<{
    clicks: number;
    target: number;
    timeLeft: number;
    isPlaying: boolean;
    isWon: boolean;
  }>({
    clicks: 0,
    target: 30,
    timeLeft: 15,
    isPlaying: false,
    isWon: false
  });

  const toothCards = [
    { id: 'incisor', name: 'Gigi Seri', type: 'tooth', icon: '🦷', matchId: 'cutter' },
    { id: 'cutter', name: 'Memotong Makanan', type: 'function', icon: '✂️', matchId: 'incisor' },
    { id: 'canine', name: 'Gigi Taring', type: 'tooth', icon: '🦷', matchId: 'tearer' },
    { id: 'tearer', name: 'Merobek Makanan', type: 'function', icon: '🥩', matchId: 'canine' },
    { id: 'molar', name: 'Gigi Geraham', type: 'tooth', icon: '🦷', matchId: 'grinder' },
    { id: 'grinder', name: 'Menghaluskan Makanan', type: 'function', icon: '🥣', matchId: 'molar' }
  ];

  const handleMatchClick = (item: typeof toothCards[0]) => {
    playClickSfx(!soundEnabled);
    if (matchState.matchedPairs.includes(item.id)) return;

    if (!matchState.selectedTooth) {
      setMatchState(prev => ({ ...prev, selectedTooth: item.id }));
    } else {
      const first = toothCards.find(c => c.id === matchState.selectedTooth);
      if (first && first.matchId === item.id) {
        // MATCH!
        playStarSfx(!soundEnabled);
        const newMatched = [...matchState.matchedPairs, first.id, item.id];
        setMatchState({ selectedTooth: null, matchedPairs: newMatched });

        if (newMatched.length === toothCards.length) {
          addXP(50);
          triggerRewardPopup(
            '🦷 MASTER COCOK GIGI!',
            'Kamu hebat! Semua jenis gigi berhasil dipasangkan dengan fungsinya!',
            50,
            'Tooth Scholar'
          );
        }
      } else {
        // Mismatch
        setMatchState(prev => ({ ...prev, selectedTooth: null }));
      }
    }
  };

  // Brush Rush Timer
  const startBrushRush = () => {
    playClickSfx(!soundEnabled);
    setBrushRushState({
      clicks: 0,
      target: 30,
      timeLeft: 15,
      isPlaying: true,
      isWon: false
    });

    const interval = setInterval(() => {
      setBrushRushState(prev => {
        if (prev.clicks >= prev.target) {
          clearInterval(interval);
          addXP(50);
          triggerRewardPopup('⚡ BRUSH RUSH JUARA!', 'Kamu super cepat menyikat gigimu!', 50);
          return { ...prev, isPlaying: false, isWon: true };
        }
        if (prev.timeLeft <= 1) {
          clearInterval(interval);
          return { ...prev, isPlaying: false, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  };

  const handleBrushRushClick = () => {
    if (!brushRushState.isPlaying) return;
    playClickSfx(!soundEnabled);
    setBrushRushState(prev => {
      const nextClicks = prev.clicks + 1;
      if (nextClicks >= prev.target) {
        return { ...prev, clicks: nextClicks, isPlaying: false, isWon: true };
      }
      return { ...prev, clicks: nextClicks };
    });
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* If inside a specific game, show back button */}
      {activeGame !== 'hub' && (
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setActiveGame('hub')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors shadow-xs"
          >
            ← Kembali ke Semua Game
          </button>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-xl border border-teal-200">
            Dental Arcade Hub
          </span>
        </div>
      )}

      {/* RENDER ACTIVE GAME */}
      {activeGame === 'food' && <FoodDetectiveGame />}
      {activeGame === 'germ' && <GermBattleGame />}

      {/* MATCH THE TOOTH GAME */}
      {activeGame === 'match' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-xl border-2 border-slate-200 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-blue-50 text-blue-800 text-xs font-bold mb-3">
            🦷 MATCH THE TOOTH
          </div>
          <h3 className="text-2xl font-black font-display text-slate-800 mb-2">
            Cocokkan Jenis Gigi & Fungsinya!
          </h3>
          <p className="text-xs sm:text-base text-slate-500 mb-6">
            Klik nama gigi, lalu klik fungsi khususnya untuk memasangkan keduanya!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {toothCards.map((item) => {
              const isMatched = matchState.matchedPairs.includes(item.id);
              const isSelected = matchState.selectedTooth === item.id;
              return (
                <button
                  key={item.id}
                  disabled={isMatched}
                  onClick={() => handleMatchClick(item)}
                  className={`p-4 rounded-2xl border-2 text-center transition-all ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-800 opacity-60 scale-95'
                      : isSelected
                      ? 'bg-sky-50 border-sky-500 shadow-md scale-105'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-3xl block mb-1">{item.icon}</span>
                  <span className="text-xs font-bold text-slate-800 block">{item.name}</span>
                  {isMatched && <span className="text-[10px] font-black text-emerald-600 block mt-1">✓ Cocok!</span>}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setMatchState({ selectedTooth: null, matchedPairs: [] })}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
          >
            Reset Pasangan
          </button>
        </div>
      )}

      {/* BRUSH RUSH SPEED CHALLENGE */}
      {activeGame === 'brush-rush' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md mx-auto shadow-xl border-2 border-slate-200 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-rose-50 text-rose-800 text-xs font-bold mb-3">
            🪥 BRUSH RUSH
          </div>
          <h3 className="text-2xl font-black font-display text-slate-800 mb-2">
            Brush Rush 15 Detik!
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-6">
            Ketuk gigi sebanyak 30 kali secepat mungkin sebelum waktu habis!
          </p>

          <div className="flex items-center justify-around mb-6 p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs text-slate-400 block font-semibold">Sisa Waktu</span>
              <span className="text-xl font-black text-rose-500 tabular-nums">
                {brushRushState.timeLeft}s
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-semibold">Gosokan Gigi</span>
              <span className="text-xl font-black text-teal-600 tabular-nums">
                {brushRushState.clicks} / {brushRushState.target}
              </span>
            </div>
          </div>

          {!brushRushState.isPlaying && !brushRushState.isWon && (
            <button
              onClick={startBrushRush}
              className="w-full py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-base shadow-lg shadow-rose-300 transition-all"
            >
              Mulai Sikat Cepat! ⚡
            </button>
          )}

          {brushRushState.isPlaying && (
            <button
              onClick={handleBrushRushClick}
              className="w-full h-40 rounded-3xl bg-gradient-to-tr from-sky-400 to-teal-400 text-white font-black text-4xl shadow-xl transform active:scale-95 transition-all flex flex-col items-center justify-center gap-2 select-none"
            >
              <span className="text-6xl animate-bounce">🪥</span>
              <span>KLIK CEPAT!</span>
            </button>
          )}

          {brushRushState.isWon && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="text-4xl block mb-2">🎉</span>
              <span className="font-bold text-emerald-900 block text-lg">Kamu Juara Brush Rush!</span>
              <button
                onClick={startBrushRush}
                className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Coba Lagi
              </button>
            </div>
          )}
        </div>
      )}

      {/* MAIN GAMES HUB TILES */}
      {activeGame === 'hub' && (
        <>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-teal-50 border border-teal-200 mb-3">
              <Gamepad2 className="w-4 h-4 text-teal-600" />
              <span className="text-xs sm:text-sm font-bold text-teal-800 uppercase tracking-wider">
                DENTAL MINI GAMES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 tracking-tight mb-2">
              Bermain & Menang Sambil Belajar Gigi!
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Pilih game seru di bawah, kumpulkan skor setinggi-tingginya, dan dapatkan badge pahlawan!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Game 1: Food Detective */}
            <div
              onClick={() => {
                playClickSfx(!soundEnabled);
                setActiveGame('food');
              }}
              className="group bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all cursor-pointer text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                🍎
              </div>
              <h3 className="text-xl font-black font-display text-slate-800 mb-1 group-hover:text-amber-600">
                Food Detective
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Pilih makanan mana yang ramah untuk gigi dan mana yang harus dibatasi.
              </p>
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-700">
                <span>Mainkan Game</span>
                <span>➔</span>
              </div>
            </div>

            {/* Game 2: Germ Battle */}
            <div
              onClick={() => {
                playClickSfx(!soundEnabled);
                setActiveGame('germ');
              }}
              className="group bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-purple-400 shadow-sm hover:shadow-xl transition-all cursor-pointer text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                🦠
              </div>
              <h3 className="text-xl font-black font-display text-slate-800 mb-1 group-hover:text-purple-600">
                Germ Battle
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Gosok kuman plak yang menempel pada gigi sampai bersih dan berbusa!
              </p>
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-purple-700">
                <span>Mainkan Game</span>
                <span>➔</span>
              </div>
            </div>

            {/* Game 3: Match the Tooth */}
            <div
              onClick={() => {
                playClickSfx(!soundEnabled);
                setActiveGame('match');
              }}
              className="group bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all cursor-pointer text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                🦷
              </div>
              <h3 className="text-xl font-black font-display text-slate-800 mb-1 group-hover:text-sky-600">
                Match the Tooth
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Cocokkan jenis gigi (Seri, Taring, Geraham) dengan kekuatan fungsinya.
              </p>
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-sky-700">
                <span>Mainkan Game</span>
                <span>➔</span>
              </div>
            </div>

            {/* Game 4: Brush Rush */}
            <div
              onClick={() => {
                playClickSfx(!soundEnabled);
                setActiveGame('brush-rush');
              }}
              className="group bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-rose-400 shadow-sm hover:shadow-xl transition-all cursor-pointer text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="text-xl font-black font-display text-slate-800 mb-1 group-hover:text-rose-600">
                Brush Rush
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Tantangan kecepatan! Sikat gigi secepat kilat dalam 15 detik!
              </p>
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-rose-700">
                <span>Mainkan Game</span>
                <span>➔</span>
              </div>
            </div>

            {/* Game 5: Dental Enamel Shield Puzzle */}
            <div
              onClick={() => {
                playClickSfx(!soundEnabled);
                setActiveGame('match');
              }}
              className="group bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-xl transition-all cursor-pointer text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                🧩
              </div>
              <h3 className="text-xl font-black font-display text-slate-800 mb-1 group-hover:text-emerald-600">
                Dental Puzzle
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Susun bagian gigi dan pelindung enamel dengan urutan yang tepat.
              </p>
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700">
                <span>Mainkan Game</span>
                <span>➔</span>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};
