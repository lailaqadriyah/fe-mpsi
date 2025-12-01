import React, { useEffect, useState } from "react";
import AsideTendik from "../../components/AsideTendik";
import Topbar from "../../components/Topbar";
import { FiClock, FiLogIn, FiLogOut } from "react-icons/fi";

const AbsensiDigital = () => {
  const [now, setNow] = useState(new Date());
  const [status, setStatus] = useState("Belum Absen");
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (d) => {
    if (!d) return "--:--";
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  };

  const handleCheckIn = () => {
    const t = new Date();
    setCheckInTime(t);
    setStatus("Dalam Shift");
  };

  const handleCheckOut = () => {
    const t = new Date();
    setCheckOutTime(t);
    setStatus("Hadir");
  };

  const durationText = () => {
    if (!checkInTime || !checkOutTime) return "0 jam";
    const diff = Math.abs(checkOutTime - checkInTime) / 1000; // seconds
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    return `${hours} jam ${minutes} menit`;
  };

  const history = [
    { tanggal: "14 November 2025", in: "08:10", out: "17:05", durasi: "8 jam 55 menit", status: "Hadir" },
    { tanggal: "13 November 2025", in: "08:20", out: "17:00", durasi: "8 jam 40 menit", status: "Terlambat" },
    { tanggal: "12 November 2025", in: "08:05", out: "17:10", durasi: "9 jam 5 menit", status: "Hadir" },
    { tanggal: "11 November 2025", in: "08:00", out: "17:00", durasi: "9 jam", status: "Hadir" },
    { tanggal: "10 November 2025", in: "-", out: "-", durasi: "-", status: "Tidak Hadir" },
  ];

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
            <button 
                onClick={handleCheckIn} 
                className="bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] hover:opacity-90 text-white px-10 py-3 rounded-xl font-bold text-sm shadow-[0_8px_25px_rgba(46,125,50,0.4)] transition-all flex items-center gap-2"
            >
                <FiLogIn className="text-lg" />
                Check In
            </button>
            
            <button 
                onClick={handleCheckOut} 
                className="bg-[#FFCC80] hover:bg-[#FFB74D] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
                <FiLogOut className="text-lg" />
                Check Out
            </button>
        </div>
    </div>
</div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 mr-8 ml-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="inline-block p-3 rounded bg-green-50 text-green-700 mb-2"><FiClock /></div>
            <p className="text-xs text-gray-500">Waktu Check In</p>
            <p className="font-semibold">{checkInTime ? formatTime(checkInTime) : "--:--"}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="inline-block p-3 rounded bg-green-50 text-green-700 mb-2"><FiClock /></div>
            <p className="text-xs text-gray-500">Waktu Check Out</p>
            <p className="font-semibold">{checkOutTime ? formatTime(checkOutTime) : "--:--"}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="inline-block p-3 rounded bg-green-50 text-green-700 mb-2"><FiClock /></div>
            <p className="text-xs text-gray-500">Durasi Kerja</p>
            <p className="font-semibold">{durationText()}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mt-8 mr-8 ml-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-green-800 flex items-center gap-2"><FiClock className="text-green-700"/> Riwayat Absensi</h3>
            <select className="border border-gray-50 bg-gray px-3 py-1 rounded text-sm">
              <option>November 2025</option>
              <option>October 2025</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-green-50 text-left">
                <tr className="bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9] text-left text-green-800">
                  <th className="px-4 py-3">TANGGAL</th>
                  <th className="px-4 py-3">CHECK IN</th>
                  <th className="px-4 py-3">CHECK OUT</th>
                  <th className="px-4 py-3">DURASI</th>
                  <th className="px-4 py-3">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {history.map((r, i) => (
                  <tr key={i} className="hover:bg-green-50">
                    <td className="px-4 py-3 text-left">{r.tanggal}</td>
                    <td className="px-4 py-3 text-left">{r.in}</td>
                    <td className="px-4 py-3 text-left">{r.out}</td>
                    <td className="px-4 py-3 text-left">{r.durasi}</td>
                    <td className="px-4 py-3 text-left"><span className={`px-3 py-1 rounded-full text-xs ${r.status === 'Hadir' ? 'bg-green-100 text-green-700' : r.status === 'Terlambat' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AbsensiDigital;
