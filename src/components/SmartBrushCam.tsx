import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { Camera, Video, VideoOff, RefreshCw, CheckCircle2, AlertCircle, Sparkles, Volume2, ShieldAlert } from 'lucide-react';
import { playClickSfx, playStarSfx, playBrushSwoosh, speakIndonesian } from '../utils/audio';

type AreaStep = 'OUTER' | 'INNER' | 'CHEWING' | 'TONGUE';

interface AreaInfo {
  id: AreaStep;
  name: string;
  subname: string;
  durationSeconds: number;
  instruction: string;
  feedbackGreen: string;
  feedbackYellow: string;
  tipColor: string;
  icon: string;
}

const BRUSH_AREAS: AreaInfo[] = [
  {
    id: 'OUTER',
    name: 'Gigi Depan & Luar',
    subname: 'OUTER SURFACE',
    durationSeconds: 15,
    instruction: 'Pegang sikat miring 45 derajat ke arah gusi, gerakkan memutar lembut melingkar!',
    feedbackGreen: 'Bagus! Gerakan melingkarmu sudah tepat!',
    feedbackYellow: 'Coba lebih pelan dan memutar, ya!',
    tipColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    icon: '🦷'
  },
  {
    id: 'INNER',
    name: 'Bagian Dalam Gigi',
    subname: 'INNER SURFACE',
    durationSeconds: 15,
    instruction: 'Jangan lupa bagian belakang gigi! Miringkan sikat ke atas dan kebawah perlahan.',
    feedbackGreen: 'Hebat! Kuman di sela dalam gigi tersikat bersih!',
    feedbackYellow: 'Jangan lupa bagian belakang gigi!',
    tipColor: 'text-sky-600 bg-sky-50 border-sky-200',
    icon: '🔄'
  },
  {
    id: 'CHEWING',
    name: 'Permukaan Kunyah',
    subname: 'CHEWING SURFACE',
    durationSeconds: 15,
    instruction: 'Sekarang bersihkan permukaan kunyah! Gosok maju mundur di atas geraham.',
    feedbackGreen: 'Mantap! Sisa makanan di geraham terangkat semua!',
    feedbackYellow: 'Sekarang bersihkan permukaan kunyah!',
    tipColor: 'text-purple-600 bg-purple-50 border-purple-200',
    icon: '⚡'
  },
  {
    id: 'TONGUE',
    name: 'Pembersihan Lidah',
    subname: 'TONGUE CLEAN',
    durationSeconds: 10,
    instruction: 'Terakhir, sikat lidah dengan sangat lembut dari belakang ke depan!',
    feedbackGreen: 'Luar biasa! Napasmu segar dan gigi super bersih!',
    feedbackYellow: 'Sikat lidah sangat lembut, jangan ditekan ya!',
    tipColor: 'text-pink-600 bg-pink-50 border-pink-200',
    icon: '👅'
  }
];

export const SmartBrushCam: React.FC = () => {
  const { soundEnabled, voiceEnabled, unlockBadge, completeMission, triggerRewardPopup } = useGame();

  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(BRUSH_AREAS[0].durationSeconds);
  const [isSessionRunning, setIsSessionRunning] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<number>(0);

  const [aiStatus, setAiStatus] = useState<{
    status: 'green' | 'yellow' | 'blue' | 'purple';
    message: string;
    motionLevel: number; // 0 to 100
  }>({
    status: 'green',
    message: 'Arahkan sikat gigimu ke layar. Brush Cam siap mendeteksi gerakan!',
    motionLevel: 50
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const prevFrameData = useRef<Uint8ClampedArray | null>(null);

  const currentArea = BRUSH_AREAS[currentStepIndex];

  // Start webcam
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser tidak mendukung akses kamera.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      setIsDemoMode(false);
      startBrushingSession();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Kamera tidak dapat diakses';
      setCameraError(errMsg);
      // Fallback to interactive demo mode
      setIsDemoMode(true);
      setIsCameraActive(true);
      startBrushingSession();
    }
  };

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setIsCameraActive(false);
    setIsSessionRunning(false);
  }, []);

  const startBrushingSession = () => {
    setIsSessionRunning(true);
    setCurrentStepIndex(0);
    setCompletedSteps(0);
    setSecondsRemaining(BRUSH_AREAS[0].durationSeconds);
    const initialArea = BRUSH_AREAS[0];
    const msg = `🟢 ${initialArea.feedbackGreen}`;
    setAiStatus({ status: 'green', message: msg, motionLevel: 65 });
    speakIndonesian(`Mulai Brush Cam! ${initialArea.instruction}`, !voiceEnabled);
  };

  // Optical motion detection loop
  useEffect(() => {
    if (!isCameraActive || isDemoMode) return;

    const checkMotion = () => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState === 4) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = frame.data;

          if (prevFrameData.current) {
            let diffSum = 0;
            // sample pixels
            for (let i = 0; i < data.length; i += 16) {
              const diff = Math.abs(data[i] - prevFrameData.current[i]);
              if (diff > 25) diffSum++;
            }
            const normalizedMotion = Math.min(100, Math.floor((diffSum / (data.length / 64)) * 100));

            // Feedback based on motion intensity
            if (normalizedMotion > 75) {
              setAiStatus(prev => ({
                ...prev,
                status: 'yellow',
                message: '🟡 Coba lebih pelan, ya! Gerakan lembut menjaga gusimu tetap nyaman.',
                motionLevel: normalizedMotion
              }));
            } else if (normalizedMotion > 20) {
              setAiStatus(prev => ({
                ...prev,
                status: 'green',
                message: `🟢 ${currentArea.feedbackGreen}`,
                motionLevel: normalizedMotion
              }));
              playBrushSwoosh(!soundEnabled);
            }
          }
          prevFrameData.current = new Uint8ClampedArray(data);
        }
      }
      animFrameRef.current = requestAnimationFrame(checkMotion);
    };

    animFrameRef.current = requestAnimationFrame(checkMotion);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isCameraActive, isDemoMode, currentArea, soundEnabled]);

  // Session timer countdown
  useEffect(() => {
    if (!isSessionRunning) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Advance to next step or complete
          const nextIndex = currentStepIndex + 1;
          const newCompleted = completedSteps + 1;
          setCompletedSteps(newCompleted);
          playStarSfx(!soundEnabled);

          if (nextIndex < BRUSH_AREAS.length) {
            setCurrentStepIndex(nextIndex);
            const nextArea = BRUSH_AREAS[nextIndex];
            speakIndonesian(nextArea.instruction, !voiceEnabled);
            return nextArea.durationSeconds;
          } else {
            // FINISHED ALL 4 AREAS!
            clearInterval(timer);
            setIsSessionRunning(false);
            stopCamera();
            unlockBadge('brush-master');
            completeMission('mission-brush-cam');
            triggerRewardPopup(
              '🎉 GREAT JOB!',
              'Kamu berhasil menyelesaikan Brush Mission 4 area dengan sangat cermat!',
              100,
              'Brush Master 🏅'
            );
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSessionRunning, currentStepIndex, completedSteps, soundEnabled, voiceEnabled, stopCamera, unlockBadge, completeMission, triggerRewardPopup]);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Flagship Hero Card */}
      {!isCameraActive ? (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-teal-500 to-emerald-600 p-8 sm:p-12 text-white shadow-2xl">
          {/* Background circles */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-teal-300/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-white/20 backdrop-blur-md text-white font-bold text-xs sm:text-sm mb-4 border border-white/30">
              <Camera className="w-4 h-4" />
              <span>FITUR UNGGULAN DENTALVERSE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight mb-4">
              Sudah jago sikat gigi?
            </h2>

            <p className="text-lg sm:text-xl text-sky-100 font-medium leading-relaxed mb-8 max-w-2xl">
              Yuk, coba sikat gigi sambil dipantau <span className="font-bold text-white underline decoration-amber-300 decoration-3">Brush Cam</span>! Karakter Dental Buddy akan memandu gerakan sikat gigimu di setiap area sampai tuntas!
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={startCamera}
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-teal-800 font-bold text-lg shadow-xl hover:bg-amber-300 hover:text-slate-900 transform active:scale-95 transition-all"
              >
                <Video className="w-6 h-6 text-teal-600 group-hover:text-slate-900 group-hover:scale-110 transition-transform" />
                <span>🎥 MULAI BRUSH CAM</span>
              </button>

              <button
                onClick={() => {
                  setIsDemoMode(true);
                  setIsCameraActive(true);
                  startBrushingSession();
                }}
                className="px-5 py-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm backdrop-blur-md border border-white/30 transition-all"
              >
                🎮 Mode Demo Simulasi
              </button>
            </div>

            {/* Quick feature pill highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 pt-8 border-t border-white/20 text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-medium">
                <span className="text-lg">🎯</span>
                <span>4 Area Gigi Lengkap</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <span className="text-lg">🤖</span>
                <span>Panduan AI Real-Time</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <span className="text-lg">⭐</span>
                <span>Hadiah +100 XP</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <span className="text-lg">🏅</span>
                <span>Badge Brush Master</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Active Camera & Live Session Interface */
        <div className="space-y-6">
          {/* Top Session Progress Bar */}
          <div className="bg-white rounded-3xl p-5 shadow-lg border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                    Sesi Brush Cam Berlangsung
                  </span>
                  {isDemoMode && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Mode Demo Simulasi
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 font-display">
                  Area: {currentArea.name} ({currentArea.subname})
                </h3>
              </div>

              {/* Progress counter */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-medium">Progress Area</span>
                  <span className="text-lg font-black text-teal-600 tabular-nums">
                    {completedSteps} / 4 area selesai ⭐
                  </span>
                </div>
                <button
                  onClick={stopCamera}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold transition-colors"
                >
                  Akhiri Sesi
                </button>
              </div>
            </div>

            {/* Sequence Pills */}
            <div className="grid grid-cols-4 gap-2">
              {BRUSH_AREAS.map((area, idx) => {
                const isCurrent = idx === currentStepIndex;
                const isDone = idx < completedSteps;
                return (
                  <div
                    key={area.id}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : isCurrent
                        ? 'bg-sky-50 border-sky-400 text-sky-800 ring-2 ring-sky-300'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold truncate">
                      {isDone ? '✓ ' : ''}{area.subname}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Camera Workspace: Video & Dental Buddy Assistant */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Camera Viewport (Col 8) */}
            <div className="lg:col-span-8 bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative aspect-[4/3] flex items-center justify-center border-4 border-slate-800">
              {/* Actual Video */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform -scale-x-100 ${isDemoMode ? 'hidden' : 'block'}`}
              />

              {/* Hidden canvas for optical motion analysis */}
              <canvas
                ref={canvasRef}
                width={160}
                height={120}
                className="hidden"
              />

              {/* Demo Mode Visual Canvas */}
              {isDemoMode && (
                <div className="relative w-full h-full bg-gradient-to-tr from-sky-900 via-slate-800 to-teal-900 flex flex-col items-center justify-center p-6 text-center text-white">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-teal-400 mb-4 shadow-xl animate-pulse">
                    <img
                      src="/src/assets/images/mascot_brushing_hero_1790413529123.jpg"
                      alt="Demo Brushing"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h4 className="text-xl font-bold font-display text-teal-300 mb-1">
                    Simulasi Gerakan Sikat Gigi
                  </h4>
                  <p className="text-xs text-sky-200 max-w-sm mb-4">
                    Kamera fisik tidak terdeteksi atau sedang dalam izin terbatas. Sistem AI mensimulasikan panduan interaktif secara sempurna!
                  </p>
                  <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-xs font-mono text-teal-200 border border-white/20">
                    Gerakan Mendeteksi Kecepatan: Optimal (60 rpm)
                  </div>
                </div>
              )}

              {/* Camera Face & Mouth Guide Reticle Overlay */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                <div className="relative w-48 h-56 sm:w-60 sm:h-72 border-2 border-dashed border-teal-400/70 rounded-[48px] flex items-center justify-center">
                  {/* Mouth Box */}
                  <div className="w-28 h-16 sm:w-36 sm:h-20 border-2 border-amber-300 rounded-3xl bg-amber-400/10 flex items-center justify-center">
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest bg-slate-900/80 px-2 py-0.5 rounded-full">
                      Posisikan Mulut Di Sini
                    </span>
                  </div>
                  <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-teal-500 text-white text-[10px] font-bold uppercase tracking-wider">
                    Area Deteksi Sikat
                  </div>
                </div>
              </div>

              {/* Live Overlay Timer */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md text-white border border-white/20">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Live</span>
                <span className="text-xs opacity-40">|</span>
                <span className="text-sm font-black tabular-nums">{secondsRemaining} Detik</span>
              </div>

              {/* Bottom Real-time AI status ticker banner */}
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 truncate">
                  <span className="text-xl shrink-0">{currentArea.icon}</span>
                  <span className="text-xs sm:text-sm font-semibold truncate text-teal-200">
                    {aiStatus.message}
                  </span>
                </div>
                <div className="shrink-0 flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                  <span>Gerakan:</span>
                  <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-400 transition-all duration-300"
                      style={{ width: `${aiStatus.motionLevel}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Dental Buddy Live Guide Panel (Col 4) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-xl border-2 border-teal-200 flex flex-col items-center text-center">
              {/* Mascot Portrait */}
              <div className="relative w-36 h-36 rounded-3xl overflow-hidden border-4 border-teal-400 mb-4 shadow-lg">
                <img
                  src="/src/assets/images/mascot_brushing_hero_1790413529123.jpg"
                  alt="Dental Buddy Guide"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-1 right-1 bg-amber-400 p-1 rounded-full text-xs">
                  ✨
                </div>
              </div>

              <h4 className="text-xl font-bold font-display text-slate-800 mb-1">
                Dental Buddy Coach
              </h4>
              <p className="text-xs text-slate-500 mb-4">Memantau gerakan sikatmu setiap detik</p>

              {/* Speech bubble instruction */}
              <div className="w-full p-4 rounded-2xl bg-teal-50 border-2 border-teal-200 text-left mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                    Langkah Saat Ini:
                  </span>
                  <button
                    onClick={() => speakIndonesian(currentArea.instruction, !voiceEnabled)}
                    className="text-teal-700 hover:text-teal-900 p-0.5"
                    title="Dengarkan Panduan Suara"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                  "{currentArea.instruction}"
                </p>
              </div>

              {/* Cheerful prompt badges */}
              <div className="w-full space-y-2 text-left text-xs font-medium">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span>🟢</span>
                  <span>"Bagus! Gerakanmu sudah tepat!"</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                  <span>🟡</span>
                  <span>"Coba lebih pelan, ya!"</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-sky-50 text-sky-800 border border-sky-200">
                  <span>🔵</span>
                  <span>"Jangan lupa bagian belakang gigi!"</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-purple-50 text-purple-800 border border-purple-200">
                  <span>🟣</span>
                  <span>"Sekarang bersihkan permukaan kunyah!"</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Mandatory Non-Medical Disclaimer Banner */}
      <div className="mt-8 p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 flex items-start gap-3 text-xs leading-relaxed">
        <ShieldAlert className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">Catatan Penting untuk Orang Tua & Anak:</span>
          Fitur Brush Cam dan Smile Scanner adalah fitur edukasi serta panduan kebiasaan menyikat gigi yang menyenangkan, <strong>bukan merupakan alat diagnosis medis klinis</strong>. Selalu konsultasikan kesehatan gigi secara langsung dengan dokter gigi secara rutin setiap 6 bulan sekali.
        </div>
      </div>
    </div>
  );
};
