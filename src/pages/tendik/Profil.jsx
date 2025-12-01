import React, { useState } from "react";
import AsideTendik from "../../components/AsideTendik";
import Topbar from "../../components/Topbar";
import { FiInfo, FiEdit, FiSave, FiKey, FiLock } from "react-icons/fi";

const Profil = () => {
  const [form, setForm] = useState({
    nama: "Siti Rahma",
    email: "siti.rahma@unand.ac.id",
    posisi: "Admin Perpus",
    tanggalGabung: "20 Maret 2023",
    statusKerja: "Kontrak Permanen",
    telepon: "+62 813-4567-8901",
    alamat: "Padang, Sumatera Barat",
  });

  const [passwords, setPasswords] = useState({
    oldPwd: "",
    newPwd: "",
    confirmPwd: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handlePwdChange = (e) =>
    setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const saveProfile = (e) => {
    e.preventDefault();
    console.log("Simpan perubahan:", form);
  };

  const changePassword = (e) => {
    e.preventDefault();
    console.log("Ubah password:", passwords);
  };

  return (
    <div className="flex bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] min-h-screen">
      <AsideTendik />

      <main className="flex-1">
        <Topbar
          title="Profil Saya"
          subtitle="Informasi dasar dan pengaturan akun Anda"
        />

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-4xl mx-auto mt-8 mb-8">
          {/* Header Profile */}
          <div className="flex items-center gap-5 mb-10 border-b border-gray-50 pb-8">
            <div className="w-20 h-20 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold text-3xl shadow-md">
              SR
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-900 mb-1">
                {form.nama}
              </h2>
              <p className="text-sm text-gray-500 font-medium">{form.posisi}</p>
            </div>
          </div>

          {/* Detail Profil */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              {/* Ikon Info (Hijau) */}
              <svg
                className="w-5 h-5 text-[#43A047]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-700">
                Detail Profil
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <p className="text-xs text-gray-400 mb-1">Email Resmi</p>
                <p className="text-sm font-bold text-green-900">{form.email}</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <p className="text-xs text-gray-400 mb-1">Posisi / Jabatan</p>
                <p className="text-sm font-bold text-green-900">
                  {form.posisi}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <p className="text-xs text-gray-400 mb-1">Tanggal Bergabung</p>
                <p className="text-sm font-bold text-green-900">
                  {form.tanggalGabung}
                </p>
              </div>
            </div>
            {/* (Opsional: Badge Status Kerja jika diperlukan, di gambar tidak terlalu menonjol tapi bisa tetap ada) */}
            {/* <div className="mt-4 inline-block px-4 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100">{form.statusKerja}</div> */}
          </section>

          {/* Edit Kontak & Data Pribadi */}
          <form onSubmit={saveProfile} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              {/* Ikon Edit Contact (Hijau) */}
              <svg
                className="w-5 h-5 text-[#43A047]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0 1 1 0 002 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-700">
                Edit Kontak & Data Pribadi
              </h3>
            </div>

            <div className="space-y-5">
              {/* Nama Lengkap (Full Width) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Nama Lengkap
                </label>
                <input
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Nomor Telepon
                  </label>
                  <input
                    name="telepon"
                    value={form.telepon}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Alamat (Opsional)
                  </label>
                  <input
                    name="alamat"
                    value={form.alamat}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <button className="bg-[#43A047] hover:bg-[#2E7D32] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-sm flex items-center gap-2 transition-all mt-2">
                  {/* Ikon Save */}
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
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    ></path>
                  </svg>
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </form>

          {/* Keamanan Akun */}
          <form onSubmit={changePassword} className="mb-2">
            <div className="flex items-center gap-2 mb-4">
              {/* Ikon Key (Hijau) */}
              <svg
                className="w-5 h-5 text-[#43A047]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 000-2z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-700">
                Keamanan Akun
              </h3>
            </div>

            <div className="space-y-5">
              {/* Password Lama (Full Width) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Password Lama
                </label>
                <input
                  type="password"
                  name="oldPwd"
                  value={passwords.oldPwd}
                  onChange={handlePwdChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              {/* Password Baru (Full Width) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Password Baru
                </label>
                <input
                  type="password"
                  name="newPwd"
                  value={passwords.newPwd}
                  onChange={handlePwdChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              {/* Konfirmasi Password Baru (Full Width) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  name="confirmPwd"
                  value={passwords.confirmPwd}
                  onChange={handlePwdChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <button className="bg-[#E53935] hover:bg-[#C62828] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-sm flex items-center gap-2 transition-all mt-2">
                  {/* Ikon Lock */}
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    ></path>
                  </svg>
                  Ubah Password
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profil;
