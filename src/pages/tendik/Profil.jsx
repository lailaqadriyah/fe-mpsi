import React, { useState } from "react";
import AsideTendik from "../../components/AsideTendik";
import Topbar from "../../components/Topbar";

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

  const [passwords, setPasswords] = useState({ oldPwd: "", newPwd: "", confirmPwd: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePwdChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const saveProfile = (e) => {
    e.preventDefault();
    console.log("Simpan perubahan:", form);
  };

  const changePassword = (e) => {
    e.preventDefault();
    console.log("Ubah password:", passwords);
  };

  return (
    <div className="flex bg-[#f3fff5] min-h-screen">
      <AsideTendik />

      <main className="flex-1 p-8">
        <Topbar title="Profil Saya" subtitle="Informasi dasar dan pengaturan akun Anda" />

        <div className="bg-white rounded-xl shadow p-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-green-700 text-white flex items-center justify-center font-bold">SR</div>
            <div>
              <h2 className="text-xl font-bold text-green-800">{form.nama}</h2>
              <p className="text-sm text-gray-500">{form.posisi}</p>
            </div>
          </div>

          {/* Detail Profil */}
          <section className="mb-6">
            <h3 className="text-green-800 font-semibold mb-3">Detail Profil</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-md p-3">
                <p className="text-xs text-gray-500">Email Resmi</p>
                <p className="text-sm text-gray-800 mt-2">{form.email}</p>
              </div>

              <div className="bg-gray-50 rounded-md p-3">
                <p className="text-xs text-gray-500">Posisi / Jabatan</p>
                <p className="text-sm text-gray-800 mt-2">{form.posisi}</p>
              </div>

              <div className="bg-gray-50 rounded-md p-3">
                <p className="text-xs text-gray-500">Tanggal Bergabung</p>
                <p className="text-sm text-gray-800 mt-2">{form.tanggalGabung}</p>
              </div>
            </div>
            <div className="mt-3 inline-block px-3 py-2 rounded-md bg-white text-green-700 text-sm">{form.statusKerja}</div>
          </section>

          {/* Edit Kontak & Data Pribadi */}
          <form onSubmit={saveProfile} className="mb-6">
            <h3 className="text-green-800 font-semibold mb-3">Edit Kontak & Data Pribadi</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Nama Lengkap</label>
                <input name="nama" value={form.nama} onChange={handleChange} className="w-full border rounded-md p-2" />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Alamat (Opsional)</label>
                <input name="alamat" value={form.alamat} onChange={handleChange} className="w-full border rounded-md p-2" />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Nomor Telepon</label>
                <input name="telepon" value={form.telepon} onChange={handleChange} className="w-full border rounded-md p-2" />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">&nbsp;</label>
                <button className="w-full bg-green-600 text-white py-2 rounded-md">Simpan Perubahan</button>
              </div>
            </div>
          </form>

          {/* Keamanan Akun */}
          <form onSubmit={changePassword} className="mb-3">
            <h3 className="text-green-800 font-semibold mb-3">Keamanan Akun</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Password Lama</label>
                <input type="password" name="oldPwd" value={passwords.oldPwd} onChange={handlePwdChange} className="w-full border rounded-md p-2" />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Password Baru</label>
                <input type="password" name="newPwd" value={passwords.newPwd} onChange={handlePwdChange} className="w-full border rounded-md p-2" />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Konfirmasi Password Baru</label>
                <input type="password" name="confirmPwd" value={passwords.confirmPwd} onChange={handlePwdChange} className="w-full border rounded-md p-2" />
              </div>

              <div className="flex items-end">
                <button className="w-full bg-red-500 text-white py-2 rounded-md">Ubah Password</button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profil;
