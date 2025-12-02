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
import Swal from 'sweetalert2';

const ManajemenTugas = () => {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]); // Data karyawan untuk dropdown
    const [loading, setLoading] = useState(true);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    // State untuk Edit Status
    const [showEditStatusModal, setShowEditStatusModal] = useState(false);
    const [statusToUpdate, setStatusToUpdate] = useState("");
    const [taskToUpdate, setTaskToUpdate] = useState(null);

    // Helper untuk inisial nama
    const initials = (name) => name ? name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() : "??";
    
    // Helper format tanggal
    const formatDate = (dateString) => {
        if(!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric", month: "short", year: "numeric"
        });
    };

    // 1. FETCH DATA TUGAS & KARYAWAN
    const fetchData = async () => {
        const token = localStorage.getItem("token");
        try {
            // Fetch Tasks
            const tasksRes = await fetch("http://localhost:4000/api/admin/tasks", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const tasksData = await tasksRes.json();

            // Fetch Users (untuk dropdown assignee)
            const usersRes = await fetch("http://localhost:4000/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const usersData = await usersRes.json();

            if (tasksRes.ok && usersRes.ok) {
                setTasks(tasksData || []);
                // Handle struktur data user dari backend { data: [...] } atau [...]
                setUsers(usersData.data || usersData || []);
            } else {
                console.error("Gagal mengambil data");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. HANDLE BUAT TUGAS (POST)
    const handleCreateTask = async (formData) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:4000/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Tugas baru berhasil dibuat.',
                    confirmButtonColor: '#2E7D32',
                    timer: 1500
                });
                setShowTaskModal(false);
                fetchData(); // Refresh data
            } else {
                const err = await response.json();
                Swal.fire('Gagal', err.message || 'Gagal membuat tugas', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Terjadi kesalahan koneksi', 'error');
        }
    };

    // 3. HANDLE UPDATE STATUS (PATCH)
    const handleUpdateStatus = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:4000/api/admin/tasks/${taskToUpdate.id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: statusToUpdate })
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Status tugas berhasil diperbarui.',
                    confirmButtonColor: '#2E7D32',
                    timer: 1500
                });
                setShowEditStatusModal(false);
                fetchData();
            } else {
                Swal.fire('Gagal', 'Gagal update status', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Koneksi error', 'error');
        }
    };

    // 4. HANDLE DELETE (Dummy - Backend belum support delete task)
    const handleDelete = () => {
        Swal.fire({
            icon: 'info',
            title: 'Fitur Belum Tersedia',
            text: 'Penghapusan tugas belum didukung oleh sistem backend.',
            confirmButtonColor: '#2E7D32'
        });
    };

    // Buka Modal Edit Status
    const openEditModal = (task) => {
        setTaskToUpdate(task);
        setStatusToUpdate(task.status);
        setShowEditStatusModal(true);
    };

    // Filter Tabs
    const tabNames = ["Semua Tugas", "PENDING", "IN_PROGRESS", "DONE", "CANCELLED"];
    
    return (
        <div className="flex bg-[#F0F4F0] min-h-screen font-sans">
            <Aside />

            <main className="flex-1 bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] overflow-y-auto transition-all">
                <Topbar title="Manajemen Tugas" subtitle="Kelola dan monitor tugas karyawan" />

                {/* STATS CARDS (Dihitung dari data asli) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
                    <StatItem 
                        label="Total Tugas" 
                        value={tasks.length} 
                        color="text-green-700" 
                    />
                    <StatItem 
                        label="Selesai" 
                        value={tasks.filter(t => t.status === 'DONE').length} 
                        color="text-blue-600" 
                    />
                    <StatItem 
                        label="Dalam Proses" 
                        value={tasks.filter(t => t.status === 'IN_PROGRESS').length} 
                        color="text-orange-600" 
                    />
                    <StatItem 
                        label="Pending" 
                        value={tasks.filter(t => t.status === 'PENDING').length} 
                        color="text-gray-600" 
                    />
                </div>

                {/* ACTION & TABS */}
                <div className="flex flex-col gap-4 px-8">
                    <div className="flex justify-end">
                        <button 
                            onClick={() => setShowTaskModal(true)} 
                            className="cursor-pointer bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] hover:bg-green-700 text-white px-5 py-2.5 rounded-lg shadow-md font-medium text-sm flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                        >
                            <FiPlus className="text-lg" /> Buat Tugas Baru
                        </button>
                    </div>

                    <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 flex flex-wrap sm:flex-nowrap overflow-x-auto">
                        {tabNames.map((t, i) => (
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
                    {loading ? <p className="text-center text-gray-500">Memuat data tugas...</p> : (() => {
                        const filterStatus = tabNames[activeTab];
                        const filtered = activeTab === 0 
                            ? tasks 
                            : tasks.filter(t => t.status === filterStatus);
                        
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
                                    <h2 className="text-lg font-bold text-green-900 leading-tight">{task.title}</h2>
                                    <StatusBadge status={task.status} />
                                </div>

                                <p className="text-gray-500 text-sm mb-6 line-clamp-2 text-left">
                                    {task.description || "Tidak ada deskripsi"}
                                </p>

                                <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm mb-6 border-b border-gray-50 pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center font-bold text-xs">
                                            {initials(task.assignee?.name)}
                                        </div>
                                        <span className="text-gray-600 font-medium">{task.assignee?.name || "Belum ditugaskan"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <FiCalendar className="text-green-600" />
                                        <span>Deadline: {formatDate(task.dueDate)}</span>
                                    </div>
                                </div>

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
                        <TaskForm 
                            users={users} 
                            onCancel={() => setShowTaskModal(false)} 
                            onSave={handleCreateTask} 
                        />
                    </Modal>
                )}

                {/* MODAL - UPDATE STATUS */}
                {showEditStatusModal && (
                    <Modal title="Update Status Tugas" onClose={() => setShowEditStatusModal(false)}>
                        <div className="mt-2 space-y-4">
                            <p className="text-sm text-gray-600">Ubah status untuk tugas: <b>{taskToUpdate?.title}</b></p>
                            <select 
                                value={statusToUpdate} 
                                onChange={(e) => setStatusToUpdate(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                                <option value="PENDING">PENDING</option>
                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                <option value="DONE">DONE</option>
                                <option value="CANCELLED">CANCELLED</option>
                            </select>
                            <div className="flex justify-end pt-4 gap-2">
                                <button onClick={() => setShowEditStatusModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
                                <button onClick={handleUpdateStatus} className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">Simpan</button>
                            </div>
                        </div>
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
                                    <p className="font-semibold text-gray-800">{selectedTask.assignee?.name || "-"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Deadline</p>
                                    <p className="font-semibold text-gray-800">{formatDate(selectedTask.dueDate)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Dibuat Oleh</p>
                                    <p className="font-semibold text-gray-800">{selectedTask.createdBy?.name || "-"}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 uppercase mb-1">Deskripsi</p>
                                <p className="text-gray-700 bg-white p-3 border rounded-md min-h-[80px]">{selectedTask.description || "-"}</p>
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

/* --- SUB COMPONENTS --- */

const StatItem = ({ label, value, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center h-32">
        <h3 className={`text-4xl font-bold ${color}`}>{value}</h3>
        <p className="text-gray-500 text-sm mt-2 font-medium">{label}</p>
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        "IN_PROGRESS": "bg-blue-100 text-blue-700",
        "PENDING": "bg-orange-100 text-orange-700",
        "DONE": "bg-green-100 text-green-700",
        "CANCELLED": "bg-red-100 text-red-700"
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || "bg-gray-100"}`}>
            {status?.replace("_", " ")}
        </span>
    );
};

const ActionButton = ({ color, icon, label, onClick }) => {
    const colors = {
        blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
        yellow: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100",
        red: "bg-red-50 text-red-600 hover:bg-red-100",
    };
    return (
        <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${colors[color]}`}>
            <span className="text-lg">{icon}</span> {label}
        </button>
    );
};

/* --- FORM COMPONENT --- */
const TaskForm = ({ users, onCancel, onSave }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assigneeId, setAssigneeId] = useState("");
    const [dueDate, setDueDate] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!assigneeId) {
            Swal.fire('Peringatan', 'Silakan pilih karyawan terlebih dahulu', 'warning');
            return;
        }
        onSave({ 
            title, 
            description, 
            assigneeId: parseInt(assigneeId), 
            dueDate 
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Judul Tugas</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="Contoh: Input Data Buku" />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Deskripsi</label>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="Detail tugas..." />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Ditugaskan Kepada</label>
                <div className="relative">
                    <select value={assigneeId} onChange={e => setAssigneeId(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 appearance-none bg-white cursor-pointer">
                        <option value="">-- Pilih Karyawan --</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                </div>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Deadline</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="flex justify-end pt-4 gap-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">Batal</button>
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 shadow">Simpan Tugas</button>
            </div>
        </form>
    )
}