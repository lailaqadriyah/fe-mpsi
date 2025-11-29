import React from "react";
import Aside from "../../components/Aside";
import Topbar from "../../components/Topbar";
import { FiCalendar, FiSave, FiList, FiKey, FiShield  } from "react-icons/fi";

const Settings = () => {
  return (
    <div className="flex bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] min-h-screen font-sans">
      <Aside />

      <main className="flex-1">
        <Topbar
          title="Pengaturan Sistem"
          subtitle="Konfigurasi parameter dan aturan sistem manajemen SDM"
        />

        <div className="space-y-6 mt-8 mb-8 ml-24 mr-24">
          {/* Aturan Absensi */}
          {/* Aturan Absensi */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {/* Header Section */}
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
                    <select className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none appearance-none bg-white text-gray-700 cursor-pointer">
                      <option>Waktu Normal</option>
                      <option>Waktu Fleksibel</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <button className="mt-3 bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] hover:bg-[#2E7D32] text-white px-5 py-2 rounded-lg font-bold text-xs shadow-sm flex items-center gap-2 transition-all">
                  <FiSave className="text-sm" />
                  Simpan Aturan
                </button>
              </div>

              {/* Separator Halus (Opsional) */}
              <div className="border-t border-dashed border-gray-200"></div>

              {/* Toleransi Keterlambatan */}
              <div>
                <h3 className="text-base font-bold text-green-700 mb-1">
                  Toleransi Keterlambatan
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Berapa menit batas maksimal keterlambatan yang masih
                  ditolerir.
                </p>

                <div className="mb-2">
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">
                    Batas Toleransi (Menit)
                  </label>
                  <input
                    type="number"
                    defaultValue={15}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>

                <button className="mt-3 bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] hover:bg-[#2E7D32] text-white px-5 py-2 rounded-lg font-bold text-xs shadow-sm flex items-center gap-2 transition-all">
                  <FiSave className="text-sm" />
                  Simpan Toleransi
                </button>
              </div>
            </div>
          </section>

          {/* Pengaturan Tugas & Laporan */}
          {/* Pengaturan Tugas & Laporan */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {/* Header Section */}
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
                      Aktifkan jika karyawan wajib mengirimkan laporan harian
                      melalui sistem.
                    </p>
                  </div>

                  {/* Custom Toggle Switch Style */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                      Status Wajib Lapor
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#43A047]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Separator Halus */}
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
                    defaultValue="17:30"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-700 cursor-pointer"
                  />
                </div>

                <button className="mt-3 bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] hover:bg-[#2E7D32] text-white px-5 py-2 rounded-lg font-bold text-xs shadow-sm flex items-center gap-2 transition-all">
                  <FiSave className="text-sm" />
                  Simpan Batas Waktu
                </button>
              </div>
            </div>
          </section>

          {/* Keamanan & Akun */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {/* Header Section */}
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
                  {/* Password Baru */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">
                      Password Baru
                    </label>
                    <input
                      type="password"
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
                      placeholder="Ulangi password baru"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-700 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button className="bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] hover:bg-[#2E7D32] text-white px-5 py-2.5 rounded-lg font-bold text-xs shadow-sm flex items-center gap-2 transition-all">
                    <FiKey className="text-sm" />
                    Ubah Password
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
