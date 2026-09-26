import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, MessageCircle, X, Volume2, ArrowRight, Lightbulb, Bell, CheckCircle2 } from 'lucide-react';
import { playClickSfx, playPopSfx, speakIndonesian } from '../utils/audio';

const DENTAL_TIPS = [
  'Sikat gigi minimal 2 kali sehari: pagi setelah sarapan dan malam sebelum tidur!',
  'Gunakan sikat gigi berbulu halus agar tidak melukai gusimu yang sensitif!',
  'Bakteri plak paling suka sisa permen dan biskuit manis. Jangan lupa berkumur air putih!',
  'Ganti sikat gigimu setiap 3 bulan sekali atau saat bulu sikat sudah mekar!',
  'Lidah juga perlu disikat lembut dari belakang ke depan agar napas selalu segar!',
  'Ke dokter gigi setiap 6 bulan sekali itu asyik, seperti bertualang mengecek kesehatan gigi!'
];

export const DentalBuddyWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [reminderActive, setReminderActive] = useState(false);
  const { xp, level, dailyMissions, setCurrentTab, soundEnabled, voiceEnabled } = useGame();

  const handleToggle = () => {
    playPopSfx(!soundEnabled);
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      const tip = DENTAL_TIPS[tipIndex];
      speakIndonesian(`Hai Dental Hero! ${tip}`, !voiceEnabled);
    }
  };

  const nextTip = () => {
    playClickSfx(!soundEnabled);
    const nextIdx = (tipIndex + 1) % DENTAL_TIPS.length;
    setTipIndex(nextIdx);
    speakIndonesian(DENTAL_TIPS[nextIdx], !voiceEnabled);
  };

  const speakCurrent = () => {
    speakIndonesian(`Hai Sobat! ${DENTAL_TIPS[tipIndex]}`, !voiceEnabled);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-20 lg:bottom-6 right-5 z-40">
        <button
          onClick={handleToggle}
          className="group relative flex items-center gap-2 p-2 sm:p-2.5 bg-white/95 rounded-full shadow-xl border-3 border-teal-400 hover:border-teal-500 hover:scale-105 active:scale-95 transition-all"
          aria-label="Buka Dental Buddy"
        >
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-gradient-to-tr from-sky-400 to-teal-300 flex items-center justify-center p-1">
            <img
              src="/src/assets/images/mascot_dental_buddy_1790413498693.jpg"
              alt="Dental Buddy"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full animate-ping" />
          </div>

          <div className="hidden sm:flex flex-col items-start pr-2">
            <span className="text-xs font-bold text-teal-800 leading-none">Dental Buddy</span>
            <span className="text-[11px] text-teal-600 font-medium">Bantu Kamu! ✨</span>
          </div>

          <div className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-teal-500 text-[10px] font-bold text-white items-center justify-center">!</span>
          </div>
        </button>
      </div>

      {/* Buddy Popup Dialog */}
      {isOpen && (
        <div className="fixed bottom-36 lg:bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 bg-white rounded-3xl shadow-2xl border-4 border-teal-300 p-5 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-teal-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-teal-400 shadow-sm">
                <img
                  src="/src/assets/images/mascot_dental_buddy_1790413498693.jpg"
                  alt="Dental Buddy Mascot"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 font-display leading-tight flex items-center gap-1.5">
                  Dental Buddy
                  <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
                    Teman Setiamu
                  </span>
                </h4>
                <p className="text-xs text-slate-500">Level {level} Hero · {xp} XP</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
              aria-label="Tutup Buddy"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Speech Bubble */}
          <div className="mt-4 p-3.5 bg-gradient-to-r from-sky-50 to-teal-50 rounded-2xl border border-sky-100 relative">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 bg-amber-100 text-amber-600 rounded-xl shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-teal-900 uppercase tracking-wide">
                    Tips Rahasia Gigi Sehat
                  </span>
                  <button
                    onClick={speakCurrent}
                    title="Dengarkan Suara"
                    className="text-teal-600 hover:text-teal-800 p-1"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  "{DENTAL_TIPS[tipIndex]}"
                </p>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-teal-100/60 text-xs">
              <span className="text-slate-400 font-medium">Tips {tipIndex + 1} dari {DENTAL_TIPS.length}</span>
              <button
                onClick={nextTip}
                className="text-teal-600 hover:text-teal-800 font-bold flex items-center gap-1"
              >
                Tips Lainnya <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Daily Missions preview */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Misi Harianmu
              </span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setCurrentTab('achievements');
                }}
                className="text-xs text-sky-600 hover:underline font-semibold"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {dailyMissions.slice(0, 2).map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    setIsOpen(false);
                    setCurrentTab(m.actionTab);
                  }}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium cursor-pointer transition-all border ${
                    m.completed
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-50 hover:bg-sky-50 text-slate-700 border-slate-200/70'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span>{m.icon}</span>
                    <span className="truncate">{m.title}</span>
                  </div>
                  {m.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <span className="text-amber-600 font-bold shrink-0">+{m.xpReward} XP</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Brushing reminder helper */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Bell className="w-4 h-4 text-teal-500" />
              <span>Pengingat Sikat Gigi Malam</span>
            </div>
            <button
              onClick={() => {
                setReminderActive(!reminderActive);
                playClickSfx(!soundEnabled);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                reminderActive
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {reminderActive ? 'Aktif (20:00)' : 'Aktifkan'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
