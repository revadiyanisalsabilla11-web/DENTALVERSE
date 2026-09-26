import React from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, Trophy, Award, X } from 'lucide-react';

export const CelebrationModal: React.FC = () => {
  const { celebration, closeCelebration } = useGame();

  if (!celebration || !celebration.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 sm:p-8 bg-white rounded-3xl shadow-2xl border-4 border-amber-300 text-center transform scale-100 transition-all">
        {/* Close Button */}
        <button
          onClick={closeCelebration}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mascot / Icon Badge */}
        <div className="relative mx-auto mb-4 w-24 h-24 flex items-center justify-center bg-gradient-to-tr from-amber-400 to-yellow-200 rounded-full shadow-inner animate-bounce">
          <Trophy className="w-14 h-14 text-white drop-shadow-md" />
          <div className="absolute -top-1 -right-1 text-2xl animate-spin">✨</div>
          <div className="absolute -bottom-1 -left-1 text-2xl">🌟</div>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-800 mb-2">
          {celebration.title}
        </h3>

        <p className="text-sm sm:text-base text-slate-600 mb-6 font-medium">
          {celebration.message}
        </p>

        {/* XP & Badge Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {celebration.xpEarned > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border-2 border-amber-300 rounded-2xl text-amber-800 font-bold">
              <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
              <span>+{celebration.xpEarned} XP</span>
            </div>
          )}

          {celebration.badgeName && (
            <div className="flex items-center gap-2 px-4 py-2 bg-teal-50 border-2 border-teal-300 rounded-2xl text-teal-800 font-bold">
              <Award className="w-5 h-5 text-teal-600" />
              <span>Badge: {celebration.badgeName}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={closeCelebration}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold text-lg shadow-lg shadow-teal-500/30 transform active:scale-95 transition-all"
        >
          Lanjut Bertualang! 🚀
        </button>
      </div>
    </div>
  );
};
