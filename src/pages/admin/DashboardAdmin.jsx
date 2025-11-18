import React from "react";

import Aside from "../../components/Aside";
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
} from "react-icons/fi";

const Dashboard = () => {
    return (
        <div className="flex bg-green-50 min-h-screen">

            {/* Sidebar */}
            <Aside />

            {/* Main Content */}
            <main className="flex-1 p-8">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-green-800">Dashboard Admin</h1>

                    <div className="flex items-center gap-4">

                        {/* Notification */}
                        <button className="relative bg-white p-2 rounded-full shadow">
                            <FiBell className="text-green-700 text-lg" />
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                                2
                            </span>
                        </button>

                        {/* User */}
                        <div className="flex items-center bg-white px-4 py-2 rounded-full shadow gap-3">
                            <div className="w-9 h-9 flex items-center justify-center bg-green-600 text-white rounded-full font-bold">
                                A
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Admin</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                        </div>

                        {/* Logout */}
                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
                            <FiLogOut />
                            Logout
                        </button>
                    </div>
                </div>

                {/* STAT CARDS */}
                <div className="grid grid-cols-4 gap-6 mb-10">

                    <StatCard icon={<FiUser />} value="24" label="Karyawan Aktif Hari Ini" trend="+8.5%" trendUp />
                    <StatCard icon={<FiBookOpen />} value="18" label="Laporan Harian" trend="+12.3%" trendUp />
                    <StatCard icon={<FiClipboard />} value="12" label="Tugas Aktif" trend="-3.2%" />
                    <StatCard icon={<FiPercent />} value="95%" label="Tingkat Kehadiran" trend="+5.1%" trendUp />

                </div>

                {/* QUICK ACTIONS */}
                <div className="grid grid-cols-4 gap-6 mb-10">
                    <QuickButton label="Tambah Karyawan" icon={<FiUser />} />
                    <QuickButton label="Buat Tugas Baru" icon={<FiClipboard />} />
                    <QuickButton label="Export Laporan" icon={<FiBookOpen />} />
                    <QuickButton label="Kirim Notifikasi" icon={<FiBell />} />
                </div>

                {/* ABSENSI */}
                <SectionHeader label="Absensi Hari Ini" buttonText="Lihat Semua" />

                <table className="w-full bg-white rounded-xl shadow mb-10">
                    <thead className="bg-green-200 text-left">
                        <tr>
                            <Th>NAMA KARYAWAN</Th>
                            <Th>JABATAN</Th>
                            <Th>CHECK IN</Th>
                            <Th>CHECK OUT</Th>
                            <Th>DURASI</Th>
                            <Th>STATUS</Th>
                            <Th>AKSI</Th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {absensiData.map((row, i) => (
                            <tr key={i} className="hover:bg-green-50">
                                <Td>{row.nama}</Td>
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

                {/* TUGAS TERBARU */}
                <SectionHeader label="Tugas Terbaru" buttonText="+ Tambah Tugas" />

                <table className="w-full bg-white rounded-xl shadow mb-10">
                    <thead className="bg-green-200 text-left">
                        <tr>
                            <Th>JUDUL TUGAS</Th>
                            <Th>DITUGASKAN KEPADA</Th>
                            <Th>DEADLINE</Th>
                            <Th>PRIORITAS</Th>
                            <Th>STATUS</Th>
                            <Th>AKSI</Th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {taskData.map((row, i) => (
                            <tr key={i} className="hover:bg-green-50">
                                <Td>{row.judul}</Td>
                                <Td>{row.kepada}</Td>
                                <Td>{row.deadline}</Td>
                                <Td><PriorityBadge level={row.prioritas} /></Td>
                                <Td><StatusBadge type={row.statusType}>{row.status}</StatusBadge></Td>
                                <Td><ActionButtons /></Td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </main>
        </div>
    );
};

export default Dashboard;

const StatCard = ({ icon, value, label, trend, trendUp }) => (
    <div className="bg-white shadow rounded-xl p-5 flex gap-4 items-center">
        <div className="text-3xl text-green-700">{icon}</div>

        <div>
            <h2 className="text-2xl font-bold text-green-800">{value}</h2>
            <p className="text-sm text-gray-600">{label}</p>
            <p className={`text-xs mt-1 ${trendUp ? "text-green-600" : "text-red-500"}`}>
                {trend}
            </p>
        </div>
    </div>
);

const QuickButton = ({ icon, label }) => (
    <button className="bg-white shadow hover:shadow-md transition rounded-xl py-5 flex flex-col items-center gap-3">
        <div className="text-2xl text-green-700">{icon}</div>
        <p className="font-medium text-sm">{label}</p>
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
    <th className="px-4 py-3 text-xs font-semibold">{children}</th>
);

const Td = ({ children }) => (
    <td className="px-4 py-3 border-t">{children}</td>
);


const StatusBadge = ({ children, type }) => {
    const colors = {
        hadir: "bg-green-100 text-green-700",
        shift: "bg-orange-100 text-orange-700",
        belum: "bg-red-100 text-red-700",
        progress: "bg-yellow-100 text-yellow-700",
        selesai: "bg-green-100 text-green-700",
        pending: "bg-orange-100 text-orange-700",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[type]}`}>
            {children}
        </span>
    );
};


const PriorityBadge = ({ level }) => {
    const color = {
        Tinggi: "bg-orange-100 text-orange-700",
        Normal: "bg-green-100 text-green-700",
        Urgent: "bg-red-100 text-red-700",
    }[level];

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
            {level}
        </span>
    );
};


const ActionButtons = () => (
    <div className="flex gap-2 text-green-700">
        <button className="p-1 bg-green-100 rounded"><FiEye /></button>
        <button className="p-1 bg-blue-100 rounded"><FiEdit /></button>
        <button className="p-1 bg-red-100 rounded"><FiTrash2 /></button>
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


