import React, { useState } from "react";
import Aside from "../../components/Aside";
import Topbar from "../../components/Topbar";
import {
  FiMail,
  FiPhone,
  FiCalendar,
  FiEye,
  FiEdit,
  FiTrash2,
  FiCreditCard, // Tambahan icon untuk header modal
} from "react-icons/fi";
import Modal from "../../components/Modal";

const ManajemenKaryawan = () => {
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="flex bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] min-h-screen">
      {/* Sidebar */}
      <Aside />

      {/* Content */}
      <main
        className={`flex-1 bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] overflow-y-auto transition-all`}
      >
        <Topbar
          title="Manajemen Karyawan"
          subtitle="Kelola data tenaga kependidikan perpustakaan"
        />
        <div>
            <div className="w-full flex justify-end pr-8">
          <button
            onClick={() => setShowAdd(true)}
            className="bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white px-4 py-2 rounded-lg font-semibold text-sm shadow"
          >
            + Tambah Karyawan
          </button>
            </div>
        </div>
        {/* Search + filters + add button */}
        <div className="flex items-start gap-6 mb-8 p-8">
          <div className="flex-1 bg-white rounded-xl shadow px-4 py-6">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Cari nama karyawan, email, atau posisi..."
                className="flex-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 px-3 py-2"
              />

              <button className="bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 px-3 py-2 text-sm">
                Semua Status
              </button>
              <button className="bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 rounded-lg px-3 py-2 text-sm">
                Semua Posisi
              </button>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-16">
          {karyawanList.map((k, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow hover:shadow-md transition "
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 mb-4 rounded-full flex items-center justify-center text-white font-bold text-3xl 
                bg-gradient-to-b from-[#2E7D32] to-[#43A047] 
                shadow-[0_8px_20px_rgba(46,125,50,0.30)]">
                {k.initial}
              </div>
                <div className="">
                  <h3 className="font-bold text-green-800">{k.nama}</h3>
                  <p className="text-sm text-gray-600">{k.posisi}</p>
                  <div className="">
                    <StatusBadge status={k.status} />
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <button
                  onClick={() => setSelected(k)}
                  className="w-full bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 py-2 rounded-lg shadow-sm text-sm flex items-center justify-center gap-2"
                > <FiEye />
                  Lihat
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- MODAL DETAIL KARYAWAN (DIUBAH) --- */}
      {selected && (
        <Modal 
            title={
                <div className="flex items-center gap-2 text-[#1B5E20]">
                    <FiCreditCard className="text-xl" />
                    <span className="font-bold text-lg">Detail Data Karyawan</span>
                </div>
            } 
            onClose={() => setSelected(null)}
        >
          {/* Header Profile */}
          <div className="flex items-center gap-4 mb-6 mt-2">
            <div className="w-20 h-20 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold text-3xl shadow-sm">
              {selected.initial}
            </div>
            <div className="flex items-center gap-3">
                <h2 className="font-bold text-[#1B5E20] text-2xl">
                    {selected.nama}
                </h2>
                <button className="bg-[#FFF3E0] hover:bg-orange-100 bg-gradient-to-r from-[#FFE0B2] to-[#FFCC80] text-[#E65100] px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition">
                    <FiEdit className="text-sm" /> Edit
                </button>
            </div>
          </div>

          {/* List Data dengan Garis Putus-putus */}
          <div className="space-y-3">
            
            <div className="border-b border-dashed border-gray-200 pb-2 text-left">
                <p className="text-[11px] text-gray-400 mb-0.5">Posisi</p>
                <p className="font-medium text-gray-800">{selected.posisi}</p>
            </div>

            <div className="border-b border-dashed border-gray-200 pb-2 text-left">
                <p className="text-[11px] text-gray-400 mb-1">Status</p>
                <span className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-bold ${
                    selected.status === 'Aktif' ? 'bg-gradient-to-r from-[#C8E6C9] to-[#A5D6A7] text-[#1B5E20]' : 'bg-gradient-to-r from-[#FFCDD2] to-[#EF9A9A] text-[#C62828]'
                }`}>
                  {selected.status}
                </span>
            </div>

            <div className="border-b border-dashed border-gray-200 pb-2 text-left">
                <p className="text-[11px] text-gray-400 mb-0.5">Email</p>
                <p className="font-medium text-gray-800">{selected.email}</p>
            </div>

            <div className="border-b border-dashed border-gray-200 pb-2 text-left">
                <p className="text-[11px] text-gray-400 mb-0.5">Nomor Telepon</p>
                <p className="font-medium text-gray-800">{selected.telepon}</p>
            </div>

            <div className="border-b border-dashed border-gray-200 pb-2 text-left">
                <p className="text-[11px] text-gray-400 mb-0.5">Tanggal Bergabung</p>
                <p className="font-medium text-gray-800">{selected.bergabung}</p>
            </div>

          </div>

          {/* Ringkasan Kinerja */}
          <div className="mt-6">
            <h5 className="font-bold text-[#1B5E20] mb-3 text-left text-lg">
              Ringkasan Kinerja
            </h5>
            
            <div className="space-y-3">
                <div className="border-b border-dashed border-gray-200 pb-2 text-left">
                    <p className="text-[11px] text-gray-400 mb-0.5">Tugas Selesai</p>
                    <p className="font-bold text-gray-800">85%</p>
                </div>

                <div className="border-b border-dashed border-gray-200 pb-2 text-left">
                    <p className="text-[11px] text-gray-400 mb-0.5">Kehadiran Rata-rata</p>
                    <p className="font-bold text-gray-800">{selected.kehadiran}%</p>
                </div>
            </div>
          </div>

          {/* Tombol Hapus */}
          <div className="flex justify-end mt-6">
            <button className="bg-gradient-to-r from-[#FFCDD2] to-[#EF9A9A] text-[#C62828] hover:bg-red-100 px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition">
              <FiTrash2 className="text-lg" /> Hapus
            </button>
          </div>
        </Modal>
      )}

      {/* --- MODAL TAMBAH KARYAWAN (DIUBAH) --- */}
      {showAdd && (
        <Modal 
            title={
                <span className="text-2xl font-bold text-[#1B5E20]">Tambah Karyawan Baru</span>
            } 
            onClose={() => setShowAdd(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowAdd(false);
            }}
            className="space-y-4 mt-2"
          >
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5 text-left">
                Nama Lengkap
              </label>
              <input
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none transition placeholder-gray-400"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5 text-left">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none transition placeholder-gray-400"
                placeholder="nama@unand.ac.id"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5 text-left">
                Nomor Telepon
              </label>
              <input
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none transition placeholder-gray-400"
                placeholder="+62 812-3456-7890"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5 text-left">
                Posisi/Jabatan
              </label>
              <div className="relative">
                <select className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none transition appearance-none bg-gray-100 text-gray-700">
                    <option>Pustakawan</option>
                    <option>Admin Perpus</option>
                    <option>Referensi</option>
                    <option>Petugas Sirkulasi</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5 text-left">
                Tanggal Bergabung
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none transition text-gray-600"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] hover:bg-[#2E7D32] text-white px-16  py-2.5 rounded-lg font-bold text-sm shadow-md transition-all"
              >
                Simpan
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ManajemenKaryawan;

/* Components */

const DetailItem = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
    <span className="text-green-600">{icon}</span>
    {text}
  </div>
);

const StatusBadge = ({ status }) => {
  const styles =
    status === "Aktif"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles}`}>
      {status}
    </span>
  );
};

const ActionButton = ({ color, icon, label }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <button
      className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-semibold ${colors[color]}`}
    >
      {icon} {label}
    </button>
  );
};

/* Dummy Data */

const karyawanList = [
  {
    nama: "Ahmad Fauzi",
    posisi: "Pustakawan",
    initial: "AF",
    email: "ahmad.fauzi@unand.ac.id",
    telepon: "+62 812-3456-7890",
    bergabung: "15 Jan 2023",
    kehadiran: 95,
    status: "Aktif",
  },
  {
    nama: "Siti Rahma",
    posisi: "Admin Perpus",
    initial: "SR",
    email: "siti.rahma@unand.ac.id",
    telepon: "+62 813-4567-8901",
    bergabung: "20 Mar 2023",
    kehadiran: 98,
    status: "Aktif",
  },
  {
    nama: "Dewi Lestari",
    posisi: "Katalogis",
    initial: "DL",
    email: "dewi.lestari@unand.ac.id",
    telepon: "+62 815-6789-0123",
    bergabung: "05 Sep 2023",
    kehadiran: 97,
    status: "Aktif",
  },
  {
    nama: "Eko Prasetyo",
    posisi: "Referensi",
    initial: "EP",
    email: "eko.prasetyo@unand.ac.id",
    telepon: "+62 816-7890-1234",
    bergabung: "12 Feb 2024",
    kehadiran: 94,
    status: "Aktif",
  },
  {
    nama: "Budi Santoso",
    posisi: "Petugas Sirkulasi",
    initial: "BS",
    email: "budi.santoso@unand.ac.id",
    telepon: "+62 814-5678-9012",
    bergabung: "10 Jun 2022",
    kehadiran: 92,
    status: "Aktif",
  },
  {
    nama: "Rina Wulandari",
    posisi: "Pustakawan",
    initial: "RW",
    email: "rina.wulandari@unand.ac.id",
    telepon: "+62 817-8901-2345",
    bergabung: "18 Nov 2022",
    kehadiran: 88,
    status: "Nonaktif",
  },
];