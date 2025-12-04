import React, { useState, useEffect } from "react";
import Aside from "../../components/Aside";
import Topbar from "../../components/Topbar";
import { FiUser, FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiInfo, FiFileText } from "react-icons/fi";
import Modal from "../../components/Modal";
import Swal from "sweetalert2";

const LihatCuti = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Modal Detail
  const [selectedRequest, setSelectedRequest] = useState(null);

  // --- 1. FETCH DATA (Integrasi Backend) ---
  const fetchRequests = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:4000/api/cuti/all", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error("Gagal mengambil data cuti:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // --- 2. HANDLER TERIMA ---
  const handleAccept = async (id) => {
    const token = localStorage.getItem("token");
    
    const result = await Swal.fire({
      title: "Setujui Pengajuan?",
      text: "Status akan berubah menjadi Disetujui.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2E7D32",
      confirmButtonText: "Ya, Setujui",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:4000/api/cuti/${id}/approve`, {
          method: "PUT",
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
          Swal.fire("Berhasil", "Pengajuan telah disetujui.", "success");
          fetchRequests(); // Refresh data
          setSelectedRequest(null); // Tutup modal jika sedang terbuka
        } else {
          Swal.fire("Gagal", "Terjadi kesalahan.", "error");
        }
      } catch (err) {
        Swal.fire("Error", "Koneksi error.", "error");
      }
    }
  };

  // --- 3. HANDLER TOLAK ---
  const handleReject = async (id) => {
    const token = localStorage.getItem("token");

    const { value: reason } = await Swal.fire({
      title: "Tolak Pengajuan?",
      input: "text",
      inputLabel: "Alasan Penolakan",
      inputPlaceholder: "Masukkan alasan...",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Tolak",
      inputValidator: (value) => {
        if (!value) {
          return "Alasan penolakan wajib diisi!";
        }
      }
    });

    if (reason) {
      try {
        const response = await fetch(`http://localhost:4000/api/cuti/${id}/reject`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify({ alasanPenolakan: reason })
        });

        if (response.ok) {
          Swal.fire("Ditolak", "Pengajuan telah ditolak.", "success");
          fetchRequests(); // Refresh data
          setSelectedRequest(null); // Tutup modal jika sedang terbuka
        }
      } catch (err) {
        Swal.fire("Error", "Koneksi error.", "error");
      }
    }
  };

  // Helper: Format Tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  // Helper: Inisial Nama
  const getInitials = (name) => {
    return name ? name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() : "US";
  };

  // Helper: Warna Badge Status
  const getStatusStyle = (status) => {
    switch(status) {
        case 'DISETUJUI': return 'bg-green-100 text-green-700 border-green-200';
        case 'DITOLAK': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  const formatStatus = (status) => {
      if(status === 'MENUNGGU_KONFIRMASI') return 'Menunggu Konfirmasi';
      if(status === 'DISETUJUI') return 'Disetujui';
      if(status === 'DITOLAK') return 'Ditolak';
      return status;
  }

  return (
    <div className="flex bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] min-h-screen font-sans">
      <Aside />

      <main className="flex-1 bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] overflow-y-auto transition-all">
        <Topbar
          title="Lihat Pengajuan Cuti"
          subtitle="Kelola pengajuan cuti tenaga kependidikan"
        />

        <div className="space-y-6 mt-4 p-8">
          {loading ? (
             <p className="text-center text-gray-500 py-10">Memuat data...</p>
          ) : requests.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-white rounded-xl shadow-sm">
              Tidak ada pengajuan cuti saat ini.
            </div>
          ) : (
            requests.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedRequest(item)} // KLIK UNTUK DETAIL
                className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col gap-4 relative transition-all cursor-pointer hover:shadow-md ${
                    item.status === 'MENUNGGU_KONFIRMASI' ? 'border-l-4 border-l-yellow-400 border-gray-100' : 'border-gray-100 opacity-90 hover:opacity-100'
                }`}
              >
                {/* Status Badge Pojok Kanan Atas */}
                <div className="absolute top-6 right-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusStyle(item.status)}`}>
                        {formatStatus(item.status)}
                    </span>
                </div>

                {/* Judul & Alasan */}
                <div className="pr-20">
                  <h3 className="text-lg font-bold text-green-900 mb-1">
                    {item.judul}
                  </h3>
                  <p className="text-sm text-gray-600 font-normal leading-relaxed line-clamp-2">
                    {item.alasan}
                  </p>
                  
                  {/* Klik Info */}
                  <p className="text-xs text-blue-500 mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Klik untuk detail
                  </p>
                </div>

                {/* Info User & Tanggal */}
                <div className="flex flex-wrap items-center gap-6 mt-1 pb-2 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-green-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {getInitials(item.user?.name)}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-800">{item.user?.name}</p>
                        <p className="text-xs text-gray-400">{item.user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                    <FiCalendar className="text-green-600" />
                    <span className="font-medium">
                        {formatDate(item.tanggalMulai)} - {formatDate(item.tanggalSelesai)}
                    </span>
                  </div>
                </div>

                {/* Tombol Aksi (Hanya muncul jika status MENUNGGU) */}
                {item.status === 'MENUNGGU_KONFIRMASI' && (
                    <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleAccept(item.id); }} // Stop Propagation
                        className="flex items-center gap-2 px-5 py-2 bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#1B5E20] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                        <FiCheckCircle /> Terima
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleReject(item.id); }} // Stop Propagation
                        className="flex items-center gap-2 px-5 py-2 bg-[#FFEBEE] hover:bg-[#FFCDD2] text-[#C62828] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                        <FiXCircle /> Tolak
                    </button>
                    </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* --- MODAL DETAIL --- */}
        {selectedRequest && (
            <Modal
                title={
                    <div className="flex items-center gap-2 text-green-800">
                        <FiFileText className="text-xl" />
                        <span className="font-bold text-lg">Detail Permohonan Cuti</span>
                    </div>
                }
                onClose={() => setSelectedRequest(null)}
            >
                <div className="space-y-6 text-left text-sm text-gray-700">
                    
                    {/* Header: Profil Pemohon */}
                    <div className="flex items-center gap-4 bg-green-50 p-4 rounded-xl border border-green-100">
                        <div className="w-12 h-12 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {getInitials(selectedRequest.user?.name)}
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Pemohon</p>
                            <p className="text-base font-bold text-gray-900">{selectedRequest.user?.name}</p>
                            <p className="text-xs text-gray-600">{selectedRequest.user?.email}</p>
                        </div>
                        <div className="ml-auto">
                             <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(selectedRequest.status)}`}>
                                {formatStatus(selectedRequest.status)}
                            </span>
                        </div>
                    </div>

                    {/* Detail Cuti */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Jenis Cuti</label>
                            <p className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">
                                {selectedRequest.judul}
                            </p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Tanggal Mulai</label>
                            <div className="flex items-center gap-2 font-medium text-gray-800">
                                <FiCalendar className="text-green-600" /> {formatDate(selectedRequest.tanggalMulai)}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Tanggal Selesai</label>
                            <div className="flex items-center gap-2 font-medium text-gray-800">
                                <FiCalendar className="text-green-600" /> {formatDate(selectedRequest.tanggalSelesai)}
                            </div>
                        </div>
                    </div>

                    {/* Alasan */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Alasan Pengajuan</label>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="leading-relaxed whitespace-pre-wrap text-gray-700">
                                {selectedRequest.alasan}
                            </p>
                        </div>
                    </div>

                    {/* Alasan Penolakan (Jika Ada) */}
                    {selectedRequest.status === 'DITOLAK' && selectedRequest.alasanPenolakan && (
                        <div>
                            <label className="text-xs font-bold text-red-400 uppercase block mb-2">Alasan Penolakan</label>
                            <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-700 font-medium">
                                {selectedRequest.alasanPenolakan}
                            </div>
                        </div>
                    )}

                    {/* Footer Actions (Jika masih MENUNGGU) */}
                    {selectedRequest.status === 'MENUNGGU_KONFIRMASI' && (
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => handleReject(selectedRequest.id)}
                                className="px-5 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-bold transition-colors"
                            >
                                Tolak
                            </button>
                            <button
                                onClick={() => handleAccept(selectedRequest.id)}
                                className="px-5 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm font-bold transition-colors shadow-md"
                            >
                                Setujui Pengajuan
                            </button>
                        </div>
                    )}

                    {/* Tombol Tutup (Jika bukan MENUNGGU) */}
                    {selectedRequest.status !== 'MENUNGGU_KONFIRMASI' && (
                        <div className="flex justify-end pt-2">
                            <button 
                                onClick={() => setSelectedRequest(null)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm font-bold transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    )}

                </div>
            </Modal>
        )}

      </main>
    </div>
  );
};

export default LihatCuti;