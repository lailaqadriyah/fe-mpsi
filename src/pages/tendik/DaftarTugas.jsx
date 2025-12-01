import React, { useState } from "react";
import AsideTendik from "../../components/AsideTendik";
import Topbar from "../../components/Topbar";
import {
  FiCalendar,
  FiFlag,
  FiUser,
  FiCheckCircle,
  FiMessageSquare,
  FiPlayCircle,
  FiEye
} from "react-icons/fi";
import Modal from "../../components/Modal";

const DaftarTugas = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTab, setActiveTab] = useState("Semua Tugas");
  const [selectedTask, setSelectedTask] = useState(null);

  // Tab Filters
  const tabs = ["Semua Tugas", "Baru", "Sedang Dikerjakan", "Selesai"];

  // Stats Data
  const stats = [
    { label: "Tugas Baru", value: 2, color: "text-orange-500" },
    { label: "Sedang Dikerjakan", value: 3, color: "text-blue-500" },
    { label: "Selesai Bulan Ini", value: 15, color: "text-green-600" },
  ];

  return (
    <div className="flex bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] min-h-screen">
      <AsideTendik />

      <main className="flex-1">
        <Topbar
          title="Daftar Tugas"
          subtitle="Kelola dan selesaikan tugas yang diberikan"
        />

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center h-32">
              <h3 className={`text-4xl font-bold ${s.color}`}>{s.value}</h3>
              <p className="text-gray-500 text-sm mt-2 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* FILTER TABS (Transparent Style) */}
        <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 flex flex-wrap sm:flex-nowrap overflow-x-auto mr-8 ml-8">
                        {tabs.map((t, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(i)}
                                className={`flex-1 text-center px-4 py-3 text-sm font-semibold transition-all duration-200 rounded-lg whitespace-nowrap ${
                                    i === activeTab 
                                    ? 'bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white shadow-sm' 
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

        {/* TASK LIST */}
        <div className="space-y-5 p-8">
          {(() => {
            const filtered = activeTab === "Semua Tugas" 
                ? tasks 
                : tasks.filter((tt) => tt.status === activeTab);

            if (filtered.length === 0) {
              return (
                <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                  Tidak ada tugas untuk kategori ini.
                </div>
              );
            }

            return filtered.map((task, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
                
                {/* Header: Title & Status Badge */}
                <div className="flex justify-between items-start mb-2 pr-28"> 
                  {/* pr-28 agar judul tidak menabrak badge status */}
                  <h3 className="text-lg font-bold text-gray-800 leading-tight">{task.judul}</h3>
                </div>
                
                {/* Status Badge (Absolute Top Right) */}
                <div className="absolute top-6 right-6">
                    <StatusBadge status={task.status} />
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-5 leading-relaxed max-w-4xl">
                  {task.deskripsi}
                </p>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs font-medium text-gray-500 mb-6">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Deadline: {task.deadline}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                         <FiFlag className={task.prioritas === "Prioritas Tinggi" ? "text-red-500" : "text-green-600"} />
                         <PrioritasBadge prioritas={task.prioritas} />
                    </div>

                    <div className="flex items-center gap-1.5">
                         <FiUser className="text-gray-400" />
                         <span>Ditugaskan oleh: {task.assigner}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-50">
                    
                    {/* Dynamic Main Action Button */}
                    {task.status === "Baru" && (
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 text-xs font-bold hover:bg-green-200 transition-colors">
                            <FiPlayCircle className="text-sm" /> Mulai Tugas
                        </button>
                    )}

                    {task.status === "Sedang Dikerjakan" && (
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 text-xs font-bold hover:bg-green-200 transition-colors">
                            <FiCheckCircle className="text-sm" /> Tandai Selesai
                        </button>
                    )}

                    {/* Secondary Actions */}
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors">
                        <FiMessageSquare className="text-sm" /> Tambah Catatan
                    </button>
                    
                    {/* View Detail (Optional/Jika perlu) */}
                    {task.status === "Selesai" && (
                         <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 transition-colors">
                            <FiEye className="text-sm" /> Lihat Detail
                        </button>
                    )}
                </div>

              </div>
            ));
          })()}
        </div>

        {/* MODAL DETAIL (Opsional - jika tombol detail diklik) */}
        {selectedTask && (
             <Modal title="Detail Tugas" onClose={() => setSelectedTask(null)}>
                 <p className="text-gray-700">{selectedTask.deskripsi}</p>
                 {/* Isi detail lainnya... */}
             </Modal>
        )}

      </main>
    </div>
  );
};

export default DaftarTugas;

/* --- COMPONENTS --- */

const StatusBadge = ({ status }) => {
    const styles = {
        "Baru": "bg-orange-100 text-orange-600", // Orange untuk baru
        "Sedang Dikerjakan": "bg-blue-100 text-blue-600", // Biru untuk progress
        "Selesai": "bg-green-100 text-green-600", // Hijau untuk selesai
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${styles[status] || "bg-gray-100"}`}>
            {status}
        </span>
    );
};

const PrioritasBadge = ({ prioritas }) => {
    const styles = {
        "Prioritas Normal": "bg-orange-100 text-orange-700",
        "Prioritas Tinggi": "bg-red-100 text-red-700",
    };
    // Di desain figma, prioritas badge berbentuk kotak kecil berwarna
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${styles[prioritas]}`}>
            {prioritas}
        </span>
    );
}

/* --- DUMMY DATA --- */
const initialTasks = [
  {
    judul: "Inventarisasi Buku Baru",
    deskripsi: "Melakukan pencatatan dan katalogisasi buku-buku baru yang baru diterima dari pengadaan bulan November 2025. Total 150 eksemplar buku perlu diinventaris dengan detail lengkap.",
    status: "Sedang Dikerjakan",
    deadline: "20 Nov 2025",
    prioritas: "Prioritas Tinggi",
    assigner: "Admin Perpustakaan"
  },
  {
    judul: "Update Database Koleksi",
    deskripsi: "Memperbarui database koleksi perpustakaan dengan menambahkan metadata yang masih kurang dan memperbaiki data yang salah input. Fokus pada koleksi tahun 2020-2023.",
    status: "Baru",
    deadline: "25 Nov 2025",
    prioritas: "Prioritas Normal",
    assigner: "Admin Perpustakaan"
  },
  {
    judul: "Penyusunan Panduan Layanan Digital",
    deskripsi: "Membuat panduan penggunaan layanan digital perpustakaan untuk mahasiswa baru, termasuk cara akses e-journal, e-book, dan layanan referensi online.",
    status: "Sedang Dikerjakan",
    deadline: "30 Nov 2025",
    prioritas: "Prioritas Normal",
    assigner: "Admin Perpustakaan"
  },
  {
    judul: "Pembuatan Laporan Bulanan",
    deskripsi: "Membuat laporan statistik pengunjung perpustakaan, peminjaman buku, dan layanan referensi untuk bulan Oktober 2025.",
    status: "Selesai",
    deadline: "15 Nov 2025",
    prioritas: "Prioritas Normal",
    assigner: "Admin Perpustakaan"
  },
];