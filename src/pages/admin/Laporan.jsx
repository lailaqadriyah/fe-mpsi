import React, { useState, useEffect } from "react";
import Aside from "../../components/Aside";
import Topbar from "../../components/Topbar";
import { FiDownload } from "react-icons/fi";
import Swal from "sweetalert2";

const LaporanRekap = () => {
  const [loading, setLoading] = useState(true);
  
  // State untuk Filter & Export
  const [jenisData, setJenisData] = useState("Rekap Absensi");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [format, setFormat] = useState("PDF");

  const [data, setData] = useState({
    analisisProduktivitas: { rataRataHadir: 0 },
    statistikDetail: {
      kehadiranTepatWaktu: 0,
      terlambat: 0,
      absen: 0,
      cuti: 0
    },
    rekapAbsensi: [],
    rekapPenyelesaianTugas: []
  });

  // --- 1. FETCH DATA LAPORAN ---
  const fetchLaporan = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:4000/api/admin/laporan-rekap", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        console.error("Gagal mengambil data laporan");
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set default dates
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(date.toISOString().split('T')[0]);

    fetchLaporan();
  }, []);

  // --- 2. LOGIKA CHART (VISUALISASI: HADIR, ABSEN, CUTI) ---
  // Grafik tetap 3 warna: Hadir (Gabungan), Absen, Cuti
  const { rataRataHadir } = data.analisisProduktivitas;
  // Data detail untuk Legend (4 Kategori)
  const { kehadiranTepatWaktu, terlambat, absen, cuti } = data.statistikDetail;

  const p1 = rataRataHadir;
  const p2 = p1 + absen;

  const chartBackground = `conic-gradient(
    #4CAF50 0% ${p1}%, 
    #EF5350 ${p1}% ${p2}%, 
    #42A5F5 ${p2}% 100%
  )`;

  // --- 3. HANDLER EXPORT ---
  const handleExportClick = () => {
    if (!startDate || !endDate) {
        Swal.fire("Peringatan", "Harap pilih rentang tanggal terlebih dahulu.", "warning");
        return;
    }

    if (format === "PDF") {
        Swal.fire("Info", "Fitur Export PDF sedang dalam pengembangan.", "info");
    } else {
        const url = `http://localhost:4000/api/admin/export/attendance?format=xlsx&from=${startDate}&to=${endDate}`;
        window.open(url, '_blank');
    }
  };

  return (
    <div className="flex bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] min-h-screen font-sans">
      <Aside />

      <main className="flex-1 bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] overflow-y-auto transition-all">
        <Topbar
          title="Laporan & Rekap"
          subtitle="Ekspor data dan analisis produktivitas tenaga kependidikan"
        />

        {/* --- FILTER & EXPORT SECTION --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 mt-8 ml-8 mr-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            
            {/* 1. Jenis Data */}
            <div className="lg:col-span-3">
              <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">
                Jenis Data
              </label>
              <div className="relative">
                <select 
                    value={jenisData}
                    onChange={(e) => setJenisData(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-gray-50 text-gray-700 focus:ring-2 focus:ring-green-500 outline-none appearance-none cursor-pointer"
                >
                    <option>Rekap Absensi</option>
                    <option>Rekap Penyelesaian Tugas</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* 2. Periode Mulai */}
            <div className="lg:col-span-3">
              <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">
                Periode Mulai
              </label>
              <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-600 cursor-pointer"
                  />
              </div>
            </div>

            {/* 3. Periode Akhir */}
            <div className="lg:col-span-3">
              <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">
                Periode Akhir
              </label>
              <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-600 cursor-pointer"
                  />
              </div>
            </div>

            {/* 4. Pilih Format */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">
                Pilih Format
              </label>
              <div className="relative">
                <select 
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-gray-50 text-gray-700 focus:ring-2 focus:ring-green-500 outline-none appearance-none cursor-pointer"
                >
                    <option value="PDF">PDF</option>
                    <option value="Excel">Excel</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* 5. Tombol Ekspor */}
            <div className="lg:col-span-1">
              <button 
                onClick={handleExportClick}
                className="w-full bg-[#0288D1] hover:bg-[#0277BD] text-white font-bold py-2.5 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 transition-all h-[42px]"
              >
                <FiDownload className="text-lg" />
                <span className="hidden xl:inline">Ekspor</span> 
              </button>
            </div>

          </div>
        </div>

        {/* Analisis Absensi Chart */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 ml-8 mr-8">
          <h2 className="font-bold text-lg text-green-800 mb-6 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 12A10 10 0 0 0 12 2V12H22Z" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Analisis Produktivitas Absensi (Bulan Ini)
          </h2>

          <div className="flex flex-col items-center">
            <div className="w-full bg-[#E8F5E9] rounded-2xl p-8 border border-green-50">
              
              {loading ? (
                  <div className="text-center py-10 text-gray-500">Memuat grafik...</div>
              ) : (
                  <>
                    <div className="flex justify-center py-4">
                        {/* Dynamic Donut Chart */}
                        <div className="relative w-48 h-48">
                        <div
                            className="w-full h-full rounded-full transition-all duration-1000"
                            style={{ background: chartBackground }}
                        ></div>
                        {/* Lubang Donut */}
                        <div className="absolute inset-4 bg-[#E8F5E9] rounded-full flex flex-col items-center justify-center">
                            <span className="text-3xl font-extrabold text-green-900">
                            {rataRataHadir}%
                            </span>
                            <span className="text-gray-600 text-xs font-medium mt-1">
                            Rata-rata Hadir
                            </span>
                        </div>
                        </div>
                    </div>

                    {/* Legend Data: Kembali ke 4 Kategori (Tepat Waktu, Terlambat, Absen, Cuti) */}
                    <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-left">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            {/* Tepat Waktu */}
                            <div>
                                <p className="text-2xl font-bold text-[#4CAF50] mb-1">
                                {kehadiranTepatWaktu}%
                                </p>
                                <span className="text-gray-600 text-xs font-medium">Tepat Waktu</span>
                            </div>

                            {/* Terlambat */}
                            <div>
                                <p className="text-2xl font-bold text-[#FFC107] mb-1">
                                {terlambat}%
                                </p>
                                <span className="text-gray-600 text-xs font-medium">Terlambat</span>
                            </div>
                            
                            {/* Absen */}
                            <div>
                                <p className="text-2xl font-bold text-[#EF5350] mb-1">
                                {absen}%
                                </p>
                                <span className="text-gray-600 text-xs font-medium">Absen</span>
                            </div>

                            {/* Cuti */}
                            <div>
                                <p className="text-2xl font-bold text-[#42A5F5] mb-1">
                                {cuti}%
                                </p>
                                <span className="text-gray-600 text-xs font-medium">Cuti</span>
                            </div>
                        </div>
                    </div>
                  </>
              )}
            </div>
          </div>
        </div>

        {/* Tabel Rekap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-8 mr-8 mb-8">
          
          {/* Tabel Rekap Absensi */}
          <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-green-800">Rekap Absensi (Per Karyawan)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9] text-left text-green-800">
                    <th className="px-4 py-3">KARYAWAN</th>
                    <th className="px-4 py-3 text-center">HADIR</th>
                    <th className="px-4 py-3 text-center">LATE</th>
                    <th className="px-4 py-3 text-center">ABSEN</th>
                    <th className="px-4 py-3 text-center">CUTI</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                      <tr><td colSpan="5" className="text-center py-4 text-gray-500">Memuat...</td></tr>
                  ) : data.rekapAbsensi.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-4 text-gray-500">Belum ada data.</td></tr>
                  ) : (
                      data.rekapAbsensi.map((row, i) => (
                        <tr key={i} className="hover:bg-green-50 border-b border-gray-50 last:border-0">
                          <td className="px-4 py-3 font-medium text-gray-700">{row.karyawan}</td>
                          {/* Angka Polos (Tanpa Warna) */}
                          <td className="px-4 py-3 text-center text-gray-700">{row.hadir}</td>
                          <td className="px-4 py-3 text-center text-gray-700">{row.terlambat}</td>
                          <td className="px-4 py-3 text-center text-gray-700">{row.absen}</td>
                          <td className="px-4 py-3 text-center text-gray-700">{row.cuti}</td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabel Rekap Tugas */}
          <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-green-800">Rekap Penyelesaian Tugas</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9] text-left text-green-800">
                    <th className="px-4 py-3">KARYAWAN</th>
                    <th className="px-4 py-3 text-center">SELESAI (%)</th>
                    <th className="px-4 py-3 text-center">TUGAS AKTIF</th>
                  </tr>
                </thead>
                <tbody>
                   {loading ? (
                      <tr><td colSpan="3" className="text-center py-4 text-gray-500">Memuat...</td></tr>
                  ) : data.rekapPenyelesaianTugas.length === 0 ? (
                      <tr><td colSpan="3" className="text-center py-4 text-gray-500">Belum ada data.</td></tr>
                  ) : (
                      data.rekapPenyelesaianTugas.map((row, i) => (
                        <tr key={i} className="hover:bg-green-50 border-b border-gray-50 last:border-0">
                          <td className="px-4 py-3 font-medium text-gray-700">{row.karyawan}</td>
                          {/* Persentase Polos (Tanpa Background) */}
                          <td className="px-4 py-3 text-center text-gray-700 font-bold">
                                {row.selesaiPersen}%
                          </td>
                          <td className="px-4 py-3 text-center text-gray-700">{row.tugasAktif}</td>
                        </tr>
                      ))
                  )}
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