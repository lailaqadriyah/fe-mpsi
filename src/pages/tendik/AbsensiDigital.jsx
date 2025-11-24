import React, { useEffect, useState } from "react";
import AsideTendik from "../../components/AsideTendik";
import Topbar from "../../components/Topbar";
import { FiClock } from "react-icons/fi";

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
    <div className="flex bg-[#f3fff5] min-h-screen">

      <AsideTendik />

      <main className="flex-1 p-8">
        <Topbar title="Absensi Digital" />

        <div className="bg-white rounded-xl shadow p-8 mb-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-green-800">{formatTime(now)}</h1>
            <div className="mt-4 inline-block px-4 py-2 rounded-full bg-green-50 text-green-700 font-semibold">Status Hari Ini<br/>{status}</div>
            <div className="mt-6 flex justify-center gap-4">
              <button onClick={handleCheckIn} className="px-6 py-2 rounded-full bg-green-600 text-white">Check In</button>
              <button onClick={handleCheckOut} className="px-6 py-2 rounded-full bg-orange-100 text-orange-700">Check Out</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-green-800 flex items-center gap-2"><FiClock className="text-green-700"/> Riwayat Absensi</h3>
            <select className="border px-3 py-1 rounded text-sm">
              <option>November 2025</option>
              <option>October 2025</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-green-50 text-left">
                <tr className="text-green-800 font-semibold">
                  <th className="px-4 py-3">TANGGAL</th>
                  <th className="px-4 py-3">CHECK IN</th>
                  <th className="px-4 py-3">CHECK OUT</th>
                  <th className="px-4 py-3">DURASI</th>
                  <th className="px-4 py-3">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {history.map((r, i) => (
                  <tr key={i} className="border-t hover:bg-green-50">
                    <td className="px-4 py-3">{r.tanggal}</td>
                    <td className="px-4 py-3">{r.in}</td>
                    <td className="px-4 py-3">{r.out}</td>
                    <td className="px-4 py-3">{r.durasi}</td>
                    <td className="px-4 py-3"><span className={`px-3 py-1 rounded-full text-xs ${r.status === 'Hadir' ? 'bg-green-100 text-green-700' : r.status === 'Terlambat' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{r.status}</span></td>
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
