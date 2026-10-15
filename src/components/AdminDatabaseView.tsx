import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { UserProfile, UserRole } from '../types/dentalverse';
import { 
  Users, Shield, ShieldAlert, Plus, Edit2, Trash2, Search, Filter, 
  RotateCcw, CheckCircle2, Lock, History, AlertTriangle, Key, ChevronDown
} from 'lucide-react';
import { playClickSfx, playStarSfx } from '../utils/audio';

export const AdminDatabaseView: React.FC = () => {
  const { 
    currentUser, 
    allUsers, 
    addUser, 
    updateUser, 
    deleteUser, 
    auditLogs, 
    requestConfirmation, 
    soundEnabled,
    triggerRewardPopup
  } = useGame();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'users' | 'audit'>('users');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    role: UserRole;
    age: number;
    schoolGrade: string;
    region: string;
    preTestScore: number;
    postTestScore: number;
    cadreNotes: string;
  }>({
    name: '',
    email: '',
    role: 'user',
    age: 9,
    schoolGrade: 'Kelas 3 SD',
    region: 'Posyandu Melati',
    preTestScore: 60,
    postTestScore: 85,
    cadreNotes: ''
  });

  // Check RBAC Permissions
  const isSuperAdmin = currentUser.role === 'super_admin';
  const isAdmin = currentUser.role === 'admin' || isSuperAdmin;
  const isKader = currentUser.role === 'kader';
  const canModify = isSuperAdmin || isAdmin || isKader;
  const canDelete = isSuperAdmin || isAdmin;

  // Filtered Users
  const filteredUsers = allUsers.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenAdd = () => {
    playClickSfx(!soundEnabled);
    setEditingUserId(null);
    setFormData({
      name: '',
      email: '',
      role: 'user',
      age: 9,
      schoolGrade: 'Kelas 3 SD',
      region: 'Posyandu Melati',
      preTestScore: 50,
      postTestScore: 80,
      cadreNotes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserProfile) => {
    playClickSfx(!soundEnabled);
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      age: user.age,
      schoolGrade: user.schoolGrade,
      region: user.region,
      preTestScore: user.preTestScore,
      postTestScore: user.postTestScore,
      cadreNotes: user.cadreNotes || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    playStarSfx(!soundEnabled);

    if (editingUserId) {
      // Editing with security warning if changing role
      const originalUser = allUsers.find(u => u.id === editingUserId);
      if (originalUser && originalUser.role !== formData.role && !isSuperAdmin) {
        alert('Hanya Super Admin yang diizinkan mengubah peran akun!');
        return;
      }

      requestConfirmation({
        title: 'Konfirmasi Pembaruan Data Pengguna',
        message: `Apakah Anda yakin ingin memperbarui data profil dan skor untuk ${formData.name} (${formData.email})?`,
        confirmLabel: 'Simpan Perubahan',
        isDestructive: false,
        onConfirm: () => {
          updateUser(editingUserId, {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            age: Number(formData.age),
            schoolGrade: formData.schoolGrade,
            region: formData.region,
            preTestScore: Number(formData.preTestScore),
            postTestScore: Number(formData.postTestScore),
            cadreNotes: formData.cadreNotes
          });
          setIsModalOpen(false);
          triggerRewardPopup('✓ DATA BERHASIL DIPERBARUI', 'Data pengguna telah disinkronkan ke database.', 0);
        }
      });
    } else {
      // Adding new user
      addUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        age: Number(formData.age),
        schoolGrade: formData.schoolGrade,
        region: formData.region,
        preTestScore: Number(formData.preTestScore),
        postTestScore: Number(formData.postTestScore),
        modulesCompleted: ['mod-1'],
        brushCamCompleted: false,
        brushCamRating: 0,
        streakDays: 1,
        totalXp: 100,
        lastActive: new Date().toISOString().replace('T', ' ').substring(0, 16),
        cadreNotes: formData.cadreNotes
      });
      setIsModalOpen(false);
      triggerRewardPopup('✓ PENGGUNA BARU DITAMBAHKAN', 'Akun berhasil terdaftar di database DENTALVERSE.', 20);
    }
  };

  const handleDeleteClick = (user: UserProfile) => {
    playClickSfx(!soundEnabled);
    requestConfirmation({
      title: 'Peringatan Keamanan: Hapus Akun',
      message: `Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus permanen pengguna "${user.name}" (${user.email}) beserta seluruh rekam jejak belajarnya?`,
      confirmLabel: 'Hapus Permanen',
      isDestructive: true,
      onConfirm: () => {
        deleteUser(user.id);
        triggerRewardPopup('🗑️ PENGGUNA DIHAPUS', `Akun ${user.name} berhasil dihapus dari database.`, 0);
      }
    });
  };

  const roleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">👑 Super Admin</span>;
      case 'admin':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">🛡️ Admin</span>;
      case 'kader':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-200">🤝 Kader Pembina</span>;
      case 'viewer':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">👁️ Viewer Pemantau</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">🧒 Pengguna / Siswa</span>;
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-teal-600" />
              Pusat Manajemen Database & Hak Akses
            </span>
            {roleBadge(currentUser.role)}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-800">
            Database Pengguna & Audit Keamanan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau perkembangan belajar masyarakat, nilai Pre-Test/Post-Test, dan kelola akun secara aman.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="p-1 bg-slate-100 rounded-2xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Data Pengguna ({allUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'audit' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Riwayat Audit ({auditLogs.length})
            </button>
          </div>

          {canModify && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pengguna</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'users' ? (
        <div className="space-y-6">
          
          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama, email, atau wilayah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-teal-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Peran:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none"
              >
                <option value="all">Semua Peran ({allUsers.length})</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin Medis</option>
                <option value="kader">Kader Posyandu</option>
                <option value="user">Pengguna / Siswa</option>
                <option value="viewer">Viewer Pemantau</option>
              </select>
            </div>
          </div>

          {/* Database Table */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-4 px-5">Nama & Akun Gmail</th>
                    <th className="py-4 px-4">Peran (Role)</th>
                    <th className="py-4 px-4">Usia & Wilayah</th>
                    <th className="py-4 px-4 text-center">Pre-Test</th>
                    <th className="py-4 px-4 text-center">Post-Test</th>
                    <th className="py-4 px-4 text-center">N-Gain</th>
                    <th className="py-4 px-4 text-center">Brush Cam</th>
                    <th className="py-4 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredUsers.map((u) => {
                    const gain = u.preTestScore === 100 ? 100 : Math.max(0, Math.round(((u.postTestScore - u.preTestScore) / (100 - u.preTestScore)) * 100));

                    return (
                      <tr key={u.id} className="hover:bg-sky-50/40 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 to-teal-400 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                              {u.name.substring(0, 2)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block text-xs sm:text-sm">{u.name}</span>
                              <span className="text-[11px] text-slate-400">{u.email}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {roleBadge(u.role)}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="block font-semibold text-slate-800">{u.age} Thn · {u.schoolGrade}</span>
                          <span className="text-[11px] text-slate-400 block truncate max-w-xs">{u.region}</span>
                        </td>

                        <td className="py-3.5 px-4 text-center font-bold text-sky-700 tabular-nums">
                          {u.preTestScore}
                        </td>

                        <td className="py-3.5 px-4 text-center font-bold text-teal-700 tabular-nums">
                          {u.postTestScore}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-block px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold tabular-nums border border-emerald-200 text-[11px]">
                            +{gain}%
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          {u.brushCamCompleted ? (
                            <span className="text-emerald-600 font-bold">✓ Praktik (5★)</span>
                          ) : (
                            <span className="text-slate-400">Belum</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {canModify && (
                              <button
                                onClick={() => handleOpenEdit(u)}
                                className="p-1.5 rounded-lg text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                                title="Edit Data Pengguna"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}

                            {canDelete && u.id !== currentUser.id && (
                              <button
                                onClick={() => handleDeleteClick(u)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Hapus Pengguna"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="p-8 text-center text-slate-400">
                Tidak ada data pengguna yang cocok dengan pencarian atau filter.
              </div>
            )}
          </div>

        </div>
      ) : (
        /* SECURITY AUDIT LOGS VIEW */
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <History className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-base text-slate-800 font-display">
              Riwayat Aktivitas & Log Keamanan Sistem
            </h3>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md font-mono font-bold text-[10px] bg-slate-200 text-slate-800">
                      {log.action}
                    </span>
                    <span className="font-bold text-slate-800">{log.actorName} ({log.actorRole})</span>
                    <span className="text-slate-400">➔</span>
                    <span className="font-semibold text-teal-700">{log.targetUser}</span>
                  </div>
                  <p className="text-slate-600">{log.details}</p>
                </div>
                <span className="text-[11px] text-slate-400 font-mono shrink-0">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD / EDIT USER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-2 border-teal-300 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold font-display text-slate-900 mb-1">
              {editingUserId ? 'Edit Profil & Skor Pengguna' : 'Tambah Pengguna Baru'}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Kelola data belajar, tingkat kelas, dan skor evaluasi pengetahuan anak.
            </p>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Alamat Email Gmail</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Peran (Role)</label>
                  <select
                    disabled={!isSuperAdmin}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-bold"
                  >
                    <option value="user">Pengguna / Siswa</option>
                    <option value="kader">Kader Pembina</option>
                    <option value="admin">Admin Medis</option>
                    <option value="viewer">Viewer Pemantau</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Usia (Tahun)</label>
                  <input
                    type="number"
                    min="5"
                    max="65"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kelas / Institusi</label>
                  <input
                    type="text"
                    value={formData.schoolGrade}
                    onChange={(e) => setFormData({ ...formData, schoolGrade: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Wilayah / Posyandu</label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nilai Pre-Test (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.preTestScore}
                    onChange={(e) => setFormData({ ...formData, preTestScore: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nilai Post-Test (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.postTestScore}
                    onChange={(e) => setFormData({ ...formData, postTestScore: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Evaluasi Kader</label>
                <textarea
                  rows={2}
                  value={formData.cadreNotes}
                  onChange={(e) => setFormData({ ...formData, cadreNotes: e.target.value })}
                  placeholder="Catatan perkembangan atau kebutuhan pendampingan khusus..."
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
