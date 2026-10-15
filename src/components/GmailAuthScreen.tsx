import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { UserRole } from '../types/dentalverse';
import { 
  ShieldCheck, Sparkles, CheckCircle2, User, Key, 
  ArrowRight, Heart, Award, Database, School, HelpCircle, Lock,
  Rocket, Star, Eye
} from 'lucide-react';
import { playClickSfx } from '../utils/audio';

export const GmailAuthScreen: React.FC = () => {
  const { loginWithGoogle, soundEnabled } = useGame();

  const [activeTab, setActiveTab] = useState<'quick' | 'custom'>('quick');
  const [selected3DPreview, setSelected3DPreview] = useState<number>(0);

  // Custom Gmail form state
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [customAge, setCustomAge] = useState<number>(9);
  const [customGrade, setCustomGrade] = useState('Kelas 3 SD');
  const [customRegion, setCustomRegion] = useState('Posyandu Melati');
  const [customRole, setCustomRole] = useState<UserRole>('user');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 3D Space Images Showcase
  const space3DGallery = [
    {
      title: 'Astronot Gigi Juara 3D',
      subtitle: 'Dental Buddy pelindung enamel di luar angkasa',
      image: '/src/assets/images/dental_space_hero_1792076219545.jpg',
      badge: '🚀 Maskot Kosmik',
      accent: 'border-amber-400 bg-amber-400/20 text-amber-300'
    },
    {
      title: 'Galaksi Gigi & Roket Sikat',
      subtitle: 'Menjelajahi kosmos planet geraham & bintang',
      image: '/src/assets/images/dental_space_galaxy_1792076218171.jpg',
      badge: '🌌 Dunia Galaksi',
      accent: 'border-sky-400 bg-sky-400/20 text-sky-300'
    },
    {
      title: 'Stasiun Luar Angkasa Gigi',
      subtitle: 'Klinik senyum orbital futuristik ramah anak',
      image: '/src/assets/images/dental_space_station_1792076219087.jpg',
      badge: '🛰️ Stasiun Orbital',
      accent: 'border-pink-400 bg-pink-400/20 text-pink-300'
    }
  ];

  // Quick Preset Accounts with Diverse COLORFUL palettes
  const presetAccounts = [
    {
      name: 'Revadiyani Salsabilla',
      email: 'revadiyanisalsabilla11@gmail.com',
      role: 'super_admin' as UserRole,
      roleBadge: 'Super Admin',
      roleColor: 'bg-purple-500 text-white shadow-purple-500/30',
      borderHover: 'hover:border-purple-500',
      bgGrad: 'bg-gradient-to-br from-purple-50 via-white to-indigo-50/50',
      desc: 'Akses penuh kelola database seluruh peserta, hak akses peran, dan audit sistem.',
      icon: '👑'
    },
    {
      name: 'drg. Budi Santoso',
      email: 'drg.budi.santoso@gmail.com',
      role: 'admin' as UserRole,
      roleBadge: 'Admin / Dokter Gigi',
      roleColor: 'bg-sky-500 text-white shadow-sky-500/30',
      borderHover: 'hover:border-sky-500',
      bgGrad: 'bg-gradient-to-br from-sky-50 via-white to-blue-50/50',
      desc: 'Kelola data pengguna, periksa riwayat gigi dan materi edukasi anak.',
      icon: '🩺'
    },
    {
      name: 'Siti Aminah',
      email: 'siti.aminah.kader@gmail.com',
      role: 'kader' as UserRole,
      roleBadge: 'Kader Posyandu',
      roleColor: 'bg-rose-500 text-white shadow-rose-500/30',
      borderHover: 'hover:border-rose-500',
      bgGrad: 'bg-gradient-to-br from-pink-50 via-white to-rose-50/50',
      desc: 'Mendampingi anak binaan posyandu & mencatat evaluasi sikat gigi.',
      icon: '🤝'
    },
    {
      name: 'Alif Pratama (Siswa / Anak)',
      email: 'alif.pratama@gmail.com',
      role: 'user' as UserRole,
      roleBadge: 'Pengguna / Siswa',
      roleColor: 'bg-amber-500 text-white shadow-amber-500/30',
      borderHover: 'hover:border-amber-500',
      bgGrad: 'bg-gradient-to-br from-amber-50 via-white to-yellow-50/50',
      desc: 'Membaca modul bertahap, praktek Brush Cam, dan kuis senyum sehat.',
      icon: '🧒'
    },
    {
      name: 'Biro Evaluasi Dinkes',
      email: 'dinkes.evaluator@gmail.com',
      role: 'viewer' as UserRole,
      roleBadge: 'Viewer / Pemantau',
      roleColor: 'bg-indigo-600 text-white shadow-indigo-500/30',
      borderHover: 'hover:border-indigo-500',
      bgGrad: 'bg-gradient-to-br from-indigo-50 via-white to-violet-50/50',
      desc: 'Hanya melihat rekapitulasi data & laporan grafik N-Gain tanpa izin edit.',
      icon: '📊'
    }
  ];

  const handleQuickLogin = (acc: typeof presetAccounts[0]) => {
    playClickSfx(!soundEnabled);
    setIsLoading(true);
    setTimeout(() => {
      loginWithGoogle(acc.email, acc.name, acc.role);
    }, 350);
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
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-pink-50 to-amber-100/60 flex flex-col justify-between p-3 sm:p-6 lg:p-8 font-sans selection:bg-pink-300 selection:text-pink-900">
      
      {/* Top Brand Bar */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-2 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl sm:text-4xl transform hover:rotate-12 transition-transform">🦷</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight bg-gradient-to-r from-sky-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
              DENTALVERSE
            </h1>
            <span className="text-[11px] font-black tracking-wider text-purple-700">
              PETUALANGAN LUAR ANGKASA GIGI ANAK
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-pink-200 shadow-sm">
          <Lock className="w-3.5 h-3.5 text-pink-500" />
          <span>Autentikasi Terproteksi Gmail</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full my-auto py-2">
        
        {/* PROMINENT 3D SPACE CARTOON SHOWCASE BANNER (Immediately visible on page open!) */}
        <section className="mb-6 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-950 relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[320px]">
            
            {/* Big 3D Image Display */}
            <div className="lg:col-span-7 relative overflow-hidden flex items-center justify-center bg-black min-h-[260px] sm:min-h-[340px]">
              <img
                src={space3DGallery[selected3DPreview].image}
                alt={space3DGallery[selected3DPreview].title}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-950" />
              
              {/* Floating Badge */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black backdrop-blur-md border ${space3DGallery[selected3DPreview].accent}`}>
                  {space3DGallery[selected3DPreview].badge}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold">
                  Karakter 3D Resmi
                </span>
              </div>
            </div>

            {/* Showcase Info & Selector */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between text-white bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/30 text-pink-300 text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Dunia 3D Kartun DENTALVERSE</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black font-display leading-tight mb-2 text-white">
                  {space3DGallery[selected3DPreview].title}
                </h2>
                <p className="text-xs sm:text-sm text-sky-200/90 font-medium leading-relaxed mb-6">
                  {space3DGallery[selected3DPreview].subtitle}. Masuk dengan akun Gmail untuk menjelajahi modul bertahap, berlatih dengan Brush Cam, dan kumpulkan skor kuis senyum sehatmu!
                </p>
              </div>

              {/* 3 Interactive Thumbnail Switches */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Pilih Galeri 3D Luar Angkasa:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {space3DGallery.map((item, idx) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setSelected3DPreview(idx)}
                      className={`group relative rounded-xl overflow-hidden border-2 transition-all p-0.5 text-left aspect-video ${
                        selected3DPreview === idx
                          ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105'
                          : 'border-white/20 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-lg" />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent" />
                      <span className="absolute bottom-1 left-1 right-1 text-[8px] font-bold text-white truncate drop-shadow">
                        {item.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* AUTHENTICATION ACTION CARD (Vibrant Colorful UI) */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-pink-100 overflow-hidden">
          
          {/* Colorful Header Strip */}
          <div className="bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 p-5 sm:p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-black font-display">
                Masuk dengan Akun Gmail Anda
              </h3>
              <p className="text-xs text-pink-100 font-medium mt-0.5">
                Riwayat belajar modul bertahap, skor kuis, sertifikat rapor, dan rekaman sikat gigi tersimpan otomatis.
              </p>
            </div>

            <div className="flex items-center gap-2 p-1 bg-white/20 backdrop-blur-md rounded-2xl shrink-0">
              <button
                type="button"
                onClick={() => {
                  playClickSfx(!soundEnabled);
                  setActiveTab('quick');
                }}
                className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'quick'
                    ? 'bg-white text-purple-700 shadow-md font-black'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                ⚡ Akun Siap Pakai
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSfx(!soundEnabled);
                  setActiveTab('custom');
                }}
                className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'custom'
                    ? 'bg-white text-pink-700 shadow-md font-black'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                ✉️ Pakai Gmail Sendiri
              </button>
            </div>
          </div>

          {/* TAB CONTENT */}
          <div className="p-5 sm:p-7">
            
            {/* TAB 1: QUICK PROFILES WITH RICH DIVERSE COLORS */}
            {activeTab === 'quick' && (
              <div>
                <div className="text-center max-w-xl mx-auto mb-5">
                  <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-0.5">
                    1-Klik Akses Langsung
                  </span>
                  <h4 className="text-base font-bold text-slate-800">
                    Pilih Peran Uji Coba untuk Langsung Menjelajah:
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {presetAccounts.map((acc) => (
                    <button
                      key={acc.email}
                      disabled={isLoading}
                      onClick={() => handleQuickLogin(acc)}
                      className={`group text-left p-4 rounded-2xl border-2 border-slate-200/90 ${acc.borderHover} ${acc.bgGrad} hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between relative overflow-hidden cursor-pointer`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-3xl transform group-hover:scale-110 transition-transform">
                            {acc.icon}
                          </span>
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs ${acc.roleColor}`}>
                            {acc.roleBadge}
                          </span>
                        </div>

                        <h5 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                          {acc.name}
                        </h5>
                        <p className="text-[11px] font-mono text-slate-400 truncate mb-2">
                          {acc.email}
                        </p>
                        <p className="text-[11px] text-slate-600 line-clamp-2">
                          {acc.desc}
                        </p>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs font-black text-purple-600 group-hover:text-pink-600 transition-colors">
                        <span>Masuk sebagai ini ➔</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  ))}

                  {/* Official Google Card with Bright Colors */}
                  <div className="p-4 rounded-2xl border-2 border-dashed border-sky-300 bg-gradient-to-br from-sky-50 via-white to-amber-50 flex flex-col justify-center items-center text-center">
                    <svg className="w-8 h-8 mb-2 drop-shadow" viewBox="0 0 24 24">
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
                    <span className="text-xs font-black text-slate-800 mb-1">
                      Akun Super Admin Utama
                    </span>
                    <button
                      disabled={isLoading}
                      onClick={() => handleQuickLogin(presetAccounts[0])}
                      className="mt-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      {isLoading ? 'Menghubungkan...' : 'Lanjutkan Akun Utama 🚀'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CUSTOM GMAIL FORM (Vibrant input cards) */}
            {activeTab === 'custom' && (
              <form onSubmit={handleCustomSubmit} className="max-w-xl mx-auto space-y-4">
                <div className="text-center mb-4">
                  <h4 className="text-base font-bold text-slate-800">
                    Daftar / Masuk dengan Alamat Gmail Pribadi
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Seluruh progres modul dan skor kuis akan otomatis disimpan ke alamat email ini.
                  </p>
                </div>

                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-xs font-bold text-rose-700">
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
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-pink-500">
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
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Peran Akun
                    </label>
                    <select
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-purple-500 bg-white"
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
                      className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
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
                      className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
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
                      className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <span>Memproses Autentikasi...</span>
                    ) : (
                      <>
                        <span>🚀 Masuk Sekarang & Simpan ke Akun Ini</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* Bottom Security Info */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Autentikasi akun melindungi data belajar anak & evaluasi riset posyandu.</span>
            </div>
            <span className="font-bold text-purple-700">DENTALVERSE · Dental Adventure for Kids</span>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 py-2">
        Aplikasi Edukasi Kesehatan Gigi Anak Indonesia dengan Visual 3D Luar Angkasa & Autentikasi Gmail
      </footer>

    </div>
  );
};
