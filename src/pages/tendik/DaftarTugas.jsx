import React, { useState, useEffect } from "react";
import AsideTendik from "../../components/AsideTendik";
import Topbar from "../../components/Topbar";
import {
  FiFlag,
  FiUser,
  FiCheckCircle,
  FiMessageSquare,
  FiPlayCircle,
  FiEye
} from "react-icons/fi";
import Modal from "../../components/Modal";
import Swal from "sweetalert2";

const DaftarTugas = () => {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("Semua Tugas");
  const [selectedTask, setSelectedTask] = useState(null);
  
  // State untuk statistik yang dihitung dari data tugas
  const [stats, setStats] = useState([
    { label: "Tugas Baru", value: 0, color: "text-orange-500" },
    { label: "Sedang Dikerjakan", value: 0, color: "text-blue-500" },
    { label: "Selesai Bulan Ini", value: 0, color: "text-green-600" },
  ]);

  const tabs = ["Semua Tugas", "Baru", "Sedang Dikerjakan", "Selesai"];

  // --- HELPER MAPPING ---
  // Mapping status dari Backend (ENUM) ke Tampilan Frontend
  const mapStatusBEtoFE = (status) => {
    switch(status) {
      case 'BARU': return 'Baru';
      case 'SEDANG_DIKERJAKAN': return 'Sedang Dikerjakan';
      case 'SELESAI': return 'Selesai';
      default: return status;
    }
  };

  // Mapping Prioritas dari Backend ke Tampilan Frontend
  const mapPrioritasBEtoFE = (prio) => {
    switch(prio) {
      case 'TINGGI': return 'Prioritas Tinggi';
      case 'NORMAL': return 'Prioritas Normal';
      default: return 'Prioritas Normal';
    }
  };

  // --- API FETCHING ---
  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Menggunakan endpoint /api/tasks yang sudah memfilter berdasarkan user login (assignee atau creator)
      const response = await fetch("http://localhost:4000/api/tasks", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Format data dari Backend ke Frontend
        const formattedTasks = data.map(t => ({
          id: t.id,
          judul: t.title,
          deskripsi: t.description || "-",
          status: mapStatusBEtoFE(t.status),
          deadline: t.dueDate ? new Date(t.dueDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }) : "-",
          prioritas: mapPrioritasBEtoFE(t.prioritas),
          assigner: t.createdBy ? t.createdBy.name : "Admin" // Nama pembuat tugas
        }));

        setTasks(formattedTasks);
        calculateStats(formattedTasks);
      }
    } catch (error) {
      console.error("Gagal mengambil data tugas:", error);
    }
  };

  // Hitung statistik berdasarkan data yang diterima
  const calculateStats = (taskList) => {
    const baru = taskList.filter(t => t.status === "Baru").length;
    const progress = taskList.filter(t => t.status === "Sedang Dikerjakan").length;
    const selesai = taskList.filter(t => t.status === "Selesai").length;

    setStats([
      { label: "Tugas Baru", value: baru, color: "text-orange-500" },
      { label: "Sedang Dikerjakan", value: progress, color: "text-blue-500" },
      { label: "Selesai Total", value: selesai, color: "text-green-600" },
    ]);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // --- HANDLER UPDATE STATUS ---
  const handleUpdateStatus = async (id, newStatusBE) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:4000/api/tasks/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatusBE })
      });

      if (response.ok) {
        Swal.fire("Berhasil", "Status tugas diperbarui", "success");
        fetchTasks(); // Refresh data
      } else {
        Swal.fire("Gagal", "Gagal memperbarui status", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Terjadi kesalahan koneksi", "error");
    }
  };

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

        {/* FILTER TABS */}
        <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 flex flex-wrap sm:flex-nowrap overflow-x-auto mr-8 ml-8">
            {tabs.map((t, i) => (
                <button
                    key={i}
                    onClick={() => setActiveTab(t)}
                    className={`flex-1 text-center px-4 py-3 text-sm font-semibold transition-all duration-200 rounded-lg whitespace-nowrap ${
                        activeTab === t 
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
                    
                    {/* BUTTON: Mulai Tugas -> Ubah status jadi SEDANG_DIKERJAKAN */}
                    {task.status === "Baru" && (
                        <button 
                            onClick={() => handleUpdateStatus(task.id, 'SEDANG_DIKERJAKAN')}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 text-xs font-bold hover:bg-green-200 transition-colors cursor-pointer"
                        >
                            <FiPlayCircle className="text-sm" /> Mulai Tugas
                        </button>
                    )}

                    {/* BUTTON: Tandai Selesai -> Ubah status jadi SELESAI */}
                    {task.status === "Sedang Dikerjakan" && (
                        <button 
                            onClick={() => handleUpdateStatus(task.id, 'SELESAI')}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 text-xs font-bold hover:bg-green-200 transition-colors cursor-pointer"
                        >
                            <FiCheckCircle className="text-sm" /> Tandai Selesai
                        </button>
                    )}

                    {/* Secondary Actions */}
                    {task.status !== "Selesai" && (
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer">
                            <FiMessageSquare className="text-sm" /> Tambah Catatan
                        </button>
                    )}
                    
                    {/* View Detail */}
                    <button 
                        onClick={() => setSelectedTask(task)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        <FiEye className="text-sm" /> Lihat Detail
                    </button>
                </div>

              </div>
            ));
          })()}
        </div>

        {/* MODAL DETAIL */}
        {selectedTask && (
             <Modal title="Detail Tugas" onClose={() => setSelectedTask(null)}>
                 <div className="space-y-4">
                    <div>
                        <h4 className="font-bold text-gray-800 text-lg">{selectedTask.judul}</h4>
                        <div className="mt-1 flex gap-2">
                            <StatusBadge status={selectedTask.status} />
                            <PrioritasBadge prioritas={selectedTask.prioritas} />
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Deskripsi</p>
                        <p className="text-gray-700 text-sm leading-relaxed">{selectedTask.deskripsi}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Deadline</p>
                            <p className="text-sm font-medium">{selectedTask.deadline}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Pemberi Tugas</p>
                            <p className="text-sm font-medium">{selectedTask.assigner}</p>
                        </div>
                    </div>
                 </div>
                 <div className="mt-6 flex justify-end">
                    <button onClick={() => setSelectedTask(null)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold text-gray-700">Tutup</button>
                 </div>
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
        "Baru": "bg-orange-100 text-orange-600",
        "Sedang Dikerjakan": "bg-blue-100 text-blue-600",
        "Selesai": "bg-green-100 text-green-600",
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
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${styles[prioritas] || "bg-gray-100"}`}>
            {prioritas}
        </span>
    );
}