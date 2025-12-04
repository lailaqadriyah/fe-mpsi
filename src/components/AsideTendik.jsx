import React from "react";
import { Link, useLocation } from "react-router-dom";

import {
    FiGrid,
    FiCalendar,
    FiFileText,
    FiList,
    FiRepeat,
    FiUser,
    FiBriefcase, // Icon yang cocok untuk "Pengajuan Cuti" (mirip gambar)
} from "react-icons/fi";

import unandLogo from "../assets/img/unand.png";

const AsideTendik = () => {
    const { pathname } = useLocation();

    return (
        <>
            {/* Spacer agar konten halaman tidak tertutup sidebar */}
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
                            <Link to="/tendik/dashboardTendik">
                                <Item icon={<FiGrid />} label="Dashboard" active={pathname === "/tendik/dashboardTendik"} />
                            </Link>

                            <Link to="/tendik/absensiDigital">
                                <Item icon={<FiCalendar />} label="Absensi Digital" active={pathname === "/tendik/absensiDigital"} />
                            </Link>

                            <Link to="/tendik/pengajuanCuti">
                                <Item icon={<FiBriefcase />} label="Pengajuan Cuti" active={pathname === "/tendik/pengajuanCuti"} />
                            </Link>

                            <Link to="/tendik/laporanHarian">
                                <Item icon={<FiFileText />} label="Laporan Harian" active={pathname === "/tendik/laporanHarian"} />
                            </Link>

                            <Link to="/tendik/daftarTugas">
                                <Item icon={<FiList />} label="Daftar Tugas" active={pathname === "/tendik/daftarTugas"} />
                            </Link>

                            <Link to="/tendik/riwayatAktivitas">
                                <Item icon={<FiRepeat />} label="Riwayat Aktivitas" active={pathname === "/tendik/riwayatAktivitas"} />
                            </Link>
                        </nav>
                    </div>

                    <div>
                        <p className="text-xs uppercase opacity-70 tracking-wider mb-3 text-left">Settings</p>
                        <nav className="space-y-2">
                            <Link to="/tendik/profil">
                                <Item icon={<FiUser />} label="Profil Saya" active={pathname === "/tendik/profil"} />
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

// Komponen Item Menu
const Item = ({ icon, label, active }) => {
    return (
        <div className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition ${active ? "bg-white/20 shadow-md font-semibold" : "hover:bg-white/10"}`}>
            <span className="text-lg">{icon}</span>
            <span className="text-sm">{label}</span>
        </div>
    );
};