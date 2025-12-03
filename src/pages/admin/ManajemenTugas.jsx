import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // IMPORT BARU
import Aside from "../../components/Aside";
import Topbar from "../../components/Topbar";
import {
    FiCalendar,
    FiEye,
    FiEdit,
    FiTrash2,
    FiFlag,
    FiUser,
    FiPlus,
    FiAlertCircle
} from "react-icons/fi";
import Modal from "../../components/Modal";
import Swal from "sweetalert2";

const ManajemenTugas = () => {
    // --- STATE ---
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [showTaskModal, setShowTaskModal] = useState(false);
    
    // State untuk Detail & Edit
    const [selectedTask, setSelectedTask] = useState(null);
    const [editingTask, setEditingTask] = useState(null); 
    const [activeTab, setActiveTab] = useState(0);
    
    const [statsData, setStatsData] = useState({
        pending: 0,
        progress: 0,
        done: 0,
        late: 0
    });

    const location = useLocation(); // Hook location
    const navigate = useNavigate(); // Hook navigate

    // --- HELPER FUNCTIONS ---
    const initials = (name) => name ? name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() : "XY";

    // PERBAIKAN: Mapping Status ENUM DB ke Tampilan
    const mapStatusBEtoFE = (status) => {
        switch(status) {
            case 'PENDING': return 'Pending';
            case 'DALAM_PROGERSS': return 'On Progress'; // Typo DB
            case 'SELESAI': return 'Selesai';
            // Fallback untuk data lama
            case 'BARU': return 'Pending';
            case 'SEDANG_DIKERJAKAN': return 'On Progress';
            default: return status;
        }
    };

    const mapPrioritasBEtoFE = (prio) => {
        switch(prio) {
            case 'TINGGI': return 'Prioritas Tinggi';
            case 'NORMAL': return 'Prioritas Normal';
            default: return 'Normal';
        }
    };

    // LOGIKA BARU: Cek Apakah Terlambat
    const checkIsOverdue = (dateString, status) => {
        if (!dateString || status === 'Selesai') return false;
        
        const deadline = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        deadline.setHours(0, 0, 0, 0);

        return deadline < today;
    };

    // --- API CALLS ---
    const token = localStorage.getItem("token");

    const fetchTasksAndStats = async () => {
        if (!token) return;
        try {
            // Stats
            const resStats = await fetch("http://localhost:4000/api/admin/task-stats", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (resStats.ok) setStatsData(await resStats.json());

            // Tasks
            const resTasks = await fetch("http://localhost:4000/api/admin/tasks", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            if (resTasks.ok) {
                const dataTasks = await resTasks.json();
                const formattedTasks = dataTasks.map(t => ({
                    id: t.id,
                    judul: t.title,
                    deskripsi: t.description || "-",
                    status: mapStatusBEtoFE(t.status),
                    assigneeId: t.assigneeId,
                    rawDate: t.dueDate, 
                    rawPrioritas: t.prioritas,
                    nama: t.assignee ? t.assignee.name : "Belum Ditunjuk",
                    initial: initials(t.assignee ? t.assignee.name : ""),
                    deadline: t.dueDate ? new Date(t.dueDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }) : "-",
                    prioritas: mapPrioritasBEtoFE(t.prioritas)
                }));
                setTasks(formattedTasks);
            }
        } catch (error) {
            console.error("Gagal mengambil data tugas:", error);
        }
    };

    const fetchUsers = async () => {
        if (!token) return;
        try {
            const response = await fetch("http://localhost:4000/api/admin/users", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const result = await response.json();
                setUsers(result.data || []); 
            }
        } catch (error) {
            console.error("Gagal mengambil data user:", error);
        }
    };

    useEffect(() => {
        fetchTasksAndStats();
        fetchUsers();
    }, []);

    // --- EFFECT: AUTO OPEN MODAL FROM DASHBOARD ---
    useEffect(() => {
        if (location.state?.openAddModal) {
            handleAddNewClick();
            // Bersihkan state agar tidak terbuka terus saat refresh
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location]);

    // --- HANDLERS ---
    const handleSaveTask = async (payload) => {
        const isEdit = !!editingTask;
        const url = isEdit 
            ? `http://localhost:4000/api/tasks/${editingTask.id}` 
            : "http://localhost:4000/api/tasks";
        
        const method = isEdit ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                Swal.fire("Berhasil", isEdit ? "Tugas diperbarui" : "Tugas baru dibuat", "success");
                setShowTaskModal(false);
                setEditingTask(null);
                fetchTasksAndStats();
            } else {
                const err = await response.json();
                Swal.fire("Gagal", err.message || "Gagal menyimpan tugas", "error");
            }
        } catch (error) {
            Swal.fire("Error", "Terjadi kesalahan koneksi", "error");
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Hapus Tugas?',
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:4000/api/tasks/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.ok) {
                    Swal.fire('Terhapus!', 'Tugas berhasil dihapus.', 'success');
                    fetchTasksAndStats();
                } else {
                    Swal.fire('Gagal', 'Gagal menghapus tugas', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Terjadi kesalahan koneksi', 'error');
            }
        }
    };

    const handleEditClick = (task) => {
        setEditingTask(task);
        setShowTaskModal(true);
    };

    const handleAddNewClick = () => {
        setEditingTask(null);
        setShowTaskModal(true);
    };

    const statsCards = [
        { label: "Tugas Pending", value: statsData.pending, color: "bg-gradient-to-r from-[#F57C00] to-[#FFB74D] bg-clip-text text-transparent" },
        { label: "On Progress", value: statsData.progress, color: "bg-gradient-to-r from-[#0288D1] to-[#4FC3F7] bg-clip-text text-transparent" },
        { label: "Selesai", value: statsData.done, color: "bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] bg-clip-text text-transparent" },
        { label: "Terlambat", value: statsData.late, color: "bg-gradient-to-r from-[#C62828] to-[#EF5350] bg-clip-text text-transparent" },
    ];

    const tabs = ["Semua Tugas", "Pending", "On Progress", "Selesai"];

    return (
        <div className="flex bg-[#F0F4F0] min-h-screen font-sans">
            <Aside />
            <main className="flex-1 bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] overflow-y-auto transition-all">
                <Topbar title="Manajemen Tugas" subtitle="Kelola dan monitor tugas karyawan" />

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
                    {statsCards.map((s, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center h-32">
                            <h3 className={`text-4xl font-bold ${s.color}`}>{s.value}</h3>
                            <p className="text-gray-500 text-sm mt-2 font-medium">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col gap-4">
                    <div className="flex justify-end mr-8">
                        <button 
                            onClick={handleAddNewClick} 
                            className="bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] hover:bg-green-700 text-white px-5 py-2.5 rounded-lg shadow-md font-medium text-sm flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                        >
                            <FiPlus className="text-lg" /> Buat Tugas Baru
                        </button>
                    </div>

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
                </div>

                {/* TASK LIST CARDS */}
                <div className="space-y-5 p-8">
                    {(() => {
                        const filtered = activeTab === 0 ? tasks : tasks.filter(t => t.status === tabs[activeTab]);
                        
                        if (filtered.length === 0) {
                            return (
                                <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                                    <p>Tidak ada tugas ditemukan untuk kategori ini.</p>
                                </div>
                            );
                        }

                        return filtered.map((task, i) => {
                            // 🔥 Hitung status terlambat untuk setiap kartu
                            const isOverdue = checkIsOverdue(task.rawDate, task.status);

                            return (
                                <div key={i} 
                                    className={`
                                        bg-white p-6 rounded-2xl shadow-sm border transition-shadow hover:shadow-md
                                        ${isOverdue 
                                            ? 'border-l-4 border-l-red-500 border-t-gray-100 border-r-gray-100 border-b-gray-100' // Jika telat: Border kiri merah
                                            : 'border-gray-100' // Normal
                                        }
                                    `}
                                >
                                    {/* Header: Title & Status */}
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className={`text-lg font-bold leading-tight ${isOverdue ? 'text-gray-800' : 'text-green-900'}`}>
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
                                        
                                        {/* User */}
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center font-bold text-xs">
                                                {task.initial}
                                            </div>
                                            <span className="text-gray-600 font-medium">{task.nama}</span>
                                        </div>

                                        {/* 🔥 Tampilan Deadline: Berubah Merah jika Terlambat */}
                                        <div className={`
                                            flex items-center gap-2 
                                            ${isOverdue ? "text-red-600 font-bold bg-red-50 px-2 py-1 rounded-md" : "text-gray-500"}
                                        `}>
                                            {isOverdue ? <FiAlertCircle /> : <FiCalendar className="text-green-600" />}
                                            <span>
                                                {isOverdue ? `Terlambat: ${task.deadline}` : `Deadline: ${task.deadline}`}
                                            </span>
                                        </div>

                                        {/* Priority */}
                                        <div className="flex items-center gap-2">
                                            <FiFlag className={`${task.prioritas.includes('Tinggi') ? 'text-red-500' : 'text-green-600'}`} />
                                            <PrioritasBadge prioritas={task.prioritas} />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <ActionButton onClick={() => setSelectedTask(task)} color="blue" icon={<FiEye />} label="Detail" />
                                        <ActionButton onClick={() => handleEditClick(task)} color="yellow" icon={<FiEdit />} label="Edit" />
                                        <ActionButton onClick={() => handleDelete(task.id)} color="red" icon={<FiTrash2 />} label="Hapus" />
                                    </div>

                                </div>
                            );
                        })
                    })()}
                </div>

                {/* MODAL - CREATE / EDIT TASK */}
                {showTaskModal && (
                    <Modal title={editingTask ? "Edit Tugas" : "Buat Tugas Baru"} onClose={() => setShowTaskModal(false)}>
                        <TaskForm 
                            userList={users}
                            initialData={editingTask}
                            onCancel={() => setShowTaskModal(false)} 
                            onSave={handleSaveTask}
                        />
                    </Modal>
                )}

                {/* MODAL - DETAIL TASK */}
                {selectedTask && (
                    <Modal title="Detail Tugas" onClose={() => setSelectedTask(null)}>
                        {/* Logic cek terlambat juga bisa dipakai di Detail */}
                        {(() => {
                             const isOverdueDetail = checkIsOverdue(selectedTask.rawDate, selectedTask.status);
                             return (
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <h4 className="font-extrabold text-lg text-green-800 mb-1">{selectedTask.judul}</h4>
                                        <div className="flex gap-2">
                                            <StatusBadge status={selectedTask.status} />
                                            {isOverdueDetail && (
                                                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold border border-red-200">
                                                    TERLAMBAT
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                        <div><p className="text-xs text-gray-500 uppercase">Ditugaskan Kepada</p><p className="font-semibold text-gray-800">{selectedTask.nama}</p></div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Deadline</p>
                                            <p className={`font-semibold ${isOverdueDetail ? 'text-red-600' : 'text-gray-800'}`}>
                                                {selectedTask.deadline}
                                            </p>
                                        </div>
                                        <div><p className="text-xs text-gray-500 uppercase">Prioritas</p><p className="font-semibold text-gray-800">{selectedTask.prioritas}</p></div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 uppercase mb-1">Deskripsi</p>
                                        <p className="text-gray-700 bg-white p-3 border rounded-md">{selectedTask.deskripsi}</p>
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <button onClick={() => setSelectedTask(null)} className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium text-gray-700">Tutup</button>
                                    </div>
                                </div>
                             );
                        })()}
                    </Modal>
                )}
            </main>
        </div>
    );
};

export default ManajemenTugas;

/* --- COMPONENT HELPERS --- */
const StatusBadge = ({ status }) => {
    const styles = { "On Progress": "bg-gradient-to-r from-[#BBDEFB] to-[#90CAF9] text-[#0D47A1]", "Pending": "bg-gradient-to-r from-[#FFE0B2] to-[#FFCC80] text-[#E65100]", "Selesai": "bg-gradient-to-r from-[#C8E6C9] to-[#A5D6A7] text-[#1B5E20]", "Terlambat": "bg-gradient-to-r from-[#FFCDD2] to-[#EF9A9A] text-[#C62828]" };
    return <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${styles[status] || "bg-gray-100 text-gray-600"}`}>{status}</span>;
};

const PrioritasBadge = ({ prioritas }) => {
    const styles = { "Prioritas Normal": "bg-orange-100 text-orange-700", "Prioritas Tinggi": "bg-red-100 text-red-700", "Urgent": "bg-red-200 text-red-800" };
    return <span className={`px-3 py-1 rounded-md text-xs font-semibold ${styles[prioritas] || "bg-gray-100"}`}>{prioritas}</span>;
};

const ActionButton = ({ color, icon, label, onClick }) => {
    const colors = { blue: "bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] text-[#1976D2] hover:shadow-md", yellow: "bg-gradient-to-r from-[#FFF3E0] to-[#FFE0B2] text-[#EF6C00] hover:shadow-md", red: "bg-gradient-to-r from-[#FFEBEE] to-[#FFCDD2] text-[#C62828] hover:shadow-md" };
    return <button type="button" onClick={onClick} className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-[10px] text-sm font-bold transition-all duration-200 ${colors[color]}`}><span className="text-lg">{icon}</span>{label}</button>;
};

/* --- FORM COMPONENT --- */
const TaskForm = ({ onSave, userList, initialData }) => {
    const [judul, setJudul] = useState("");
    const [deskripsi, setDeskripsi] = useState("");
    const [assigneeId, setAssigneeId] = useState("");
    const [deadline, setDeadline] = useState("");
    const [prioritas, setPrioritas] = useState("TINGGI");

    useEffect(() => {
        if (initialData) {
            setJudul(initialData.judul);
            setDeskripsi(initialData.deskripsi !== "-" ? initialData.deskripsi : "");
            setAssigneeId(initialData.assigneeId || "");
            setPrioritas(initialData.rawPrioritas || "TINGGI");
            
            if (initialData.rawDate) {
                const dateObj = new Date(initialData.rawDate);
                const yyyy = dateObj.getFullYear();
                const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
                const dd = String(dateObj.getDate()).padStart(2, '0');
                setDeadline(`${yyyy}-${mm}-${dd}`);
            }
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!assigneeId) {
            Swal.fire("Gagal", "Silakan pilih karyawan terlebih dahulu", "warning");
            return;
        }
        onSave({ 
            title: judul, 
            description: deskripsi, 
            assigneeId: parseInt(assigneeId),
            dueDate: deadline, 
            prioritas: prioritas 
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5 text-left">Judul Tugas</label>
                <input required value={judul} onChange={e => setJudul(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none transition placeholder-gray-400" placeholder="Masukkan judul tugas" />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5 text-left">Deskripsi</label>
                <textarea rows={3} value={deskripsi} onChange={e => setDeskripsi(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none transition placeholder-gray-400" placeholder="Deskripsi detail tugas" />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5 text-left">Ditugaskan Kepada</label>
                <div className="relative">
                    <select 
                        value={assigneeId} 
                        onChange={e => setAssigneeId(e.target.value)} 
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none transition appearance-none bg-gray-100 text-gray-700 cursor-pointer"
                    >
                        <option value="" disabled>Pilih Karyawan</option>
                        {userList.map((u) => (
                            <option key={u.id} value={u.id}>{u.name} ({u.position || u.role?.name})</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5 text-left">Deadline</label>
                <div className="relative w-full">
                    <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none transition text-gray-600 cursor-pointer" />
                </div>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-800 block mb-1.5 text-left">Prioritas</label>
                <div className="relative">
                    <select 
                        value={prioritas} 
                        onChange={e => setPrioritas(e.target.value)} 
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none transition appearance-none bg-gray-100 text-gray-700 cursor-pointer"
                    >
                        <option value="TINGGI">Tinggi</option>
                        <option value="NORMAL">Normal</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>
            <div className="flex justify-end pt-6">
                <button type="submit" className="bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] hover:bg-[#2E7D32] text-white px-10 py-2.5 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95">
                    {initialData ? "Simpan Perubahan" : "Simpan Tugas"}
                </button>
            </div>
        </form>
    )
}