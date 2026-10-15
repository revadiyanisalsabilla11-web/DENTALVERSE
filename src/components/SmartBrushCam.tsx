import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { 
  Camera, Video, VideoOff, RefreshCw, CheckCircle2, 
  Sparkles, Volume2, ShieldAlert, Play, Pause, ChevronRight, 
  Layers, Smile, Award, Info, Rocket, AlertCircle, Eye
} from 'lucide-react';
import { playClickSfx, playStarSfx, playBrushSwoosh, speakIndonesian } from '../utils/audio';

type AreaStep = 'OUTER' | 'INNER' | 'CHEWING' | 'TONGUE';

interface AreaInfo {
  id: AreaStep;
  name: string;
  subname: string;
  durationSeconds: number;
  instruction: string;
  angleGuide: string;
  technique: string;
  feedbackGreen: string;
  feedbackYellow: string;
  color: string;
  icon: string;
}

const BRUSH_AREAS: AreaInfo[] = [
  {
    id: 'OUTER',
    name: 'Gigi Depan & Luar',
    subname: 'OUTER SURFACE',
    durationSeconds: 15,
    instruction: 'Pegang sikat miring 45 derajat ke arah perbatasan gusi. Gerakkan memutar melingkar lembut seperti membuat donat kecil!',
    angleGuide: 'Sudut 45° miring ke arah batas gusi atas & bawah',
    technique: 'Putar melingkar pendek (circular motion) lembut 10x per bagian',
    feedbackGreen: 'Bagus! Gerakan melingkarmu sudah tepat!',
    feedbackYellow: 'Coba lebih pelan, ya! Jaga gusi tetap nyaman.',
    color: 'from-sky-500 to-teal-500',
    icon: '🦷'
  },
  {
    id: 'INNER',
    name: 'Bagian Dalam Gigi',
    subname: 'INNER SURFACE',
    durationSeconds: 15,
    instruction: 'Miringkan sikat secara vertikal di belakang gigi depan dan geraham dalam. Sapu perlahan dari gusi ke ujung gigi!',
    angleGuide: 'Posisikan sikat tegak lurus (vertikal)',
    technique: 'Tarik sikat dari bawah ke atas (gigi bawah) & atas ke bawah (gigi atas)',
    feedbackGreen: 'Hebat! Kuman di sela dalam gigi tersapu bersih!',
    feedbackYellow: 'Jangan lupa bagian belakang gigi!',
    color: 'from-blue-500 to-indigo-500',
    icon: '🔄'
  },
  {
    id: 'CHEWING',
    name: 'Permukaan Kunyah Geraham',
    subname: 'CHEWING SURFACE',
    durationSeconds: 15,
    instruction: 'Letakkan bulu sikat rata di atas parit gigi geraham. Gosok maju dan mundur dengan mantap untuk mengangkat sisa makanan!',
    angleGuide: 'Bulu sikat rata mendatar di atas permukaan gigi',
    technique: 'Gerakan maju mundur (scrubbing back and forth) pada parit geraham',
    feedbackGreen: 'Mantap! Sisa makanan di geraham terangkat semua!',
    feedbackYellow: 'Sekarang bersihkan permukaan kunyah!',
    color: 'from-purple-500 to-pink-500',
    icon: '⚡'
  },
  {
    id: 'TONGUE',
    name: 'Pembersihan Lidah',
    subname: 'TONGUE CLEAN',
    durationSeconds: 10,
    instruction: 'Terakhir, julurkan lidah dan sapukan sikat sangat lembut dari pangkal belakang ke arah depan. Napas jadi super segar!',
    angleGuide: 'Sikat mendatar di atas lidah',
    technique: 'Sapuan satu arah lembut dari pangkal ke ujung depan lidah',
    feedbackGreen: 'Luar biasa! Napasmu segar dan gigi super bersih!',
    feedbackYellow: 'Sikat lidah sangat lembut, jangan ditekan ya!',
    color: 'from-pink-500 to-rose-500',
    icon: '👅'
  }
];

export const SmartBrushCam: React.FC = () => {
  const { soundEnabled, voiceEnabled, markBrushCamCompleted, triggerRewardPopup } = useGame();

  // Camera & Stream states
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isSpaceCosmicMode, setIsSpaceCosmicMode] = useState<boolean>(false);

  // Session & step states
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(BRUSH_AREAS[0].durationSeconds);
  const [isSessionRunning, setIsSessionRunning] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<number>(0);

  // Motion Detection
  const [aiStatus, setAiStatus] = useState<{
    status: 'green' | 'yellow' | 'blue';
    message: string;
    motionLevel: number;
  }>({
    status: 'green',
    message: 'Kamera aktif! Arahkan sikat gigimu ke kamera dan ikuti tutorial di kanan.',
    motionLevel: 55
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const prevFrameData = useRef<Uint8ClampedArray | null>(null);

  const currentArea = BRUSH_AREAS[currentStepIndex];

  // Attach active stream to video ref whenever either stream or element changes
  const attachStreamToVideo = useCallback((mediaStream: MediaStream | null) => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch((err) => {
          console.warn('Auto-play failed, waiting for user click:', err);
        });
      };
      videoRef.current.play().catch((err) => {
        console.warn('Immediate video play error:', err);
      });
    }
  }, []);

  // Request & Start Open Camera
  const startCamera = async () => {
    setCameraLoading(true);
    setCameraError(null);
    setIsCameraActive(true);
    setIsSpaceCosmicMode(false);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser ini tidak mengizinkan akses kamera WebRTC.');
      }

      let userStream: MediaStream;
      try {
        // Preferred user-facing camera
        userStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false
        });
      } catch {
        // Fallback generic video constraint
        userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      setStream(userStream);
      setCameraLoading(false);
      attachStreamToVideo(userStream);

      // Start the interactive brushing session
      startBrushingSession();
    } catch (err: any) {
      console.warn('Gagal membuka webcam fisik:', err);
      setCameraLoading(false);
      setCameraError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Izin kamera ditolak. Silakan klik ikon gembok/kamera di bilah URL browser untuk mengizinkan kamera.'
          : err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError'
          ? 'Perangkat webcam/kamera tidak terdeteksi pada komputer atau ponsel Anda.'
          : 'Kamera tidak dapat dibuka (' + (err.message || 'error') + '). Anda dapat mencoba lagi atau menggunakan mode cermin kosmik di bawah.'
      );
      // Auto-fallback to 3D cosmic space mirror so user is never stuck
      setIsSpaceCosmicMode(true);
      startBrushingSession();
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setIsCameraActive(false);
    setIsSessionRunning(false);
  }, [stream]);

  const startBrushingSession = () => {
    setIsSessionRunning(true);
    setCurrentStepIndex(0);
    setCompletedSteps(0);
    setSecondsRemaining(BRUSH_AREAS[0].durationSeconds);
    const initialArea = BRUSH_AREAS[0];
    setAiStatus({
      status: 'green',
      message: `🟢 ${initialArea.feedbackGreen}`,
      motionLevel: 65
    });
    speakIndonesian(`Buka Brush Cam! ${initialArea.instruction}`, !voiceEnabled);
  };

  // Re-attach video stream whenever video element mounts
  useEffect(() => {
    if (isCameraActive && stream && videoRef.current) {
      attachStreamToVideo(stream);
    }
  }, [isCameraActive, stream, attachStreamToVideo]);

  // Optical motion detection loop
  useEffect(() => {
    if (!isCameraActive || isSpaceCosmicMode) return;

    const checkMotion = () => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState >= 2) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = frame.data;

          if (prevFrameData.current) {
            let diffSum = 0;
            for (let i = 0; i < data.length; i += 16) {
              const diff = Math.abs(data[i] - prevFrameData.current[i]);
              if (diff > 25) diffSum++;
            }
            const normalizedMotion = Math.min(100, Math.floor((diffSum / (data.length / 64)) * 100));

            if (normalizedMotion > 75) {
              setAiStatus(prev => ({
                ...prev,
                status: 'yellow',
                message: '🟡 ' + currentArea.feedbackYellow,
                motionLevel: normalizedMotion
              }));
            } else if (normalizedMotion > 15) {
              setAiStatus(prev => ({
                ...prev,
                status: 'green',
                message: '🟢 ' + currentArea.feedbackGreen,
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
  }, [isCameraActive, isSpaceCosmicMode, currentArea, soundEnabled]);

  // Session timer countdown
  useEffect(() => {
    if (!isSessionRunning) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
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
            // FINISHED ALL 4 AREAS
            clearInterval(timer);
            setIsSessionRunning(false);
            stopCamera();
            markBrushCamCompleted(5);
            triggerRewardPopup(
              '🎉 BRUSH MASTER JUARA!',
              'Luar biasa! Kamu berhasil menyikat 4 area gigi sambil memantau tutorial berdampingan dengan sempurna!',
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
  }, [isSessionRunning, currentStepIndex, completedSteps, soundEnabled, voiceEnabled, stopCamera, markBrushCamCompleted, triggerRewardPopup]);

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Intro Hero when camera is off */}
      {!isCameraActive ? (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-teal-950 p-6 sm:p-10 text-white shadow-2xl border-2 border-teal-500/30">
          
          {/* 3D Dental Space Cosmic Background Watermark */}
          <div className="absolute right-0 top-0 w-full sm:w-1/2 h-full opacity-25 pointer-events-none overflow-hidden">
            <img
              src="/src/assets/images/dental_space_galaxy_1792076218171.jpg"
              alt="Dental Space Galaxy"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-teal-500/20 backdrop-blur-md text-teal-300 font-bold text-xs sm:text-sm mb-4 border border-teal-400/30">
              <Camera className="w-4 h-4 text-amber-300" />
              <span>FITUR UTAMA: LIVE OPEN CAMERA + TUTORIAL</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight mb-4">
              Sikat Gigi di Depan Kamera Berdampingan Tutorial!
            </h2>

            <p className="text-sm sm:text-base text-sky-100 font-medium leading-relaxed mb-6 max-w-xl">
              Nyalakan kamera ponsel atau laptopmu. Layar akan membelah menjadi dua: sisi kiri menampilkan wajahmu secara langsung, dan sisi kanan memutar animasi gerakan sikat gigi 4 zona berurutan!
            </p>

            {/* Launch Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={startCamera}
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-teal-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Video className="w-6 h-6 text-slate-950" />
                <span>🎥 BUKA KAMERA & MULAI SEKARANG</span>
              </button>

              <button
                onClick={() => {
                  setIsSpaceCosmicMode(true);
                  setIsCameraActive(true);
                  startBrushingSession();
                }}
                className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-white/20 transition-all cursor-pointer"
              >
                <Rocket className="w-4 h-4 text-amber-300" />
                <span>🚀 Mode Cermin Kosmik Gigi 3D</span>
              </button>
            </div>

            {/* 4 Feature Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/15 text-xs">
              <div className="flex items-center gap-2">
                <span>📹</span>
                <span>Open Webcam Real-Time</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🪥</span>
                <span>Tutorial Gerakan 45°</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⏱️</span>
                <span>Panduan Timer 60 Detik</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⭐</span>
                <span>Nilai Masuk Rapor Siswa</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ACTIVE DUAL-SCREEN WORKSPACE */
        <div className="space-y-6">
          
          {/* Top Progress & Step Switcher */}
          <div className="bg-white rounded-3xl p-5 shadow-lg border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  Kamera & Tutorial Berdampingan Aktif
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 font-display">
                  {currentArea.name} ({currentArea.subname})
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-medium block">Kemajuan Area</span>
                  <span className="text-base sm:text-lg font-black text-teal-600 tabular-nums">
                    {completedSteps} / 4 area selesai ⭐
                  </span>
                </div>

                {/* Switch to real camera if currently in cosmic mode */}
                {isSpaceCosmicMode && (
                  <button
                    onClick={startCamera}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold transition-all border border-teal-200"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Nyalakan Webcam Fisik</span>
                  </button>
                )}

                <button
                  onClick={stopCamera}
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors border border-rose-200"
                >
                  Tutup Sesi
                </button>
              </div>
            </div>

            {/* Steps indicator */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BRUSH_AREAS.map((area, idx) => {
                const isCurrent = idx === currentStepIndex;
                const isDone = idx < completedSteps;
                return (
                  <button
                    key={area.id}
                    onClick={() => {
                      setCurrentStepIndex(idx);
                      setSecondsRemaining(area.durationSeconds);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : isCurrent
                        ? 'bg-sky-50 border-sky-400 text-sky-900 ring-2 ring-sky-300'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    <div className="text-[11px] font-bold truncate">
                      {isDone ? '✓ ' : ''}{idx + 1}. {area.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DUAL SCREEN VIEW: CAMERA (LEFT) + TUTORIAL (RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* SCREEN 1 (LEFT 6 COLS): OPEN CAMERA VIEWPORT */}
            <div className="lg:col-span-6 bg-slate-950 rounded-3xl overflow-hidden shadow-xl border-4 border-slate-800 relative aspect-[4/3] flex items-center justify-center">
              
              {/* Actual Live Camera Feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform -scale-x-100 ${
                  isSpaceCosmicMode || cameraLoading ? 'hidden' : 'block'
                }`}
              />

              <canvas ref={canvasRef} width={160} height={120} className="hidden" />

              {/* Camera Loading Spinner */}
              {cameraLoading && (
                <div className="flex flex-col items-center justify-center p-6 text-white text-center">
                  <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mb-3" />
                  <span className="text-sm font-bold text-teal-300">Menghubungkan ke Webcam...</span>
                  <span className="text-xs text-slate-400 mt-1">Harap klik "Izinkan" jika browser meminta izin kamera.</span>
                </div>
              )}

              {/* 3D Cosmic Space Mirror Mode (Used when user chooses space mode or camera device is blocked) */}
              {isSpaceCosmicMode && !cameraLoading && (
                <div className="relative w-full h-full flex flex-col items-center justify-center text-center text-white overflow-hidden">
                  <img
                    src="/src/assets/images/dental_space_hero_1792076219545.jpg"
                    alt="Tooth Astronaut 3D Mascot"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  <div className="relative z-10 p-4 max-w-xs mt-auto mb-10">
                    <span className="inline-block px-3 py-1 rounded-full bg-teal-500/80 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-white mb-2">
                      🚀 Mode Cermin Kosmik Gigi 3D
                    </span>
                    <p className="text-xs text-sky-100 font-semibold drop-shadow">
                      Ikuti gerakan sikat gigi astronot gigi ini dan tutorial di sebelah kanan!
                    </p>
                  </div>
                </div>
              )}

              {/* Camera Error / Permission Notice with One-Click Retry */}
              {cameraError && !cameraLoading && (
                <div className="absolute inset-x-4 top-14 bg-rose-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-rose-400/40 text-white z-20 flex items-start gap-2.5 text-xs shadow-lg">
                  <AlertCircle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold block mb-0.5 text-rose-200">Perhatian Kamera:</span>
                    <p className="text-[11px] leading-relaxed text-rose-100">{cameraError}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={startCamera}
                        className="px-3 py-1 bg-white text-rose-900 rounded-lg font-bold text-[10px] hover:bg-rose-100 transition-colors"
                      >
                        🔄 Coba Izinkan Kamera Lagi
                      </button>
                      <button
                        onClick={() => setIsSpaceCosmicMode(true)}
                        className="px-3 py-1 bg-rose-800 text-white rounded-lg font-bold text-[10px] hover:bg-rose-700 transition-colors"
                      >
                        Lanjut Mode Kosmik
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tooth Alignment Overlay Guide (Only when live video is active) */}
              {!isSpaceCosmicMode && !cameraLoading && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
                  <div className="w-52 h-60 border-2 border-dashed border-teal-400/70 rounded-[44px] flex items-center justify-center relative">
                    <div className="w-32 h-20 border-2 border-amber-300 rounded-2xl bg-amber-400/10 flex items-center justify-center shadow-lg">
                      <span className="text-[10px] font-bold text-amber-300 bg-slate-950/80 px-2.5 py-0.5 rounded-full">
                        Posisikan Gigi & Sikat
                      </span>
                    </div>
                    <span className="absolute -top-3 px-2.5 py-0.5 rounded-md bg-teal-500 text-white text-[9px] font-bold shadow-xs">
                      KAMERA SIKAT REAL-TIME
                    </span>
                  </div>
                </div>
              )}

              {/* Live Status Badge */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white border border-white/20 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold text-emerald-300">
                  {isSpaceCosmicMode ? 'Cosmic Cam' : 'Live Camera'}
                </span>
                <span className="opacity-40">|</span>
                <span className="font-black tabular-nums">{secondsRemaining}s</span>
              </div>

              {/* AI Feedback Bar Overlay */}
              <div className="absolute bottom-3 left-3 right-3 z-10 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-2xl border border-white/15 text-white flex items-center justify-between text-xs">
                <span className="text-teal-200 font-semibold truncate mr-2">
                  {aiStatus.message}
                </span>
                <span className="shrink-0 font-bold text-amber-300 tabular-nums">
                  {aiStatus.motionLevel}% Aktif
                </span>
              </div>
            </div>

            {/* SCREEN 2 (RIGHT 6 COLS): TUTORIAL & ANIMATED 3D VISUAL GUIDE */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-xl border-2 border-teal-200 flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-teal-100 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 rounded-2xl bg-teal-50 border border-teal-200">
                      {currentArea.icon}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                        Tutorial Menyikat Gigi Berdampingan
                      </span>
                      <h4 className="text-lg sm:text-xl font-bold font-display text-slate-800">
                        {currentArea.name}
                      </h4>
                    </div>
                  </div>

                  <button
                    onClick={() => speakIndonesian(currentArea.instruction, !voiceEnabled)}
                    className="p-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 cursor-pointer"
                    title="Dengarkan Suara Tutorial"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Animated Diagram of the Movement */}
                <div className="relative w-full h-44 rounded-2xl bg-gradient-to-tr from-sky-50 via-teal-50 to-indigo-50 border border-teal-100 flex items-center justify-center p-4 mb-4 overflow-hidden">
                  {/* Visual animation according to step */}
                  {currentArea.id === 'OUTER' && (
                    <div className="flex flex-col items-center animate-bounce">
                      <div className="text-5xl mb-2">🦷 🪥</div>
                      <div className="px-3 py-1 bg-white rounded-full text-xs font-bold text-teal-800 shadow-sm border border-teal-200">
                        Gerakan Memutar Melingkar 45°
                      </div>
                    </div>
                  )}

                  {currentArea.id === 'INNER' && (
                    <div className="flex flex-col items-center animate-pulse">
                      <div className="text-5xl mb-2">🔄 🪥</div>
                      <div className="px-3 py-1 bg-white rounded-full text-xs font-bold text-blue-800 shadow-sm border border-blue-200">
                        Sikat Vertikal: Tarik dari Gusi ke Gigi
                      </div>
                    </div>
                  )}

                  {currentArea.id === 'CHEWING' && (
                    <div className="flex flex-col items-center">
                      <div className="text-5xl mb-2 animate-pulse">⚡ 🪥</div>
                      <div className="px-3 py-1 bg-white rounded-full text-xs font-bold text-purple-800 shadow-sm border border-purple-200">
                        Maju - Mundur pada Parit Geraham
                      </div>
                    </div>
                  )}

                  {currentArea.id === 'TONGUE' && (
                    <div className="flex flex-col items-center">
                      <div className="text-5xl mb-2">👅 🪥</div>
                      <div className="px-3 py-1 bg-white rounded-full text-xs font-bold text-pink-800 shadow-sm border border-pink-200">
                        Sapu Lembut dari Pangkal ke Ujung Depan
                      </div>
                    </div>
                  )}

                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-teal-600 text-white text-[10px] font-bold">
                    Panduan Visual
                  </div>
                </div>

                {/* Instruction details */}
                <div className="space-y-2.5 mb-4 text-xs">
                  <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-slate-800">
                    <span className="font-bold text-teal-900 block mb-0.5">📐 Panduan Sudut Sikat:</span>
                    <span>{currentArea.angleGuide}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-slate-800">
                    <span className="font-bold text-sky-900 block mb-0.5">🔄 Teknik Gerakan Tepat:</span>
                    <span>{currentArea.technique}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Advice */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Waktu Area: {secondsRemaining}s</span>
                <span className="text-teal-600 font-bold">Terus ikuti gerakan cermin! ✨</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Educational Notice */}
      <div className="mt-8 p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 flex items-start gap-3 text-xs leading-relaxed">
        <ShieldAlert className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">Pemberitahuan Edukatif:</span>
          Fitur Brush Cam ini dirancang untuk melatih pembiasaan teknik menyikat gigi yang tepat bagi anak-anak berdampingan dengan tutorial visual. <strong>Bukan pengganti diagnosis klinis dokter gigi.</strong> Lakukan periksa gigi rutin setiap 6 bulan sekali.
        </div>
      </div>
    </div>
  );
};
