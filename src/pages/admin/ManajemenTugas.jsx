import React, { useState } from "react";
import Aside from "../../components/Aside";
import {
    FiCalendar,
    FiEye,
    FiEdit,
    FiTrash2,
    FiFlag,
    FiUser,
    FiPlus
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

            {/* Sidebar */}
            <Aside />

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">

                {/* HEADER SECTION */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-green-800">Manajemen Tugas</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Kelola dan monitor tugas karyawan
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 gap-3">
                            <div className="w-9 h-9 flex items-center justify-center bg-green-600 text-white rounded-full font-bold text-sm">
                                A
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-semibold text-gray-800">Admin</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                        </div>

                        <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full text-sm font-medium shadow-sm transition">
                            Logout
                        </button>
                    </div>
                </div>

                {/* STATS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center h-32">
                            <h3 className={`text-4xl font-bold ${s.color}`}>{s.value}</h3>
                            <p className="text-gray-500 text-sm mt-2 font-medium">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* ACTION BUTTON & TABS SECTION */}
                <div className="flex flex-col gap-4 mb-6">
                    
                    {/* 1. Tombol Buat Tugas (Aligned Right) */}
                    <div className="flex justify-end">
                        <button 
                            onClick={() => setShowTaskModal(true)} 
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg shadow-md font-medium text-sm flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                        >
                            <FiPlus className="text-lg" /> Buat Tugas Baru
                        </button>
                    </div>

                    {/* 2. Tab Navigation Bar (White Container) */}
                    <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 flex flex-wrap sm:flex-nowrap overflow-x-auto">
                        {tabs.map((t, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(i)}
                                className={`flex-1 text-center px-4 py-3 text-sm font-semibold transition-all duration-200 rounded-lg whitespace-nowrap ${
                                    i === activeTab 
                                    ? 'bg-green-600 text-white shadow-sm' 
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* TASK LIST CARDS */}
                <div className="space-y-5">
                    {(() => {
                        const filtered = activeTab === 0 ? tasks : tasks.filter(t => t.status === tabs[activeTab]);
                        
                        if (filtered.length === 0) {
                            return (
                                <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                                    <p>Tidak ada tugas ditemukan untuk kategori ini.</p>
                                </div>
                            );
                        }

                        return filtered.map((task, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                
                                {/* Header: Title & Status */}
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-lg font-bold text-green-900 leading-tight">
                                        {task.judul}
                                    </h2>
                                    <StatusBadge status={task.status} />
                                </div>

                                {/* Description */}
                                <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                                    {task.deskripsi}
                                </p>

                                {/* Meta Data Row */}
                                <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm mb-6 border-b border-gray-50 pb-4">
                                    
                                    {/* User */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center font-bold text-xs">
                                            {task.initial}
                                        </div>
                                        <span className="text-gray-600 font-medium">{task.nama}</span>
                                    </div>

                                    {/* Deadline */}
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
                                    <ActionButton color="yellow" icon={<FiEdit />} label="Edit" />
                                    <ActionButton color="red" icon={<FiTrash2 />} label="Hapus" />
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
                                <h4 className="font-bold text-lg text-green-800 mb-1">{selectedTask.judul}</h4>
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
        "Dalam Progress": "bg-blue-100 text-blue-700",
        "Pending": "bg-orange-100 text-orange-700",
        "Selesai": "bg-green-100 text-green-700",
        "Terlambat": "bg-red-100 text-red-700"
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
        blue: "bg-blue-100 text-blue-600 hover:bg-blue-200",
        yellow: "bg-orange-100 text-orange-600 hover:bg-orange-200", // Adjusted to match 'Edit' usually being yellowish/orange
        red: "bg-red-100 text-red-600 hover:bg-red-200",
    };

    return (
        <button 
            type="button" 
            onClick={onClick} 
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${colors[color]}`}
        >
            {icon} {label}
        </button>
    );
};

/* --- FORM COMPONENT --- */
const TaskForm = ({ onCancel, onSave }) => {
    const [judul, setJudul] = useState("");
    const [deskripsi, setDeskripsi] = useState("");
    const [assignee, setAssignee] = useState("Ahmad Fauzi");
    const [deadline, setDeadline] = useState("");
    const [prioritas, setPrioritas] = useState("Prioritas Normal");
    const [status, setStatus] = useState("Pending");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ judul, deskripsi, assignee, deadline, prioritas, status });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Judul Tugas</label>
                <input required value={judul} onChange={e => setJudul(e.target.value)} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none" placeholder="Contoh: Inventarisasi Buku" />
            </div>
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Deskripsi</label>
                <textarea rows={3} value={deskripsi} onChange={e => setDeskripsi(e.target.value)} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none" placeholder="Deskripsi detail..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Karyawan</label>
                    <select value={assignee} onChange={e => setAssignee(e.target.value)} className="w-full px-4 py-2 rounded-lg border">
                        <option>Ahmad Fauzi</option>
                        <option>Siti Rahma</option>
                        <option>Dewi Lestari</option>
                        <option>Eko Prasetyo</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Deadline</label>
                    <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full px-4 py-2 rounded-lg border" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Prioritas</label>
                    <select value={prioritas} onChange={e => setPrioritas(e.target.value)} className="w-full px-4 py-2 rounded-lg border">
                        <option>Prioritas Normal</option>
                        <option>Prioritas Tinggi</option>
                        <option>Urgent</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-4 py-2 rounded-lg border">
                        <option>Pending</option>
                        <option>Dalam Progress</option>
                        <option>Selesai</option>
                        <option>Terlambat</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={onCancel} className="px-5 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Batal</button>
                <button type="submit" className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow">Simpan</button>
            </div>
        </form>
    )
}

/* --- DUMMY DATA --- */

const tabs = ["Semua Tugas", "Pending", "Dalam Progress", "Selesai", "Terlambat"];

const stats = [
    { label: "Tugas Pending", value: 8, color: "text-orange-500" },
    { label: "Dalam Progress", value: 12, color: "text-blue-500" },
    { label: "Selesai", value: 45, color: "text-green-600" },
    { label: "Terlambat", value: 3, color: "text-red-500" },
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