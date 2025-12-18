import React, { useState, useEffect } from "react";
import Aside from "../../components/Aside";
import Topbar from "../../components/Topbar";
import { FiCalendar, FiSave, FiList, FiKey, FiShield } from "react-icons/fi";
import Swal from "sweetalert2";

const Settings = () => {
  // --- STATE PENGATURAN SISTEM (Integrasi Backend) ---
  const [attendanceConfig, setAttendanceConfig] = useState({
    ruleType: "Waktu Normal",
    startWorkTime: "08:00", // Default UI
    tolerance: 15,
  });

  // State Laporan (Masih LocalStorage karena belum ada API khusus, opsional bisa dibuatkan)
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

  // --- LOAD SETTINGS FROM BACKEND & LOCAL STORAGE ---
  useEffect(() => {
    const fetchSettings = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:4000/api/settings", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          // Format jam dari {startHour: 8, startMinute: 0} ke "08:00" untuk input type="time"
          const hh = String(data.startHour).padStart(2, '0');
          const mm = String(data.startMinute).padStart(2, '0');

          setAttendanceConfig(prev => ({
            ...prev,
            startWorkTime: `${hh}:${mm}`,
            tolerance: data.tolerance
          }));
        }
      } catch (error) {
        console.error("Gagal mengambil pengaturan:", error);
      }
    };

    fetchSettings();

    // Load report config from local storage (karena belum ada API-nya)
    const savedReport = localStorage.getItem("reportConfig");
    if (savedReport) setReportConfig(JSON.parse(savedReport));
  }, []);

  // --- HANDLER: SIMPAN PENGATURAN ABSENSI (KE BACKEND) ---
  const saveAttendanceSettings = async () => {
    const token = localStorage.getItem("token");

    // Pecah string "08:00" menjadi jam dan menit
    const [h, m] = attendanceConfig.startWorkTime.split(':');

    try {
      const response = await fetch("http://localhost:4000/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          startHour: parseInt(h),
          startMinute: parseInt(m),
          tolerance: parseInt(attendanceConfig.tolerance)
        })
      });

      if (response.ok) {
        Swal.fire("Berhasil", "Pengaturan absensi tersimpan di Server.", "success");
      } else {
        Swal.fire("Gagal", "Gagal menyimpan pengaturan", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Koneksi error", "error");
    }
  };

  // --- HANDLER: SIMPAN PENGATURAN LAPORAN (LOCAL STORAGE) ---
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
    e.preventDefault();
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
                  Tentukan aturan standar untuk jam masuk kerja.
                </p>

                <div className="mb-2">
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">
                    Jam Masuk Kerja
                  </label>
                  <input
                    type="time"
                    value={attendanceConfig.startWorkTime}
                    onChange={(e) => setAttendanceConfig({ ...attendanceConfig, startWorkTime: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-700 cursor-pointer max-w-md"
                  />
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
                  className="mt-3 bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] hover:bg-[#2E7D32] text-white px-5 py-2 rounded-lg font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  <FiSave className="text-sm" />
                  Simpan Aturan Absensi
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