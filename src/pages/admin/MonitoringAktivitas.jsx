import React, { useState } from "react";
import Aside from "../../components/Aside";// ← sesuaikan dengan lokasi aside-mu
import Topbar from "../../components/Topbar";
import Modal from "../../components/Modal";

const MonitoringAktivitas = () => {
  const [selectedReport, setSelectedReport] = useState(null);

  const reports = [
    {
      tanggal: "14 November 2025",
      karyawan: "Siti Rahma",
      jenis: "Layanan Sirkulasi",
      judul: "Pelayanan Sirkulasi Harian",
      deskripsi: "Melayani pengembalian dan peminjaman buku serta membantu pencarian buku untuk mahasiswa.",
      hasil: "25 transaksi peminjaman dan pengembalian berhasil diproses.",
      dokumentasi: "[Lihat File Foto/Dokumen Terlampir]",
    },
    {
      tanggal: "13 November 2025",
      karyawan: "Dewi Lestari",
      jenis: "Katalogisasi",
      judul: "Katalogisasi Buku Baru",
      deskripsi: "Melakukan katalogisasi 25 judul buku baru, input data bibliografi dan penentuan nomor klasifikasi.",
      hasil: "25 buku siap untuk diberi label dan ditempatkan di rak koleksi baru.",
      dokumentasi: "[Lihat File Foto/Dokumen Terlampir]",
    },
    {
      tanggal: "12 November 2025",
      karyawan: "Eko Prasetyo",
      jenis: "Referensi",
      judul: "Layanan Referensi dan Literasi Informasi",
      deskripsi: "Memberikan konsultasi referensi kepada 8 mahasiswa terkait materi penelitian.",
      hasil: "8 mahasiswa menerima rekomendasi sumber dan panduan pengutipan.",
      dokumentasi: "[Lihat File Foto/Dokumen Terlampir]",
    },
  ];

  return (
    <div className="flex bg-[#e9f5e9] min-h-screen">

      {/* Sidebar */}
      <Aside />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Topbar title="Monitoring Aktivitas" subtitle="Memantau dan mengevaluasi laporan kegiatan harian karyawan" />

        {/* Filter pill */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow px-4 py-3 flex items-center gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">Filter Data</button>

            <input type="text" placeholder="Nama karyawan atau kata kunci laporan..." className="flex-1 text-sm px-3 py-2 rounded-md bg-transparent outline-none" />

            <input type="date" className="text-sm px-3 py-2 rounded-md border" />
            <input type="date" className="text-sm px-3 py-2 rounded-md border" />

            <select className="text-sm px-3 py-2 rounded-md border bg-white">
              <option>Semua Jenis</option>
              <option>Administrasi</option>
              <option>Sirkulasi</option>
              <option>Katalogisasi</option>
              <option>Referensi</option>
            </select>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-green-800 flex items-center gap-2">📊 Tren Laporan Harian (7 Hari Terakhir)</h2>
            <div className="text-sm text-gray-500">{new Date().toLocaleDateString()}</div>
          </div>

          <div className="h-64 w-full rounded-lg p-4">
            <div className="h-full w-full bg-gradient-to-t from-green-100 to-white rounded-lg p-6 flex items-end gap-6">
              {[5,8,12,10,15,9,14].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="bg-green-600 w-full rounded-t-md" style={{ height: `${v * 12}px` }} />
                  <span className="text-xs mt-2 text-gray-600">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rincian Laporan */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-green-800">📋 Rincian Laporan Terbaru</h2>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Lihat Semua</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-green-100 text-left text-sm text-green-800">
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Karyawan</th>
                  <th className="px-4 py-3">Jenis Kegiatan</th>
                  <th className="px-4 py-3">Judul Kegiatan</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, i) => (
                  <tr key={i} className="border-b hover:bg-green-50 text-sm">
                    <td className="px-4 py-3">{report.tanggal}</td>
                    <td className="px-4 py-3 font-semibold text-gray-700">{report.karyawan}</td>
                    <td className="px-4 py-3">{report.jenis}</td>
                    <td className="px-4 py-3">{report.judul}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedReport(report)} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md">Detail</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedReport && (
          <Modal title="Detail Laporan Harian" onClose={() => setSelectedReport(null)}>
            <div className="text-sm text-gray-700 space-y-4">
              <div>
                <p className="text-xs text-gray-500">Karyawan</p>
                <p className="font-semibold">{selectedReport.karyawan}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Tanggal Laporan</p>
                <p>{selectedReport.tanggal}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Jenis Kegiatan</p>
                <p>{selectedReport.jenis}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Judul Kegiatan</p>
                <p className="font-semibold">{selectedReport.judul}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Deskripsi Kegiatan</p>
                <p className="text-gray-700 whitespace-pre-line">{selectedReport.deskripsi}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Hasil / Output</p>
                <p className="text-gray-700">{selectedReport.hasil}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Dokumentasi</p>
                <p className="text-indigo-600 font-medium">{selectedReport.dokumentasi}</p>
              </div>

              <div className="flex justify-end">
                <button onClick={() => setSelectedReport(null)} className="px-4 py-2 rounded-md bg-white border">Tutup</button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default MonitoringAktivitas;
