import React, { useState, useEffect } from "react";
import AsideTendik from "../../components/AsideTendik";
import Topbar from "../../components/Topbar";
import { FiTrash2, FiPlus, FiFilter, FiFileText, FiSend, FiCalendar, FiClock, FiX, FiInfo } from "react-icons/fi";
import Modal from "../../components/Modal";
import Swal from "sweetalert2";

const PengajuanCuti = () => {
  const [showModal, setShowModal] = useState(false); // Modal Form Tambah
  const [selectedLeave, setSelectedLeave] = useState(null); // Modal Detail (Baru)
  const [loading, setLoading] = useState(true);
  
  // State data dari database
  const [leaveRequests, setLeaveRequests] = useState([]);

  // State form pengajuan
  const [form, setForm] = useState({
    jenisCuti: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    alasan: "",
    dokumen: null 
  });

  // --- 1. FETCH DATA CUTI ---
  const fetchCuti = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:4000/api/cuti", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setLeaveRequests(data);
      } else {
        console.error("Gagal mengambil data cuti");
      }
    } catch (error) {
      console.error("Error connection:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCuti();
  }, []);

  // --- 2. HANDLER SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!form.jenisCuti || !form.tanggalMulai || !form.tanggalSelesai || !form.alasan) {
      Swal.fire("Peringatan", "Harap lengkapi semua field wajib!", "warning");
      return;
    }

    try {
      const payload = {
        judul: form.jenisCuti,
        tanggalMulai: form.tanggalMulai,
        tanggalSelesai: form.tanggalSelesai,
        alasan: form.alasan
      };

      const response = await fetch("http://localhost:4000/api/cuti", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await Swal.fire("Berhasil", "Pengajuan cuti berhasil dikirim.", "success");
        setForm({ jenisCuti: "", tanggalMulai: "", tanggalSelesai: "", alasan: "", dokumen: null });
        setShowModal(false);
        fetchCuti();
      } else {
        const errData = await response.json();
        Swal.fire("Gagal", errData.message || "Gagal mengajukan cuti", "error");
      }

    } catch (error) {
      Swal.fire("Error", "Terjadi kesalahan koneksi", "error");
    }
  };

  // Handler Hapus
  const handleDelete = (id) => {
    Swal.fire("Info", "Fitur hapus pengajuan belum tersedia di server.", "info");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, dokumen: e.target.files[0] });
  };

  // Helper: Format Tanggal
  const formatDate = (dateString) => {
    if(!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric"
    });
  };

  // Helper: Status Badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "DISETUJUI":
        return "bg-green-100 text-green-700 border border-green-200";
      case "DITOLAK":
        return "bg-red-100 text-red-700 border border-red-200";
      case "MENUNGGU_KONFIRMASI":
      default:
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    }
  };

  const formatStatus = (status) => {
      if(status === 'MENUNGGU_KONFIRMASI') return 'Menunggu Konfirmasi';
      if(status === 'DISETUJUI') return 'Disetujui';
      if(status === 'DITOLAK') return 'Ditolak';
      return status;
  }

  return (
    <div className="flex bg-[#F0F4F0] min-h-screen font-sans">
      <AsideTendik />

      <main className="flex-1 bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] overflow-y-auto transition-all">
        <Topbar
          title="Pengajuan Cuti"
          subtitle="Kelola permohonan cuti dan izin kerja"
        />

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-6 p-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col md:flex-row items-end gap-4">
            <div className="w-full">
                <label className="text-xs font-bold text-gray-600 mb-2 block">Pilih Bulan</label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer">
                    <option>Semua Bulan</option>
                    <option>Januari</option>
                    <option>Februari</option>
                </select>
            </div>
            <div className="w-full">
                <label className="text-xs font-bold text-gray-600 mb-2 block">Tampilkan Status</label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer">
                    <option>Semua Status</option>
                    <option>Disetujui</option>
                    <option>Menunggu</option>
                    <option>Ditolak</option>
                </select>
            </div>
            <button className="bg-gradient-to-r from-[#0288D1] to-[#4FC3F7] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md flex items-center gap-2 transition-all h-[42px] whitespace-nowrap cursor-pointer hover:opacity-90">
                <FiFilter /> Tampilkan Data
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full lg:w-64 flex flex-col items-center justify-center gap-3 cursor-pointer hover:shadow-md transition-all group" onClick={() => setShowModal(true)}>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <FiPlus className="text-xl" />
            </div>
            <span className="font-bold text-sm text-gray-700">Ajukan Cuti Baru</span>
          </div>
        </div>

        {/* List Pengajuan Cuti */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 mx-8">
            <div className="flex items-center gap-3 mb-6">
                <FiClock className="text-xl text-green-800" />
                <h2 className="text-lg font-bold text-green-800">Riwayat Pengajuan Saya</h2>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <p className="text-center text-gray-500 py-10">Memuat data...</p>
                ) : leaveRequests.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">Belum ada pengajuan cuti.</p>
                ) : (
                    leaveRequests.map((item) => (
                    <div 
                        key={item.id} 
                        onClick={() => setSelectedLeave(item)} // KLIK UNTUK LIHAT DETAIL
                        className="bg-[#FAFAFA] border border-gray-100 p-6 rounded-xl hover:bg-white hover:shadow-md transition-all relative group cursor-pointer"
                    >
                        {/* Status Badge */}
                        <div className="absolute top-6 right-6">
                             <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(item.status)}`}>
                                {formatStatus(item.status)}
                            </span>
                        </div>

                        {/* Tanggal */}
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <FiCalendar className="text-green-600"/>
                            <span className="font-medium text-green-800">
                                {formatDate(item.tanggalMulai)} - {formatDate(item.tanggalSelesai)}
                            </span>
                        </div>

                        {/* Judul */}
                        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">
                            {item.judul}
                        </h3>

                        {/* Alasan (Truncated) */}
                        <p className="text-sm text-gray-600 line-clamp-2 max-w-2xl">
                            {item.alasan}
                        </p>

                        {/* Info Klik */}
                        <p className="text-xs text-blue-500 mt-3 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            Klik untuk melihat detail
                        </p>

                        {/* Tombol Hapus (Stop Propagation agar tidak buka modal) */}
                        {item.status === 'MENUNGGU_KONFIRMASI' && (
                            <div className="absolute bottom-6 right-6">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                    className="flex items-center gap-2 px-4 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer"
                                >
                                    <FiTrash2 /> Batalkan
                                </button>
                            </div>
                        )}
                    </div>
                )))}
            </div>
        </div>

      </main>

      {/* --- MODAL 1: DETAIL PENGAJUAN (READ ONLY) --- */}
      {selectedLeave && (
        <Modal
            title={
                <div className="flex items-center gap-2 text-green-800">
                    <FiInfo className="text-xl" />
                    <span className="font-bold text-lg">Detail Pengajuan</span>
                </div>
            }
            onClose={() => setSelectedLeave(null)}
        >
            <div className="space-y-6 text-left text-sm text-gray-700">
                {/* Header Status */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Status Pengajuan</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(selectedLeave.status)}`}>
                            {formatStatus(selectedLeave.status)}
                        </span>
                    </div>
                    {/* Jika ditolak, tampilkan alert merah */}
                    {selectedLeave.status === 'DITOLAK' && (
                        <div className="text-right">
                            <p className="text-xs text-red-500 font-bold uppercase mb-1">Ditolak Karena</p>
                            <p className="text-sm font-medium text-red-700 bg-red-50 px-3 py-1 rounded-lg border border-red-100">
                                {selectedLeave.alasanPenolakan || "Tidak ada alasan spesifik"}
                            </p>
                        </div>
                    )}
                </div>

                {/* Judul Cuti */}
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Jenis Cuti</label>
                    <p className="text-lg font-bold text-green-900 border-b border-dashed border-gray-200 pb-2">
                        {selectedLeave.judul}
                    </p>
                </div>

                {/* Tanggal */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Tanggal Mulai</label>
                        <p className="font-medium text-gray-800 flex items-center gap-2">
                            <FiCalendar className="text-green-600" /> {formatDate(selectedLeave.tanggalMulai)}
                        </p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Tanggal Selesai</label>
                        <p className="font-medium text-gray-800 flex items-center gap-2">
                            <FiCalendar className="text-green-600" /> {formatDate(selectedLeave.tanggalSelesai)}
                        </p>
                    </div>
                </div>

                {/* Alasan Lengkap */}
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Alasan Pengajuan</label>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="leading-relaxed whitespace-pre-wrap">
                            {selectedLeave.alasan}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        onClick={() => setSelectedLeave(null)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm font-bold transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </Modal>
      )}

      {/* --- MODAL 2: FORM PENGAJUAN BARU --- */}
      {showModal && (
        <Modal 
            title={
                <div className="flex items-center gap-2 text-green-800">
                    <FiFileText className="text-xl" />
                    <span className="font-bold text-lg">Formulir Pengajuan Cuti</span>
                </div>
            } 
            onClose={() => setShowModal(false)}
        >
            <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                
                {/* Jenis Cuti */}
                <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5 text-left">Jenis Cuti</label>
                    <div className="relative">
                        <select 
                            name="jenisCuti"
                            value={form.jenisCuti}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none transition appearance-none bg-white text-gray-700 cursor-pointer"
                            required
                        >
                            <option value="">-- Pilih Jenis Cuti --</option>
                            <option value="Cuti Tahunan">Cuti Tahunan</option>
                            <option value="Cuti Sakit">Cuti Sakit</option>
                            <option value="Cuti Menikah">Cuti Menikah</option>
                            <option value="Cuti Melahirkan">Cuti Melahirkan</option>
                            <option value="Cuti Penting/Mendesak">Cuti Penting/Mendesak</option>
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                {/* Tanggal */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1.5 text-left">Tanggal Mulai</label>
                        <input 
                            type="date" 
                            name="tanggalMulai"
                            value={form.tanggalMulai}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none transition text-gray-600"
                            required 
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1.5 text-left">Tanggal Selesai</label>
                        <input 
                            type="date" 
                            name="tanggalSelesai"
                            value={form.tanggalSelesai}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none transition text-gray-600"
                            required 
                        />
                    </div>
                </div>

                {/* Alasan */}
                <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5 text-left">Alasan Lengkap</label>
                    <textarea 
                        name="alasan"
                        value={form.alasan}
                        onChange={handleInputChange}
                        rows={3} 
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none transition placeholder-gray-400" 
                        placeholder="Contoh: Menghadiri acara pernikahan saudara kandung di luar kota." 
                        required
                    />
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end pt-4 gap-3">
                    <button 
                        type="submit" 
                        className="bg-[#43A047] hover:bg-[#2E7D32] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                    >
                        <FiSend className="text-sm" />
                        Kirim Pengajuan
                    </button>
                </div>

            </form>
        </Modal>
      )}

    </div>
  );
};

export default PengajuanCuti;