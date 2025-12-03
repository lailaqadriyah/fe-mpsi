import React, { useEffect, useState } from "react";
import AsideTendik from "../../components/AsideTendik";
import Topbar from "../../components/Topbar";
import { FiClock, FiLogIn, FiLogOut } from "react-icons/fi";
import Swal from "sweetalert2";

const AbsensiDigital = () => {
  const [now, setNow] = useState(new Date());
  const [status, setStatus] = useState("Belum Absen");
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper: Format Waktu (HH:mm:ss)
  const formatTime = (d) => {
    if (!d) return "--:--";
    const dateObj = new Date(d);
    if (isNaN(dateObj.getTime())) return "--:--";
    const hh = String(dateObj.getHours()).padStart(2, "0");
    const mm = String(dateObj.getMinutes()).padStart(2, "0");
    const ss = String(dateObj.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  };

  // Helper: Format Tanggal (DD MMMM YYYY)
  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Helper: Hitung Durasi
  const durationText = () => {
    if (!checkInTime || !checkOutTime) return "0 jam 0 menit";
    const start = new Date(checkInTime);
    const end = new Date(checkOutTime);
    const diff = Math.abs(end - start) / 1000; // seconds
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    return `${hours} jam ${minutes} menit`;
  };

  // 1. UPDATE JAM DIGITAL SETIAP DETIK
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // 🔥 LOGIKA BARU: Hanya boleh checkout jika jam >= 16
  const currentHour = now.getHours();
  const isCheckOutTime = currentHour >= 16; 
  
  // Syarat tombol aktif: Status harus "Dalam Shift" DAN Waktu sudah >= 16:00
  const canCheckOut = status === "Dalam Shift" && isCheckOutTime;

  // 2. FETCH DATA ABSENSI
  const fetchAttendanceData = async () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (!token || !user) return;

    try {
      const response = await fetch(`http://localhost:4000/api/attendance/history?userId=${user.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data);

        // Cek status hari ini
        const todayStr = new Date().toDateString();
        const todayAttendance = data.find(item => new Date(item.date).toDateString() === todayStr);

        if (todayAttendance) {
          setCheckInTime(todayAttendance.checkIn);
          setCheckOutTime(todayAttendance.checkOut);

          if (todayAttendance.checkOut) {
            setStatus("Hadir");
          } else {
            setStatus("Dalam Shift");
          }
        } else {
          setStatus("Belum Absen");
          setCheckInTime(null);
          setCheckOutTime(null);
        }
      }
    } catch (error) {
      console.error("Gagal mengambil data absensi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  // 3. HANDLER CHECK IN
  const handleCheckIn = async () => {
    const token = localStorage.getItem("token");
    
    const result = await Swal.fire({
      title: 'Konfirmasi Check In',
      text: "Anda akan memulai shift kerja hari ini.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Check In',
      confirmButtonColor: '#2E7D32'
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch("http://localhost:4000/api/attendance/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({}) 
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire("Berhasil", "Check In berhasil dicatat", "success");
        setCheckInTime(data.checkIn);
        setStatus("Dalam Shift");
        fetchAttendanceData();
      } else {
        Swal.fire("Gagal", data.message || "Gagal melakukan Check In", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Terjadi kesalahan koneksi", "error");
    }
  };

  // 4. HANDLER CHECK OUT
  const handleCheckOut = async () => {
    // Double check logic (walaupun tombol disabled, jaga-jaga)
    if (!isCheckOutTime) {
        Swal.fire("Belum Waktunya", "Anda baru bisa melakukan Check Out mulai pukul 16:00.", "warning");
        return;
    }

    const token = localStorage.getItem("token");

    const result = await Swal.fire({
      title: 'Konfirmasi Check Out',
      text: "Apakah Anda yakin ingin mengakhiri shift hari ini?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Check Out',
      confirmButtonColor: '#E65100'
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch("http://localhost:4000/api/attendance/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ note: "Selesai tepat waktu" })
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire("Berhasil", "Check Out berhasil dicatat", "success");
        setCheckOutTime(data.checkOut);
        setStatus("Hadir");
        fetchAttendanceData();
      } else {
        Swal.fire("Gagal", data.message || "Gagal melakukan Check Out", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Terjadi kesalahan koneksi", "error");
    }
  };

  const getStatusBadge = (checkoutTime) => {
    if (checkoutTime) return <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">Hadir</span>;
    return <span className="px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-700">Dalam Shift</span>;
  };

  return (
    <div className="flex bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] min-h-screen">

      <AsideTendik />

      <main className="flex-1">
        <Topbar title="Absensi Digital" />

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 mt-8 mx-8 border border-gray-100">
          <div className="text-center">
            {/* Jam Digital */}
            <h1 className="text-6xl font-bold bg-gradient-to-b from-[#1B5E20] to-[#43A047] bg-clip-text text-transparent tracking-widest mb-6">
              {formatTime(now)}
            </h1>

            {/* Status Box */}
            <div className="inline-block bg-gradient-to-b from-[#E8F5E9] to-[#C8E6C9] px-10 py-4 rounded-xl mb-8">
              <p className="text-[10px] font-bold text-[#2E7D32] tracking-widest uppercase mb-1">
                STATUS HARI INI
              </p>
              <h2 className="text-2xl font-bold text-[#1B5E20]">
                {status}
              </h2>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              {/* Tombol Check In */}
              <button 
                onClick={handleCheckIn} 
                disabled={status !== "Belum Absen"}
                className={`px-10 py-3 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 transition-all 
                  ${status === "Belum Absen" 
                    ? "bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] hover:opacity-90 text-white cursor-pointer" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              >
                <FiLogIn className="text-lg" />
                Check In
              </button>
              
              {/* Tombol Check Out (Logic Updated) */}
              <button 
                onClick={handleCheckOut} 
                disabled={!canCheckOut} // Hanya aktif jika Dalam Shift DAN jam >= 16:00
                title={!isCheckOutTime ? "Check Out dibuka mulai jam 16:00" : "Klik untuk mengakhiri shift"}
                className={`px-8 py-3 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 transition-all 
                  ${canCheckOut 
                    ? "bg-[#FFCC80] hover:bg-[#FFB74D] text-white cursor-pointer" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              >
                <FiLogOut className="text-lg" />
                Check Out
              </button>
            </div>

            {/* Pesan Info jika Dalam Shift tapi belum jam 16:00 */}
            {status === "Dalam Shift" && !isCheckOutTime && (
                <p className="text-xs text-orange-500 mt-4 font-medium animate-pulse">
                    * Tombol Check Out akan aktif pada pukul 16:00
                </p>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 mr-8 ml-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="inline-block p-3 rounded bg-green-50 text-green-700 mb-2"><FiClock /></div>
            <p className="text-xs text-gray-500">Waktu Check In</p>
            <p className="font-semibold">{formatTime(checkInTime)}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="inline-block p-3 rounded bg-green-50 text-green-700 mb-2"><FiClock /></div>
            <p className="text-xs text-gray-500">Waktu Check Out</p>
            <p className="font-semibold">{formatTime(checkOutTime)}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="inline-block p-3 rounded bg-green-50 text-green-700 mb-2"><FiClock /></div>
            <p className="text-xs text-gray-500">Durasi Kerja</p>
            <p className="font-semibold">{durationText()}</p>
          </div>
        </div>

        {/* Riwayat Absensi */}
        <div className="bg-white rounded-xl shadow p-6 mt-8 mr-8 ml-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-green-800 flex items-center gap-2">
              <FiClock className="text-green-700"/> Riwayat Absensi
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-green-50 text-left">
                <tr className="bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9] text-left text-green-800">
                  <th className="px-4 py-3">TANGGAL</th>
                  <th className="px-4 py-3">CHECK IN</th>
                  <th className="px-4 py-3">CHECK OUT</th>
                  <th className="px-4 py-3">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-4">Memuat data...</td></tr>
                ) : history.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-4">Belum ada riwayat absensi.</td></tr>
                ) : (
                  history.map((r, i) => (
                    <tr key={i} className="hover:bg-green-50">
                      <td className="px-4 py-3 text-left font-medium text-gray-700">{formatDate(r.date)}</td>
                      <td className="px-4 py-3 text-left">{formatTime(r.checkIn)}</td>
                      <td className="px-4 py-3 text-left">{formatTime(r.checkOut)}</td>
                      <td className="px-4 py-3 text-left">{getStatusBadge(r.checkOut)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AbsensiDigital;