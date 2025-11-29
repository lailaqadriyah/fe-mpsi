import React from "react";
import Aside from "../../components/Aside";
import Topbar from "../../components/Topbar";
import { FiEye, FiFilter } from "react-icons/fi";

const Absensi = () => {
  return (
    <div className="flex bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] min-h-screen font-sans">

      {/* Sidebar */}
      <Aside />

      {/* Main */}
      <main className="flex-1 bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] overflow-y-auto transition-all">

        <Topbar title="Data Absensi Karyawan" subtitle="Rekapitulasi kehadiran tenaga kependidikan" />

        {/* Filter pill */}
       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 mt-8 ml-8 mr-8">
          <div className="flex flex-col md:flex-row items-end gap-6">
            
            {/* Pilih Karyawan */}
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-gray-600 mb-2 text-left">Pilih Karyawan</label>
              <select className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm bg-gray-50 text-gray-700 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer appearance-none">
                <option>Semua Karyawan</option>
                <option>Ahmad Fauzi</option>
                <option>Siti Rahma</option>
                <option>Budi Santoso</option>
              </select>
            </div>

            {/* Pilih Bulan */}
            <div className="w-full md:w-48">
              <label className="block text-sm font-bold text-gray-600 mb-2 text-left">Pilih Bulan</label>
              <select className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm bg-gray-50 text-gray-700 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer appearance-none">
                <option>Semua Bulan</option>
                <option>Januari</option>
                <option>Februari</option>
                <option>Maret</option>
              </select>
            </div>

            {/* Tampilkan Status */}
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-gray-600 mb-2 text-left">Tampilkan Status</label>
              <select className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm bg-gray-50 text-gray-700 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer appearance-none">
                <option>Semua Status</option>
                <option>Hadir</option>
                <option>Terlambat</option>
                <option>Absen</option>
              </select>
            </div>

            {/* Tombol Tampilkan Data */}
            <div className="flex-none">
              <button className="bg-gradient-to-r from-[#0288D1] to-[#4FC3F7] hover:shadow-lg hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center gap-2 transition-all w-full md:w-auto justify-center h-[46px]">
                <FiFilter className="text-lg" />
                Tampilkan Data
              </button>
            </div>

          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl shadow p-6 ml-16 mr-16 mb-8">
          <h2 className="font-bold text-[#1B5E20] mb-4 text-left">Riwayat Absensi Lengkap</h2>

          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9] text-left text-[#1B5E20]">
                  <th className="px-4 py-3">TANGGAL</th>
                  <th className="px-4 py-3">NAMA KARYAWAN</th>
                  <th className="px-4 py-3">CHECK IN</th>
                  <th className="px-4 py-3">CHECK OUT</th>
                  <th className="px-4 py-3">STATUS</th>
                  <th className="px-4 py-3">DETAIL</th>
                </tr>
              </thead>
              <tbody>
                {absensiData.map((r, i) => (
                  <tr key={i} className=" hover:bg-green-50">
                    <td className="px-4 py-3 text-left">{r.tanggal}</td>
                    <td className="px-4 py-3 font-semibold text-gray-700 text-left">{r.nama}</td>
                    <td className="px-4 py-3 text-left">{r.in}</td>
                    <td className="px-4 py-3 text-left">{r.out}</td>
                    <td className="px-4 py-3 text-left"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3 text-left"><button className="bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] text-[#1976D2] hover:shadow-md hover:opacity-90 px-6 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 mx-auto text-left"
                                          >
                                            <FiEye className="text-sm" />
                                            Lihat</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Absensi;

/* Helpers & data */
const StatusBadge = ({ status }) => {
  const cls =
    status === "Hadir"
      ? "bg-gradient-to-r from-[#C8E6C9] to-[#A5D6A7] text-[#1B5E20]"
      : status === "Terlambat"
      ? "bg-gradient-to-r from-[#FFE0B2] to-[#FFCC80] text-[#E65100]"
      : "bg-gradient-to-r from-[#FFCDD2] to-[#EF9A9A] text-[#C62828]";

  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>{status}</span>;
};

const absensiData = [
  { tanggal: "14 November 2025", nama: "Ahmad Fauzi", in: "08:00", out: "17:00", status: "Hadir" },
  { tanggal: "14 November 2025", nama: "Siti Rahma", in: "08:15", out: "17:00", status: "Hadir" },
  { tanggal: "14 November 2025", nama: "Budi Santoso", in: "-", out: "-", status: "Absen" },
  { tanggal: "14 November 2025", nama: "Dewi Lestari", in: "08:45", out: "17:00", status: "Terlambat" },
];
