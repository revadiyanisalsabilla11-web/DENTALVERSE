import { LearningModule } from '../types/dentalverse';

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'mod-1',
    number: 1,
    title: 'Modul 1: Rahasia Anatomi & Perisai Gigi',
    shortTitle: 'Anatomi & Perisai Gigi',
    description: 'Kenali 3 jenis gigi sakti (Seri, Taring, Geraham) dan lapisan terkeras tubuh manusia.',
    icon: '🦷',
    color: 'from-blue-500 to-indigo-600',
    durationMinutes: 4,
    content: {
      summary: 'Gigi kita bukan sekadar tulang putih biasa, melainkan organ pengunyah canggih dengan lapisan perisai super kuat bernama Enamel!',
      keyPoints: [
        'Gigi Seri (depan): Berbentuk pipih tajam untuk memotong makanan seperti gunting.',
        'Gigi Taring (samping): Runcing dan kokoh untuk merobek makanan yang liat atau berserat.',
        'Gigi Geraham (belakang): Memiliki permukaan datar berparit untuk menggiling makanan sampai halus.',
        'Lapisan Enamel: Bagian terluar gigi yang lebih keras daripada tulang manusia, namun bisa terkikis oleh zat asam.'
      ],
      deepDive: 'Di bawah enamel terdapat lapisan Dentin berwarna kekuningan. Jika enamel berlubang dan dentin terbuka, saraf di dalam Pulpa akan mengirim sinyal rasa ngilu ketika terkena es atau air panas. Menjaga kebersihan enamel sejak dini adalah kunci senyum bebas rasa sakit seumur hidup!',
      funFact: 'Enamel gigi manusia mengandung mineral hidroksiapatit yang kekerasannya mencapai tingkat 5 pada skala Mohs — hampir sekeras batu permata apatit!',
      audioText: 'Halo Sobat Gigi! Di Modul 1 ini, kita belajar bahwa gigi seri memotong, gigi taring merobek, dan geraham menggiling makanan. Lapisan terluar gigi bernama enamel adalah zat terkeras di tubuh kita!'
    }
  },
  {
    id: 'mod-2',
    number: 2,
    title: 'Modul 2: Teknik Sakti Sikat Gigi 2-2-45°',
    shortTitle: 'Teknik Sikat 2-2-45°',
    description: 'Kuasai rumus emas menyikat gigi: 2 kali sehari, 2 menit penuh, dan sudut sikat 45 derajat.',
    icon: '🪥',
    color: 'from-teal-500 to-emerald-600',
    durationMinutes: 5,
    content: {
      summary: 'Menyikat gigi bukan sekadar menggosok cepat. Sudut kemiringan sikat dan ketelitian menjangkau setiap sudut menentukan kebersihannya!',
      keyPoints: [
        'Waktu Tepat: 2 kali sehari — pagi setelah sarapan dan malam tepat sebelum tidur.',
        'Durasi Ideal: Minimal 2 menit penuh (30 detik untuk setiap kuadran mulut).',
        'Sudut 45 Derajat: Arahkan bulu sikat miring ke perbatasan gusi dan gigi dengan gerakan melingkar lembut.',
        'Sikat 4 Area Lengkap: Bagian luar gigi, bagian dalam gigi, permukaan kunyah geraham, dan pembersihan lidah.',
        'Pasta Gigi Berfluorida: Gunakan secukupnya sebesar biji kacang polong (pea-sized) untuk anak-anak.'
      ],
      deepDive: 'Hindari menggosok gigi secara horizontal keras seperti menggergaji kayu, karena dapat merusak enamel dan membuat gusi turun (resesi gingiva). Gerakan melingkar lembut dan menyapu dari gusi ke mahkota gigi adalah teknik yang paling dianjurkan oleh dokter gigi.',
      funFact: 'Menyikat gigi sebelum tidur malam adalah waktu terpenting, karena saat tidur air liur pelindung berkurang drastis sehingga kuman menjadi 2 kali lebih aktif!',
      audioText: 'Ingat selalu rumus 2-2-45 derajat! Sikat 2 kali sehari, selama 2 menit, dengan sikat miring 45 derajat ke arah gusi. Jangan lupa bersihkan bagian luar, dalam, kunyah, dan lidah!'
    }
  },
  {
    id: 'mod-3',
    number: 3,
    title: 'Modul 3: Detektif Nutrisi Sahabat vs Musuh Gigi',
    shortTitle: 'Nutrisi Sahabat vs Musuh Gigi',
    description: 'Pilah makanan yang memperkuat enamel gigi dan waspadai gula lengket tersembunyi.',
    icon: '🍎',
    color: 'from-amber-500 to-orange-600',
    durationMinutes: 4,
    content: {
      summary: 'Makanan yang kita kunyah berpengaruh langsung terhadap kekuatan gigi dan tingkat keasaman di dalam rongga mulut.',
      keyPoints: [
        'Sahabat Gigi: Susu, keju, dan yoghurt kaya kalsium serta fosfat yang memperbaiki mineral gigi.',
        'Pembersih Alami: Apel renyah dan wortel mentah merangsang produksi air liur pembersih sisa plak.',
        'Musuh Gigi: Permen kenyal, permen hisap manis, dan minuman soda yang merendam gigi dalam cairan asam.',
        'Trik Sehat: Jika makan makanan manis, segeralah berkumur dengan air putih untuk membilas sisa gula.'
      ],
      deepDive: 'Bakteri mulut menyukai sukrosa (gula sederhana). Saat bakteri memakan gula, mereka menghasilkan asam dalam waktu 20 detik pertama. Asam inilah yang melarutkan kalsium dari enamel gigi dalam proses yang dinamakan demineralisasi.',
      funFact: 'Keju memiliki sifat istimewa menaikkan pH mulut secara instan dan menghentikan serangan asam setelah kamu makan snack manis!',
      audioText: 'Pilihlah buah segar dan susu yang kaya kalsium! Kurangi makanan manis lengket yang bisa memicu asam perusak gigi. Selalu minum air putih setelah makan ya!'
    }
  },
  {
    id: 'mod-4',
    number: 4,
    title: 'Modul 4: Melawan Pasukan Kuman Plak & Asam',
    shortTitle: 'Membasmi Kuman Plak & Asam',
    description: 'Pelajari bagaimana plak bakteri terbentuk dan bagaimana sikat gigi menghancurkan benteng kuman.',
    icon: '🦠',
    color: 'from-purple-500 to-pink-600',
    durationMinutes: 5,
    content: {
      summary: 'Plak adalah lapisan lengket tak berwarna berisi jutaan koloni bakteri yang terus-menerus menempel pada permukaan gigimu.',
      keyPoints: [
        'Asal Mula Plak: Terbentuk dari sisa makanan berpati/gula yang bercampur dengan air liur dan bakteri alami mulut.',
        'Bahaya Karang Gigi (Tartar): Jika plak tidak disikat selama 48 jam, ia akan mengeras menjadi karang gigi yang hanya bisa dibersihkan oleh dokter gigi.',
        'Gusi Berdarah (Gingivitis): Tanda awal bahwa plak menumpuk di tepi gusi dan menyebabkan radang.',
        'Senjata Pemusnah: Sikat gigi teratur dan benang gigi (dental floss) membersihkan 100% sela sempit.'
      ],
      deepDive: 'Bakteri Streptococcus mutans adalah biang keladi utama karies. Mereka membentuk biofilm yang kuat. Namun biofilm ini mudah dihancurkan secara mekanik hanya dengan menyikat gigi secara teratur dan lembut setiap hari.',
      funFact: 'Dalam satu tetes plak gigi yang tidak disikat bisa terkandung lebih dari 500 spesies mikroorganisme!',
      audioText: 'Plak adalah sarang kuman lengket! Jika kamu rajin menyikat gigi 2 kali sehari, benteng kuman plak akan hancur dan gigimu terlindungi dari lubang!'
    }
  },
  {
    id: 'mod-5',
    number: 5,
    title: 'Modul 5: Petualangan Menyenangkan ke Klinik Gigi',
    shortTitle: 'Klinik Gigi Sahabat Kita',
    description: 'Hapus rasa takut! Kenali alat-alat keren dan manfaat periksa gigi setiap 6 bulan.',
    icon: '🏥',
    color: 'from-rose-500 to-red-600',
    durationMinutes: 4,
    content: {
      summary: 'Pergi ke dokter gigi adalah pengalaman seru untuk mengecek senyum sehat, bukan tempat yang menakutkan!',
      keyPoints: [
        'Kunjungan Rutin: Setiap 6 bulan sekali bersama ayah atau ibu.',
        'Kursi Astronot: Bisa bergerak naik, turun, dan rebahan dengan nyaman.',
        'Kaca Mulut Ajaib: Cermin kecil bersudut untuk mengintip kuman di sudut tersembunyi.',
        'Penyedot Saliva: Sedotan berbunyi slurp yang menjaga mulutmu tetap kering dan nyaman.',
        'Pencegahan Dini: Mengoleskan fluoride pelindung agar gigi kebal terhadap serangan asam.'
      ],
      deepDive: 'Datang ke dokter gigi saat gigi masih sehat terasa jauh lebih nyaman daripada menunggu hingga gigi terasa sakit dan berlubang besar. Pemeriksaan rutin membantu mendeteksi pertumbuhan gigi yang bertumpuk atau lubang halus sedini mungkin.',
      funFact: 'Banyak klinik gigi modern menyediakan kacamata bioskop khusus anak sehingga kamu bisa menonton film kartun favorit saat gigimu diperiksa!',
      audioText: 'Ke dokter gigi itu asyik! Kamu bisa mencoba kursi astronot dan mengecek kesehatan senyummu setiap 6 bulan sekali. Jangan takut ya Sobat Hero!'
    }
  }
];
