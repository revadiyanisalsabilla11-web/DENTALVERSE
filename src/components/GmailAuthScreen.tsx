import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { UserRole } from '../types/dentalverse';
import { 
  ShieldCheck, Sparkles, CheckCircle2, User, Key, 
  ArrowRight, Heart, Award, Database, School, HelpCircle, Lock
} from 'lucide-react';
import { playClickSfx } from '../utils/audio';

export const GmailAuthScreen: React.FC = () => {
  const { loginWithGoogle, allUsers, soundEnabled } = useGame();

  const [activeTab, setActiveTab] = useState<'quick' | 'custom'>('quick');

  // Custom Gmail form state
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [customAge, setCustomAge] = useState<number>(9);
  const [customGrade, setCustomGrade] = useState('Kelas 3 SD');
  const [customRegion, setCustomRegion] = useState('Posyandu Melati');
  const [customRole, setCustomRole] = useState<UserRole>('user');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Quick Preset Accounts
  const presetAccounts = [
    {
      name: 'Revadiyani Salsabilla',
      email: 'revadiyanisalsabilla11@gmail.com',
      role: 'super_admin' as UserRole,
      roleBadge: 'Super Admin',
      roleColor: 'bg-purple-100 text-purple-800 border-purple-200',
      desc: 'Akses penuh kelola database, pengaturan hak akses, dan audit sistem.',
      icon: '👑'
    },
    {
      name: 'drg. Budi Santoso',
      email: 'drg.budi.santoso@gmail.com',
      role: 'admin' as UserRole,
      roleBadge: 'Admin / Dokter Gigi',
      roleColor: 'bg-blue-100 text-blue-800 border-blue-200',
      desc: 'Kelola data pengguna, periksa riwayat gigi dan materi edukasi.',
      icon: '🩺'
    },
    {
      name: 'Siti Aminah',
      email: 'siti.aminah.kader@gmail.com',
      role: 'kader' as UserRole,
      roleBadge: 'Kader Posyandu',
      roleColor: 'bg-teal-100 text-teal-800 border-teal-200',
      desc: 'Mendampingi anak binaan posyandu & mencatat evaluasi sikat gigi.',
      icon: '🤝'
    },
    {
      name: 'Alif Pratama (Anak / Siswa)',
      email: 'alif.pratama@gmail.com',
      role: 'user' as UserRole,
      roleBadge: 'Pengguna / Siswa',
      roleColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      desc: 'Membaca modul bertahap, praktek Brush Cam, dan kuis senyum.',
      icon: '🧒'
    },
    {
      name: 'Biro Evaluasi Dinkes',
      email: 'dinkes.evaluator@gmail.com',
      role: 'viewer' as UserRole,
      roleBadge: 'Viewer / Pemantau',
      roleColor: 'bg-amber-100 text-amber-800 border-amber-200',
      desc: 'Hanya melihat rekapitulasi data & laporan grafik N-Gain tanpa izin edit.',
      icon: '📊'
    }
  ];

  const handleQuickLogin = (acc: typeof presetAccounts[0]) => {
    playClickSfx(!soundEnabled);
    setIsLoading(true);
    setTimeout(() => {
      loginWithGoogle(acc.email, acc.name, acc.role);
    }, 400);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customEmail.trim()) {
      setFormError('Alamat email Gmail wajib diisi.');
      return;
    }

    if (!customEmail.includes('@')) {
      setFormError('Format email tidak valid. Masukkan email Gmail (contoh: nama@gmail.com)');
      return;
    }

    playClickSfx(!soundEnabled);
    setIsLoading(true);

    const displayName = customName.trim() || customEmail.split('@')[0];

    setTimeout(() => {
      loginWithGoogle(customEmail.trim().toLowerCase(), displayName, customRole, {
        age: customAge,
        schoolGrade: customGrade,
        region: customRegion
      });
    }, 450);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-teal-50/60 to-amber-50/40 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans selection:bg-teal-200 selection:text-teal-900">
      
      {/* Top Simple Brand Bar */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <span className="text-3xl animate-bounce">🦷</span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
              DENTALVERSE
            </h1>
            <span className="text-[10px] font-bold text-teal-700 tracking-wider">
              DENTAL ADVENTURE FOR KIDS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-xs">
          <Lock className="w-3.5 h-3.5 text-teal-600" />
          <span>Autentikasi Terproteksi Gmail</span>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="max-w-4xl mx-auto w-full my-auto py-6">
        <div className="bg-white rounded-3xl sm:rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
          
          {/* Top Banner Notice */}
          <div className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-6 opacity-15 pointer-events-none text-9xl">
              🦷
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase mb-3 text-white border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  Gerbang Masuk Petualangan Kosmik Gigi
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display leading-tight mb-2">
                  Masuk dengan Akun Gmail
                </h2>
                <p className="text-xs sm:text-sm text-sky-50 font-medium leading-relaxed">
                  Menjaga riwayat belajar bertahap, skor kuis evaluasi, rekaman Brush Cam, dan sertifikat rapor anak agar tersimpan aman di akun Google Anda.
                </p>
              </div>

              {/* 3D Tooth Astronaut Space Mascot */}
              <div className="shrink-0 hidden sm:flex items-center gap-3 bg-white/10 backdrop-blur-md p-2 pr-4 rounded-3xl border border-white/20 shadow-lg">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md">
                  <img
                    src="/src/assets/images/dental_space_hero_1792076219545.jpg"
                    alt="Tooth Astronaut"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                    Dental Buddy Kosmik
                  </span>
                  <span className="text-xs font-black text-white block">
                    Astronot Senyum 🚀
                  </span>
                  <span className="text-[10px] text-teal-200">
                    Siap Memandu!
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/20">
              <div className="flex items-center gap-2.5 text-xs text-sky-100 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Skor Kuis & Rapor Tersimpan</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-sky-100 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Progres Modul Bertahap</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-sky-100 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Pengaturan Hak Akses (RBAC)</span>
              </div>
            </div>
          </div>

          {/* Form / Quick Tabs */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-center p-1 bg-slate-100 rounded-2xl max-w-md mx-auto mb-6">
              <button
                type="button"
                onClick={() => {
                  playClickSfx(!soundEnabled);
                  setActiveTab('quick');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'quick'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                ⚡ Akun Siap Pakai (1-Klik)
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSfx(!soundEnabled);
                  setActiveTab('custom');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'custom'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                ✉️ Masuk Pakai Gmail Baru / Sendiri
              </button>
            </div>

            {/* TAB 1: QUICK 1-CLICK PROFILES */}
            {activeTab === 'quick' && (
              <div>
                <div className="text-center max-w-xl mx-auto mb-6">
                  <h3 className="text-base font-bold text-slate-800">
                    Pilih Akun Gmail untuk Langsung Masuk:
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Klik salah satu akun di bawah untuk mencoba fitur sesuai peran hak akses masing-masing.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {presetAccounts.map((acc) => (
                    <button
                      key={acc.email}
                      disabled={isLoading}
                      onClick={() => handleQuickLogin(acc)}
                      className="group text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-teal-400 bg-white hover:bg-teal-50/30 transition-all duration-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between relative overflow-hidden"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-2xl">{acc.icon}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${acc.roleColor}`}>
                            {acc.roleBadge}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                          {acc.name}
                        </h4>
                        <p className="text-[11px] font-mono text-slate-400 truncate mb-2">
                          {acc.email}
                        </p>
                        <p className="text-[11px] text-slate-600 line-clamp-2">
                          {acc.desc}
                        </p>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-600">
                        <span>Masuk sebagai ini</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  ))}

                  {/* Official Google Button Card */}
                  <div className="p-4 rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50/50 flex flex-col justify-center items-center text-center">
                    <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span className="text-xs font-bold text-slate-800 mb-1">
                      Login Google Default
                    </span>
                    <button
                      disabled={isLoading}
                      onClick={() => handleQuickLogin(presetAccounts[0])}
                      className="mt-2 w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      {isLoading ? 'Menghubungkan...' : 'Lanjutkan Akun Utama'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CUSTOM GMAIL FORM */}
            {activeTab === 'custom' && (
              <form onSubmit={handleCustomSubmit} className="max-w-xl mx-auto space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-base font-bold text-slate-800">
                    Gunakan Alamat Email Gmail Anda
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Jika email sudah pernah digunakan, seluruh progres belajar sebelumnya akan dimuat kembali secara otomatis.
                  </p>
                </div>

                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat Email Gmail *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="contoh: nama.kamu@gmail.com"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder:text-slate-400"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                      @gmail.com
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Lengkap / Nama Anak
                    </label>
                    <input
                      type="text"
                      placeholder="contoh: Bintang Pratama"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Peran Akun
                    </label>
                    <select
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                      <option value="user">🧒 Pengguna / Anak (Siswa)</option>
                      <option value="kader">🤝 Kader Posyandu Pendamping</option>
                      <option value="admin">🩺 Admin / Dokter Gigi</option>
                      <option value="viewer">📊 Viewer / Pemantau Dinas</option>
                      <option value="super_admin">👑 Super Admin (Akses Penuh)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Usia Anak (Tahun)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={60}
                      value={customAge}
                      onChange={(e) => setCustomAge(parseInt(e.target.value) || 8)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Jenjang / Kelas
                    </label>
                    <input
                      type="text"
                      placeholder="contoh: Kelas 4 SD"
                      value={customGrade}
                      onChange={(e) => setCustomGrade(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Wilayah / Posyandu
                    </label>
                    <input
                      type="text"
                      placeholder="contoh: Posyandu Dahlia"
                      value={customRegion}
                      onChange={(e) => setCustomRegion(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span>Memproses Autentikasi...</span>
                    ) : (
                      <>
                        <span>🚀 Masuk Sekarang & Sinkronkan Data</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* Bottom Security Assurance */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Privasi data kesehatan anak terjaga aman sesuai standar edukasi.</span>
            </div>
            <span>DENTALVERSE · Dental Adventure for Kids</span>
          </div>

        </div>
      </main>

      {/* Footer info */}
      <footer className="text-center text-xs text-slate-400 py-2">
        Aplikasi Edukasi Kesehatan Gigi Anak Indonesia dengan Integrasi Autentikasi Gmail
      </footer>

    </div>
  );
};
