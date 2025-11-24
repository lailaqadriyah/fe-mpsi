import React, { useState } from "react";
import AsideTendik from "../../components/AsideTendik";
import Topbar from "../../components/Topbar";

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
    <div className="flex bg-[#f3fff5] min-h-screen">
      <AsideTendik />

      <main className="flex-1 p-8">
        <Topbar title="Riwayat Aktivitas" subtitle="Rekapitulasi semua absensi dan laporan kegiatan Anda" />

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-green-800 font-bold text-lg mb-4">Laporan Terkirim</h2>

          <div className="space-y-4">
            {reports.map((r) => (
              <div key={r.id} className="border rounded-lg p-4 bg-green-50">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{r.date}</p>
                    <h3 className="font-semibold text-green-800 mt-2">{r.title}</h3>
                    <p className="text-sm text-gray-700 mt-2">{r.description}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                      <span className="inline-block px-2 py-1 rounded-full bg-white text-green-700">{r.category}</span>
                      <span>{r.time}</span>
                    </div>
                  </div>

                  <div className="ml-4 flex-shrink-0">
                    <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">{r.status}</span>
                  </div>
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
