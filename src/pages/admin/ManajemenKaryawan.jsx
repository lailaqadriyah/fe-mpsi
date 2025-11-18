import React from "react";
import Aside from "../../components/Aside";
import { FiMail, FiPhone, FiCalendar, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

const ManajemenKaryawan = () => {
    return (
        <div className="flex bg-[#e8f5e9] min-h-screen">

            {/* Sidebar */}
            <Aside />

            {/* Content */}
            <main className="flex-1 p-8">

                {/* Top Bar */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-green-800">Manajemen Karyawan</h1>
                        <p className="text-gray-600 text-sm">Kelola data tenaga kependidikan perpustakaan</p>
                    </div>

                    {/* User & Logout */}
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

                {/* Button + Search Bar */}
                <div className="flex justify-between items-center mb-6">
                    <button className="bg-green-600 text-white px-5 py-2 rounded-lg shadow text-sm">
                        + Tambah Karyawan
                    </button>

                    <div className="flex gap-3">
                        <select className="bg-white px-4 py-2 rounded-lg shadow text-sm">
                            <option>Semua Status</option>
                            <option>Aktif</option>
                            <option>Nonaktif</option>
                        </select>

                        <select className="bg-white px-4 py-2 rounded-lg shadow text-sm">
                            <option>Semua Posisi</option>
                            <option>Pustakawan</option>
                            <option>Admin Perpus</option>
                            <option>Referensi</option>
                        </select>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Cari nama karyawan, email, atau posisi..."
                        className="w-full bg-white px-5 py-3 rounded-xl shadow text-sm outline-none"
                    />
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">

                    {karyawanList.map((k, i) => (
                        <div key={i} className="bg-white rounded-xl p-5 shadow hover:shadow-md transition">

                            {/* Initial Avatar */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-600 text-white flex items-center justify-center rounded-full font-bold text-lg">
                                        {k.initial}
                                    </div>
                                </div>

                                <StatusBadge status={k.status} />
                            </div>

                            {/* Name */}
                            <h2 className="mt-3 font-bold text-lg text-green-800">{k.nama}</h2>
                            <p className="text-sm text-gray-600 mb-4">{k.posisi}</p>

                            {/* Details */}
                            <DetailItem icon={<FiMail />} text={k.email} />
                            <DetailItem icon={<FiPhone />} text={k.telepon} />
                            <DetailItem icon={<FiCalendar />} text={`Bergabung: ${k.bergabung}`} />

                            <p className="text-sm text-gray-700 mt-2">
                                Kehadiran: <span className="font-semibold">{k.kehadiran}%</span>
                            </p>

                            {/* Actions */}
                            <div className="flex gap-2 mt-4">
                                <ActionButton color="blue" icon={<FiEye />} label="Lihat" />
                                <ActionButton color="yellow" icon={<FiEdit />} label="Edit" />
                                <ActionButton color="red" icon={<FiTrash2 />} label="Hapus" />
                            </div>

                        </div>
                    ))}

                </div>
            </main>
        </div>
    );
};

export default ManajemenKaryawan;

/* Components */

const DetailItem = ({ icon, text }) => (
    <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
        <span className="text-green-600">{icon}</span>
        {text}
    </div>
);

const StatusBadge = ({ status }) => {
    const styles =
        status === "Aktif"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700";

    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles}`}>
            {status}
        </span>
    );
};

const ActionButton = ({ color, icon, label }) => {
    const colors = {
        blue: "bg-blue-100 text-blue-600",
        yellow: "bg-yellow-100 text-yellow-600",
        red: "bg-red-100 text-red-600",
    };

    return (
        <button className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-semibold ${colors[color]}`}>
            {icon} {label}
        </button>
    );
};

/* Dummy Data */

const karyawanList = [
    {
        nama: "Ahmad Fauzi",
        posisi: "Pustakawan",
        initial: "AF",
        email: "ahmad.fauzi@unand.ac.id",
        telepon: "+62 812-3456-7890",
        bergabung: "15 Jan 2023",
        kehadiran: 95,
        status: "Aktif",
    },
    {
        nama: "Siti Rahma",
        posisi: "Admin Perpus",
        initial: "SR",
        email: "siti.rahma@unand.ac.id",
        telepon: "+62 813-4567-8901",
        bergabung: "20 Mar 2023",
        kehadiran: 98,
        status: "Aktif",
    },
    {
        nama: "Dewi Lestari",
        posisi: "Katalogis",
        initial: "DL",
        email: "dewi.lestari@unand.ac.id",
        telepon: "+62 815-6789-0123",
        bergabung: "05 Sep 2023",
        kehadiran: 97,
        status: "Aktif",
    },
    {
        nama: "Eko Prasetyo",
        posisi: "Referensi",
        initial: "EP",
        email: "eko.prasetyo@unand.ac.id",
        telepon: "+62 816-7890-1234",
        bergabung: "12 Feb 2024",
        kehadiran: 94,
        status: "Aktif",
    },
    {
        nama: "Budi Santoso",
        posisi: "Petugas Sirkulasi",
        initial: "BS",
        email: "budi.santoso@unand.ac.id",
        telepon: "+62 814-5678-9012",
        bergabung: "10 Jun 2022",
        kehadiran: 92,
        status: "Aktif",
    },
    {
        nama: "Rina Wulandari",
        posisi: "Pustakawan",
        initial: "RW",
        email: "rina.wulandari@unand.ac.id",
        telepon: "+62 817-8901-2345",
        bergabung: "18 Nov 2022",
        kehadiran: 88,
        status: "Nonaktif",
    },
];
