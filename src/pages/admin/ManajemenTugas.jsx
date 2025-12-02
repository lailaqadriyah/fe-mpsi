import React, { useState, useEffect } from "react";
import Aside from "../../components/Aside";
import Topbar from "../../components/Topbar";
import {
    FiCalendar,
    FiEye,
    FiEdit,
    FiTrash2,
    FiFlag,
    FiPlus,
    FiX,
    FiCheckCircle
} from "react-icons/fi";
import Modal from "../../components/Modal";

const ManajemenTugas = () => {
    const [tasks, setTasks] = useState(taskList);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    // Helper untuk inisial nama
    const initials = (name) => name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

    return (
        <div className="flex bg-[#F0F4F0] min-h-screen font-sans">
            <Aside />

            {/* Main Content */}
            <main
        className={`flex-1 bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] overflow-y-auto transition-all`}
      >

                <Topbar
          title="Manajemen Tugas"
          subtitle="Kelola dan monitor tugas karyawan"
        />

                {/* STATS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center h-32">
                            <h3 className={`text-4xl font-bold ${s.color}`}>{s.value}</h3>
                            <p className="text-gray-500 text-sm mt-2 font-medium">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* ACTION BUTTON & TABS SECTION */}
                <div className="flex flex-col gap-4">
                    
                    {/* 1. Tombol Buat Tugas (Aligned Right) */}
                    <div className="flex justify-end mr-8">
                        <button 
                            onClick={() => setShowTaskModal(true)} 
                            className="cursor-pointer bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] hover:bg-green-700 text-white px-5 py-2.5 rounded-lg shadow-md font-medium text-sm flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                        >
                            <FiPlus className="text-lg" /> Buat Tugas Baru
                        </button>
                    </div>

                    {/* 2. Tab Navigation Bar (White Container) */}
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
                                {t.replace("_", " ")}
                            </button>
                        ))}
                    </div>
                </div>

                {/* TASK LIST */}
                <div className="space-y-5 p-8">
                    {(() => {
                        const filtered = activeTab === 0 ? tasks : tasks.filter(t => t.status === tabs[activeTab]);
                        
                        if (filtered.length === 0) {
                            return (
                                <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                                    <p>Tidak ada tugas ditemukan.</p>
                                </div>
                            );
                        }
                        return filtered.map((task, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-lg font-bold text-green-900 leading-tight">
                                        {task.judul}
                                    </h2>
                                    <StatusBadge status={task.status} />
                                </div>

                                {/* Description */}
                                <p className="text-gray-500 text-sm mb-6 line-clamp-2 text-left">
                                    {task.deskripsi}
                                </p>

                                {/* Meta Data Row */}
                                <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm mb-6 border-b border-gray-50 pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center font-bold text-xs">
                                            {initials(task.assignee?.name)}
                                        </div>
                                        <span className="text-gray-600 font-medium">{task.assignee?.name || "Belum ditugaskan"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <FiCalendar className="text-green-600" />
                                        <span>Deadline: {task.deadline}</span>
                                    </div>

                                    {/* Priority */}
                                    <div className="flex items-center gap-2">
                                        <FiFlag className={`${task.prioritas === 'Urgent' ? 'text-red-500' : 'text-green-600'}`} />
                                        <PrioritasBadge prioritas={task.prioritas} />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <ActionButton onClick={() => setSelectedTask(task)} color="blue" icon={<FiEye />} label="Detail" />
                                    <ActionButton onClick={() => openEditModal(task)} color="yellow" icon={<FiEdit />} label="Ubah Status" />
                                    <ActionButton onClick={handleDelete} color="red" icon={<FiTrash2 />} label="Hapus" />
                                </div>
                            </div>
                        ))
                    })()}
                </div>

                {/* MODAL - CREATE TASK */}
                {showTaskModal && (
                    <Modal title="Buat Tugas Baru" onClose={() => setShowTaskModal(false)}>
                        <TaskForm onCancel={() => setShowTaskModal(false)} onSave={(values) => {
                            const newTask = {
                                ...values,
                                initial: initials(values.assignee),
                                nama: values.assignee,
                                deadline: values.deadline || 'Belum ditentukan'
                            };
                            setTasks(prev => [newTask, ...prev]);
                            setShowTaskModal(false);
                        }} />
                    </Modal>
                )}

                {/* MODAL - DETAIL TASK */}
                {selectedTask && (
                    <Modal title="Detail Tugas" onClose={() => setSelectedTask(null)}>
                        <div className="space-y-4 text-sm">
                            <div>
                                <h4 className="font-extrabold text-lg text-green-800 mb-1">{selectedTask.title}</h4>
                                <StatusBadge status={selectedTask.status} />
                            </div>
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Ditugaskan Kepada</p>
                                    <p className="font-semibold text-gray-800">{selectedTask.nama}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Deadline</p>
                                    <p className="font-semibold text-gray-800">{selectedTask.deadline}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Prioritas</p>
                                    <p className="font-semibold text-gray-800">{selectedTask.prioritas}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 uppercase mb-1">Deskripsi</p>
                                <p className="text-gray-700 bg-white p-3 border rounded-md">{selectedTask.deskripsi}</p>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button onClick={() => setSelectedTask(null)} className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium text-gray-700">Tutup</button>
                            </div>
                        </div>
                    </Modal>
                )}
            </main>
        </div>
    );
};

export default ManajemenTugas;

/* --- COMPONENT HELPERS --- */

const StatusBadge = ({ status }) => {
    const styles = {
        "Dalam Progress": "bg-gradient-to-r from-[#BBDEFB] to-[#90CAF9] text-[#0D47A1]",
        "Pending": "bg-gradient-to-r from-[#FFE0B2] to-[#FFCC80] text-[#E65100]",
        "Selesai": "bg-gradient-to-r from-[#C8E6C9] to-[#A5D6A7] text-[#1B5E20]",
        "Terlambat": "bg-gradient-to-r from-[#FFCDD2] to-[#EF9A9A] text-[#C62828]"
    };

    return (
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${styles[status] || "bg-gray-100 text-gray-600"}`}>
            {status}
        </span>
    );
};

const PrioritasBadge = ({ prioritas }) => {
    const styles = {
        "Prioritas Normal": "bg-orange-100 text-orange-700",
        "Prioritas Tinggi": "bg-red-100 text-red-700",
        "Urgent": "bg-red-200 text-red-800"
    };

    return (
        <span className={`px-3 py-1 rounded-md text-xs font-semibold ${styles[prioritas] || "bg-gray-100"}`}>
            {prioritas}
        </span>
    );
};

const ActionButton = ({ color, icon, label, onClick }) => {
    const colors = {
        // Detail: Gradasi Biru
        blue: "bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] text-[#1976D2] hover:shadow-md",
        
        // Edit: Gradasi Kuning/Oranye
        yellow: "bg-gradient-to-r from-[#FFF3E0] to-[#FFE0B2] text-[#EF6C00] hover:shadow-md",
        
        // Hapus: Gradasi Merah
        red: "bg-gradient-to-r from-[#FFEBEE] to-[#FFCDD2] text-[#C62828] hover:shadow-md",
    };

    return (
        <button 
            type="button" 
            onClick={onClick} 
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-[10px] text-sm font-bold transition-all duration-200 ${colors[color]}`}
        >
            <span className="text-lg">{icon}</span>
            {label}
        </button>
    );
};

/* --- FORM COMPONENT (UPDATED FOR MODAL UI) --- */
const TaskForm = ({ onSave }) => {
    const [judul, setJudul] = useState("");
    const [deskripsi, setDeskripsi] = useState("");
    const [assignee, setAssignee] = useState("Pilih Karyawan");
    const [deadline, setDeadline] = useState("");
    const [prioritas, setPrioritas] = useState("Tinggi");
    const [status, setStatus] = useState("Pending");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validasi sederhana
        if(assignee === "Pilih Karyawan") {
            alert("Silakan pilih karyawan terlebih dahulu");
            return;
        }
        onSave({ judul, deskripsi, assignee, deadline, prioritas, status });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5 text-left">Judul Tugas</label>
                <input 
                    required 
                    value={judul} 
                    onChange={e => setJudul(e.target.value)} 
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none transition placeholder-gray-400" 
                    placeholder="Masukkan judul tugas" 
                />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5 text-left">Deskripsi</label>
                <textarea 
                    rows={3} 
                    value={deskripsi} 
                    onChange={e => setDeskripsi(e.target.value)} 
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none transition placeholder-gray-400" 
                    placeholder="Deskripsi detail tugas" 
                />
            </div>

            {/* Ditugaskan Kepada */}
            <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Ditugaskan Kepada</label>
                <div className="relative">
                    <select value={assignee} onChange={e => setAssignee(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none transition appearance-none bg-gray-100 text-gray-700 cursor-pointer">
                        <option disabled>Pilih Karyawan</option>
                        <option>Ahmad Fauzi</option>
                        <option>Siti Rahma</option>
                        <option>Dewi Lestari</option>
                        <option>Eko Prasetyo</option>
                        <option>Budi Santoso</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5 text-left">Deadline</label>
                <div className="relative w-48">
                    <input 
                        type="date" 
                        value={deadline} 
                        onChange={e => setDeadline(e.target.value)} 
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none transition text-gray-600 cursor-pointer" 
                    />
                </div>
            </div>

            {/* Prioritas */}
            <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5 text-left">Prioritas</label>
                <div className="relative">
                    <select value={prioritas} onChange={e => setPrioritas(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none transition appearance-none bg-gray-100 text-gray-700 cursor-pointer">
                        <option>Tinggi</option>
                        <option>Normal</option>
                        <option>Urgent</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            {/* Status */}
            <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5 text-left">Status</label>
                <div className="relative">
                    <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none transition appearance-none bg-gray-100 text-gray-700 cursor-pointer">
                        <option>Pending</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            {/* Footer Button (Hanya Simpan) */}
            <div className="flex justify-end pt-6">
                <button 
                    type="submit" 
                    className="bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] hover:bg-[#2E7D32] text-white px-10 py-2.5 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95"
                >
                    Simpan Tugas
                </button>
            </div>
        </form>
    )
}

/* --- DUMMY DATA --- */

const tabs = ["Semua Tugas", "Pending", "Dalam Progress", "Selesai", "Terlambat"];

const stats = [
    { 
        label: "Tugas Pending", 
        value: 8, 
        // Gradasi Orange (Sesuai gambar image_29c5fc.jpg: #F57C00 -> #FFB74D)
        color: "bg-gradient-to-r from-[#F57C00] to-[#FFB74D] bg-clip-text text-transparent" 
    },
    { 
        label: "Dalam Progress", 
        value: 12, 
        // Gradasi Biru (Sesuai gambar image_29c61c.jpg: #0288D1 -> #4FC3F7)
        color: "bg-gradient-to-r from-[#0288D1] to-[#4FC3F7] bg-clip-text text-transparent" 
    },
    { 
        label: "Selesai", 
        value: 45, 
        // Gradasi Hijau (Sesuai gambar sebelumnya)
        color: "bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] bg-clip-text text-transparent" 
    },
    { 
        label: "Terlambat", 
        value: 3, 
        // Gradasi Merah (Sesuai gambar sebelumnya)
        color: "bg-gradient-to-r from-[#C62828] to-[#EF5350] bg-clip-text text-transparent" 
    },
];

const taskList = [
    {
        judul: "Inventarisasi Buku Baru",
        deskripsi: "Melakukan pencatatan dan katalogisasi buku-buku baru yang baru diterima dari pengadaan bulan November 2025. Total 150 eksemplar buku perlu diinventaris.",
        status: "Dalam Progress",
        nama: "Ahmad Fauzi",
        initial: "AF",
        deadline: "30 Nov 2025",
        prioritas: "Prioritas Normal"
    },
    {
        judul: "Update Database Koleksi",
        deskripsi: "Memperbarui database koleksi perpustakaan dengan menambahkan metadata yang masih kurang dan memperbaiki data yang salah input.",
        status: "Pending",
        nama: "Dewi Lestari",
        initial: "DL",
        deadline: "25 Nov 2025",
        prioritas: "Prioritas Normal"
    },
    {
        judul: "Penyusunan Panduan Layanan Digital",
        deskripsi: "Membuat panduan penggunaan layanan digital perpustakaan untuk mahasiswa baru, termasuk cara akses e-journal dan e-book.",
        status: "Dalam Progress",
        nama: "Eko Prasetyo",
        initial: "EP",
        deadline: "30 Nov 2025",
        prioritas: "Prioritas Normal"
    },
];