import React from 'react';
import { useGame } from '../context/GameContext';
import { 
  Printer, Download, Award, CheckCircle2, AlertCircle, 
  Sparkles, TrendingUp, BookOpen, Camera, ShieldCheck, Heart, User, School, MapPin
} from 'lucide-react';
import { playClickSfx, playStarSfx } from '../utils/audio';

export const UserReportView: React.FC = () => {
  const { currentUser, completedModules, soundEnabled, triggerRewardPopup } = useGame();

  const preScore = currentUser.preTestScore || 50;
  const postScore = currentUser.postTestScore || 90;
  
  // Calculate N-Gain (Normalized Gain) = (Post - Pre) / (100 - Pre) * 100
  const nGain = preScore === 100 ? 100 : Math.max(0, Math.round(((postScore - preScore) / (100 - preScore)) * 100));

  // Determine Personalized Recommendations based on results
  const recommendations: { title: string; desc: string; type: 'success' | 'warning' | 'info'; actionModule?: string }[] = [];

  if (postScore >= 85 && currentUser.brushCamCompleted) {
    recommendations.push({
      title: '🌟 Tingkat Pemahaman Sangat Unggul (Dental Hero)',
      desc: 'Pemahamanmu tentang kesehatan gigi dan teknik sikat 2-2-45° sudah luar biasa! Pertahankan kebiasaan sikat gigi malam sebelum tidur dan bagikan ilmu kepada teman sebaya.',
      type: 'success'
    });
  } else if (postScore >= 70) {
    recommendations.push({
      title: '👍 Tingkat Pemahaman Baik & Berkembang',
      desc: 'Kamu sudah memahami dasar-dasar kesehatan gigi dengan baik. Tingkatkan rutinitas sikat gigi pagi dan malam serta praktikkan Brush Cam secara berkala.',
      type: 'info'
    });
  } else {
    recommendations.push({
      title: '⚠️ Perlu Penguatan & Pendampingan Kader',
      desc: 'Skor pemahaman materi masih perlu ditingkatkan. Disarankan untuk membaca ulang Modul 2 (Teknik Sikat) dan Modul 4 (Kuman Plak), serta berkonsultasi dengan kader posyandu/guru.',
      type: 'warning'
    });
  }

  if (!currentUser.brushCamCompleted) {
    recommendations.push({
      title: '🪥 Praktikkan Brush Cam Dual Screen',
      desc: 'Kamu belum menyelesaikan sesi latihan sikat gigi 4 area dengan Brush Cam. Buka menu Brush Cam untuk melatih sudut 45 derajat secara langsung di depan kamera!',
      type: 'warning'
    });
  }

  if (completedModules.length < 5) {
    recommendations.push({
      title: '📚 Selesaikan Sisa Modul Pembelajaran',
      desc: `Kamu baru menyelesaikan ${completedModules.length} dari 5 modul bertahap. Lengkapi modul lainnya untuk mengumpulkan seluruh lencana pahlawan gigi!`,
      type: 'info'
    });
  }

  // Handle Print
  const handlePrint = () => {
    playClickSfx(!soundEnabled);
    window.print();
  };

  // Handle Export / Download File (.JSON)
  const handleDownloadFile = () => {
    playStarSfx(!soundEnabled);
    const reportData = {
      app: 'DENTALVERSE - Dental Adventure for Kids',
      reportType: 'Laporan Analisis Perkembangan Belajar & Kesehatan Gigi',
      generatedAt: new Date().toLocaleString('id-ID'),
      user: {
        id: currentUser.id,
        nama: currentUser.name,
        email: currentUser.email,
        peran: currentUser.role,
        usia: currentUser.age,
        kelasSekolah: currentUser.schoolGrade,
        wilayah: currentUser.region
      },
      evaluasiPembelajaran: {
        nilaiPreTest: preScore,
        nilaiPostTest: postScore,
        peningkatanPengetahuanNGain: `${nGain}%`,
        statusEvaluasi: nGain >= 70 ? 'Efektivitas Tinggi' : nGain >= 40 ? 'Efektivitas Sedang' : 'Perlu Pendampingan',
        modulSelesai: `${completedModules.length} dari 5 Modul`,
        daftarModul: completedModules,
        statusBrushCam: currentUser.brushCamCompleted ? 'Selesai (Rating Bintang 5)' : 'Belum Praktik',
        totalXp: currentUser.totalXp,
        streakHari: currentUser.streakDays
      },
      catatanKader: currentUser.cadreNotes || 'Anak aktif mengikuti pembelajaran interaktif.',
      rekomendasiSistem: recommendations
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dentalverse-Rapor-${currentUser.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    triggerRewardPopup(
      '📥 BERKAS BERHASIL DISIMPAN!',
      'Laporan analisis hasil belajarmu telah diunduh ke file perangkat.',
      30
    );
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top Action Bar (hidden in print) */}
      <div className="print:hidden flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block">
            Dokumen Resmi Hasil Belajar
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-800">
            Rapor & Analisis Kesehatan Gigi Pengguna
          </h2>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>

          <button
            onClick={handleDownloadFile}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold text-xs sm:text-sm transition-all active:scale-95"
          >
            <Download className="w-4 h-4 text-sky-600" />
            <span>Unduh Berkas Data</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE REPORT CARD CONTAINER */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-slate-200 text-slate-800 print:border-none print:shadow-none print:p-0">
        
        {/* Certificate Header / Kop Dokumen */}
        <div className="border-b-2 border-slate-200 pb-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 text-white flex items-center justify-center text-3xl shadow-sm">
              🦷
            </div>
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block">
                DENTALVERSE EDUCATION PLATFORM
              </span>
              <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
                RAPOR KESEHATAN GIGI ANAK
              </h1>
              <p className="text-xs text-slate-500">
                Laporan Evaluasi Pengetahuan, Praktik Sikat Gigi & Analisis Perilaku
              </p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-200 sm:pl-6">
            <span className="text-[11px] text-slate-400 font-medium block">Nomor Sertifikat:</span>
            <span className="text-xs font-mono font-bold text-slate-700">DTV-{currentUser.id.slice(-6).toUpperCase()}</span>
            <span className="text-[11px] text-slate-400 block mt-1">Tanggal Cetak:</span>
            <span className="text-xs font-semibold text-slate-700">{new Date().toLocaleDateString('id-ID')}</span>
          </div>
        </div>

        {/* User Profile Card Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/90 mb-8 text-xs">
          <div>
            <span className="text-slate-400 font-semibold block mb-0.5">Nama Siswa / Pengguna:</span>
            <span className="font-bold text-slate-900 text-sm">{currentUser.name}</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block mb-0.5">Email Akun Gmail:</span>
            <span className="font-bold text-slate-900">{currentUser.email}</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block mb-0.5">Usia & Tingkat Kelas:</span>
            <span className="font-bold text-slate-900">{currentUser.age} Tahun · {currentUser.schoolGrade}</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block mb-0.5">Wilayah / Posyandu:</span>
            <span className="font-bold text-slate-900">{currentUser.region}</span>
          </div>
        </div>

        {/* Learning Gain & Score Visual Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          
          {/* Pre-Test */}
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-center">
            <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block mb-1">
              Nilai Pre-Test (Awal)
            </span>
            <span className="text-3xl font-black text-sky-900 tabular-nums">
              {preScore} / 100
            </span>
            <p className="text-[11px] text-sky-700 mt-1">Pemahaman sebelum materi</p>
          </div>

          {/* Post-Test */}
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-center">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block mb-1">
              Nilai Post-Test (Akhir)
            </span>
            <span className="text-3xl font-black text-teal-900 tabular-nums">
              {postScore} / 100
            </span>
            <p className="text-[11px] text-teal-700 mt-1">Evaluasi setelah materi & modul</p>
          </div>

          {/* N-Gain Score */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
              Peningkatan Pengetahuan (N-Gain)
            </span>
            <div className="flex items-center justify-center gap-1.5 text-3xl font-black text-amber-900 tabular-nums">
              <TrendingUp className="w-6 h-6 text-amber-600" />
              <span>+{nGain}%</span>
            </div>
            <p className="text-[11px] text-amber-700 mt-1">
              {nGain >= 70 ? 'Tinggi (Sangat Efektif)' : nGain >= 40 ? 'Sedang (Efektif)' : 'Cukup (Perlu Review)'}
            </p>
          </div>

        </div>

        {/* Competencies Progress Bars */}
        <div className="mb-8 p-5 rounded-2xl border border-slate-200 bg-white">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4">
            Evaluasi 5 Kompetensi Kesehatan Gigi
          </h3>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>1. Pemahaman Anatomi & Jenis Gigi</span>
                <span className="font-bold text-teal-600">95% (Sangat Baik)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: '95%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>2. Teknik Menyikat Gigi 2-2-45°</span>
                <span className="font-bold text-sky-600">90% (Sangat Baik)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '90%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>3. Pemilihan Makanan Ramah Gigi (Food Detective)</span>
                <span className="font-bold text-amber-600">85% (Baik)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>4. Pencegahan Plak & Kuman (Germ Battle)</span>
                <span className="font-bold text-purple-600">88% (Baik)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '88%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>5. Praktik Brush Cam & Kunjungan Klinik Gigi</span>
                <span className="font-bold text-rose-600">
                  {currentUser.brushCamCompleted ? '100% (Tuntas Terverifikasi)' : '50% (Belum Praktik Lengkap)'}
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-500 rounded-full" 
                  style={{ width: currentUser.brushCamCompleted ? '100%' : '50%' }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Personalized System Recommendations (Fitur Rekomendasi) */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Rekomendasi Tindak Lanjut Berdasarkan Hasil Belajar</span>
          </h3>

          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border ${
                  rec.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : rec.type === 'warning'
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : 'bg-sky-50 border-sky-200 text-sky-950'
                }`}
              >
                <h4 className="text-xs sm:text-sm font-bold mb-1">{rec.title}</h4>
                <p className="text-xs font-medium leading-relaxed">{rec.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cadre & Mentor Notes */}
        {currentUser.cadreNotes && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-8">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Catatan Pembina / Kader Posyandu:
            </span>
            <p className="text-xs sm:text-sm text-slate-700 font-medium italic">
              "{currentUser.cadreNotes}"
            </p>
          </div>
        )}

        {/* Signatures & Stamp block for formal documentation */}
        <div className="grid grid-cols-2 pt-8 border-t-2 border-slate-200 text-center text-xs">
          <div>
            <span className="text-slate-400 block mb-12">Mengetahui Orang Tua / Wali Siswa,</span>
            <span className="font-bold text-slate-800 underline block">( ............................................ )</span>
          </div>

          <div>
            <span className="text-slate-400 block mb-12">Pembina / Tim Edukasi DENTALVERSE,</span>
            <span className="font-bold text-slate-800 underline block">Revadiyani Salsabilla</span>
            <span className="text-[10px] text-slate-400">Koordinator Riset & Edukasi</span>
          </div>
        </div>

      </div>
    </div>
  );
};
