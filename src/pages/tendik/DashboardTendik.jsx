import React from "react";
import AsideTendik from "../../components/AsideTendik";
import Topbar from "../../components/Topbar";
import { FiClock, FiList, FiPlus, FiCheckCircle } from "react-icons/fi";

const DashboardTendik = () => {
  const stats = [
    { label: "Hari Kehadiran Bulan Ini", value: 22 },
    { label: "Laporan Dikirim", value: 18 },
    { label: "Tingkat Penyelesaian", value: "98%" },
  ];

  const absensi = {
    checkIn: "08:15",
    date: "15 November 2025",
    statusLabel: "Dalam Shift",
    statusNote: "Check out sebelum jam 17:00",
  };

  const tugas = [
    { judul: "Inventarisasi Buku Baru", deadline: "20 Nov 2025", prioritas: "Tinggi", status: "Dalam Progress" },
    { judul: "Pembuatan Laporan Bulanan", deadline: "15 Nov 2025", prioritas: "Normal", status: "Selesai" },
    { judul: "Update Database Koleksi", deadline: "25 Nov 2025", prioritas: "Normal", status: "Dalam Progress" },
  ];

  const aktivitas = [
    { text: "Menyelesaikan tugas Pembuatan Laporan Bulanan", when: "2 jam yang lalu" },
    { text: "Mengirim laporan harian", when: "5 jam yang lalu" },
    { text: "Check in absensi pagi", when: "7 jam yang lalu" },
    { text: "Mendapatkan tugas baru: Update Database Koleksi", when: "1 hari yang lalu" },
  ];

  return (
    <div className="flex bg-[#f3fff5] min-h-screen">

      <AsideTendik />

      <main className="flex-1 p-8">
        <Topbar title="Dashboard Tenaga Kependidikan" />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-2xl text-green-700"><FiCheckCircle /></div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-green-800">{s.value}</h3>
                <p className="text-sm text-gray-600">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Absensi Hari Ini */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-green-800 flex items-center gap-2"><FiClock className="text-green-700"/> Absensi Hari Ini</h3>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Lihat Semua</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-xs text-gray-500">Check In</p>
              <h4 className="text-2xl font-bold text-green-800">{absensi.checkIn}</h4>
              <p className="text-xs text-gray-500">{absensi.date}</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 flex flex-col justify-between">
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">{absensi.statusLabel}</span>
              </div>
              <p className="text-sm text-gray-600">{absensi.statusNote}</p>
            </div>
          </div>
        </div>

        {/* Tugas Saya */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg text-green-800 flex items-center gap-2"><FiList className="text-green-700"/> Tugas Saya</h3>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Lihat Semua</button>
          </div>

          <div className="space-y-3">
            {tugas.map((t, i) => (
              <div key={i} className="p-4 rounded-md border bg-gray-50 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{t.judul}</p>
                  <p className="text-xs text-gray-500">Deadline: {t.deadline} • Prioritas {t.prioritas}</p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${t.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aktivitas Terbaru */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h3 className="font-bold text-lg text-green-800 mb-3">Aktivitas Terbaru</h3>
          <ul className="space-y-3">
            {aktivitas.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-700">✓</div>
                <div>
                  <p className="text-sm">{a.text}</p>
                  <p className="text-xs text-gray-500">{a.when}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </main>
    </div>
  );
};

export default DashboardTendik;
