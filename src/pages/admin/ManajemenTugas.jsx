import React, { useState } from "react";
import Aside from "../../components/Aside";
import {
    FiUser,
    FiCalendar,
    FiEye,
    FiEdit,
    FiTrash2
} from "react-icons/fi";
import Modal from "../../components/Modal";

const ManajemenTugas = () => {
    const [tasks, setTasks] = useState(taskList);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const [activeTab, setActiveTab] = useState(0);

    // helper to compute initials from name
    const initials = (name) => name.split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase();

    return (
        <div className="flex bg-[#e8f5e9] min-h-screen">

            {/* Sidebar */}
            <Aside />

            {/* Content */}
            <main className="flex-1 p-8">

                {/* TOP BAR */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-green-800">Manajemen Tugas</h1>
                        <p className="text-gray-600 text-sm">
                            Kelola dan monitor tugas karyawan
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-white px-4 py-2 rounded-full shadow gap-3">
                            <div className="w-9 h-9 flex items-center justify-center bg-green-600 text-white rounded-full font-bold">
                                A
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Admin</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                        </div>

                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full">
                            Logout
                        </button>
                    </div>
                </div>

                {/* STAT CARDS */}
                <div className="grid grid-cols-4 gap-5 mb-8">

                    {stats.map((s, i) => (
                        <div key={i} className="bg-white p-5 rounded-xl shadow flex flex-col items-center">
                            <h3 className="text-3xl font-bold text-green-700">{s.value}</h3>
                            <p className="text-gray-600 text-sm mt-1">{s.label}</p>
                        </div>
                    ))}

                </div>

                {/* Header Row + Tabs (styled like mockup) */}
                <div className="relative mb-6 mt-6">
                    <div className="bg-white rounded-full shadow p-1 flex items-center overflow-hidden">
                        {tabs.map((t, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(i)}
                                className={`flex-1 text-center px-6 py-3 text-sm font-semibold transition-colors duration-150 ${i === activeTab ? 'bg-green-600 text-white shadow-lg' : 'text-gray-700'}`}
                            >
                                {t}
                            </button>
                        ))}
                        <div className="mb-8">
                    <button onClick={() => setShowTaskModal(true)} className="absolute right-0 -top-4 bg-green-600 text-white px-5 py-2 rounded-lg shadow text-sm mb-18">
                        + Buat Tugas Baru
                    </button>
                        </div>
                    </div>

                </div>

                {/* TASK LIST */}
                {(() => {
                    const filtered = activeTab === 0 ? tasks : tasks.filter(t => t.status === tabs[activeTab]);
                    if (filtered.length === 0) {
                        return (
                            <div className="bg-white p-6 rounded-xl shadow mb-5 border border-green-100 text-center text-gray-500">
                                Tidak ada tugas untuk kategori ini.
                            </div>
                        );
                    }

                    return filtered.map((task, i) => (
                    <div
                        key={i}
                        className="bg-white p-6 rounded-xl shadow mb-5 border border-green-100"
                    >

                        {/* Title + Status */}
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-bold text-green-900">
                                {task.judul}
                            </h2>

                            <StatusBadge status={task.status} />
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 text-sm mb-5 leading-relaxed">
                            {task.deskripsi}
                        </p>

                        {/* Footer info */}
                        <div className="flex items-center gap-5 text-sm">

                            <div className="flex items-center gap-2 text-gray-700">
                                <div className="w-9 h-9 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                                    {task.initial}
                                </div>
                                <span className="font-semibold">{task.nama}</span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-700">
                                <FiCalendar className="text-green-700" />
                                <span>Deadline: {task.deadline}</span>
                            </div>

                            <PrioritasBadge prioritas={task.prioritas} />
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex gap-3 mt-4">
                            <ActionButton onClick={() => setSelectedTask(task)} color="blue" icon={<FiEye />} label="Detail" />
                            <ActionButton color="yellow" icon={<FiEdit />} label="Edit" />
                            <ActionButton color="red" icon={<FiTrash2 />} label="Hapus" />
                        </div>

                    </div>
                    ))
                })()}

                {/* Task creation modal */}
                {showTaskModal && (
                    <Modal title="Buat Tugas Baru" onClose={() => setShowTaskModal(false)}>
                        <TaskForm onCancel={() => setShowTaskModal(false)} onSave={(values) => {
                            const newTask = {
                                judul: values.judul,
                                deskripsi: values.deskripsi,
                                status: values.status,
                                nama: values.assignee,
                                initial: initials(values.assignee),
                                deadline: values.deadline || '-',
                                prioritas: values.prioritas || 'Prioritas Normal'
                            };
                            setTasks(prev => [newTask, ...prev]);
                            setShowTaskModal(false);
                        }} />
                    </Modal>
                )}
                {selectedTask && (
                    <Modal title={`Detail Tugas: ${selectedTask.judul}`} onClose={() => setSelectedTask(null)}>
                        <div className="text-sm text-gray-700 space-y-3">
                            <div>
                                <p className="text-xs text-gray-500">Judul Tugas</p>
                                <p className="font-semibold text-green-900">{selectedTask.judul}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">Ditugaskan Kepada</p>
                                <p className="font-semibold">{selectedTask.nama}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">Deadline</p>
                                    <p>{selectedTask.deadline}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Prioritas</p>
                                    <p className="text-sm font-semibold text-yellow-700">{selectedTask.prioritas}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">Status</p>
                                <p className="text-sm font-semibold text-blue-600">{selectedTask.status}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">Deskripsi Tugas</p>
                                <p className="text-gray-700 whitespace-pre-line">{selectedTask.deskripsi}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">Catatan Karyawan</p>
                                <p className="text-gray-700">-</p>
                            </div>

                            <div className="flex justify-end mt-4">
                                <button onClick={() => setSelectedTask(null)} className="px-4 py-2 rounded-md bg-white border">Tutup</button>
                            </div>
                        </div>
                    </Modal>
                )}
            </main>
        </div>
    );
};

export default ManajemenTugas;

/* --- BADGES COMPONENTS --- */

const StatusBadge = ({ status }) => {
    const styles = {
        "Dalam Progress": "bg-blue-100 text-blue-700",
        "Pending": "bg-yellow-100 text-yellow-700",
        "Selesai": "bg-green-100 text-green-700",
        "Terlambat": "bg-red-100 text-red-700"
    };

    return (
        <span className={`px-4 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
            {status}
        </span>
    );
};

const PrioritasBadge = ({ prioritas }) => {
    const styles = {
        "Prioritas Normal": "bg-orange-100 text-orange-700",
        "Prioritas Tinggi": "bg-red-100 text-red-700",
        "Urgent": "bg-red-300 text-white"
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[prioritas]}`}>
            {prioritas}
        </span>
    );
};

const ActionButton = ({ color, icon, label, onClick }) => {
    const colors = {
        blue: "bg-blue-100 text-blue-600",
        yellow: "bg-yellow-100 text-yellow-600",
        red: "bg-red-100 text-red-600",
    };

    return (
        <button type="button" onClick={onClick} className={`flex items-center gap-2 px-4 py-1.5 rounded text-sm font-semibold ${colors[color]}`}>
            {icon} {label}
        </button>
    );
};

/* --- DATA --- */

const tabs = ["Semua Tugas", "Pending", "Dalam Progress", "Selesai", "Terlambat"];

const stats = [
    { label: "Tugas Pending", value: 8 },
    { label: "Dalam Progress", value: 12 },
    { label: "Selesai", value: 45 },
    { label: "Terlambat", value: 3 },
];

const taskList = [
    {
        judul: "Inventarisasi Buku Baru",
        deskripsi:
            "Melakukan pencatatan dan katalogisasi buku-buku baru hasil pengadaan bulan November 2025.",
        status: "Dalam Progress",
        nama: "Ahmad Fauzi",
        initial: "AF",
        deadline: "30 Nov 2025",
        prioritas: "Prioritas Normal"
    },
    {
        judul: "Update Database Koleksi",
        deskripsi:
            "Mengupdate database koleksi perpustakaan dengan menambahkan metadata yang kurang.",
        status: "Pending",
        nama: "Dewi Lestari",
        initial: "DL",
        deadline: "25 Nov 2025",
        prioritas: "Prioritas Normal"
    },
    {
        judul: "Penyusunan Panduan Layanan Digital",
        deskripsi:
            "Membuat panduan layanan digital untuk mahasiswa baru.",
        status: "Dalam Progress",
        nama: "Eko Prasetyo",
        initial: "EP",
        deadline: "30 Nov 2025",
        prioritas: "Prioritas Normal"
    },
    {
        judul: "Pembuatan Laporan Bulanan",
        deskripsi:
            "Menyusun laporan statistik penggunaan perpustakaan.",
        status: "Selesai",
        nama: "Siti Rahma",
        initial: "SR",
        deadline: "15 Nov 2025",
        prioritas: "Prioritas Normal"
    },
    {
        judul: "Penataan Ruang Baca",
        deskripsi:
            "Melakukan penataan ulang ruang baca lantai 2.",
        status: "Terlambat",
        nama: "Budi Santoso",
        initial: "BS",
        deadline: "18 Nov 2025",
        prioritas: "Urgent"
    },
];

/* --- Task Form Component --- */
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
                <label className="text-sm font-semibold text-gray-700">Judul Tugas</label>
                <input value={judul} onChange={e=>setJudul(e.target.value)} required className="w-full mt-1 px-3 py-2 rounded-md border" placeholder="Masukkan judul tugas" />
            </div>

            <div>
                <label className="text-sm font-semibold text-gray-700">Deskripsi</label>
                <textarea value={deskripsi} onChange={e=>setDeskripsi(e.target.value)} rows={4} className="w-full mt-1 px-3 py-2 rounded-md border" placeholder="Deskripsi detail tugas" />
            </div>

            <div>
                <label className="text-sm font-semibold text-gray-700">Ditugaskan Kepada</label>
                <select value={assignee} onChange={e=>setAssignee(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md border">
                    <option>Ahmad Fauzi</option>
                    <option>Siti Rahma</option>
                    <option>Dewi Lestari</option>
                    <option>Eko Prasetyo</option>
                    <option>Budi Santoso</option>
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-semibold text-gray-700">Deadline</label>
                    <input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md border" />
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-700">Prioritas</label>
                    <select value={prioritas} onChange={e=>setPrioritas(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md border">
                        <option>Prioritas Normal</option>
                        <option>Prioritas Tinggi</option>
                        <option>Urgent</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="text-sm font-semibold text-gray-700">Status</label>
                <select value={status} onChange={e=>setStatus(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md border">
                    <option>Pending</option>
                    <option>Dalam Progress</option>
                    <option>Selesai</option>
                    <option>Terlambat</option>
                </select>
            </div>

            <div className="flex justify-end gap-3">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-white border">Batal</button>
                <button type="submit" className="px-6 py-2 rounded-full bg-green-600 text-white">Simpan Tugas</button>
            </div>
        </form>
    );
};

