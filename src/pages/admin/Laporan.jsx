// src/pages/LaporanRekap.jsx

import React from "react";
import Aside from "../../components/Aside"; // sesuaikan path
import Topbar from "../../components/Topbar";

const LaporanRekap = () => {
  return (
    <div className="flex bg-[#e9f5e9] min-h-screen">

      {/* Sidebar */}
      <Aside />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-green-50">

        <Topbar title="Laporan & Rekap" subtitle="Ekspor data dan analisis produktivitas tenaga kependidikan" />

        {/* Filter pill */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow px-4 py-3 flex items-center gap-3">
            <select className="text-sm px-3 py-2 rounded-md bg-transparent border">
              <option>Rekap Absensi</option>
              <option>Rekap Tugas</option>
            </select>

            <input type="date" className="text-sm px-3 py-2 rounded-md border" />
            <input type="date" className="text-sm px-3 py-2 rounded-md border" />

            <select className="text-sm px-3 py-2 rounded-md border bg-white">
              <option>PDF</option>
              <option>Excel</option>
            </select>

            <div className="flex-1" />

            <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Ekspor Data</button>
          </div>
        </div>

        {/* Analisis Absensi */}
        <div className="bg-green-50 rounded-xl p-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="font-semibold mb-4 text-green-800">Analisis Produktivitas Absensi (Bulan Ini)</h2>

            <div className="flex flex-col items-center">
              <div className="w-full max-w-3xl bg-green-50 rounded-lg p-6">
                <div className="flex justify-center py-6">
                  {/* Donut placeholder */}
                  <div className="relative w-56 h-56">
                    <div className="w-full h-full rounded-full border-[36px] border-green-400 border-t-blue-400 border-r-yellow-300 border-b-green-500 rotate-[45deg]"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">92,5%</span>
                      <span className="text-gray-500 text-sm">Rata-rata hadir</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-white rounded-md p-4">
                  <div className="grid grid-cols-4 text-center text-sm font-semibold">
                    <div>
                      <p className="text-lg font-bold text-gray-700">55%</p>
                      Kehadiran Tepat Waktu
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-700">30%</p>
                      Terlambat
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-700">10%</p>
                      Absen
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-700">5%</p>
                      Cuti
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rekap Absensi per Karyawan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-green-800">Rekap Absensi (Per Karyawan)</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="bg-green-100 text-left text-green-800">
                    <th className="px-4 py-3">KARYAWAN</th>
                    <th className="px-4 py-3">HADIR</th>
                    <th className="px-4 py-3">TERLAMBAT</th>
                    <th className="px-4 py-3">ABSEN</th>
                    <th className="px-4 py-3">CUTI</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Ahmad Fauzi", 20, 1, 0, 0],
                    ["Siti Rahma", 19, 2, 0, 0],
                    ["Budi Santoso", 18, 4, 0, 0],
                    ["Dewi Lestari", 21, 1, 0, 0],
                    ["Eko Prasetyo", 19, 2, 0, 0],
                  ].map((row, i) => (
                    <tr key={i} className="border-b hover:bg-green-50">
                      <td className="px-4 py-3">{row[0]}</td>
                      <td className="px-4 py-3">{row[1]}</td>
                      <td className="px-4 py-3">{row[2]}</td>
                      <td className="px-4 py-3">{row[3]}</td>
                      <td className="px-4 py-3">{row[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rekap Penyelesaian Tugas */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-green-800">Rekap Penyelesaian Tugas</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="bg-green-100 text-left text-green-800">
                    <th className="px-4 py-3">KARYAWAN</th>
                    <th className="px-4 py-3">SELESAI (%)</th>
                    <th className="px-4 py-3">TUGAS AKTIF</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Ahmad Fauzi", "95%", 2],
                    ["Siti Rahma", "98%", 1],
                    ["Budi Santoso", "75%", 3],
                    ["Dewi Lestari", "100%", 0],
                    ["Eko Prasetyo", "80%", 2],
                  ].map((row, i) => (
                    <tr key={i} className="border-b hover:bg-green-50">
                      <td className="px-4 py-3">{row[0]}</td>
                      <td className="px-4 py-3">{row[1]}</td>
                      <td className="px-4 py-3">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LaporanRekap;
