import React from "react";

import {
    FiGrid,
    FiUsers,
    FiClipboard,
    FiActivity,
    FiFileText,
    FiCalendar,
    FiPieChart,
    FiSettings
} from "react-icons/fi";

import unandLogo from "../assets/img/unand.png";

const Aside = () => {
    return (
        <aside className="h-screen w-72 bg-gradient-to-b from-green-800 to-green-600 text-white shadow-2xl px-6 py-8 flex flex-col">

            {/* Logo + Title */}
            <div className="flex flex-col items-center text-center mb-8">
                <img src={unandLogo} alt="Unand Logo" className="w-20 mb-4 drop-shadow-lg" />
                <h1 className="text-lg font-bold">Dashboard Admin</h1>
                <p className="text-sm opacity-80">Perpustakaan UNAND</p>
            </div>

            <div className="flex flex-col space-y-6">

                {/* MAIN MENU */}
                <div>
                    <p className="text-xs uppercase opacity-70 tracking-wider mb-3">Main Menu</p>

                    <nav className="space-y-2">
                        <Item icon={<FiGrid />} label="Dashboard" active />
                        <Item icon={<FiUsers />} label="Manajemen Karyawan" />
                        <Item icon={<FiClipboard />} label="Manajemen Tugas" />
                        <Item icon={<FiActivity />} label="Monitoring Aktivitas" />
                    </nav>
                </div>

                {/* REPORTS */}
                <div>
                    <p className="text-xs uppercase opacity-70 tracking-wider mb-3">Reports</p>

                    <nav className="space-y-2">
                        <Item icon={<FiFileText />} label="Laporan & Rekap" />
                        <Item icon={<FiCalendar />} label="Absensi" />
                        <Item icon={<FiPieChart />} label="Produktivitas" />
                    </nav>
                </div>

                {/* SETTINGS */}
                <div className="mt-4">
                    <p className="text-xs uppercase opacity-70 tracking-wider mb-3">Settings</p>

                    <nav className="space-y-2">
                        <Item icon={<FiSettings />} label="Pengaturan" />
                    </nav>
                </div>
            </div>

            {/* Spacer */}
            <div className="flex-1"></div>

        </aside>
    );
};

export default Aside;


/* ---- COMPONENT UNTUK ITEM MENU ---- */
const Item = ({ icon, label, active }) => {
    return (
        <div className={`
            flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition
            ${active ? "bg-white/20 shadow-md font-semibold" : "hover:bg-white/10"}
        `}>
            <span className="text-lg">{icon}</span>
            <span className="text-sm">{label}</span>
        </div>
    );
};
