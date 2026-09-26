import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { BookOpen, Volume2, Sparkles, Check, ArrowRight } from 'lucide-react';
import { playClickSfx, speakIndonesian } from '../utils/audio';

interface LibraryCard {
  id: string;
  category: string;
  title: string;
  icon: string;
  color: string;
  badge: string;
  points: string[];
  goldenRule: string;
}

const LIBRARY_DATA: LibraryCard[] = [
  {
    id: 'brushing',
    category: '🪥 Cara Sikat Gigi',
    title: 'Formula Sakti 2-2-45°',
    icon: '🪥',
    color: 'from-sky-400 to-teal-500',
    badge: 'Kunci Utama',
    points: [
      '2 Kali Sehari: Pagi setelah sarapan & malam sebelum tidur.',
      '2 Menit Penuh: Agar seluruh sela-sela gigi terjangkau bersih.',
      'Sudut 45 Derajat: Bulu sikat miring ke arah perbatasan gusi & gigi.'
    ],
    goldenRule: 'Jangan menyikat secara horizontal keras seperti menggergaji kayu!'
  },
  {
    id: 'anatomy',
    category: '🦷 Mengenal Gigi',
    title: 'Pasukan Pengunyah Super',
    icon: '🦷',
    color: 'from-blue-400 to-indigo-500',
    badge: 'Anatomi',
    points: [
      'Gigi Seri (Depan): Memotong makanan dengan rapi.',
      'Gigi Taring (Samping): Runcing untuk merobek serat makanan.',
      'Gigi Geraham (Belakang): Melembutkan makanan seperti gilingan.'
    ],
    goldenRule: 'Gigi susu akan digantikan gigi permanen yang bertugas seumur hidupmu!'
  },
  {
    id: 'food',
    category: '🍎 Makanan & Gigi',
    title: 'Nutrisi Perisai Enamel',
    icon: '🍎',
    color: 'from-amber-400 to-orange-500',
    badge: 'Nutrisi',
    points: [
      'Kalsium (Susu, Keju, Yoghurt): Mengokohkan lapisan enamel.',
      'Serat Renyah (Apel, Wortel): Mengusir sisa makanan secara alami.',
      'Batas Gula: Kurangi permen kenyal yang menempel seharian.'
    ],
    goldenRule: 'Setelah makan manis, segera berkumur air putih hangat!'
  },
  {
    id: 'plaque',
    category: '🦠 Plak & Bakteri',
    title: 'Mengenal Si Musuh Plak',
    icon: '🦠',
    color: 'from-purple-400 to-pink-500',
    badge: 'Mikroorganisme',
    points: [
      'Plak adalah lapisan lengket tak kasat mata tempat kuman tinggal.',
      'Kuman mengubah gula menjadi cairan asam perusak enamel.',
      'Jika dibiarkan, asam membuat lubang mikro hingga gigi berlubang.'
    ],
    goldenRule: 'Sikat gigi adalah tameng terbaik untuk menghancurkan rumah plak!'
  },
  {
    id: 'clinic',
    category: '🏥 Dokter Gigi Sahabat',
    title: 'Pemeriksaan Rutin 6 Bulan',
    icon: '🏥',
    color: 'from-rose-400 to-red-500',
    badge: 'Kesehatan',
    points: [
      'Dokter gigi mengecek apakah gigimu tumbuh teratur dan kuat.',
      'Membersihkan karang gigi yang tidak bisa dijangkau sikat biasa.',
      'Mengoleskan gel pelindung fluorida agar enamel kebal kuman.'
    ],
    goldenRule: 'Periksa ke dokter gigi sebelum gigimu sakit agar perawatannya santai!'
  },
  {
    id: 'smile',
    category: '✨ Tips Senyum Sehat',
    title: 'Rahasia Senyum Juara',
    icon: '✨',
    color: 'from-emerald-400 to-teal-500',
    badge: 'Kebiasaan',
    points: [
      'Ganti sikat gigimu setiap 3 bulan sekali atau saat bulunya mekar.',
      'Bersihkan lidah secara lembut agar napasmu wangi sepanjang hari.',
      'Gunakan pasta gigi berfluorida seukuran biji kacang polong (pea-sized).'
    ],
    goldenRule: 'Senyum yang sehat bikin kamu makin percaya diri dan bahagia!'
  }
];

export const DentalLibrary: React.FC = () => {
  const { soundEnabled, voiceEnabled } = useGame();
  const [selectedCard, setSelectedCard] = useState<LibraryCard | null>(null);

  const handleCardClick = (card: LibraryCard) => {
    playClickSfx(!soundEnabled);
    setSelectedCard(card);
    speakIndonesian(`${card.title}. ${card.points.join('. ')}. ${card.goldenRule}`, !voiceEnabled);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-teal-50 border border-teal-200 mb-3">
          <BookOpen className="w-4 h-4 text-teal-600" />
          <span className="text-xs sm:text-sm font-bold text-teal-800 uppercase tracking-wider">
            PERPUSTAKAAN DENTALVERSE
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 tracking-tight mb-2">
          Ensiklopedia Singkat & Seru!
        </h2>
        <p className="text-sm sm:text-base text-slate-600 font-medium">
          Kartu pengetahuan bergambar yang ringkas, mudah dipahami, dan dilengkapi suara narasi.
        </p>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LIBRARY_DATA.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card)}
            className="group relative bg-white rounded-3xl p-6 border-2 border-slate-200/80 hover:border-teal-400 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Category & Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {card.category}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {card.badge}
                </span>
              </div>

              {/* Title & Icon */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center text-2xl shadow-sm shrink-0`}
                >
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold font-display text-slate-800 group-hover:text-teal-600 transition-colors">
                  {card.title}
                </h3>
              </div>

              {/* Key Points */}
              <ul className="space-y-2 mb-4">
                {card.points.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                    <span className="text-teal-500 font-bold shrink-0">✓</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Golden Rule Highlight */}
            <div className="pt-3 border-t border-slate-100">
              <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs font-medium">
                <span className="font-bold">⭐ Aturan Emas: </span>
                <span>{card.goldenRule}</span>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-teal-600 mt-3 pt-2">
                <span>Dengarkan Narasi Suara</span>
                <Volume2 className="w-4 h-4 text-teal-600" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
