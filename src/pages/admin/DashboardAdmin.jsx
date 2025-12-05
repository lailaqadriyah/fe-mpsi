import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import icon1 from "../../assets/icon/ds1.png";
import icon2 from "../../assets/icon/ds2.png";
import icon3 from "../../assets/icon/ds3.png";
import icon4 from "../../assets/icon/ds4.png";
import icon5 from "../../assets/icon/ds5.png";
import icon6 from "../../assets/icon/ds6.png";

import Aside from "../../components/Aside";
import Topbar from "../../components/Topbar";
import Modal from "../../components/Modal";
import { FiClock, FiList, FiEye, FiUser, FiCalendar } from "react-icons/fi";

const Dashboard = () => {

    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalKaryawan: 0,
        karyawanAktifHariIni: 0,
        laporanHarian: 0,
    });

    const [absensiList, setAbsensiList] = useState([]);
    const [taskList, setTaskList] = useState([]);
    const [loading, setLoading] = useState(true);

    // State untuk Modal Lihat Semua Absensi
    const [showAllAbsensi, setShowAllAbsensi] = useState(false);

    // --- HELPER FUNCTIONS ---
    const formatTime = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const calculateDuration = (start, end) => {
        if (!start || !end) return "-";
        const startTime = new Date(start);
        const endTime = new Date(end);
        const diff = Math.abs(endTime - startTime) / 1000;
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        return `${hours}j ${minutes}m`;
    };

    const getStatusType = (status) => {
        const map = {
            'PENDING': 'pending',
            'DALAM_PROGERSS': 'progress',
            'SELESAI': 'selesai',
            'HADIR_TEPAT_WAKTU': 'hadir',
            'TERLAMBAT': 'terlambat',
            'ABSEN': 'belum',
            'Dalam Shift': 'shift'
        };
        return map[status] || 'default';
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const response = await fetch("http://localhost:4000/api/admin/dashboard", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                    setAbsensiList(data.absensiHariIni || []);
                    
                    // Sorting Tugas: Terbaru di atas (berdasarkan updatedAt atau createdAt)
                    const sortedTasks = (data.tugasTerbaru || []).sort((a, b) => {
                        const dateA = new Date(a.updatedAt || a.createdAt);
                        const dateB = new Date(b.updatedAt || b.createdAt);
                        return dateB - dateA; 
                    });
                    setTaskList(sortedTasks);
                }
            } catch (error) {
                console.error("Error fetching dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Komponen Baris Tabel Absensi (Reusable)
    const AbsensiRow = ({ row }) => {
        let displayStatus = row.statusAbsen || (row.checkOut ? "Hadir" : "Dalam Shift");
        if (row.statusAbsen === "HADIR_TEPAT_WAKTU") displayStatus = "Tepat Waktu";
        else if (row.statusAbsen === "TERLAMBAT") displayStatus = "Terlambat";

        const statusType = row.checkOut ? (row.statusAbsen === "TERLAMBAT" ? "terlambat" : "hadir") : "shift";

        return (
            <tr className="hover:bg-green-50 border-b border-gray-50 last:border-none transition-colors">
                <Td className="font-bold text-gray-700 whitespace-nowrap">{row.user?.name}</Td>
                <Td className="whitespace-nowrap">{row.user?.position || "-"}</Td>
                <Td className="font-mono text-green-700 whitespace-nowrap">{formatTime(row.checkIn)}</Td>
                <Td className="font-mono text-red-700 whitespace-nowrap">{row.checkOut ? formatTime(row.checkOut) : "-"}</Td>
                <Td className="whitespace-nowrap">{calculateDuration(row.checkIn, row.checkOut)}</Td>
                <Td>
                    <StatusBadge type={statusType}>{displayStatus}</StatusBadge>
                </Td>
            </tr>
        );
    };

    return (
        <div className="flex bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] min-h-screen">

            <Aside />

            <main className="flex-1 bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] overflow-y-auto">

                <Topbar title="Dashboard Admin" />

                {/* STATS CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 p-8 text-left">
                    <StatCard 
                        icon={<img src={icon1} alt="karyawan"/>} 
                        value={loading ? "..." : stats.totalKaryawan} 
                        label="Total Karyawan" 
                        trendUp 
                    />
                    <StatCard 
                        icon={<img src={icon2} alt="laporan"/>} 
                        value={loading ? "..." : stats.laporanHarian} 
                        label="Laporan Hari Ini" 
                        trend="Baru masuk" 
                        trendUp 
                    />
                    <StatCard 
                        icon={<img src={icon3} alt="kehadiran"/>} 
                        value={loading ? "..." : stats.karyawanAktifHariIni} 
                        label="Karyawan Hadir" 
                        trend="Hari Ini" 
                        trendUp 
                    />
                </div>

                {/* QUICK ACTIONS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 px-8">
                    <QuickButton 
                        label="Tambah Karyawan" 
                        icon={<img src={icon4} alt="add"/>} 
                        onClick={() => navigate("/admin/manajemenKaryawan", { state: { openAddModal: true } })}
                    />
                    <QuickButton 
                        label="Buat Tugas Baru" 
                        icon={<img src={icon5} alt="task"/>} 
                        onClick={() => navigate("/admin/manajemenTugas", { state: { openAddModal: true } })}
                    />
                    <QuickButton 
                        label="Export Laporan" 
                        icon={<img src={icon6} alt="export"/>} 
                        onClick={() => navigate("/admin/laporan")} 
                    />
                </div>

                {/* TABEL ABSENSI HARI INI (PREVIEW MAX 3) */}
                <div className="p-8">
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="font-bold text-lg text-green-800 flex items-center gap-2">
                                <FiClock className="text-green-700" />
                                Absensi Hari Ini
                            </h3>
                            <button 
                                onClick={() => setShowAllAbsensi(true)}
                                className="bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer"
                            >
                                <FiEye />
                                Lihat Semua
                            </button>
                        </div>
                    
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#E8F5E9] text-left rounded-t-lg">
                                    <tr className="bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9] text-left text-green-800">
                                        <Th>NAMA KARYAWAN</Th>
                                        <Th>JABATAN</Th>
                                        <Th>CHECK IN</Th>
                                        <Th>CHECK OUT</Th>
                                        <Th>DURASI</Th>
                                        <Th>STATUS</Th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-left">
                                    {loading ? (
                                        <tr><td colSpan="6" className="p-4 text-center text-gray-500">Memuat data...</td></tr>
                                    ) : absensiList.length === 0 ? (
                                        <tr><td colSpan="6" className="p-4 text-center text-gray-500">Belum ada karyawan yang check-in hari ini.</td></tr>
                                    ) : (
                                        // MAX 3 DATA
                                        absensiList.slice(0, 3).map((row, i) => (
                                            <AbsensiRow key={i} row={row} />
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {!loading && absensiList.length > 3 && (
                            <div className="text-center text-xs text-gray-400 mt-4 italic">
                                Menampilkan 3 dari {absensiList.length} data. Klik "Lihat Semua" untuk selengkapnya.
                            </div>
                        )}
                    </div>
                </div>

                {/* TABEL TUGAS TERBARU (MAX 3) */}
                <div className="p-8">
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="font-bold text-lg text-green-800 flex items-center gap-2">
                                <FiList className="text-green-700" />
                                Tugas Terbaru
                            </h3>
                            {/* TOMBOL LIHAT SEMUA (Pindah Laman) */}
                            <button 
                                onClick={() => navigate("/admin/manajemenTugas")} 
                                className="bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white px-4 py-2 rounded-lg font-semibold text-sm shadow flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer"
                            >
                                <FiEye /> Lihat Semua
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#E8F5E9] text-left rounded-t-lg">
                                    <tr className="bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9] text-left text-green-800">
                                        <th className="px-4 py-3">JUDUL TUGAS</th>
                                        <th className="px-4 py-3">DITUGASKAN KEPADA</th>
                                        <th className="px-4 py-3">DEADLINE</th>
                                        <th className="px-4 py-3">PRIORITAS</th>
                                        <th className="px-4 py-3">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-left">
                                    {loading ? (
                                        <tr><td colSpan="5" className="p-4 text-center text-gray-500">Memuat data...</td></tr>
                                    ) : taskList.length === 0 ? (
                                        <tr><td colSpan="5" className="p-4 text-center text-gray-500">Belum ada tugas terbaru.</td></tr>
                                    ) : (
                                        // HANYA 3 TERATAS
                                        taskList.slice(0, 3).map((t, i) => {
                                            const statusLabel = t.status === 'DALAM_PROGERSS' ? 'On Progress' : t.status;
                                            return (
                                                <tr key={i} className="hover:bg-green-50 border-b border-gray-50 last:border-none">
                                                    <td className="px-4 py-3 font-semibold text-gray-700">{t.title}</td>
                                                    
                                                    {/* 🔥 HAPUS AVATAR, HANYA NAMA */}
                                                    <td className="px-4 py-3 text-gray-700">
                                                        {t.assignee?.name || "Belum ditentukan"}
                                                    </td>

                                                    <td className="px-4 py-3 text-gray-500">{formatDate(t.dueDate)}</td>
                                                    <td className="px-4 py-3"><PriorityBadge level={t.prioritas} /></td>
                                                    <td className="px-4 py-3">
                                                        <StatusBadge type={getStatusType(t.status)}>{statusLabel}</StatusBadge>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* --- MODAL LIHAT SEMUA ABSENSI --- */}
                {showAllAbsensi && (
                    <Modal
                        maxWidth="max-w-4xl"
                        title={
                            <div className="flex items-center gap-2 text-green-800">
                                <FiCalendar className="text-xl" />
                                <span className="font-bold text-lg">Rekap Absensi Hari Ini</span>
                            </div>
                        }
                        onClose={() => setShowAllAbsensi(false)}
                    >
                        <div className="overflow-x-auto max-h-[70vh] overflow-y-auto pr-2">
                            {absensiList.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">Tidak ada data absensi hari ini.</p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-green-50 text-left sticky top-0 z-10 shadow-sm">
                                        <tr className="text-green-800 font-bold">
                                            <th className="px-4 py-3 whitespace-nowrap">NAMA</th>
                                            <th className="px-4 py-3 whitespace-nowrap">JABATAN</th>
                                            <th className="px-4 py-3 whitespace-nowrap">CHECK IN</th>
                                            <th className="px-4 py-3 whitespace-nowrap">CHECK OUT</th>
                                            <th className="px-4 py-3 whitespace-nowrap">DURASI</th>
                                            <th className="px-4 py-3 whitespace-nowrap">STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-700">
                                        {absensiList.map((row, i) => (
                                            <AbsensiRow key={i} row={row} />
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                        <div className="pb-2"></div>
                    </Modal>
                )}

            </main>
        </div>
    );
};

export default Dashboard;

// ... (Sub-komponen seperti StatCard, QuickButton, Th, Td, StatusBadge, PriorityBadge tetap sama)
const StatCard = ({ icon, value, label, trend, trendUp }) => (
    <div className="bg-white shadow rounded-2xl p-5 flex gap-4 items-center justify-center">
        <div className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl text-green-700 shadow-sm">{icon}</div>
        <div className="flex-1">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] bg-clip-text text-transparent">{value}</h2>
            <p className="text-sm text-gray-600">{label}</p>
        </div>
        <div className="text-right">
            <p className={`text-sm font-semibold ${trendUp ? "text-green-600" : "text-red-500"}`}>{trend}</p>
        </div>
    </div>
);

const QuickButton = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="bg-white shadow hover:shadow-md transition rounded-2xl py-6 flex flex-col items-center gap-3 cursor-pointer group">
        <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-700 text-xl group-hover:scale-110 transition-transform">{icon}</div>
        <p className="font-bold text-sm text-gray-700 group-hover:text-green-700 transition-colors">{label}</p>
    </button>
);

const Th = ({ children }) => <th className="px-4 py-3">{children}</th>;
const Td = ({ children, className }) => <td className={`px-4 py-3 ${className}`}>{children}</td>;

const StatusBadge = ({ children, type }) => {
    const colors = {
        hadir: "bg-gradient-to-r from-[#C8E6C9] to-[#A5D6A7] text-[#1B5E20]",
        terlambat: "bg-gradient-to-r from-[#FFCCBC] to-[#FFAB91] text-[#BF360C]", 
        shift: "bg-gradient-to-r from-[#FFE0B2] to-[#FFCC80] text-[#E65100]",
        belum: "bg-gray-100 text-gray-500",
        progress: "bg-gradient-to-r from-[#BBDEFB] to-[#90CAF9] text-[#0D47A1]",
        selesai: "bg-gradient-to-r from-[#C8E6C9] to-[#A5D6A7] text-[#1B5E20]",
        pending: "bg-gradient-to-r from-[#FFE0B2] to-[#FFCC80] text-[#E65100]",
    };
    return (
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap shadow-sm ${colors[type] || 'bg-gray-100 text-gray-600'}`}>
            {children}
        </span>
    );
};

const PriorityBadge = ({ level }) => {
    const color = {
        TINGGI: "bg-red-100 text-red-700",
        NORMAL: "bg-orange-100 text-orange-700",
        RENDAH: "bg-gray-50 text-gray-700 border border-gray-200",
    }[level] || "bg-gray-50 text-gray-600";
    return <span className={`px-2 py-1 rounded text-[10px] font-semibold ${color}`}>{level}</span>;
};