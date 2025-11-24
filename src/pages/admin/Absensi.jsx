import React from "react";
import Aside from "../../components/Aside";
import Topbar from "../../components/Topbar";
import { FiSearch } from "react-icons/fi";

const Absensi = () => {
  return (
    <div className="flex bg-green-50 min-h-screen">

      {/* Sidebar */}
      <Aside />

      {/* Main */}
      <main className="flex-1 p-8">

        <Topbar title="Data Absensi Karyawan" subtitle="Rekapitulasi kehadiran tenaga kependidikan" />

        {/* Filter pill */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow px-4 py-4 flex items-center gap-4">
            <div className="w-64">
              <select className="w-full text-sm px-3 py-2 rounded-md border">
                <option>Semua Karyawan</option>
                <option>Ahmad Fauzi</option>
                <option>Siti Rahma</option>
                <option>Budi Santoso</option>
              </select>
            </div>

            <div className="w-44">
              <input type="month" className="w-full text-sm px-3 py-2 rounded-md border" />
            </div>

            <div className="w-64">
              <select className="w-full text-sm px-3 py-2 rounded-md border">
                <option>Semua Status</option>
                <option>Hadir</option>
                <option>Terlambat</option>
                <option>Absen</option>
              </select>
            </div>

            <div className="flex-1" />

            <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
              <FiSearch />
              Tampilkan Data
            </button>
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-green-800 mb-4">Riwayat Absensi Lengkap</h2>

          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="bg-green-100 text-left text-green-800">
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
                  <tr key={i} className="border-b hover:bg-green-50">
                    <td className="px-4 py-3">{r.tanggal}</td>
                    <td className="px-4 py-3 font-semibold text-gray-700">{r.nama}</td>
                    <td className="px-4 py-3">{r.in}</td>
                    <td className="px-4 py-3">{r.out}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3"><button className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md">Lihat</button></td>
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
      ? "bg-green-100 text-green-700"
      : status === "Terlambat"
      ? "bg-orange-100 text-orange-700"
      : "bg-red-100 text-red-700";

  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>{status}</span>;
};

const absensiData = [
  { tanggal: "14 November 2025", nama: "Ahmad Fauzi", in: "08:00", out: "17:00", status: "Hadir" },
  { tanggal: "14 November 2025", nama: "Siti Rahma", in: "08:15", out: "17:00", status: "Hadir" },
  { tanggal: "14 November 2025", nama: "Budi Santoso", in: "-", out: "-", status: "Absen" },
  { tanggal: "14 November 2025", nama: "Dewi Lestari", in: "08:45", out: "17:00", status: "Terlambat" },
];
