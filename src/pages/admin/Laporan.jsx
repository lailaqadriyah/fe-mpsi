import React from "react";
import Aside from "../../components/Aside";
import Topbar from "../../components/Topbar";
import { FiDownload } from "react-icons/fi";

const LaporanRekap = () => {
  return (
    <div className="flex bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] min-h-screen font-sans">
      {/* Sidebar */}
      <Aside />

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] overflow-y-auto transition-all">
        <Topbar
          title="Laporan & Rekap"
          subtitle="Ekspor data dan analisis produktivitas tenaga kependidikan"
        />

        {/* Filter Section (Updated Design) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 mt-8 ml-8 mr-8">
          <div className="flex flex-col md:flex-row items-end gap-6">
            {/* Jenis Data */}
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Jenis Data
              </label>
              <select className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-[#E8F5E9] text-gray-700 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer">
                <option>Rekap Absensi</option>
                <option>Rekap Tugas</option>
              </select>
            </div>

            {/* Periode Mulai */}
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Periode Mulai
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-400 outline-none text-gray-600"
              />
            </div>

            {/* Periode Akhir */}
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Periode Akhir
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-400 outline-none text-gray-600"
              />
            </div>

            {/* Pilih Format */}
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Pilih Format
              </label>
              <select className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-[#E8F5E9] text-gray-700 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer">
                <option>PDF</option>
                <option>Excel</option>
              </select>
            </div>

            {/* Tombol Ekspor */}
            <div className="flex-none">
              <button className="bg-gradient-to-r from-[#0288D1] to-[#4FC3F7] hover:shadow-lg hover:opacity-90 text-white font-bold py-2.5 px-6 rounded-lg shadow-md flex items-center gap-2 transition-all w-full md:w-auto justify-center">
                <FiDownload className="text-lg" />
                Ekspor Data
              </button>
            </div>
          </div>
        </div>

        {/* Analisis Absensi */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 ml-8 mr-8">
          <h2 className="font-bold text-lg text-green-800 mb-6 flex items-center gap-2">
            {/* Ikon Pie Chart sederhana */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.21 15.89A10 10 0 1 1 8 2.83"
                stroke="#2E7D32"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 12A10 10 0 0 0 12 2V12H22Z"
                stroke="#2E7D32"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Analisis Produktivitas Absensi (Bulan Ini)
          </h2>

          <div className="flex flex-col items-center">
            <div className="w-full bg-[#E8F5E9] rounded-2xl p-8 border border-green-50">
              <div className="flex justify-center py-4">
                {/* Donut Chart CSS Implementation */}
                <div className="relative w-48 h-48">
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      background: `conic-gradient(
                                #66BB6A 0% 55%, 
                                #FFCA28 55% 85%, 
                                #EF5350 85% 95%, 
                                #42A5F5 95% 100%
                            )`,
                    }}
                  ></div>
                  {/* Lubang Donut (Putih Tengah) */}
                  <div className="absolute inset-4 bg-[#E8F5E9] rounded-full flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-green-900">
                      92,5%
                    </span>
                    <span className="text-gray-600 text-xs font-medium mt-1">
                      Rata-rata hadir
                    </span>
                  </div>
                </div>
              </div>

              {/* Legend / Grid Data Bawah */}
              <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-left">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
                  <div>
                    <p className="text-2xl font-bold text-[#4CAF50] mb-1">
                      55%
                    </p>
                    <span className="text-gray-600 text-xs font-medium">
                      Kehadiran Tepat Waktu
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#FFC107] mb-1">
                      30%
                    </p>
                    <span className="text-gray-600 text-xs font-medium">
                      Terlambat
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#EF5350] mb-1">
                      10%
                    </p>
                    <span className="text-gray-600 text-xs font-medium">
                      Absen
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#42A5F5] mb-1">5%</p>
                    <span className="text-gray-600 text-xs font-medium">
                      Cuti
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rekap Absensi per Karyawan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-8 mr-8 mb-8">
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-green-800">
                Rekap Absensi (Per Karyawan)
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9] text-left text-green-800">
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
                    <tr key={i} className=" hover:bg-green-50">
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
              <h3 className="font-semibold text-green-800">
                Rekap Penyelesaian Tugas
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9] text-left text-green-800">
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
                    <tr key={i} className="hover:bg-green-50">
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
      </main>
    </div>
  );
};

export default LaporanRekap;
