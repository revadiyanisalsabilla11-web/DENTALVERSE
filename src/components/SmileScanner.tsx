import React, { useState, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Camera, Sparkles, CheckCircle2, RotateCcw, ShieldCheck, Heart, Droplets, Apple, Hospital } from 'lucide-react';
import { playClickSfx, playStarSfx, speakIndonesian } from '../utils/audio';

export const SmileScanner: React.FC = () => {
  const { soundEnabled, voiceEnabled, unlockBadge, completeMission, triggerRewardPopup } = useGame();

  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<'idle' | 'capturing' | 'result'>('idle');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(3);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startSmileCheck = async () => {
    playClickSfx(!soundEnabled);
    setScanStep('capturing');
    setCountdown(3);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }
    } catch {
      // safe fallback if camera unavailable
    }

    // 3.. 2.. 1.. Smile!
    let count = 3;
    const interval = setInterval(() => {
      count--;
      setCountdown(count);
      playClickSfx(!soundEnabled);

      if (count === 0) {
        clearInterval(interval);
        captureAndAnalyze();
      }
    }, 1000);
  };

  const captureAndAnalyze = () => {
    setIsScanning(true);
    // Grab photo from video if available
    if (videoRef.current) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 400;
        canvas.height = videoRef.current.videoHeight || 300;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0);
          setPhotoDataUrl(canvas.toDataURL('image/jpeg'));
        }
      } catch {
        // ignore
      }
      // Stop stream
      if (videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
      }
    }

    // Analysis animation delay
    setTimeout(() => {
      setIsScanning(false);
      setScanStep('result');
      playStarSfx(!soundEnabled);
      unlockBadge('smart-brusher');
      completeMission('mission-smile-scan');
      speakIndonesian('Senyummu luar biasa bercahaya! Rawat terus gigi sehatmu setiap hari!', !voiceEnabled);
      triggerRewardPopup(
        '✨ SMILE CHECK COMPLETE!',
        'Senyum manismu memancarkan semangat ceria! Terus rawat gigi indahmu ya!',
        50,
        'Smart Brusher 📸'
      );
    }, 1800);
  };

  const resetScanner = () => {
    playClickSfx(!soundEnabled);
    setScanStep('idle');
    setPhotoDataUrl(null);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 mb-3">
          <Camera className="w-4 h-4 text-amber-600" />
          <span className="text-xs sm:text-sm font-bold text-amber-800 uppercase tracking-wider">
            SMILE SCAN
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 tracking-tight mb-2">
          Yuk, lihat senyum kamu!
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Tunjukkan senyum terlebar dan terindahmu di depan kamera! Ambil foto ceriamu dan dapatkan tips senyum berkilau!
        </p>
      </div>

      {/* Main View Area */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-slate-200/80 mb-8">
        {scanStep === 'idle' && (
          <div className="text-center py-10">
            <div className="relative w-44 h-44 mx-auto mb-6 rounded-3xl overflow-hidden shadow-xl border-4 border-amber-300">
              <img
                src="/src/assets/images/mascot_dental_buddy_1790413498693.jpg"
                alt="Smile Buddy"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end justify-center p-2">
                <span className="text-white text-xs font-bold">Siap Tersenyum? 😁</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold font-display text-slate-800 mb-2">
              Kamera Siap Mengambil Potret Senyummu
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              Pastikan wajahmu mendapat cahaya terang dan perlihatkan senyum gigimu yang manis!
            </p>

            <button
              onClick={startSmileCheck}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-900 font-extrabold text-lg shadow-lg shadow-amber-300/40 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3"
            >
              <Camera className="w-6 h-6" />
              <span>AMBIL FOTO SENYUMKU (3..2..1)</span>
            </button>
          </div>
        )}

        {scanStep === 'capturing' && (
          <div className="relative aspect-[4/3] max-w-md mx-auto rounded-3xl overflow-hidden bg-slate-900 shadow-2xl flex items-center justify-center border-4 border-amber-300">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />

            {/* Countdown Overlay */}
            {!isScanning ? (
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                <span className="text-7xl font-black font-display text-amber-300 animate-ping">
                  {countdown}
                </span>
                <span className="text-sm font-bold mt-4 tracking-wider uppercase bg-slate-900/80 px-4 py-1.5 rounded-full">
                  Katakan: "CHEESE! 🧀"
                </span>
              </div>
            ) : (
              /* Scanning Laser Effect */
              <div className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce" />
                <span className="mt-4 px-4 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-400/40 animate-pulse">
                  Menganalisis Kilau Senyum... ✨
                </span>
              </div>
            )}
          </div>
        )}

        {scanStep === 'result' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm mb-3">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>✨ SMILE CHECK COMPLETE!</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-display text-slate-800">
                Senyummu Keren Sekali, Sobat Gigi! 🌟
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Photo Display */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border-4 border-amber-300 shadow-md">
                {photoDataUrl ? (
                  <img
                    src={photoDataUrl}
                    alt="Hasil Senyumku"
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-sky-100 to-teal-50 p-6 text-center">
                    <span className="text-6xl mb-2">😁</span>
                    <span className="text-sm font-bold text-teal-800">Senyum Berkilau Terverifikasi!</span>
                  </div>
                )}
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-slate-800 border border-slate-200">
                  Skor Senyum: 100/100 ⭐
                </div>
              </div>

              {/* General Health Education Cards (strictly non-diagnostic) */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-2">
                  4 Rahasia Menjaga Senyum Tetap Berkilau:
                </h4>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-sky-50 border border-sky-200">
                  <div className="p-2 rounded-xl bg-sky-200 text-sky-800 shrink-0">
                    🪥
                  </div>
                  <div>
                    <span className="font-bold text-sky-900 text-xs sm:text-sm block">
                      Sikat Gigi 2× Sehari
                    </span>
                    <p className="text-xs text-sky-700">
                      Pagi hari setelah sarapan dan malam tepat sebelum tidur!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-teal-50 border border-teal-200">
                  <div className="p-2 rounded-xl bg-teal-200 text-teal-800 shrink-0">
                    💧
                  </div>
                  <div>
                    <span className="font-bold text-teal-900 text-xs sm:text-sm block">
                      Minum Air Putih Setelah Makan
                    </span>
                    <p className="text-xs text-teal-700">
                      Membantu membilas sisa makanan dan menetralkan asam di dalam mulut.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="p-2 rounded-xl bg-amber-200 text-amber-800 shrink-0">
                    🍎
                  </div>
                  <div>
                    <span className="font-bold text-amber-900 text-xs sm:text-sm block">
                      Pilih Makanan Baik untuk Gigi
                    </span>
                    <p className="text-xs text-amber-700">
                      Perbanyak buah berserat seperti apel, sayur renyah, dan susu berkalsium!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-rose-50 border border-rose-200">
                  <div className="p-2 rounded-xl bg-rose-200 text-rose-800 shrink-0">
                    🏥
                  </div>
                  <div>
                    <span className="font-bold text-rose-900 text-xs sm:text-sm block">
                      Periksa Gigi Secara Rutin
                    </span>
                    <p className="text-xs text-rose-700">
                      Kunjungi dokter gigi sahabatmu setiap 6 bulan sekali untuk pemeriksaan seru!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex justify-center gap-4 pt-4 border-t border-slate-100">
              <button
                onClick={resetScanner}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Foto Ulang Senyum</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
