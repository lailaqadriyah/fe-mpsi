import React from "react";
import { Link, useLocation } from "react-router-dom";

import {
  FiGrid,
  FiUsers,
  FiClipboard,
  FiActivity,
  FiFileText,
  FiCalendar,
  FiBriefcase,
  FiSettings,
} from "react-icons/fi";

import unandLogo from "../assets/img/unand.png";

const Aside = () => {
  const { pathname } = useLocation();

  return (
    <>
      {/* spacer to keep page content from shifting under the fixed aside */}
      <div className="w-72 flex-shrink-0" aria-hidden></div>

      <aside className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-[#1B5E20] via-[#2E7D32] to-[#388E3C] text-white shadow-2xl px-6 py-8 flex flex-col overflow-y-auto z-20">
        {/* Logo + Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <img
            src={unandLogo}
            alt="Unand Logo"
            className="w-20 mb-4 drop-shadow-lg"
          />
          <h1 className="text-lg font-bold">Dashboard Admin</h1>
          <p className="text-sm opacity-80">Perpustakaan UNAND</p>
        </div>

        <div className="flex flex-col space-y-6">
          {/* MAIN MENU */}
          <div>
            <p className="text-xs uppercase opacity-70 tracking-wider mb-3 text-left">
              Main Menu
            </p>

            <nav className="space-y-2">
              <Link to="/admin/dashboard">
                <Item
                  icon={<FiGrid />}
                  label="Dashboard"
                  active={pathname === "/admin/dashboard"}
                />
              </Link>

              <Link to="/admin/manajemenKaryawan">
                <Item
                  icon={<FiUsers />}
                  label="Manajemen Karyawan"
                  active={pathname === "/admin/manajemenKaryawan"}
                />
              </Link>

              <Link to="/admin/lihatCuti">
                <Item
                  icon={<FiBriefcase />}
                  label="Pengajuan Cuti"
                  active={pathname === "/admin/lihatCuti"}
                />
              </Link>

              <Link to="/admin/manajemenTugas">
                <Item
                  icon={<FiClipboard />}
                  label="Manajemen Tugas"
                  active={pathname === "/admin/manajemenTugas"}
                />
              </Link>

              <Link to="/admin/monitoringAktivitas">
                <Item
                  icon={<FiActivity />}
                  label="Monitoring Aktivitas"
                  active={pathname === "/admin/monitoringAktivitas"}
                />
              </Link>
            </nav>
          </div>

          {/* REPORTS */}
          <div>
            <p className="text-xs uppercase opacity-70 tracking-wider mb-3 text-left">
              Reports
            </p>

            <nav className="space-y-2">
              <Link to="/admin/laporan">
                <Item
                  icon={<FiFileText />}
                  label="Laporan & Rekap"
                  active={pathname === "/admin/laporan"}
                />
              </Link>

              <Link to="/admin/absensi">
                <Item
                  icon={<FiCalendar />}
                  label="Absensi"
                  active={pathname === "/admin/absensi"}
                />
              </Link>
            </nav>
          </div>

          {/* SETTINGS */}
          <div className="">
            <p className="text-xs uppercase opacity-70 tracking-wider mb-3 text-left">
              Settings
            </p>

            <nav className="space-y-2">
              <Link to="/admin/settings">
                <Item
                  icon={<FiSettings />}
                  label="Pengaturan"
                  active={pathname === "/admin/pengaturan"}
                />
              </Link>
            </nav>
          </div>
        </div>

        <div className="flex-1"></div>
      </aside>
    </>
  );
};

export default Aside;

/* ---- ITEM COMPONENT ---- */
const Item = ({ icon, label, active }) => {
  return (
    <div
      className={`
            flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition
            ${
              active
                ? "bg-white/20 shadow-md font-semibold"
                : "hover:bg-white/10"
            }
        `}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
};
