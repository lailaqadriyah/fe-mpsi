import React, { useState, useEffect } from "react";
import Aside from "../../components/Aside";
import Topbar from "../../components/Topbar";
import { FiCalendar, FiSave, FiList, FiKey, FiShield } from "react-icons/fi";
import Swal from "sweetalert2";

const Settings = () => {
  // --- STATE PENGATURAN SISTEM (Disimpan di LocalStorage) ---
  const [attendanceConfig, setAttendanceConfig] = useState({
    ruleType: "Waktu Normal",
    tolerance: 15,
  });

  const [reportConfig, setReportConfig] = useState({
    isRequired: true,
    deadlineTime: "17:30",
  });

  // --- STATE GANTI PASSWORD ---
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedAttendance = localStorage.getItem("attendanceConfig");
    const savedReport = localStorage.getItem("reportConfig");

    if (savedAttendance) setAttendanceConfig(JSON.parse(savedAttendance));
    if (savedReport) setReportConfig(JSON.parse(savedReport));
  }, []);

  // --- HANDLER: SIMPAN PENGATURAN ABSENSI ---
  const saveAttendanceSettings = () => {
    localStorage.setItem("attendanceConfig", JSON.stringify(attendanceConfig));
    Swal.fire({
      icon: "success",
      title: "Tersimpan",
      text: "Pengaturan absensi berhasil diperbarui (Lokal).",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // --- HANDLER: SIMPAN PENGATURAN LAPORAN ---
  const saveReportSettings = () => {
    localStorage.setItem("reportConfig", JSON.stringify(reportConfig));
    Swal.fire({
      icon: "success",
      title: "Tersimpan",
      text: "Pengaturan laporan berhasil diperbarui (Lokal).",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // --- HANDLER: GANTI PASSWORD (INTEGRASI BACKEND) ---
  const handleChangePassword = async (e) => {
    e.preventDefault(); // Mencegah reload form
    const token = localStorage.getItem("token");

    if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
      Swal.fire("Peringatan", "Mohon lengkapi semua field password.", "warning");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      Swal.fire("Gagal", "Konfirmasi password baru tidak cocok.", "error");
      return;
    }

    if (passwords.newPassword.length < 6) {
      Swal.fire("Gagal", "Password baru minimal 6 karakter.", "warning");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire("Berhasil", "Password admin berhasil diubah.", "success");
        setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        Swal.fire("Gagal", result.message || "Gagal mengubah password.", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Terjadi kesalahan koneksi ke server.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] min-h-screen font-sans">
      <Aside />

      <main className="flex-1">
        <Topbar
          title="Pengaturan Sistem"
          subtitle="Konfigurasi parameter dan aturan sistem manajemen SDM"
        />

        <div className="space-y-6 mt-8 mb-8 ml-8 mr-8 md:ml-24 md:mr-24">
          
          {/* 1. ATURAN ABSENSI */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
              <FiCalendar className="text-2xl text-green-700" />
              <h2 className="text-xl font-bold text-green-800">
                Aturan Absensi
              </h2>
            </div>

            <div className="space-y-8">
              {/* Jadwal Kerja Default */}
              <div>
                <h3 className="text-base font-bold text-green-700 mb-1">
                  Jadwal Kerja Default
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Tentukan aturan standar untuk menghitung keterlambatan.
                </p>

                <div className="mb-2">
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">
                    Aturan Standar
                  </label>
                  <div className="relative max-w-md">
                    <select
                      value={attendanceConfig.ruleType}
                      onChange={(e) => setAttendanceConfig({ ...attendanceConfig, ruleType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none appearance-none bg-white text-gray-700 cursor-pointer"
                    >
                      <option>Waktu Normal</option>
                      <option>Waktu Fleksibel</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Toleransi Keterlambatan */}
              <div>
                <h3 className="text-base font-bold text-green-700 mb-1">
                  Toleransi Keterlambatan
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Berapa menit batas maksimal keterlambatan yang masih ditolerir.
                </p>

                <div className="mb-2">
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">
                    Batas Toleransi (Menit)
                  </label>
                  <input
                    type="number"
                    value={attendanceConfig.tolerance}
                    onChange={(e) => setAttendanceConfig({ ...attendanceConfig, tolerance: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-700 placeholder-gray-400 max-w-md"
                  />
                </div>

                <button 
                  onClick={saveAttendanceSettings}
                  className="mt-3 bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] hover:bg-[#2E7D32] text-white px-5 py-2 rounded-lg font-bold text-xs shadow-sm flex items-center gap-2 transition-all"
                >
                  <FiSave className="text-sm" />
                  Simpan Aturan Absensi
                </button>
              </div>
            </div>
          </section>

          {/* 2. PENGATURAN TUGAS & LAPORAN */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
              <FiList className="text-2xl text-green-700" />
              <h2 className="text-xl font-bold text-green-800">
                Pengaturan Tugas & Laporan
              </h2>
            </div>

            <div className="space-y-8">
              {/* Wajib Lapor Harian */}
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-base font-bold text-green-700 mb-1">
                      Wajib Lapor Harian
                    </h3>
                    <p className="text-xs text-gray-500 max-w-md">
                      Aktifkan jika karyawan wajib mengirimkan laporan harian melalui sistem.
                    </p>
                  </div>

                  {/* Toggle Switch */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                      {reportConfig.isRequired ? "Wajib" : "Tidak Wajib"}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reportConfig.isRequired}
                        onChange={(e) => setReportConfig({ ...reportConfig, isRequired: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#43A047]"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-200"></div>

              {/* Batas Waktu Laporan */}
              <div>
                <h3 className="text-base font-bold text-green-700 mb-1">
                  Batas Waktu Laporan
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Batas jam terakhir pengiriman laporan harian per hari kerja.
                </p>

                <div className="mb-2">
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">
                    Jam Batas Akhir Kirim Laporan
                  </label>
                  <input
                    type="time"
                    value={reportConfig.deadlineTime}
                    onChange={(e) => setReportConfig({ ...reportConfig, deadlineTime: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-700 cursor-pointer max-w-md"
                  />
                </div>

                <button 
                  onClick={saveReportSettings}
                  className="mt-3 bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] hover:bg-[#2E7D32] text-white px-5 py-2 rounded-lg font-bold text-xs shadow-sm flex items-center gap-2 transition-all"
                >
                  <FiSave className="text-sm" />
                  Simpan Pengaturan Laporan
                </button>
              </div>
            </div>
          </section>

          {/* 3. KEAMANAN & AKUN (INTEGRASI BACKEND) */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
              <FiShield className="text-2xl text-green-700" />
              <h2 className="text-xl font-bold text-green-800">
                Keamanan & Akun
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-green-700 mb-4">
                  Ubah Password Admin
                </h3>

                <div className="space-y-4 max-w-3xl">
                  {/* Password Lama */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">
                      Password Lama
                    </label>
                    <input
                      type="password"
                      value={passwords.oldPassword}
                      onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                      placeholder="Masukkan password saat ini"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-700 placeholder-gray-400"
                    />
                  </div>

                  {/* Password Baru */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                      placeholder="Masukkan password baru"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-700 placeholder-gray-400"
                    />
                  </div>

                  {/* Konfirmasi Password */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">
                      Konfirmasi Password Baru
                    </label>
                    <input
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                      placeholder="Ulangi password baru"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-700 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button 
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] hover:bg-[#2E7D32] text-white px-5 py-2.5 rounded-lg font-bold text-xs shadow-sm flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <FiKey className="text-sm" />
                    {loading ? "Menyimpan..." : "Ubah Password"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Settings;