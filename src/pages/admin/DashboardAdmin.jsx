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
import { FiClock, FiList, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

const Dashboard = () => {

    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalUsers: 0,
        presentToday: 0,
        tasksDoneToday: 0,
        reportsToday: 0
    });

    const [loading, setLoading] = useState(true);

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
                } else {
                    console.error("Gagal mengambil data dashboard");
                }
            } catch (error) {
                console.error("Error fetching dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="flex bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] min-h-screen">

            <Aside />

            <main className="flex-1 bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] overflow-y-auto">

                <Topbar title="Dashboard Admin" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 p-8 text-left">
                    <StatCard 
                        icon={<img src={icon1} alt="karyawan"/>} 
                        value={loading ? "..." : stats.totalUsers} 
                        label="Total Karyawan" 
                        trend="Terdaftar" 
                        trendUp 
                    />
                    <StatCard 
                        icon={<img src={icon2} alt="laporan"/>} 
                        value={loading ? "..." : stats.reportsToday} 
                        label="Laporan Hari Ini" 
                        trend="Baru masuk" 
                        trendUp 
                    />
                    <StatCard 
                        icon={<img src={icon3} alt="kehadiran"/>} 
                        value={loading ? "..." : stats.presentToday} 
                        label="Karyawan Hadir" 
                        trend="Hari Ini" 
                        trendUp 
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 px-8">
                    
                    {/* 🔥 Quick Action Tambah Karyawan */}
                    <QuickButton 
                        label="Tambah Karyawan" 
                        icon={<img src={icon4} alt="add"/>} 
                        onClick={() => navigate("/admin/manajemenKaryawan", {
                            state: { openAddModal: true }
                        })}
                    />

                    <QuickButton label="Buat Tugas Baru" icon={<img src={icon5} alt="task"/>} />
                    <QuickButton label="Export Laporan" icon={<img src={icon6} alt="export"/>} />
                </div>

                {/* ABSENSI DUMMY */}
                <div className="p-8">
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="font-bold text-lg text-green-800 flex items-center gap-2">
                                <FiClock className="text-green-700" />
                                Absensi Hari Ini (Contoh)
                            </h3>
                            <button className="bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow flex items-center gap-2">
                                <FiEye />
                                Lihat Semua
                            </button>
                        </div>
                    
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#E8F5E9] text-left rounded-t-lg">
                                    <tr className="font-bold text-[#1B5E20] text-sm">
                                        <Th>NAMA KARYAWAN</Th>
                                        <Th>JABATAN</Th>
                                        <Th>CHECK IN</Th>
                                        <Th>CHECK OUT</Th>
                                        <Th>DURASI</Th>
                                        <Th>STATUS</Th>
                                        <Th>AKSI</Th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-left">
                                    {absensiData.map((row, i) => (
                                        <tr key={i} className="hover:bg-green-50">
                                            <Td className="font-bold">{row.nama}</Td>
                                            <Td>{row.jabatan}</Td>
                                            <Td>{row.in}</Td>
                                            <Td>{row.out}</Td>
                                            <Td>{row.durasi}</Td>
                                            <Td><StatusBadge type={row.statusType}>{row.status}</StatusBadge></Td>
                                            <Td><ActionButtons /></Td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* TUGAS TERBARU */}
                <div className="p-8">
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="font-bold text-lg text-green-800 flex items-center gap-2">
                                <FiList className="text-green-700" />
                                Tugas Terbaru (Contoh)
                            </h3>
                            <button className="bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white px-4 py-2 rounded-lg font-semibold text-sm shadow">
                                + Tambah Tugas
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#E8F5E9] text-left rounded-t-lg">
                                    <tr className="font-bold text-[#1B5E20] text-sm">
                                        <th className="px-4 py-3">JUDUL TUGAS</th>
                                        <th className="px-4 py-3">DITUGASKAN KEPADA</th>
                                        <th className="px-4 py-3">DEADLINE</th>
                                        <th className="px-4 py-3">PRIORITAS</th>
                                        <th className="px-4 py-3">STATUS</th>
                                        <th className="px-4 py-3">AKSI</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-left">
                                    {taskData.map((t, i) => (
                                        <tr key={i} className="hover:bg-green-50">
                                            <td className="px-4 py-3">{t.judul}</td>
                                            <td className="px-4 py-3">{t.kepada}</td>
                                            <td className="px-4 py-3">{t.deadline}</td>
                                            <td className="px-4 py-3"><PriorityBadge level={t.prioritas} /></td>
                                            <td className="px-4 py-3"><StatusBadge type={t.statusType}>{t.status}</StatusBadge></td>
                                            <td className="px-4 py-3"><ActionButtons /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;


// =========================
//   SUB-KOMPONEN
// =========================

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
    <button 
        onClick={onClick}
        className="bg-white shadow hover:shadow-md transition rounded-2xl py-6 flex flex-col items-center gap-3"
    >
        <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-700 text-xl">{icon}</div>
        <p className="font-bold text-sm">{label}</p>
    </button>
);

const Th = ({ children }) => (
    <th className="px-4 py-3">{children}</th>
);

const Td = ({ children }) => (
    <td className="px-4 py-3">{children}</td>
);

const StatusBadge = ({ children, type }) => {
    const colors = {
        hadir: "bg-gradient-to-r from-[#C8E6C9] to-[#A5D6A7] text-[#1B5E20]",
        shift: "bg-gradient-to-r from-[#FFE0B2] to-[#FFCC80] text-[#E65100]",
        belum: "bg-gradient-to-r from-[#FFCDD2] to-[#EF9A9A] text-[#C62828]",
        progress: "bg-gradient-to-r from-[#FFE0B2] to-[#FFCC80] text-[#E65100]",
        selesai: "bg-gradient-to-r from-[#C8E6C9] to-[#A5D6A7] text-[#1B5E20]",
        pending: "bg-gradient-to-r from-[#FFCDD2] to-[#EF9A9A] text-[#C62828]",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[type] || 'bg-gray-100'}`}>
            {children}
        </span>
    );
};

const PriorityBadge = ({ level }) => {
    const color = {
        Tinggi: "bg-gradient-to-r from-[#FFE0B2] to-[#FFCC80] text-[#E65100]",
        Normal: "bg-gradient-to-r from-[#C8E6C9] to-[#A5D6A7] text-[#1B5E20]",
        Urgent: "bg-gradient-to-r from-[#FFCDD2] to-[#EF9A9A] text-[#C62828]",
    }[level];

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color || 'bg-gray-100'}`}>
            {level}
        </span>
    );
};

const ActionButtons = () => (
    <div className="flex gap-2 text-green-700">
        <button className="w-[35px] h-[35px] flex items-center justify-center rounded-lg bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] hover:shadow-sm hover:opacity-90 transition-all text-[#1976D2]">
            <FiEye className="text-lg" />
        </button>
        <button className="w-[35px] h-[35px] flex items-center justify-center rounded-lg bg-gradient-to-r from-[#FFEBEE] to-[#FFCDD2] hover:shadow-sm hover:opacity-90 transition-all text-[#D32F2F]">
            <FiEdit className="text-lg" />
        </button> 
    </div>
);

// DUMMY DATA
const absensiData = [
    { nama: "Ahmad Fauzi", jabatan: "Pustakawan", in: "08:00", out: "17:00", durasi: "9 jam", status: "Hadir", statusType: "hadir" },
    { nama: "Siti Rahma", jabatan: "Admin Perpus", in: "08:15", out: "-", durasi: "6 jam 45 menit", status: "Dalam Shift", statusType: "shift" },
    { nama: "Budi Santoso", jabatan: "Petugas Sirkulasi", in: "-", out: "-", durasi: "-", status: "Belum Absen", statusType: "belum" },
];

const taskData = [
    { judul: "Inventarisasi Buku Baru", kepada: "Ahmad Fauzi", deadline: "20 Nov 2025", prioritas: "Tinggi", status: "Dalam Progress", statusType: "progress" },
    { judul: "Pembuatan Laporan Bulanan", kepada: "Siti Rahma", deadline: "15 Nov 2025", prioritas: "Normal", status: "Selesai", statusType: "selesai" },
];
