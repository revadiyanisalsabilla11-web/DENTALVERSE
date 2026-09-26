import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { FoodItem } from '../types/dentalverse';
import { Sparkles, CheckCircle2, XCircle, RotateCcw, Award, ThumbsUp, AlertTriangle } from 'lucide-react';
import { playClickSfx, playStarSfx, playPopSfx, speakIndonesian } from '../utils/audio';

const ALL_FOODS: FoodItem[] = [
  {
    id: 'apple',
    name: 'Apel Segar',
    category: 'friend',
    emoji: '🍎',
    fact: 'Apel renyah berserat tinggi yang bertindak seperti sikat gigi alami pembersih plak dan memicu produksi air liur!',
    color: 'bg-red-50 text-red-800 border-red-200'
  },
  {
    id: 'candy',
    name: 'Permen Manis',
    category: 'limit',
    emoji: '🍭',
    fact: 'Gula lengket pada permen jadi makanan favorit kuman untuk memproduksi asam perusak enamel gigi!',
    color: 'bg-pink-50 text-pink-800 border-pink-200'
  },
  {
    id: 'milk',
    name: 'Susu Murni',
    category: 'friend',
    emoji: '🥛',
    fact: 'Kaya kalsium dan vitamin D untuk membuat benteng enamel gigimu sekeras batu karang!',
    color: 'bg-sky-50 text-sky-800 border-sky-200'
  },
  {
    id: 'chocolate',
    name: 'Cokelat Manis',
    category: 'limit',
    emoji: '🍫',
    fact: 'Mudah menempel di celah gigi geraham. Jika makan cokelat, segeralah minum air putih atau sikat gigi!',
    color: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  {
    id: 'water',
    name: 'Air Putih',
    category: 'friend',
    emoji: '💧',
    fact: 'Pembersih mulut alami nomor 1! Membilas asam dan menjaga mulut tetap lembap!',
    color: 'bg-cyan-50 text-cyan-800 border-cyan-200'
  },
  {
    id: 'boba',
    name: 'Minuman Boba Manis',
    category: 'limit',
    emoji: '🧋',
    fact: 'Kandungan gula cair yang sangat tinggi merendam gigi dalam asam selama berjam-jam.',
    color: 'bg-orange-50 text-orange-800 border-orange-200'
  },
  {
    id: 'carrot',
    name: 'Wortel Renyah',
    category: 'friend',
    emoji: '🥕',
    fact: 'Mengunyah wortel mentah melatih otot rahang dan merangsang gusi agar tetap sehat bugar!',
    color: 'bg-orange-50 text-orange-800 border-orange-200'
  },
  {
    id: 'cheese',
    name: 'Keju Lezat',
    category: 'friend',
    emoji: '🧀',
    fact: 'Keju kaya fosfat dan kalsium yang menetralkan tingkat keasaman di dalam rongga mulut seketika!',
    color: 'bg-yellow-50 text-yellow-800 border-yellow-200'
  },
  {
    id: 'soda',
    name: 'Minuman Bersoda',
    category: 'limit',
    emoji: '🥤',
    fact: 'Sangat asam dan bergula tinggi! Mengikis enamel gigi pelan-pelan jika sering diminum.',
    color: 'bg-rose-50 text-rose-800 border-rose-200'
  },
  {
    id: 'chips',
    name: 'Keripik Snack',
    category: 'limit',
    emoji: '🍪',
    fact: 'Pati olahan mudah terselip dan berubah menjadi gula tersembunyi yang digemari bakteri.',
    color: 'bg-amber-50 text-amber-800 border-amber-200'
  }
];

export const FoodDetectiveGame: React.FC = () => {
  const { soundEnabled, voiceEnabled, unlockBadge, completeMission, triggerRewardPopup } = useGame();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'wrong';
    fact: string;
    foodName: string;
  } | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentFood = ALL_FOODS[currentIndex];

  const handleClassify = (chosenCategory: 'friend' | 'limit') => {
    playClickSfx(!soundEnabled);
    const isCorrect = chosenCategory === currentFood.category;

    if (isCorrect) {
      playStarSfx(!soundEnabled);
      setScore(prev => prev + 1);
      setFeedback({
        type: 'correct',
        fact: currentFood.fact,
        foodName: currentFood.name
      });
      speakIndonesian(`Tepat sekali! ${currentFood.fact}`, !voiceEnabled);
    } else {
      setFeedback({
        type: 'wrong',
        fact: currentFood.fact,
        foodName: currentFood.name
      });
      speakIndonesian(`Kurang tepat, tapi ingat: ${currentFood.fact}`, !voiceEnabled);
    }
  };

  const handleNext = () => {
    playPopSfx(!soundEnabled);
    setFeedback(null);
    if (currentIndex + 1 < ALL_FOODS.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      unlockBadge('food-detective');
      completeMission('mission-food-detective');
      triggerRewardPopup(
        '🍎 DETEKTIF MAKANAN HEBAT!',
        `Kamu berhasil memilah makanan ramah gigi dengan skor ${score + 1}/${ALL_FOODS.length}!`,
        60,
        'Food Detective'
      );
    }
  };

  const handleRestart = () => {
    playClickSfx(!soundEnabled);
    setCurrentIndex(0);
    setScore(0);
    setFeedback(null);
    setIsCompleted(false);
  };

  return (
    <div className="py-6 px-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 mb-2">
          <span className="text-lg">🕵️‍♂️</span>
          <span className="text-xs sm:text-sm font-bold text-amber-800 uppercase tracking-wider">
            FOOD DETECTIVE
          </span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black font-display text-slate-800">
          Teman Gigi vs Jangan Kebanyakan!
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
          Bantu Dental Buddy mengelompokkan makanan yang membuat gigi kuat atau yang harus dibatasi.
        </p>
      </div>

      {!isCompleted ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-slate-200">
          {/* Progress bar */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-4">
            <span>Makanan {currentIndex + 1} dari {ALL_FOODS.length}</span>
            <span className="text-teal-600 tabular-nums">Skor: {score} Benar</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-teal-400 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / ALL_FOODS.length) * 100}%` }}
            />
          </div>

          {/* Active Food Card */}
          <div className="max-w-md mx-auto text-center mb-8">
            <div className="w-32 h-32 sm:w-36 sm:h-36 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-sky-50 to-teal-50 border-3 border-teal-200 shadow-md flex items-center justify-center text-7xl sm:text-8xl transform hover:scale-105 transition-transform">
              {currentFood.emoji}
            </div>

            <h4 className="text-2xl sm:text-3xl font-black font-display text-slate-800 mb-1">
              {currentFood.name}
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Apakah makanan ini termasuk Teman Gigi atau Jangan Kebanyakan?
            </p>
          </div>

          {/* Feedback Overlay if answered */}
          {feedback ? (
            <div
              className={`p-5 rounded-2xl border-2 text-center max-w-lg mx-auto mb-6 animate-in zoom-in-95 duration-150 ${
                feedback.type === 'correct'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-2 font-black text-lg">
                {feedback.type === 'correct' ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    <span>Jawaban Tepat! 🎉</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                    <span>Hampir Benar! 💡</span>
                  </>
                )}
              </div>
              <p className="text-xs sm:text-sm font-medium leading-relaxed mb-4">
                {feedback.fact}
              </p>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs sm:text-sm hover:bg-slate-800 shadow-sm"
              >
                Lanjut Makanan Berikutnya ➔
              </button>
            </div>
          ) : (
            /* Classification Buttons */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              {/* Option 1: TEMAN GIGI */}
              <button
                onClick={() => handleClassify('friend')}
                className="group flex flex-col items-center p-5 rounded-2xl bg-emerald-50 border-3 border-emerald-400 hover:bg-emerald-100 hover:scale-[1.02] active:scale-95 transition-all text-emerald-900 shadow-sm"
              >
                <span className="text-4xl mb-2 group-hover:scale-125 transition-transform">🟢</span>
                <span className="text-lg font-black font-display">TEMAN GIGI</span>
                <span className="text-xs font-semibold text-emerald-700 mt-1">
                  Bikin gigi kuat & bersih
                </span>
              </button>

              {/* Option 2: JANGAN KEBANYAKAN */}
              <button
                onClick={() => handleClassify('limit')}
                className="group flex flex-col items-center p-5 rounded-2xl bg-amber-50 border-3 border-amber-400 hover:bg-amber-100 hover:scale-[1.02] active:scale-95 transition-all text-amber-900 shadow-sm"
              >
                <span className="text-4xl mb-2 group-hover:scale-125 transition-transform">🟠</span>
                <span className="text-lg font-black font-display">JANGAN KEBANYAKAN</span>
                <span className="text-xs font-semibold text-amber-700 mt-1">
                  Banyak gula & asam
                </span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Completion View */
        <div className="bg-white rounded-3xl p-8 text-center shadow-xl border-2 border-slate-200 max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-5xl">
            🏆
          </div>
          <h4 className="text-2xl font-black font-display text-slate-800 mb-2">
            Misi Food Detective Selesai!
          </h4>
          <p className="text-sm text-slate-600 mb-4">
            Kamu menjawab <span className="font-bold text-teal-600">{score} dari {ALL_FOODS.length}</span> makanan dengan benar!
          </p>
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-6">
            ⭐ +60 XP Berhasil Dikantongi!
          </div>
          <button
            onClick={handleRestart}
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Main Sekali Lagi</span>
          </button>
        </div>
      )}
    </div>
  );
};
