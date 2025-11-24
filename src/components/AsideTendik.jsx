import React from "react";
import { Link, useLocation } from "react-router-dom";

import {
    FiGrid,
    FiCalendar,
    FiFileText,
    FiList,
    FiRepeat,
    FiUser,
    FiSettings,
} from "react-icons/fi";

import unandLogo from "../assets/img/unand.png";

const AsideTendik = () => {
    const { pathname } = useLocation();

    return (
        <>
            <div className="w-72 flex-shrink-0" aria-hidden></div>

            <aside className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-[#1B5E20] via-[#2E7D32] to-[#388E3C] text-white shadow-2xl px-6 py-8 flex flex-col overflow-y-auto z-20">

                <div className="flex flex-col items-center text-center mb-8">
                    <img src={unandLogo} alt="Unand Logo" className="w-20 mb-4 drop-shadow-lg" />
                    <h1 className="text-lg font-bold">Dashboard Staff</h1>
                    <p className="text-sm opacity-80">Perpustakaan UNAND</p>
                </div>

                <div className="flex flex-col space-y-6">

                    <div>
                        <p className="text-xs uppercase opacity-70 tracking-wider mb-3 text-left">Main Menu</p>
                        <nav className="space-y-2">
                            <Link to="/staff/dashboard">
                                <Item icon={<FiGrid />} label="Dashboard" active={pathname === "/staff/dashboard"} />
                            </Link>

                            <Link to="/staff/absensi">
                                <Item icon={<FiCalendar />} label="Absensi Digital" active={pathname === "/staff/absensi"} />
                            </Link>

                            <Link to="/staff/laporan">
                                <Item icon={<FiFileText />} label="Laporan Harian" active={pathname === "/staff/laporan"} />
                            </Link>

                            <Link to="/staff/tugas">
                                <Item icon={<FiList />} label="Daftar Tugas" active={pathname === "/staff/tugas"} />
                            </Link>

                            <Link to="/staff/riwayat">
                                <Item icon={<FiRepeat />} label="Riwayat Aktivitas" active={pathname === "/staff/riwayat"} />
                            </Link>
                        </nav>
                    </div>

                    <div>
                        <p className="text-xs uppercase opacity-70 tracking-wider mb-3 text-left">Settings</p>
                        <nav className="space-y-2">
                            <Link to="/staff/profile">
                                <Item icon={<FiUser />} label="Profil Saya" active={pathname === "/staff/profile"} />
                            </Link>
                        </nav>
                    </div>

                </div>

                <div className="flex-1"></div>

            </aside>
        </>
    );
};

export default AsideTendik;


const Item = ({ icon, label, active }) => {
    return (
        <div className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition ${active ? "bg-white/20 shadow-md font-semibold" : "hover:bg-white/10"}`}>
            <span className="text-lg">{icon}</span>
            <span className="text-sm">{label}</span>
        </div>
    );
};
