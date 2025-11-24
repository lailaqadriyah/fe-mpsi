import React from "react";

import icon1 from "../../assets/icon/ds1.png";
import icon2 from "../../assets/icon/ds2.png";
import icon3 from "../../assets/icon/ds3.png";
import icon4 from "../../assets/icon/ds4.png";
import icon5 from "../../assets/icon/ds5.png";
import icon6 from "../../assets/icon/ds6.png";

import Aside from "../../components/Aside";
import Topbar from "../../components/Topbar";
import {
    FiUser,
    FiBookOpen,
    FiClipboard,
    FiPercent,
    FiPlus,
    FiBell,
    FiLogOut,
    FiEye,
    FiEdit,
    FiTrash2,
    FiClock,
    FiList,
} from "react-icons/fi";

const Dashboard = () => {
    return (
        <div className="flex bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] min-h-screen">

            {/* Sidebar */}
            <Aside />

            {/* Main Content */}
            <main className="flex-1 bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] overflow-y-auto">

                {/* HEADER */}
                <Topbar title="Dashboard Admin" />

                {/* STAT CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 p-8 text-left">

                    <StatCard icon={<img src={icon1}/>} value="24" label="Karyawan Aktif Hari Ini" trend="" trendUp />
                    <StatCard icon={<img src={icon2}/>} value="18" label="Laporan Harian" trend="" trendUp />
                    <StatCard icon={<img src={icon3}/>} value="95%" label="Tingkat Kehadiran" trend="" trendUp />

                </div>

                {/* QUICK ACTIONS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 px-8">
                    <QuickButton label="Tambah Karyawan" icon={<img src={icon4}/>} />
                    <QuickButton label="Buat Tugas Baru" icon={<img src={icon5}/>}  />
                    <QuickButton label="Export Laporan" icon={<img src={icon6}/>} />
                </div>

                {/* ABSENSI */}
                <div className="p-8">
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="font-bold text-lg text-green-800 flex items-center gap-2">
                            <FiClock className="text-green-700" />
                            Absensi Hari Ini
                        </h3>
                        <button className="bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow flex items-center gap-2">
                            <FiEye />
                            Lihat Semua</button>
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
                                        <Td>
                                            <ActionButtons />
                                        </Td>
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
                                Tugas Terbaru
                            </h3>
                            <button className="bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white px-4 py-2 rounded-lg font-semibold text-sm shadow">+ Tambah Tugas</button>
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
                                            <td className="px-4 py-3"><PriorityBadge level={t.prioritas || t.prioritas} /></td>
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

const QuickButton = ({ icon, label }) => (
    <button className="bg-white shadow hover:shadow-md transition rounded-2xl py-6 flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-700 text-xl">{icon}</div>
        <p className="font-bold text-sm">{label}</p>
    </button>
);


const SectionHeader = ({ label, buttonText }) => (
    <div className="flex items-center justify-between mb-3">
        <h2 className="text-green-800 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-700"></span>
            {label}
        </h2>

        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm shadow">
            {buttonText}
        </button>
    </div>
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
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[type]}`}>
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
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
            {level}
        </span>
    );
};


const ActionButtons = () => (
    <div className="flex gap-2 text-green-700">
        {/* Tombol Lihat (Mata) - Gradasi Biru */}
        <button className="w-[35px] h-[35px] flex items-center justify-center rounded-lg bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] hover:shadow-sm hover:opacity-90 transition-all text-[#1976D2]">
            <FiEye className="text-lg" />
        </button>

        {/* Tombol Edit (Pensil) - Gradasi Merah Muda */}
        <button className="w-[35px] h-[35px] flex items-center justify-center rounded-lg bg-gradient-to-r from-[#FFEBEE] to-[#FFCDD2] hover:shadow-sm hover:opacity-90 transition-all text-[#D32F2F]">
            <FiEdit className="text-lg" />
        </button> 
    </div>
);


const absensiData = [
    { nama: "Ahmad Fauzi", jabatan: "Pustakawan", in: "08:00", out: "17:00", durasi: "9 jam", status: "Hadir", statusType: "hadir" },
    { nama: "Siti Rahma", jabatan: "Admin Perpus", in: "08:15", out: "-", durasi: "6 jam 45 menit", status: "Dalam Shift", statusType: "shift" },
    { nama: "Budi Santoso", jabatan: "Petugas Sirkulasi", in: "-", out: "-", durasi: "-", status: "Belum Absen", statusType: "belum" },
    { nama: "Dewi Lestari", jabatan: "Katalogis", in: "07:55", out: "17:10", durasi: "9 jam 15 menit", status: "Hadir", statusType: "hadir" },
    { nama: "Eko Prasetyo", jabatan: "Referensi", in: "08:05", out: "-", durasi: "7 jam", status: "Dalam Shift", statusType: "shift" },
];


const taskData = [
    { judul: "Inventarisasi Buku Baru", kepada: "Ahmad Fauzi", deadline: "20 Nov 2025", prioritas: "Tinggi", status: "Dalam Progress", statusType: "progress" },
    { judul: "Pembuatan Laporan Bulanan", kepada: "Siti Rahma", deadline: "15 Nov 2025", prioritas: "Normal", status: "Selesai", statusType: "selesai" },
    { judul: "Penataan Ruang Baca", kepada: "Budi Santoso", deadline: "18 Nov 2025", prioritas: "Urgent", status: "Pending", statusType: "pending" },
];


