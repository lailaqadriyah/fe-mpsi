import React, { useState } from "react";
import Aside from "../../components/Aside";
import Topbar from "../../components/Topbar";
import Modal from "../../components/Modal";
import { FiActivity, FiSearch, FiEye, FiFileText } from "react-icons/fi";

const MonitoringAktivitas = () => {
  const [selectedReport, setSelectedReport] = useState(null);

  const reports = [
    {
      tanggal: "14 November 2025",
      karyawan: "Siti Rahma",
      // jenis: "Layanan Sirkulasi",
      judul: "Pelayanan Sirkulasi Harian",
      deskripsi:
        "Melayani pengembalian dan peminjaman buku serta membantu pencarian buku untuk mahasiswa.",
      hasil: "25 transaksi peminjaman dan pengembalian berhasil diproses.",
      dokumentasi: "[Lihat File Foto/Dokumen Terlampir]",
    },
    {
      tanggal: "13 November 2025",
      karyawan: "Dewi Lestari",
      // jenis: "Katalogisasi",
      judul: "Katalogisasi Buku Baru",
      deskripsi:
        "Melakukan katalogisasi 25 judul buku baru, input data bibliografi dan penentuan nomor klasifikasi.",
      hasil:
        "25 buku siap untuk diberi label dan ditempatkan di rak koleksi baru.",
      dokumentasi: "[Lihat File Foto/Dokumen Terlampir]",
    },
    {
      tanggal: "12 November 2025",
      karyawan: "Eko Prasetyo",
      // jenis: "Referensi",
      judul: "Layanan Referensi dan Literasi Informasi",
      deskripsi:
        "Memberikan konsultasi referensi kepada 8 mahasiswa terkait materi penelitian.",
      hasil: "8 mahasiswa menerima rekomendasi sumber dan panduan pengutipan.",
      dokumentasi: "[Lihat File Foto/Dokumen Terlampir]",
    },
  ];

  return (
    <div className="flex bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] min-h-screen font-sans">
      {/* Sidebar */}
      <Aside />

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] overflow-y-auto transition-all">
        <Topbar
          title="Monitoring Aktivitas"
          subtitle="Memantau dan mengevaluasi laporan kegiatan harian karyawan"
        />

        {/* Filter Section (Updated Design) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 mt-8 ml-8 mr-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* Cari Nama */}
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-2 text-left">
                Cari Nama/Kata Kunci Laporan
              </label>
              <input
                type="text"
                placeholder="Nama karyawan atau kata kunci laporan..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Tanggal Mulai */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 text-left">
                Tanggal Mulai
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-400 outline-none text-gray-600"
              />
            </div>

            {/* Tanggal Akhir */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 text-left">
                Tanggal Akhir
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-400 outline-none text-gray-600"
              />
            </div>

            {/* Jenis Kegiatan */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 text-left">
                Jenis Kegiatan
              </label>
              <select className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-[#E8F5E9] text-gray-700 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer">
                <option>Semua Jenis</option>
                <option>Administrasi</option>
                <option>Sirkulasi</option>
                <option>Katalogisasi</option>
                <option>Referensi</option>
              </select>
            </div>
          </div>

          {/* Tombol Filter */}
          <div>
            <button className="bg-gradient-to-r from-[#0288D1] to-[#4FC3F7] hover:shadow-lg hover:opacity-90   text-white font-bold py-2.5 px-6 rounded-lg shadow-md flex items-center gap-2 transition-all">
              <FiSearch className="text-lg" />
              Filter Data
            </button>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow p-6 mb-6 ml-8 mr-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-green-800 flex items-center gap-2">
              📊 Tren Laporan Harian (7 Hari Terakhir)
            </h2>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString()}
            </div>
          </div>

          <div className="h-64 w-full rounded-lg p-4">
            <div className="h-full w-ful rounded-lg p-6 flex items-end gap-6">
              {[5, 8, 12, 10, 15, 9, 14].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="bg-gradient-to-b from-[#43A047] to-[#66BB6A] w-full rounded-t-md"
                    style={{ height: `${v * 12}px` }}
                  />
                  <span className="text-xs mt-2 text-gray-600">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rincian Laporan */}
        <div className="bg-white rounded-xl shadow p-6 mb-6 ml-8 mr-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-green-800">
              📋 Rincian Laporan Terbaru
            </h2>
            {/* <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">Lihat Semua</button> */}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9]">
                <tr className="text-green-900 text-sm font-bold text-left">
                  <th className="px-6 py-4 rounded-tl-xl">Tanggal</th>
                  <th className="px-6 py-4">Karyawan</th>
                  <th className="px-6 py-4">Judul Kegiatan</th>
                  <th className="px-6 py-4 rounded-tr-xl">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {reports.map((report, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-100 hover:bg-green-50 transition-colors"
                  >
                    <td className="px-6 py-5 font-medium text-left">
                      {report.tanggal}
                    </td>
                    <td className="px-6 py-5 font-bold text-gray-800 text-left">
                      {report.karyawan}
                    </td>
                    {/* Kolom Jenis Kegiatan dihapus sesuai desain */}
                    <td className="px-6 py-5 font-medium text-left">
                      {report.judul}
                    </td>
                    <td className="px-6 py-5 text-left">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] text-[#1976D2] hover:shadow-md hover:opacity-90 px-6 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 mx-auto"
                      >
                        <FiEye className="text-sm" />
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedReport && (
          <Modal 
            title={
                <div className="flex items-center gap-2 text-[#1B5E20]">
                    <FiFileText className="text-xl" />
                    <span className="font-bold text-lg">Detail Laporan Harian</span>
                </div>
            }
            onClose={() => setSelectedReport(null)}
          >
            <div className="text-sm text-gray-700 space-y-4 mt-2 text-left">
              
              {/* Karyawan */}
              <div className="border-b border-dashed border-gray-200 pb-2">
                <p className="text-[10px] text-gray-400 mb-0.5">Karyawan</p>
                <p className="font-medium text-gray-900">{selectedReport.karyawan}</p>
              </div>

              {/* Tanggal Laporan */}
              <div className="border-b border-dashed border-gray-200 pb-2">
                <p className="text-[10px] text-gray-400 mb-0.5">Tanggal Laporan</p>
                <p className="font-medium text-gray-900">{selectedReport.tanggal}</p>
              </div>

              {/* Judul Kegiatan */}
              <div className="border-b border-dashed border-gray-200 pb-2">
                <p className="text-[10px] text-gray-400 mb-0.5">Judul Kegiatan</p>
                <p className="font-medium text-gray-900">{selectedReport.judul}</p>
              </div>

              {/* Deskripsi Kegiatan */}
              <div className="border-b border-dashed border-gray-200 pb-3">
                <p className="text-sm font-bold text-[#1B5E20] mb-1">Deskripsi Kegiatan</p>
                <p className="text-gray-700 text-sm leading-relaxed">{selectedReport.deskripsi}</p>
              </div>

              {/* Catatan / Hasil (Menggunakan label 'Catatan' sesuai gambar) */}
              <div className="border-b border-dashed border-gray-200 pb-3">
                <p className="text-sm font-bold text-[#1B5E20] mb-1">Catatan</p>
                <p className="text-gray-700 text-sm leading-relaxed">{selectedReport.hasil}</p>
              </div>

              {/* Dokumentasi */}
              <div>
                <p className="text-sm font-bold text-[#1B5E20] mb-1">Dokumentasi</p>
                <p className="text-blue-500 text-sm font-medium cursor-pointer hover:underline">
                  {selectedReport.dokumentasi}
                </p>
              </div>

            </div>
          </Modal>
        )}
      </main>
    </div>
  );
};

export default MonitoringAktivitas;
