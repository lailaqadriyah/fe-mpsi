import React from "react";
import AsideTendik from "../../components/AsideTendik";
import Topbar from "../../components/Topbar";
import {
  FiClock,
  FiList,
  FiPlus,
  FiCheckCircle,
  FiCalendar,
  FiEye,
  FiInfo,
  FiUpload,
  

} from "react-icons/fi";

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
    {
      judul: "Inventarisasi Buku Baru",
      deadline: "20 Nov 2025",
      prioritas: "Tinggi",
      status: "Dalam Progress",
    },
    {
      judul: "Pembuatan Laporan Bulanan",
      deadline: "15 Nov 2025",
      prioritas: "Normal",
      status: "Selesai",
    },
    {
      judul: "Update Database Koleksi",
      deadline: "25 Nov 2025",
      prioritas: "Normal",
      status: "Dalam Progress",
    },
  ];

  const aktivitas = [
    {
      text: "Menyelesaikan tugas Pembuatan Laporan Bulanan",
      when: "2 jam yang lalu",
    },
    { text: "Mengirim laporan harian", when: "5 jam yang lalu" },
    { text: "Check in absensi pagi", when: "7 jam yang lalu" },
    {
      text: "Mendapatkan tugas baru: Update Database Koleksi",
      when: "1 hari yang lalu",
    },
  ];

  return (
    <div className="flex bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] min-h-screen">
      <AsideTendik />

      <main className="flex-1">
        <Topbar title="Dashboard Tenaga Kependidikan" />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow p-5 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-2xl text-green-700">
                <FiCheckCircle />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-green-800">{s.value}</h3>
                <p className="text-sm text-gray-600">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Absensi Hari Ini */}
        <div className="bg-white rounded-xl shadow p-6 mb-6 mt-8 mx-8">
          {/* Header Section */}
          <div className="flex gap-3 mb-6">
            <FiClock className="text-xl text-green-800" />
            <h3 className="font-bold text-lg text-green-800">
              Absensi Hari Ini
            </h3>
          </div>

          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card Check In */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] border border-green-50 flex flex-col justify-center h-36 relative overflow-hidden">
              {/* Dekorasi background halus (opsional) */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>

              <p className="text-sm font-semibold text-gray-600 mb-1 text-left">
                Check In
              </p>
              <h4 className="text-4xl font-bold text-[#1B5E20] mb-1 text-left">
                {absensi.checkIn}
              </h4>
              <p className="text-xs font-medium text-gray-600 text-left">
                {absensi.date}
              </p>
            </div>

            {/* Card Check Out */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] border border-green-50 flex flex-col justify-center h-36 relative overflow-hidden">
              {/* Dekorasi background halus (opsional) */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>

              <p className="text-sm font-semibold text-gray-600 mb-1 text-left">
                Check Out
              </p>
              <h4 className="text-4xl font-bold text-[#1B5E20] mb-1 text-left">
                16:00
              </h4>
              <p className="text-xs font-medium text-gray-600 text-left">
                15 November 2025
              </p>
            </div>
          </div>
        </div>

        {/* Tugas Saya */}
        <div className="bg-white rounded-xl shadow p-6 mb-6 mt-8 mr-8 ml-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-green-900 flex items-center gap-3">
              <FiList className="text-xl" /> Tugas Saya
            </h3>
            <button className="bg-[#43A047] hover:bg-[#2E7D32] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2">
              <FiEye /> Lihat Semua
            </button>
          </div>

          <div className="space-y-4">
            {tugas.map((t, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-gray-50 bg-[#FAFAFA] hover:bg-white hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <h4 className="font-bold text-green-800 text-base">
                    {t.judul}
                  </h4>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <FiCalendar className="text-gray-400 text-sm" />
                      <span>Deadline: {t.deadline}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FiInfo className="text-gray-400 text-sm" />
                      <span>Prioritas {t.prioritas}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                      t.status === "Selesai"
                        ? "bg-[#C8E6C9] text-[#1B5E20]" // Hijau untuk Selesai
                        : "bg-[#FFE0B2] text-[#E65100]" // Orange untuk Dalam Progress
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aktivitas Terbaru */}
        <div className="bg-white rounded-xl shadow p-6 mb-6 mt-8 mr-8 ml-8">
          <h3 className="font-bold text-lg text-green-900 mb-6 flex items-center gap-2">
            <FiClock className="text-xl" /> Aktivitas Hari Ini
          </h3>
          <ul className="space-y-0">
            {aktivitas.map((a, i) => (
              <li
                key={i}
                className="flex items-start gap-4 py-4 border-b border-gray-50 last:border-0 last:pb-0 first:pt-0"
              >
                <div className="w-10 h-10 rounded-lg bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] flex-shrink-0">
                  {/* Ikon dinamis sederhana berdasarkan urutan/jenis (bisa disesuaikan logic-nya nanti) */}
                  {i === 0 ? (
                    <FiCheckCircle />
                  ) : i === 1 ? (
                    <FiUpload />
                  ) : i === 2 ? (
                    <FiClock />
                  ) : (
                    <FiList />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-800 font-medium">
                    {a.text.includes(":") ? (
                      <>
                        {a.text.split(":")[0]}:{" "}
                        <span className="font-bold">
                          {a.text.split(":")[1]}
                        </span>
                      </>
                    ) : (
                      // Logic sederhana untuk menebalkan bagian tertentu jika ada keyword "tugas" (sesuai gambar)
                      a.text.replace("tugas", "") +
                      (a.text.includes("tugas") ? "" : "")
                      // Atau biarkan default:
                      // a.text
                    )}
                    {/* Note: Karena data 'a.text' string biasa, saya render langsung saja agar aman. 
                 Jika ingin menebalkan bagian tertentu seperti di gambar, data source sebaiknya dipisah (action + subject). 
                 Di sini saya render apa adanya dari data Anda. */}
                    {a.text}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{a.when}</p>
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
