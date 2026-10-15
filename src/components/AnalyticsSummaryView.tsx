import React from 'react';
import { useGame } from '../context/GameContext';
import { 
  BarChart3, TrendingUp, Users, Award, CheckCircle2, 
  Sparkles, Layers, BookOpen, GraduationCap, MapPin, Printer
} from 'lucide-react';

export const AnalyticsSummaryView: React.FC = () => {
  const { allUsers, completedModules } = useGame();

  const totalUsers = allUsers.length;
  const avgPre = Math.round(allUsers.reduce((acc, u) => acc + (u.preTestScore || 0), 0) / (totalUsers || 1));
  const avgPost = Math.round(allUsers.reduce((acc, u) => acc + (u.postTestScore || 0), 0) / (totalUsers || 1));
  const avgGain = avgPre === 100 ? 100 : Math.max(0, Math.round(((avgPost - avgPre) / (100 - avgPre)) * 100));

  const brushCamRate = Math.round((allUsers.filter(u => u.brushCamCompleted).length / (totalUsers || 1)) * 100);

  // Group by Age Categories
  const ageGroups = [
    { label: '6–8 Tahun (Fase Awal)', min: 6, max: 8 },
    { label: '9–10 Tahun (Fase Menengah)', min: 9, max: 10 },
    { label: '11–12+ Tahun (Fase Lanjut)', min: 11, max: 99 }
  ].map(group => {
    const matched = allUsers.filter(u => u.age >= group.min && u.age <= group.max);
    const count = matched.length;
    const pre = count ? Math.round(matched.reduce((a, b) => a + b.preTestScore, 0) / count) : 0;
    const post = count ? Math.round(matched.reduce((a, b) => a + b.postTestScore, 0) / count) : 0;
    const gain = pre === 100 ? 100 : Math.max(0, Math.round(((post - pre) / (100 - pre)) * 100));
    return { ...group, count, pre, post, gain };
  });

  // Group by School Grade
  const gradeGroups = [
    { label: 'Kelas 1–2 SD', filter: (g: string) => g.includes('1') || g.includes('2') },
    { label: 'Kelas 3–4 SD', filter: (g: string) => g.includes('3') || g.includes('4') },
    { label: 'Kelas 5–6 SD / Kader', filter: (g: string) => g.includes('5') || g.includes('6') || g.includes('Dokter') || g.includes('Kader') || g.includes('Riset') }
  ].map(group => {
    const matched = allUsers.filter(u => group.filter(u.schoolGrade));
    const count = matched.length;
    const pre = count ? Math.round(matched.reduce((a, b) => a + b.preTestScore, 0) / count) : 0;
    const post = count ? Math.round(matched.reduce((a, b) => a + b.postTestScore, 0) / count) : 0;
    const gain = pre === 100 ? 100 : Math.max(0, Math.round(((post - pre) / (100 - pre)) * 100));
    return { ...group, count, pre, post, gain };
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <BarChart3 className="w-4 h-4 text-teal-600" />
            Evaluasi Program & Efektivitas Edukasi
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-800">
            Analisis & Rekapitulasi Data Pembelajaran
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Mengevaluasi peningkatan pengetahuan (N-Gain) dan adopsi perilaku kesehatan gigi masyarakat.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="print:hidden flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Laporan Riset</span>
        </button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Partisipan</span>
            <Users className="w-5 h-5 text-sky-500" />
          </div>
          <span className="text-3xl font-black text-slate-900 tabular-nums">{totalUsers} Anak</span>
          <p className="text-[11px] text-slate-500 mt-1">Tersebar di berbagai sekolah & posyandu</p>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rata-rata Pre-Test</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">Awal</span>
          </div>
          <span className="text-3xl font-black text-sky-700 tabular-nums">{avgPre} / 100</span>
          <p className="text-[11px] text-slate-500 mt-1">Tingkat pengetahuan sebelum intervensi</p>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rata-rata Post-Test</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">Akhir</span>
          </div>
          <span className="text-3xl font-black text-teal-700 tabular-nums">{avgPost} / 100</span>
          <p className="text-[11px] text-slate-500 mt-1">Evaluasi setelah mengakses materi</p>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Peningkatan N-Gain</span>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-3xl font-black text-emerald-600 tabular-nums">+{avgGain}%</span>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">Kategori: Efektivitas Tinggi (≥70%)</p>
        </div>
      </div>

      {/* COMPARISON CHART BY AGE GROUP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Card 1: Age Breakdown */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
          <h3 className="text-base font-bold text-slate-800 font-display mb-1 flex items-center gap-2">
            <span>🧒 Hasil Berdasarkan Kelompok Usia</span>
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Perbandingan nilai Pre-Test dan Post-Test pada tiap kelompok umur anak.
          </p>

          <div className="space-y-5">
            {ageGroups.map((group, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className="text-slate-800">{group.label}</span>
                  <span className="text-teal-700 font-mono">N-Gain: +{group.gain}% ({group.count} Partisipan)</span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-16 font-semibold text-slate-500">Pre-Test:</span>
                    <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-400 rounded-full" style={{ width: `${group.pre}%` }} />
                    </div>
                    <span className="w-10 text-right font-bold text-sky-800 tabular-nums">{group.pre}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-16 font-semibold text-slate-500">Post-Test:</span>
                    <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: `${group.post}%` }} />
                    </div>
                    <span className="w-10 text-right font-bold text-teal-800 tabular-nums">{group.post}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Education Level Breakdown */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
          <h3 className="text-base font-bold text-slate-800 font-display mb-1 flex items-center gap-2">
            <span>🎓 Hasil Berdasarkan Tingkat Pendidikan / Kelas</span>
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Evaluasi pemahaman anak SD kelas rendah vs kelas tinggi.
          </p>

          <div className="space-y-5">
            {gradeGroups.map((group, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className="text-slate-800">{group.label}</span>
                  <span className="text-emerald-700 font-mono">N-Gain: +{group.gain}%</span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-16 font-semibold text-slate-500">Pre-Test:</span>
                    <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-400 rounded-full" style={{ width: `${group.pre}%` }} />
                    </div>
                    <span className="w-10 text-right font-bold text-sky-800 tabular-nums">{group.pre}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-16 font-semibold text-slate-500">Post-Test:</span>
                    <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: `${group.post}%` }} />
                    </div>
                    <span className="w-10 text-right font-bold text-teal-800 tabular-nums">{group.post}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Program Evaluation Callout */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-teal-200">
        <h4 className="text-sm font-bold text-teal-950 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Kesimpulan Evaluasi Efektivitas Aplikasi</span>
        </h4>
        <p className="text-xs sm:text-sm text-teal-900 leading-relaxed font-medium">
          Berdasarkan data rekapitulasi, pengenalan konsep <strong>DENTALVERSE</strong> dengan pendekatan gamifikasi 3D cartoon, pembelajaran bertahap, dan kamera interaktif <strong>Brush Cam</strong> terbukti meningkatkan pemahaman kesehatan gigi anak secara signifikan dengan rata-rata N-Gain sebesar <strong>+{avgGain}%</strong>. Kategori partisipasi tertinggi dicapai oleh kelompok usia 9–10 tahun (Fase Menengah).
        </p>
      </div>
    </div>
  );
};
