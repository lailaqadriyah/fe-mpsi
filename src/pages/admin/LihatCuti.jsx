import React, { useState } from "react";
import Aside from "../../components/Aside";
import Topbar from "../../components/Topbar";
import { FiUser, FiCalendar } from "react-icons/fi";
import Swal from "sweetalert2";

const LihatCuti = () => {
  // Dummy Data sesuai gambar
  const [requests, setRequests] = useState([
    {
      id: 1,
      type: "Cuti Melahirkan",
      desc: "Mengajukan cuti melahirkan sesuai jadwal persalinan dan kebutuhan pemulihan",
      name: "Dewi Lestari",
      initial: "DL",
      date: "30 Nov 2025 - 30 Januari 2026",
      avatarColor: "bg-[#2E7D32]", // Hijau Tua
    },
    {
      id: 2,
      type: "Cuti Luar Kota",
      desc: "Perlu melakukan perjalanan dinas ke luar kota",
      name: "Ahmad Fauzi",
      initial: "AF",
      date: "15 Nov 2025 - 17 Nov 2025",
      avatarColor: "bg-[#43A047]", // Hijau Sedang
    },
    {
      id: 3,
      type: "Cuti Menikah",
      desc: "Mengajukan cuti menikah untuk pelaksanaan rangkaian acara pernikahan",
      name: "Eko Prasetyo",
      initial: "EP",
      date: "12 Nov 2025 - 15 Nov 2025",
      avatarColor: "bg-[#1B5E20]", // Hijau Sangat Tua
    },
  ]);

  // Handler untuk tombol Terima
  const handleAccept = (id) => {
    Swal.fire({
      title: "Terima Pengajuan?",
      text: "Pengajuan cuti akan disetujui.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2E7D32",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Terima",
    }).then((result) => {
      if (result.isConfirmed) {
        setRequests(requests.filter((req) => req.id !== id));
        Swal.fire("Berhasil", "Pengajuan telah diterima.", "success");
      }
    });
  };

  // Handler untuk tombol Tolak
  const handleReject = (id) => {
    Swal.fire({
      title: "Tolak Pengajuan?",
      text: "Pengajuan cuti akan ditolak.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Tolak",
    }).then((result) => {
      if (result.isConfirmed) {
        setRequests(requests.filter((req) => req.id !== id));
        Swal.fire("Ditolak", "Pengajuan telah ditolak.", "error");
      }
    });
  };

  return (
    <div className="flex bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] min-h-screen font-sans">
      {/* Sidebar */}
      <Aside />

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] overflow-y-auto transition-all">
        <Topbar
          title="Lihat Pengajuan Cuti" // Judul disamakan dengan gambar
          subtitle="Kelola pengajuan cuti tenaga kependidikan"
        />

        {/* List Card Container */}
        <div className="space-y-6 mt-4 p-8">
          {requests.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-white rounded-xl shadow-sm">
              Tidak ada pengajuan cuti saat ini.
            </div>
          ) : (
            requests.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-green-50 p-6 flex flex-col gap-4"
              >
                {/* Bagian Atas: Judul & Deskripsi */}
                <div>
                  <h3 className="text-lg font-bold text-green-900 mb-1">
                    {item.type}
                  </h3>
                  <p className="text-sm text-gray-500 font-normal">
                    {item.desc}
                  </p>
                </div>

                {/* Bagian Tengah: Info User & Tanggal */}
                <div className="flex flex-wrap items-center gap-6 mt-2">
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${item.avatarColor}`}>
                      {item.initial}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiUser className="text-green-700" />
                        <span>{item.name}</span>
                    </div>
                  </div>

                  {/* Date Info */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiCalendar className="text-green-700" />
                    <span>{item.date}</span>
                  </div>
                </div>

                {/* Bagian Bawah: Tombol Aksi (Rata Kanan) */}
                <div className="flex justify-end gap-3 mt-2 pt-2">
                  <button
                    onClick={() => handleAccept(item.id)}
                    className="px-6 py-1.5 bg-[#C8E6C9] hover:bg-[#A5D6A7] text-[#1B5E20] text-xs font-bold rounded-lg transition-colors shadow-sm"
                  >
                    Terima
                  </button>
                  <button
                    onClick={() => handleReject(item.id)}
                    className="px-6 py-1.5 bg-[#FFCDD2] hover:bg-[#EF9A9A] text-[#C62828] text-xs font-bold rounded-lg transition-colors shadow-sm"
                  >
                    Tolak
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default LihatCuti;