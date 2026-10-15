import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { LEARNING_MODULES } from '../data/learningModules';
import { 
  BookOpen, Lock, CheckCircle2, ArrowRight, Volume2, 
  Sparkles, Star, Award, ShieldCheck, ChevronDown, ChevronUp
} from 'lucide-react';
import { playClickSfx, playStarSfx, speakIndonesian } from '../utils/audio';

export const LearningModulesView: React.FC = () => {
  const { 
    completedModules, 
    markModuleCompleted, 
    isModuleUnlocked, 
    soundEnabled, 
    voiceEnabled,
    setCurrentTab 
  } = useGame();

  const [activeModuleId, setActiveModuleId] = useState<string>('mod-1');

  const activeModule = LEARNING_MODULES.find(m => m.id === activeModuleId) || LEARNING_MODULES[0];
  const isCompleted = completedModules.includes(activeModule.id);

  const handleSelectModule = (id: string, num: number) => {
    if (!isModuleUnlocked(num)) return;
    playClickSfx(!soundEnabled);
    setActiveModuleId(id);
  };

  const handleFinishCurrent = () => {
    markModuleCompleted(activeModule.id);
    // automatically advance to next if available
    const nextMod = LEARNING_MODULES.find(m => m.number === activeModule.number + 1);
    if (nextMod) {
      setActiveModuleId(nextMod.id);
    }
  };

  const handleListen = () => {
    speakIndonesian(activeModule.content.audioText, !voiceEnabled);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-teal-50 border border-teal-200 mb-3">
          <BookOpen className="w-4 h-4 text-teal-600" />
          <span className="text-xs sm:text-sm font-bold text-teal-800 uppercase tracking-wider">
            KURIKULUM BERTAHAP DENTALVERSE
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 tracking-tight mb-2">
          Jalur Pembelajaran Gigi Berjenjang
        </h2>
        <p className="text-sm sm:text-base text-slate-600 font-medium">
          Pelajari materi secara teratur dari Modul 1 sampai 5. Selesaikan materi untuk membuka kuis dan tantangan berikutnya!
        </p>
      </div>

      {/* Progress Track / Stepper Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-lg border border-slate-200 mb-8">
        <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-500">
          <span>Perjalanan Belajar: {completedModules.length} dari 5 Selesai</span>
          <span className="text-teal-600">{Math.round((completedModules.length / 5) * 100)}% Tuntas</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-teal-400 via-sky-400 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${(completedModules.length / 5) * 100}%` }}
          />
        </div>

        {/* 5 Sequential Module Stepper Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {LEARNING_MODULES.map((mod) => {
            const unlocked = isModuleUnlocked(mod.number);
            const done = completedModules.includes(mod.id);
            const isCurrent = mod.id === activeModuleId;

            return (
              <button
                key={mod.id}
                disabled={!unlocked}
                onClick={() => handleSelectModule(mod.id, mod.number)}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all relative ${
                  isCurrent
                    ? 'bg-sky-50 border-sky-400 shadow-md ring-2 ring-sky-300'
                    : done
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : unlocked
                    ? 'bg-white border-slate-200 hover:border-slate-300'
                    : 'bg-slate-50 border-slate-200/80 text-slate-400 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl">{mod.icon}</span>
                  {done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : !unlocked ? (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <span className="text-[10px] font-bold text-sky-600 bg-sky-100 px-1.5 py-0.5 rounded-md">
                      Buka
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-slate-800 line-clamp-1">
                  Modul {mod.number}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {mod.shortTitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE MODULE DETAIL WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Module Content Reader (Col 8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-slate-200">
          
          {/* Module Title Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activeModule.color} text-white flex items-center justify-center text-3xl shadow-sm`}>
                {activeModule.icon}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 block">
                  Modul Ke-{activeModule.number} · Durasi ~{activeModule.durationMinutes} Menit
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
                  {activeModule.title}
                </h3>
              </div>
            </div>

            <button
              onClick={handleListen}
              className="p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-700 transition-colors shrink-0"
              title="Dengarkan Suara Narator"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Summary Callout */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-teal-50 border border-sky-100 mb-6">
            <p className="text-sm sm:text-base text-slate-800 font-semibold leading-relaxed">
              "{activeModule.content.summary}"
            </p>
          </div>

          {/* Key Bullet Points */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Poin Pembelajaran Inti:
            </h4>
            <div className="space-y-2.5">
              {activeModule.content.keyPoints.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="font-medium leading-relaxed">{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deep Dive Note */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 mb-6 text-xs sm:text-sm">
            <span className="font-bold block uppercase tracking-wider text-amber-800 text-xs mb-1">
              🔍 Penjelasan Medis Ramah Anak:
            </span>
            <p className="font-medium leading-relaxed">{activeModule.content.deepDive}</p>
          </div>

          {/* Fun Fact Badge */}
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 mb-8 text-xs sm:text-sm">
            <span className="font-bold block uppercase tracking-wider text-purple-800 text-xs mb-1">
              ✨ Fakta Ajaib Gigi:
            </span>
            <p className="font-medium leading-relaxed">{activeModule.content.funFact}</p>
          </div>

          {/* Finish / Next Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              {isCompleted ? '✓ Modul ini sudah diselesaikan' : 'Baca seksama sebelum melanjutkan'}
            </span>

            <button
              onClick={handleFinishCurrent}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                isCompleted
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  : 'bg-teal-600 hover:bg-teal-700 text-white active:scale-95'
              }`}
            >
              <span>{isCompleted ? 'Selesai (Pelajari Lagi)' : 'Tandai Selesai & Lanjut (+60 XP)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Sidebar Roadmap & Quiz Gate (Col 4) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Quiz Gate Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-amber-200 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl">
              🧠
            </div>
            <h4 className="text-lg font-bold font-display text-slate-800 mb-1">
              Kuis Evaluasi Pengetahuan
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              {completedModules.length >= 2
                ? 'Kuis sudah TERBUKA! Uji pemahamanmu setelah membaca materi.'
                : `Kuis terkunci. Selesaikan minimal 2 modul untuk membuka kuis (${completedModules.length}/2).`}
            </p>

            <button
              onClick={() => setCurrentTab('quiz')}
              className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all ${
                completedModules.length >= 2
                  ? 'bg-amber-400 hover:bg-amber-500 text-slate-900'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {completedModules.length >= 2 ? 'Kerjakan Kuis Sekarang ➔' : '🔒 Kuis Terkunci'}
            </button>
          </div>

          {/* Quick Brush Cam Practice Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-teal-200 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center text-3xl">
              📷
            </div>
            <h4 className="text-lg font-bold font-display text-slate-800 mb-1">
              Praktikkan dengan Brush Cam
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Buka kamera sambil menyimak tutorial bergerak berdampingan untuk melatih sudut 45 derajat!
            </p>
            <button
              onClick={() => setCurrentTab('brush-cam')}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              Buka Brush Cam 🎥
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
