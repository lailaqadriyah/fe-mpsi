import React, { useState } from "react";
import AsideTendik from "../../components/AsideTendik";
import Topbar from "../../components/Topbar";
import { FiClock, FiCheckCircle } from "react-icons/fi";

const RiwayatAktivitas = () => {
  const [reports] = useState([
    {
      id: 1,
      date: "14 November 2025",
      title: "Layanan Sirkulasi Harian",
      category: "Layanan Sirkulasi",
      time: "Dikirim 10:30",
      description:
        "Melakukan pelayanan peminjaman dan pengembalian buku kepada mahasiswa dan dosen. Total transaksi: 45 peminjaman, 38 pengembalian. Memberikan informasi tentang perpanjangan masa pinjam melalui sistem online.",
      status: "Terkirim",
    },
    {
      id: 2,
      date: "13 November 2025",
      title: "Katalogisasi Buku Baru",
      category: "Katalogisasi",
      time: "Dikirim 16:15",
      description:
        "Melakukan proses katalogisasi untuk 25 judul buku baru yang baru diterima. Melakukan input data bibliografi, penentuan nomor klasifikasi, dan pembuatan label buku.",
      status: "Terkirim",
    },
    {
      id: 3,
      date: "12 November 2025",
      title: "Layanan Referensi dan Literasi Informasi",
      category: "Referensi",
      time: "Dikirim 16:00",
      description:
        "Memberikan bimbingan kepada 12 mahasiswa tentang cara mencari referensi jurnal internasional. Membantu akses database online dan memberikan tips penelusuran informasi yang efektif.",
      status: "Terkirim",
    },
  ]);

  return (
    <div className="flex bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] min-h-screen">
      <AsideTendik />

      <main className="flex-1">
        <Topbar title="Riwayat Aktivitas" subtitle="Rekapitulasi semua absensi dan laporan kegiatan Anda" />

        <div className="bg-white rounded-xl shadow p-6 mt-8 mx-8 mb-8">
  <div className="flex items-center gap-3 mb-6">
    <FiClock className="text-xl text-green-800" />
    <h2 className="text-lg font-bold text-green-800">Laporan Terkirim</h2>
  </div>

  <div className="space-y-4">
    {reports.map((r) => (
      <div key={r.id} className="p-6 rounded-2xl bg-[#FAFAFA] border border-gray-50 hover:shadow-md transition-shadow">
        
        {/* Header: Tanggal & Status */}
        <div className="flex justify-between items-start mb-2">
          <p className="text-sm font-bold text-green-900">{r.date}</p>
          <span className="inline-block px-4 py-1 rounded-full bg-[#C8E6C9] text-[#1B5E20] text-xs font-bold">
            {r.status}
          </span>
        </div>

        {/* Judul Laporan */}
        <h3 className="font-bold text-[#2E7D32] text-base mb-2 text-left">{r.title}</h3>

        {/* Deskripsi */}
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          {r.description}
        </p>

        {/* Footer: Waktu Kirim */}
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <FiCheckCircle className="text-green-600" />
          <span>Dikirim {r.time.replace("Dikirim ", "")}</span> {/* Menghindari duplikasi teks jika data sudah ada kata 'Dikirim' */}
        </div>

      </div>
    ))}
  </div>
</div>
      </main>
    </div>
  );
};

export default RiwayatAktivitas;
