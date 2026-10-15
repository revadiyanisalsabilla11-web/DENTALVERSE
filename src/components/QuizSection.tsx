import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { QuizQuestion } from '../types/dentalverse';
import { 
  Sparkles, CheckCircle2, XCircle, RotateCcw, Brain, 
  ArrowRight, Lock, BookOpen, Award, ShieldAlert
} from 'lucide-react';
import { playClickSfx, playStarSfx, playPopSfx, speakIndonesian } from '../utils/audio';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Kapan waktu yang paling tepat dan wajib untuk menyikat gigimu setiap hari?',
    options: [
      'Hanya saat mandi pagi saja',
      'Pagi hari setelah sarapan dan malam sebelum tidur',
      'Setiap kali sebelum memakan permen',
      'Seminggu sekali saat hari libur sekolah'
    ],
    correctIndex: 1,
    category: 'Jadwal & Rutinitas',
    explanation: 'Menyikat gigi 2 kali sehari (pagi setelah sarapan dan malam sebelum tidur) melindungi gigi dari kuman yang 2 kali lipat lebih aktif saat kita tertidur!',
    tip: 'Saat tidur, air liur pembersih berkurang drastis sehingga menyikat malam adalah tameng terpenting!'
  },
  {
    id: 2,
    question: 'Berapa durasi waktu dan sudut kemiringan sikat gigi yang dianjurkan dalam rumus 2-2-45°?',
    options: [
      '10 detik dengan sikat tegak lurus',
      'Minimal 2 menit dengan sudut 45 derajat ke arah perbatasan gusi',
      '30 detik sambil berlari dengan sudut 90 derajat',
      '15 menit sampai pasta gigi habis'
    ],
    correctIndex: 1,
    category: 'Teknik 2-2-45°',
    explanation: 'Rumus sakti 2-2-45° berarti 2 kali sehari, selama 2 menit penuh, dengan sudut 45 derajat agar bulu sikat membersihkan sela leher gigi tanpa melukai gusi!',
    tip: 'Bagi waktu 30 detik untuk setiap kuadran (atas kanan, atas kiri, bawah kanan, bawah kiri).'
  },
  {
    id: 3,
    question: 'Gigi seri yang berada di bagian paling depan mulutmu memiliki kekuatan super untuk...',
    options: [
      'Menggiling makanan menjadi bubur',
      'Memotong gigitan makanan seperti gunting tajam',
      'Menyimpan permen karet di dalam pipi',
      'Membantu telinga mendengarkan suara'
    ],
    correctIndex: 1,
    category: 'Anatomi Gigi',
    explanation: 'Gigi seri berbentuk pipih dan tajam khusus untuk memotong makanan. Sedangkan gigi taring merobek dan geraham menggiling makanan.',
    tip: 'Gigi seri adalah gigi pertama yang biasanya tumbuh saat usia bayi 6-10 bulan!'
  },
  {
    id: 4,
    question: 'Makanan manakah di bawah ini yang menjadi "Teman Terbaik" pelindung perisai enamel gigi?',
    options: [
      'Permen lolipop kenyal yang manis dan lengket',
      'Minuman bersoda dingin tinggi gula',
      'Susu berkalsium dan buah apel segar renyah berserat',
      'Biskuit cokelat tebal yang menempel berjam-jam'
    ],
    correctIndex: 2,
    category: 'Nutrisi Sahabat Gigi',
    explanation: 'Susu mengandung kalsium dan fosfat untuk remineralisasi enamel, dan apel berserat bertindak seperti pembersih plak mekanik alami!',
    tip: 'Bila mengonsumsi camilan manis, segeralah berkumur dengan air putih hangat.'
  },
  {
    id: 5,
    question: 'Berapa bulan sekali sebaiknya kita bertualang ke dokter gigi untuk kontrol kesehatan rutin?',
    options: [
      'Hanya kalau gigi sudah berlubang besar dan terasa sakit sekali',
      'Setiap 6 bulan sekali bersama orang tua',
      'Cukup 10 tahun sekali saja',
      'Tidak perlu periksa ke dokter gigi sama sekali'
    ],
    correctIndex: 1,
    category: 'Pencegahan Klinik Gigi',
    explanation: 'Pemeriksaan rutin setiap 6 bulan membuat dokter gigi bisa mencegah lubang gigi sejak dini sebelum terasa ngilu dan mengoleskan fluoride pelindung!',
    tip: 'Klinik gigi modern sangat ramah dan menyenangkan seperti mencoba kursi astronot.'
  }
];

export const QuizSection: React.FC = () => {
  const { 
    isQuizUnlocked, 
    completedModules, 
    setCurrentTab, 
    soundEnabled, 
    voiceEnabled, 
    addXP, 
    saveQuizScore, 
    triggerRewardPopup 
  } = useGame();

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // IF QUIZ IS LOCKED
  if (!isQuizUnlocked) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border-2 border-amber-300">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-amber-100 border-2 border-amber-300 text-amber-700 flex items-center justify-center text-4xl shadow-sm">
            🔒
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider mb-3 inline-block">
            Gamifikasi Kuis Terkunci
          </span>

          <h3 className="text-2xl font-black font-display text-slate-800 mb-2">
            Pelajari Materi Terlebih Dahulu!
          </h3>

          <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6">
            Agar pemahamanmu tentang kesehatan gigi benar-benar mendalam, kuis evaluasi ini dikunci sampai kamu menyelesaikan <strong>minimal 2 modul pembelajaran bertahap</strong>.
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6 text-xs text-slate-700 font-semibold flex items-center justify-between">
            <span>Status Modul Selesai:</span>
            <span className="text-amber-700 font-bold">{completedModules.length} / 2 Modul Terpenuhi</span>
          </div>

          <button
            onClick={() => setCurrentTab('learning-modules')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Buka Modul Pembelajaran Sekarang ➔</span>
          </button>
        </div>
      </div>
    );
  }

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    playClickSfx(!soundEnabled);
    setSelectedAnswer(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      playStarSfx(!soundEnabled);
      setScore(prev => prev + 1);
      speakIndonesian(`Benar sekali! ${currentQ.explanation}`, !voiceEnabled);
    } else {
      speakIndonesian(`Yuk perhatikan: ${currentQ.explanation}`, !voiceEnabled);
    }
  };

  const handleNext = () => {
    playPopSfx(!soundEnabled);
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      const finalScore = Math.round(((score + (selectedAnswer === currentQ.correctIndex ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100);
      saveQuizScore(finalScore, 'post');
      addXP(90);
      triggerRewardPopup(
        '🧠 POST-TEST EVALUASI SELESAI!',
        `Kamu meraih skor ${finalScore}/100! Hasil evaluasi tersimpan rapi di rapor belajarmu.`,
        90,
        'Quiz Master'
      );
    }
  };

  const handleRestart = () => {
    playClickSfx(!soundEnabled);
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 mb-3">
          <Brain className="w-4 h-4 text-emerald-600" />
          <span className="text-xs sm:text-sm font-bold text-emerald-800 uppercase tracking-wider">
            POST-TEST EVALUASI PENGETAHUAN GIGI
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 tracking-tight mb-2">
          Uji Pengetahuan Senyum Sehatmu!
        </h2>
        <p className="text-sm sm:text-base text-slate-600 font-medium">
          Jawab 5 soal bergambar berdasarkan modul yang telah kamu pelajari. Skor akan tersimpan di profil dan rapormu!
        </p>
      </div>

      {!quizFinished ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-slate-200">
          
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-3">
            <span>Soal {currentIdx + 1} dari {QUIZ_QUESTIONS.length} · Topik: {currentQ.category}</span>
            <span className="text-amber-600 tabular-nums">Skor: {score} Benar</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-teal-400 transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 leading-snug mb-6 text-center sm:text-left">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === currentQ.correctIndex;
              let btnStyle = 'bg-white border-slate-200/90 hover:border-sky-300 text-slate-700';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-bold';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl border-2 text-left text-sm sm:text-base transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {isAnswered && (
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 mb-6 animate-in fade-in duration-150">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800 block mb-1">
                💡 Penjelasan Edukatif:
              </span>
              <p className="text-xs sm:text-sm text-sky-900 font-medium mb-4 leading-relaxed">
                {currentQ.explanation}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2"
                >
                  <span>
                    {currentIdx + 1 === QUIZ_QUESTIONS.length ? 'Lihat Hasil Akhir & Nilai' : 'Soal Selanjutnya'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* Quiz Complete Screen */
        <div className="bg-white rounded-3xl p-8 text-center shadow-xl border-2 border-slate-200 max-w-md mx-auto">
          <div className="text-6xl mb-4 animate-bounce">🎓✨</div>
          <h3 className="text-2xl font-black font-display text-slate-800 mb-1">
            Evaluasi Selesai!
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Kamu menjawab <span className="font-bold text-teal-600">{score} dari {QUIZ_QUESTIONS.length}</span> soal dengan benar (Nilai: {Math.round((score / QUIZ_QUESTIONS.length) * 100)})!
          </p>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-6">
            ⭐ +90 XP Ditambahkan & Skor Disimpan Otomatis ke Rapor!
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => setCurrentTab('my-report')}
              className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all"
            >
              Lihat & Cetak Rapor Belajar ➔
            </button>
            <button
              onClick={handleRestart}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Ulangi Kuis
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
