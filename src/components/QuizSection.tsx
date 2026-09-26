import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { QuizQuestion } from '../types/dentalverse';
import { Sparkles, CheckCircle2, XCircle, RotateCcw, Brain, ArrowRight } from 'lucide-react';
import { playClickSfx, playStarSfx, playPopSfx, speakIndonesian } from '../utils/audio';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Kapan waktu yang paling tepat untuk menyikat gigimu setiap hari?',
    options: [
      'Hanya saat mandi pagi saja',
      'Pagi hari setelah sarapan dan malam sebelum tidur',
      'Setiap kali sebelum makan permen',
      'Seminggu sekali saat libur sekolah'
    ],
    correctIndex: 1,
    explanation: 'Menyikat gigi 2 kali sehari (pagi setelah sarapan dan malam sebelum tidur) melindungi gigi dari kuman yang aktif saat kita tidur!',
    tip: 'Sikat gigi sebelum tidur sangat penting karena saat tidur air liur berkurang!'
  },
  {
    id: 2,
    question: 'Berapa lama waktu ideal yang dibutuhkan untuk menyikat gigi secara menyeluruh?',
    options: [
      '10 detik secepat kilat',
      '30 detik sambil berlari',
      'Minimal 2 menit penuh',
      '15 menit sampai mengantuk'
    ],
    correctIndex: 2,
    explanation: 'Dibutuhkan waktu sekitar 2 menit untuk membersihkan 4 area gigi (luar, dalam, kunyah, dan lidah) dengan seksama!',
    tip: 'Gunakan lagu 2 menit atau fitur Brush Cam Dentalverse sebagai panduan!'
  },
  {
    id: '3' as unknown as number,
    question: 'Apa fungsi utama dari gigi seri yang berada di bagian paling depan mulutmu?',
    options: [
      'Menghaluskan bubur',
      'Memotong gigitan makanan seperti gunting tajam',
      'Menyimpan permen karet',
      'Membantu telinga mendengar'
    ],
    correctIndex: 1,
    explanation: 'Gigi seri berbentuk rata dan tajam seperti pisau kecil khusus untuk memotong makanan!',
    tip: 'Gigi seri atas dan bawah bekerja sama seperti gunting kertas!'
  },
  {
    id: '4' as unknown as number,
    question: 'Makanan manakah di bawah ini yang menjadi "Teman Terbaik" untuk kekuatan enamel gigimu?',
    options: [
      'Permen lolipop kenyal yang manis',
      'Minuman soda bersoda dingin',
      'Susu murni dan buah apel renyah berserat',
      'Biskuit cokelat tebal yang lengket'
    ],
    correctIndex: 2,
    explanation: 'Susu mengandung kalsium untuk mengeraskan enamel, dan apel berserat bertindak seperti sikat pembersih alami!',
    tip: 'Bila kamu makan cokelat, jangan lupa minum air putih untuk membilas sisa gulanya!'
  },
  {
    id: '5' as unknown as number,
    question: 'Berapa bulan sekali sebaiknya kita bertualang ke dokter gigi untuk cek rutin?',
    options: [
      'Hanya kalau gigi sudah berlubang besar dan menangis',
      'Setiap 6 bulan sekali bersama orang tua',
      '10 tahun sekali saja',
      'Tidak perlu ke dokter gigi sama sekali'
    ],
    correctIndex: 1,
    explanation: 'Pemeriksaan rutin setiap 6 bulan membuat dokter gigi bisa mencegah lubang gigi sejak dini sebelum terasa ngilu!',
    tip: 'Klinik gigi modern sangat ramah dan menyenangkan!'
  }
];

export const QuizSection: React.FC = () => {
  const { soundEnabled, voiceEnabled, addXP, completeMission, triggerRewardPopup } = useGame();
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

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
      speakIndonesian(`Yuk ingat: ${currentQ.explanation}`, !voiceEnabled);
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
      completeMission('mission-quiz');
      addXP(70);
      triggerRewardPopup(
        '🧠 JUARA QUIZ GIGI SEHAT!',
        `Kamu berhasil menjawab ${score + (selectedAnswer === currentQ.correctIndex ? 1 : 0)} dari ${QUIZ_QUESTIONS.length} soal dengan cemerlang!`,
        70,
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 mb-3">
          <Brain className="w-4 h-4 text-amber-600" />
          <span className="text-xs sm:text-sm font-bold text-amber-800 uppercase tracking-wider">
            QUIZ CERDAS SENYUM SEHAT
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 tracking-tight mb-2">
          Uji Pengetahuan Petualangmu!
        </h2>
        <p className="text-sm sm:text-base text-slate-600 font-medium">
          Jawab pertanyaan bergambar seru dan dapatkan +70 XP untuk mempercepat kenaikan level Dental Hero-mu!
        </p>
      </div>

      {!quizFinished ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-slate-200">
          
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-3">
            <span>Pertanyaan {currentIdx + 1} dari {QUIZ_QUESTIONS.length}</span>
            <span className="text-amber-600 tabular-nums">Skor: {score} Benar</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
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
                    {currentIdx + 1 === QUIZ_QUESTIONS.length ? 'Lihat Hasil Akhir' : 'Soal Selanjutnya'}
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
          <h3 className="text-2xl font-black font-display text-slate-800 mb-2">
            Quiz Selesai!
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Kamu menjawab <span className="font-bold text-teal-600">{score} dari {QUIZ_QUESTIONS.length}</span> soal dengan benar!
          </p>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-6">
            ⭐ +70 XP Telah Ditambahkan ke Akunmu!
          </div>

          <button
            onClick={handleRestart}
            className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ulangi Quiz</span>
          </button>
        </div>
      )}
    </div>
  );
};
