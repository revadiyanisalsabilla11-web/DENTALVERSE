import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ClinicTool } from '../types/dentalverse';
import { Sparkles, Heart, Smile, CheckCircle2, Volume2, ShieldCheck } from 'lucide-react';
import { playClickSfx, playStarSfx, speakIndonesian } from '../utils/audio';

const CLINIC_TOOLS: ClinicTool[] = [
  {
    id: 'chair',
    name: 'Kursi Gigi Dental Unit',
    friendlyName: '🚀 Kursi Astronot Ajaib',
    purpose: 'Bisa naik turun, rebahan, dan punya lampu sorot terang seperti pesawat ruang angkasa!',
    funFact: 'Kamu bisa memencet tombolnya bersama dokter gigi untuk mencoba naik dan turun!',
    icon: '💺'
  },
  {
    id: 'mirror',
    name: 'Kaca Mulut (Mouth Mirror)',
    friendlyName: '🔍 Cermin Detektif Cilik',
    purpose: 'Cermin bundar kecil bersudut yang membantu dokter melihat bagian belakang dan atap gigimu.',
    funFact: 'Cermin ini sama sekali tidak sakit! Hanya mengintip apakah ada kuman nakal yang sembunyi.',
    icon: '🪞'
  },
  {
    id: 'explorer',
    name: 'Sonde Halus (Dental Explorer)',
    friendlyName: '🪄 Tongkat Penghitung Gigi',
    purpose: 'Ujung logam sangat halus tumpul yang dipakai untuk mengetuk dan menghitung jumlah gigi sehatmu.',
    funFact: 'Dokter akan mengetuk lembut: "Satu, dua, tiga... wah gigimu kuat sekali!"',
    icon: '🪄'
  },
  {
    id: 'suction',
    name: 'Sedotan Saliva (Suction Tip)',
    friendlyName: '🧃 Sedotan Jus Ajaib',
    purpose: 'Penyedot air liur lembut agar mulutmu tetap kering dan nyaman selama diperiksa.',
    funFact: 'Bunyinya seperti: "Sluuuurp!" mirip suara kita saat menyeruput tetes terakhir jus favorit!',
    icon: '🥤'
  },
  {
    id: 'curing_light',
    name: 'Lampu Polimerisasi (Curing Light)',
    friendlyName: '⚡ Sinar Biru Superhero',
    purpose: 'Lampu LED biru yang menyinari tambalan gigi agar mengeras seketika dalam hitungan detik.',
    funFact: 'Saat dinyalakan, kamu dan dokter memakai kacamata oranye keren seperti agen rahasia!',
    icon: '🔦'
  },
  {
    id: 'air_syringe',
    name: 'Semprotan Angin-Air (3-Way Syringe)',
    friendlyName: '💨 Semprotan Angin Gunung Segar',
    purpose: 'Menyemprotkan air bersih untuk membilas dan angin sejuk untuk mengeringkan gigi.',
    funFact: 'Rasanya menggelitik sejuk seperti ditiup angin pegunungan yang segar!',
    icon: '🌬️'
  }
];

export const DentalClinicExplorer: React.FC = () => {
  const { soundEnabled, voiceEnabled, addXP, triggerRewardPopup } = useGame();
  const [selectedToolId, setSelectedToolId] = useState<string>('chair');

  const currentTool = CLINIC_TOOLS.find(t => t.id === selectedToolId) || CLINIC_TOOLS[0];

  const handleToolSelect = (id: string) => {
    playClickSfx(!soundEnabled);
    setSelectedToolId(id);
  };

  const handleListen = () => {
    speakIndonesian(
      `${currentTool.friendlyName}. ${currentTool.purpose}. Fakta seru: ${currentTool.funFact}`,
      !voiceEnabled
    );
  };

  const handleClaimReward = () => {
    addXP(40);
    triggerRewardPopup(
      '🏥 TEMAN DOKTER GIGI!',
      'Kamu sekarang tahu semua alat keren di klinik gigi. Tidak ada yang perlu ditakuti!',
      40,
      'Brave Patient'
    );
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-rose-50 border border-rose-200 mb-3">
          <span className="text-lg">🏥</span>
          <span className="text-xs sm:text-sm font-bold text-rose-800 uppercase tracking-wider">
            DENTAL CLINIC ZONE
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 tracking-tight mb-2">
          Kenali Klinik & Sahabat Dokter Gigimu!
        </h2>
        <p className="text-sm sm:text-base text-slate-600 font-medium">
          Ke dokter gigi itu asyik dan tidak menakutkan! Yuk kenali alat-alat super keren yang siap menjaga senyum manismu.
        </p>
      </div>

      {/* Main Showcase Hero */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-xl border-4 border-white mb-10 bg-slate-900 aspect-[16/9] max-h-[420px]">
        <img
          src="/src/assets/images/clinic_dental_explorer_1790413542653.jpg"
          alt="Friendly Kids Dental Clinic"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6 sm:p-8">
          <div className="text-white max-w-lg">
            <span className="text-xs font-bold text-teal-300 uppercase tracking-wider mb-1 block">
              Suasana Ramah Anak
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-display mb-2">
              Klinik Gigi Penuh Warna & Kenyamanan
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 font-medium">
              Dokter gigi adalah sahabat yang membantu gigimu tumbuh rapi, kuat, dan bebas dari rasa sakit!
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Tool Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
        
        {/* Tool Cards Selector (Col 6) */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CLINIC_TOOLS.map((tool) => {
            const isSelected = tool.id === selectedToolId;
            return (
              <div
                key={tool.id}
                onClick={() => handleToolSelect(tool.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-rose-50 border-rose-400 shadow-md scale-[1.02]'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl p-2 rounded-xl bg-slate-100">{tool.icon}</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 leading-tight">
                      {tool.friendlyName}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium block">
                      {tool.name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Tool Details (Col 6) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-slate-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{currentTool.icon}</span>
              <div>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">
                  Nama Alat Medis: {currentTool.name}
                </span>
                <h3 className="text-2xl font-black font-display text-slate-800">
                  {currentTool.friendlyName}
                </h3>
              </div>
            </div>

            <button
              onClick={handleListen}
              className="p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
              title="Dengarkan Suara"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Fungsi Alat:
              </span>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                {currentTool.purpose}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-1">
                💡 Fakta Menyenangkan:
              </span>
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                {currentTool.funFact}
              </p>
            </div>
          </div>

          <button
            onClick={handleClaimReward}
            className="w-full py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Klaim Gelar Pemberani (+40 XP)</span>
            <Sparkles className="w-4 h-4 text-amber-300" />
          </button>
        </div>

      </div>
    </div>
  );
};
