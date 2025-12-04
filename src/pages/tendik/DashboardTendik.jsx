import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AsideTendik from "../../components/AsideTendik";
import Topbar from "../../components/Topbar";
import Modal from "../../components/Modal"; // Import Modal
import {
  FiClock,
  FiList,
  FiCheckCircle,
  FiCalendar,
  FiEye,
  FiInfo,
  FiUpload,
  FiLogIn,
  FiLogOut,
  FiActivity
} from "react-icons/fi";

const DashboardTendik = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showActivityModal, setShowActivityModal] = useState(false); // State untuk Modal Aktivitas
  
  const [data, setData] = useState({
    hariKehadiranBulanIni: 0,
    laporanDikirim: 0,
    tingkatPenyelesaian: 0,
    absensiHariIni: null,
    tugasSaya: [],
    aktivitasHariIni: []
  });

  // State untuk data aktivitas yang sudah difilter
  const [filteredActivities, setFilteredActivities] = useState([]);

  // --- HELPER FORMATTING ---
  const formatTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? "-" 
      : date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric"
    });
  };

  const mapActivityAction = (action) => {
    switch (action) {
      case "LOGIN": return "Masuk ke sistem (Login)";
      case "ATTENDANCE_CHECKIN": return "Melakukan Check In";
      case "ATTENDANCE_CHECKOUT": return "Melakukan Check Out";
      case "REPORT_CREATE": return "Mengirim Laporan Harian";
      case "TASK_UPDATE_STATUS": return "Memperbarui status tugas";
      case "CUTI_CREATE": return "Mengajukan Permohonan Cuti";
      default: return action.replace(/_/g, " ");
    }
  };

  const mapActivityIcon = (action) => {
    if (action.includes("LOGIN")) return <FiLogIn />;
    if (action.includes("CHECKIN")) return <FiClock />;
    if (action.includes("CHECKOUT")) return <FiLogOut />;
    if (action.includes("REPORT")) return <FiUpload />;
    return <FiList />;
  };

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:4000/api/users/dashboard", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
          const result = await response.json();
          setData(result);

          // FILTER AKTIVITAS: Hilangkan LOGIN dan ATTENDANCE_CHECKOUT (Logout/Checkout)
          const filtered = result.aktivitasHariIni.filter(a => 
            a.action !== "LOGIN" && a.action !== "ATTENDANCE_CHECKOUT"
          );
          setFilteredActivities(filtered);
        }
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const checkInTime = data.absensiHariIni?.checkIn;
  const checkOutTime = data.absensiHariIni?.checkOut;
  const todayDate = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="flex bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] min-h-screen">
      <AsideTendik />

      <main className="flex-1">
        <Topbar title="Dashboard Tenaga Kependidikan" />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
          <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-2xl text-green-700">
              <FiCheckCircle />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-green-800">
                {loading ? "..." : data.hariKehadiranBulanIni}
              </h3>
              <p className="text-sm text-gray-600">Hari Kehadiran Bulan Ini</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-2xl text-green-700">
              <FiFileTextIcon />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-green-800">
                {loading ? "..." : data.laporanDikirim}
              </h3>
              <p className="text-sm text-gray-600">Laporan Dikirim</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-2xl text-green-700">
              <FiActivityIcon />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-green-800">
                {loading ? "..." : `${data.tingkatPenyelesaian}%`}
              </h3>
              <p className="text-sm text-gray-600">Tingkat Penyelesaian</p>
            </div>
          </div>
        </div>

        {/* Absensi Hari Ini */}
        <div className="bg-white rounded-xl shadow p-6 mb-6 mt-8 mx-8">
          <div className="flex gap-3 mb-6">
            <FiClock className="text-xl text-green-800" />
            <h3 className="font-bold text-lg text-green-800">
              Absensi Hari Ini
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] border border-green-50 flex flex-col justify-center h-36 relative overflow-hidden">
              <p className="text-sm font-semibold text-gray-600 mb-1 text-left">
                Check In
              </p>
              <h4 className="text-4xl font-bold text-[#1B5E20] mb-1 text-left">
                {formatTime(checkInTime)}
              </h4>
              <p className="text-xs font-medium text-gray-600 text-left">
                {checkInTime ? formatDate(checkInTime) : todayDate}
              </p>
            </div>

            <div className="rounded-2xl p-6 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] border border-green-50 flex flex-col justify-center h-36 relative overflow-hidden">
              <p className="text-sm font-semibold text-gray-600 mb-1 text-left">
                Check Out
              </p>
              <h4 className="text-4xl font-bold text-[#1B5E20] mb-1 text-left">
                {formatTime(checkOutTime)}
              </h4>
              <p className="text-xs font-medium text-gray-600 text-left">
                {checkOutTime ? formatDate(checkOutTime) : todayDate}
              </p>
            </div>
          </div>
        </div>

        {/* Tugas Saya (Max 3) */}
        <div className="bg-white rounded-xl shadow p-6 mb-6 mt-8 mr-8 ml-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-green-900 flex items-center gap-3">
              <FiList className="text-xl" /> Tugas Saya
            </h3>
            {/* Navigasi Pindah Halaman */}
            <button 
              onClick={() => navigate("/tendik/daftarTugas")}
              className="bg-[#43A047] hover:bg-[#2E7D32] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <FiEye /> Lihat Semua
            </button>
          </div>

          <div className="space-y-4">
            {data.tugasSaya.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">Belum ada tugas yang diberikan.</p>
            ) : (
                data.tugasSaya.slice(0, 3).map((t, i) => (
                <div
                    key={i}
                    className="p-5 rounded-xl border border-gray-50 bg-[#FAFAFA] hover:bg-white hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                    <div className="space-y-2">
                    <h4 className="font-bold text-green-800 text-base text-left">
                        {t.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
                        <div className="flex items-center gap-1.5">
                        <FiCalendar className="text-gray-400 text-sm" />
                        <span>Deadline: {t.dueDate ? formatDate(t.dueDate) : "-"}</span>
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
                        t.status === "SELESAI"
                            ? "bg-[#C8E6C9] text-[#1B5E20]"
                            : t.status === "DALAM_PROGERSS"
                            ? "bg-[#BBDEFB] text-[#0D47A1]"
                            : "bg-[#FFE0B2] text-[#E65100]"
                        }`}
                    >
                        {t.status === "DALAM_PROGERSS" ? "ON PROGRESS" : t.status}
                    </span>
                    </div>
                </div>
                ))
            )}
          </div>
        </div>

        {/* Aktivitas Hari Ini (Max 3, dengan Modal untuk Lihat Semua) */}
        <div className="bg-white rounded-xl shadow p-6 mb-6 mt-8 mr-8 ml-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-green-900 flex items-center gap-2">
                <FiClock className="text-xl" /> Aktivitas Hari Ini
            </h3>
            {/* Tombol Lihat Semua memicu Pop-up */}
            <button 
              onClick={() => setShowActivityModal(true)}
              className="text-[#43A047] hover:text-[#2E7D32] hover:bg-green-50 px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              Lihat Semua <FiList />
            </button>
          </div>

          <ul className="space-y-0">
            {filteredActivities.length === 0 ? (
                <p className="text-gray-500 text-sm py-2 text-left">Belum ada aktivitas tercatat hari ini.</p>
            ) : (
                filteredActivities.slice(0, 3).map((a, i) => (
                <li
                    key={i}
                    className="flex items-start gap-4 py-4 border-b border-gray-50 last:border-0 last:pb-0 first:pt-0"
                >
                    <div className="w-10 h-10 rounded-lg bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] flex-shrink-0">
                        {mapActivityIcon(a.action)}
                    </div>
                    <div className="text-left">
                    <p className="text-sm text-gray-800 font-medium">
                        {mapActivityAction(a.action)}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {formatTime(a.createdAt)}
                    </p>
                    </div>
                </li>
                ))
            )}
          </ul>
        </div>

        {/* MODAL SEMUA AKTIVITAS */}
        {showActivityModal && (
            <Modal 
                title={
                    <div className="flex items-center gap-2 text-green-800">
                        <FiActivity /> <span>Semua Aktivitas Hari Ini</span>
                    </div>
                }
                onClose={() => setShowActivityModal(false)}
            >
                <div className="max-h-[60vh] overflow-y-auto pr-2">
                    {filteredActivities.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">Tidak ada aktivitas.</p>
                    ) : (
                        <ul className="space-y-0">
                            {filteredActivities.map((a, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] flex-shrink-0">
                                        {mapActivityIcon(a.action)}
                                    </div>
                                    <div className="text-left flex-1">
                                        <p className="text-sm text-gray-800 font-medium">
                                            {mapActivityAction(a.action)}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {formatTime(a.createdAt)}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-100 mt-2">
                    
                </div>
            </Modal>
        )}

      </main>
    </div>
  );
};

// Helper components untuk icon
const FiFileTextIcon = () => (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);
const FiActivityIcon = () => (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);

export default DashboardTendik;