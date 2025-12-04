import React, { useState } from "react";
import AsideTendik from "../../components/AsideTendik";
import Topbar from "../../components/Topbar";
import { FiTrash2, FiPlus, FiFilter, FiCalendar, FiFileText, FiSend } from "react-icons/fi";
import Modal from "../../components/Modal";

const PengajuanCuti = () => {
  const [showModal, setShowModal] = useState(false);
  
  // State form pengajuan
  const [form, setForm] = useState({
    jenisCuti: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    alasan: "",
    dokumen: null
  });

  // Dummy Data Pengajuan Cuti
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      date: "14 November 2025",
      type: "Cuti Sakit",
      status: "Menunggu konfirmasi",
      description: "Tidak dapat bekerja karena kondisi kesehatan dan membutuhkan waktu pemulihan",
    },
    {
      id: 2,
      date: "13 November 2025",
      type: "Cuti Tahunan",
      status: "Ditolak",
      description: "Mengajukan cuti tahunan untuk pemanfaatan hak cuti berkala",
      reason: "Sudah ada yang mengajukan cuti tahunan di waktu yang sama dari divisi HRD",
    },
    {
      id: 3,
      date: "12 November 2025",
      type: "Cuti Menikah",
      status: "Disetujui",
      description: "Mengajukan cuti menikah untuk pelaksanaan rangkaian acara pernikahan",
    },
  ]);

  // Helper untuk warna badge status
  const getStatusBadge = (status) => {
    switch (status) {
      case "Disetujui":
        return "bg-green-100 text-green-700";
      case "Ditolak":
        return "bg-red-100 text-red-700";
      case "Menunggu konfirmasi":
        return "bg-gray-200 text-gray-600"; // Abu-abu sesuai gambar
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, dokumen: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logika simpan data bisa ditambahkan di sini
    console.log("Mengajukan cuti:", form);
    
    // Reset form dan tutup modal
    setForm({ jenisCuti: "", tanggalMulai: "", tanggalSelesai: "", alasan: "", dokumen: null });
    setShowModal(false);
  };

  return (
    <div className="flex bg-[#F0F4F0] min-h-screen font-sans">
      {/* Sidebar */}
      <AsideTendik />

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] overflow-y-auto transition-all">
        <Topbar
          title="Pengajuan Cuti"
          subtitle="Kelola permohonan cuti dan izin kerja"
        />

        {/* Header Section: Filter & Add Button */}
        <div className="flex flex-col lg:flex-row gap-6 p-8 ">
          
          {/* Filter Card */}
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

            <button className="bg-gradient-to-r from-[#0288D1] to-[#4FC3F7] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md flex items-center gap-2 transition-all h-[42px] whitespace-nowrap">
                <FiFilter /> Tampilkan Data
            </button>
          </div>

          {/* Add Button Card */}
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
                <svg className="w-6 h-6 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h2 className="text-lg font-bold text-green-800">Daftar Pengajuan Cuti</h2>
            </div>

            <div className="space-y-4 ">
                {leaveRequests.map((item) => (
                    <div key={item.id} className="bg-[#FAFAFA] border border-gray-50 p-6 rounded-xl hover:bg-white hover:shadow-sm transition-all relative group">
                        
                        {/* Tanggal */}
                        <p className="text-sm font-bold text-green-800 mb-2">{item.date}</p>

                        {/* Jenis & Status */}
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-base font-bold text-gray-800">{item.type}</h3>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getStatusBadge(item.status)}`}>
                                {item.status}
                            </span>
                        </div>

                        {/* Deskripsi */}
                        <p className="text-sm text-gray-500 mb-2 leading-relaxed">
                            {item.description}
                        </p>

                        {/* Alasan Penolakan (Jika ada) */}
                        {item.reason && (
                            <div className="mt-3 bg-red-50 p-3 rounded-lg border border-red-100">
                                <p className="text-xs font-bold text-gray-700 mb-1">Alasan</p>
                                <p className="text-xs text-gray-600">{item.reason}</p>
                            </div>
                        )}

                        {/* Tombol Hapus (Kanan Bawah) */}
                        <div className="flex justify-end mt-4">
                            <button className="flex items-center gap-2 px-4 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">
                                <FiTrash2 /> Hapus
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </div>

      </main>

      {/* --- MODAL FORM PENGAJUAN CUTI (BARU) --- */}
      {showModal && (
        <Modal 
            title={
                <div className="flex items-center gap-2 text-green-800">
                    <FiFileText className="text-xl" />
                    <span className="font-bold text-lg">Ajukan Cuti</span>
                </div>
            } 
            onClose={() => setShowModal(false)}
        >
            <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                
                {/* Jenis Cuti */}
                <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">Jenis Cuti</label>
                    <div className="relative">
                        <select 
                            name="jenisCuti"
                            value={form.jenisCuti}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none transition appearance-none bg-white text-gray-700 cursor-pointer"
                            required
                        >
                            <option value="">Pilih Jenis Cuti</option>
                            <option value="Cuti Tahunan">Cuti Tahunan</option>
                            <option value="Cuti Sakit">Cuti Sakit</option>
                            <option value="Cuti Menikah">Cuti Menikah</option>
                            <option value="Cuti Melahirkan">Cuti Melahirkan</option>
                            <option value="Cuti Penting">Cuti Penting</option>
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                {/* Tanggal Mulai & Selesai */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1.5">Tanggal Mulai</label>
                        <div className="relative">
                            <input 
                                type="date" 
                                name="tanggalMulai"
                                value={form.tanggalMulai}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none transition text-gray-600"
                                required 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1.5">Tanggal Selesai</label>
                        <div className="relative">
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
                </div>

                {/* Alasan Cuti */}
                <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">Alasan Cuti</label>
                    <textarea 
                        name="alasan"
                        value={form.alasan}
                        onChange={handleInputChange}
                        rows={3} 
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none transition placeholder-gray-400" 
                        placeholder="Jelaskan alasan pengajuan cuti..." 
                        required
                    />
                </div>

                {/* Upload Dokumen */}
                <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">Dokumen Pendukung (Opsional)</label>
                    <div className="mt-1 border border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors relative">
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-xs font-bold text-gray-500">
                            {form.dokumen ? form.dokumen.name : "Klik untuk upload surat dokter / dokumen lain"}
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end pt-4 gap-3">
                    
                    <button 
                        type="submit" 
                        className="bg-[#43A047] hover:bg-[#2E7D32] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md flex items-center gap-2 transition-all active:scale-95"
                    >
                        <FiSend className="text-sm" />
                        Ajukan Cuti
                    </button>
                </div>

            </form>
        </Modal>
      )}

    </div>
  );
};

export default PengajuanCuti;