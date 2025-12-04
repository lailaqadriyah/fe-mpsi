import React, { useState, useEffect } from "react";
import Aside from "../../components/Aside";
import Topbar from "../../components/Topbar";
import Modal from "../../components/Modal"; // Pastikan import Modal
import { FiEye, FiFilter, FiRefreshCw, FiClock, FiCalendar, FiUser } from "react-icons/fi";
import Swal from "sweetalert2";

const Absensi = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Modal Detail
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  // State untuk Filter
  const [filterMonth, setFilterMonth] = useState("");
  const [filterName, setFilterName] = useState("");

  // --- 1. FETCH DATA ABSENSI ---
  const fetchAbsensi = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:4000/api/attendance/history", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAttendanceData(data);
      } else {
        console.error("Gagal mengambil data absensi");
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbsensi();
  }, []);

  // --- HELPER FORMATTING ---
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric"
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "--:--";
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit", minute: "2-digit"
    });
  };

  const getInitials = (name) => {
    return name ? name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() : "US";
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return "-";
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diff = Math.abs(endTime - startTime) / 1000; // detik
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    return `${hours} Jam ${minutes} Menit`;
  };

  const determineStatus = (record) => {
    if (record.statusAbsen) return record.statusAbsen; 

    const checkInTime = new Date(record.checkIn);
    const hour = checkInTime.getHours();
    const minute = checkInTime.getMinutes();

    if (hour > 8 || (hour === 8 && minute > 30)) {
        return "TERLAMBAT";
    }
    return "HADIR_TEPAT_WAKTU";
  };

  // --- FILTERING LOGIC ---
  const filteredData = attendanceData.filter((item) => {
    const matchName = filterName === "" || (item.user?.name && item.user.name.toLowerCase().includes(filterName.toLowerCase()));
    const itemDate = new Date(item.date);
    const currentMonth = itemDate.getMonth() + 1; 
    const matchMonth = filterMonth === "" || currentMonth.toString() === filterMonth;
    return matchName && matchMonth;
  });

  return (
    <div className="flex bg-gradient-to-b from-[#ddf5df] via-[#E8F5E9] to-[#DCEDC8] min-h-screen font-sans">

      {/* Sidebar */}
      <Aside />

      {/* Main */}
      <main className="flex-1 bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] overflow-y-auto transition-all">

        <Topbar title="Data Absensi Karyawan" subtitle="Rekapitulasi kehadiran tenaga kependidikan" />

        {/* Filter pill */}
       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 mt-8 ml-8 mr-8">
          <div className="flex flex-col md:flex-row items-end gap-6">
            
            {/* Cari Karyawan */}
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-gray-600 mb-2 text-left">Cari Karyawan</label>
              <input 
                type="text"
                placeholder="Ketik nama..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm bg-gray-50 text-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* Pilih Bulan */}
            <div className="w-full md:w-48">
              <label className="block text-sm font-bold text-gray-600 mb-2 text-left">Pilih Bulan</label>
              <select 
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm bg-gray-50 text-gray-700 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer appearance-none"
              >
                <option value="">Semua Bulan</option>
                <option value="1">Januari</option>
                <option value="2">Februari</option>
                <option value="3">Maret</option>
                <option value="4">April</option>
                <option value="5">Mei</option>
                <option value="6">Juni</option>
                <option value="7">Juli</option>
                <option value="8">Agustus</option>
                <option value="9">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>
            </div>

            {/* Tombol Refresh */}
            <div className="flex-none">
              <button 
                onClick={fetchAbsensi}
                className="bg-gradient-to-r from-[#0288D1] to-[#4FC3F7] hover:shadow-lg hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center gap-2 transition-all w-full md:w-auto justify-center h-[46px]"
              >
                <FiRefreshCw className={`text-lg ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>

          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl shadow p-6 ml-16 mr-16 mb-8">
          <h2 className="font-bold text-[#1B5E20] mb-4 text-left">Riwayat Absensi Lengkap</h2>

          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9] text-left text-[#1B5E20]">
                  <th className="px-4 py-3">TANGGAL</th>
                  <th className="px-4 py-3">NAMA KARYAWAN</th>
                  <th className="px-4 py-3">CHECK IN</th>
                  <th className="px-4 py-3">CHECK OUT</th>
                  <th className="px-4 py-3">STATUS</th>
                  <th className="px-4 py-3">DETAIL</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                    <tr>
                        <td colSpan="6" className="text-center py-8 text-gray-500">Memuat data...</td>
                    </tr>
                ) : filteredData.length === 0 ? (
                    <tr>
                        <td colSpan="6" className="text-center py-8 text-gray-500">Belum ada data absensi.</td>
                    </tr>
                ) : (
                    filteredData.map((r, i) => (
                    <tr key={i} className="hover:bg-green-50 border-b border-gray-50 last:border-0">
                        <td className="px-4 py-3 text-left">{formatDate(r.date)}</td>
                        <td className="px-4 py-3 font-semibold text-gray-700 text-left">
                            {r.user?.name || "Unknown"} <br/>
                            <span className="text-[10px] text-gray-400 font-normal">{r.user?.email}</span>
                        </td>
                        <td className="px-4 py-3 text-left font-mono text-gray-600">{formatTime(r.checkIn)}</td>
                        <td className="px-4 py-3 text-left font-mono text-gray-600">
                            {r.checkOut ? formatTime(r.checkOut) : <span className="text-orange-400 italic text-xs">--:--</span>}
                        </td>
                        <td className="px-4 py-3 text-left">
                            <StatusBadge status={determineStatus(r)} checkOut={r.checkOut} />
                        </td>
                        <td className="px-4 py-3 text-left">
                            <button 
                                onClick={() => setSelectedAttendance(r)}
                                className="bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] text-[#1976D2] hover:shadow-md hover:opacity-90 px-6 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 mx-auto text-left cursor-pointer"
                            >
                                <FiEye className="text-sm" /> Lihat
                            </button>
                        </td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- MODAL DETAIL ABSENSI --- */}
        {selectedAttendance && (
            <Modal
                title={
                    <div className="flex items-center gap-2 text-green-800">
                        <FiCalendar className="text-xl" />
                        <span className="font-bold text-lg">Detail Absensi Karyawan</span>
                    </div>
                }
                onClose={() => setSelectedAttendance(null)}
            >
                <div className="space-y-6 text-left text-sm text-gray-700">
                    
                    {/* Header User Info */}
                    <div className="flex items-center gap-4 bg-green-50 p-4 rounded-xl border border-green-100">
                        <div className="w-14 h-14 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                            {getInitials(selectedAttendance.user?.name)}
                        </div>
                        <div>
                            <p className="text-lg font-bold text-gray-900">{selectedAttendance.user?.name}</p>
                            <p className="text-xs text-gray-600">{selectedAttendance.user?.email}</p>
                        </div>
                    </div>

                    {/* Detail Grid */}
                    <div className="grid grid-cols-1 gap-y-4">
                        
                        <div className="pb-2 border-b border-dashed border-gray-200">
                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Tanggal</p>
                            <p className="font-medium text-gray-800 flex items-center gap-2">
                                <FiCalendar className="text-green-600" /> {formatDate(selectedAttendance.date)}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pb-2 border-b border-dashed border-gray-200">
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Check In</p>
                                <p className="font-mono font-bold text-lg text-green-800">
                                    {formatTime(selectedAttendance.checkIn)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Check Out</p>
                                <p className="font-mono font-bold text-lg text-red-800">
                                    {formatTime(selectedAttendance.checkOut)}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pb-2 border-b border-dashed border-gray-200">
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Durasi Kerja</p>
                                <p className="font-medium text-gray-800">
                                    {calculateDuration(selectedAttendance.checkIn, selectedAttendance.checkOut)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase mb-2">Status</p>
                                <StatusBadge status={determineStatus(selectedAttendance)} checkOut={selectedAttendance.checkOut} />
                            </div>
                        </div>

                        {/* Catatan (Jika Ada) */}
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Catatan</p>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-gray-600 italic">
                                {selectedAttendance.note || "Tidak ada catatan."}
                            </div>
                        </div>

                    </div>

                    {/* Footer Close */}
                    <div className="flex justify-end pt-2">
                        <button 
                            onClick={() => setSelectedAttendance(null)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer"
                        >
                            Tutup
                        </button>
                    </div>

                </div>
            </Modal>
        )}

      </main>
    </div>
  );
};

export default Absensi;

/* Helpers & Components */
const StatusBadge = ({ status, checkOut }) => {
  let label = status;
  let cls = "bg-gray-100 text-gray-600";

  // Mapping status
  if (status === "HADIR_TEPAT_WAKTU") {
      label = "Hadir Tepat Waktu";
      cls = "bg-gradient-to-r from-[#C8E6C9] to-[#A5D6A7] text-[#1B5E20]";
  } else if (status === "TERLAMBAT") {
      label = "Terlambat";
      cls = "bg-gradient-to-r from-[#FFCDD2] to-[#EF9A9A] text-[#C62828]";
  } else if (status === "ABSEN") {
      label = "Absen";
      cls = "bg-gray-200 text-gray-500";
  }

  // Jika belum checkout, timpa tampilan
  if (!checkOut && status !== "ABSEN") {
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">Dalam Shift</span>;
  }

  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
};