import React, { useState } from "react";
import Aside from "../../components/Aside";
import Topbar from "../../components/Topbar";
import {
  FiMail,
  FiPhone,
  FiCalendar,
  FiEye,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import Modal from "../../components/Modal";

const ManajemenKaryawan = () => {
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="flex bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] min-h-screen">
      {/* Sidebar */}
      <Aside />

      {/* Content */}
      <main
        className={`flex-1 bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] overflow-y-auto transition-all`}
      >
        <Topbar
          title="Manajemen Karyawan"
          subtitle="Kelola data tenaga kependidikan perpustakaan"
        />
        <div>
            <div className="w-full flex justify-end pr-8">
          <button
            onClick={() => setShowAdd(true)}
            className="bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white px-4 py-2 rounded-lg font-semibold text-sm shadow"
          >
            + Tambah Karyawan
          </button>
            </div>
        </div>
        {/* Search + filters + add button */}
        <div className="flex items-start gap-6 mb-8 p-8">
          <div className="flex-1 bg-white rounded-xl shadow px-4 py-6">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Cari nama karyawan, email, atau posisi..."
                className="flex-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 px-3 py-2"
              />

              <button className="bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 px-3 py-2 text-sm">
                Semua Status
              </button>
              <button className="bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 rounded-lg px-3 py-2 text-sm">
                Semua Posisi
              </button>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-16">
          {karyawanList.map((k, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-green-600 text-white flex items-center justify-center rounded-full font-bold text-lg shadow-md">
                  {k.initial}
                </div>
                <div className="">
                  <h3 className="font-bold text-green-800">{k.nama}</h3>
                  <p className="text-sm text-gray-600">{k.posisi}</p>
                  <div className="">
                    <StatusBadge status={k.status} />
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <button
                  onClick={() => setSelected(k)}
                  className="w-full bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 py-2 rounded-lg shadow-sm text-sm"
                >
                  Lihat
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selected && (
        <Modal title="Detail Data Karyawan" onClose={() => setSelected(null)}>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg">
              {selected.initial}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-green-800 text-lg">
                {selected.nama}
              </h4>
              <p className="text-sm text-gray-600">{selected.posisi}</p>
            </div>
            <div>
              <button className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md text-sm flex items-center gap-2">
                {" "}
                <FiEdit /> Edit
              </button>
            </div>
          </div>

          <div className="border-t pt-4 text-sm text-gray-700">
            <p>
              <strong>Email:</strong> {selected.email}
            </p>
            <p className="mt-2">
              <strong>Telepon:</strong> {selected.telepon}
            </p>
            <p className="mt-2">
              <strong>Tanggal Bergabung:</strong> {selected.bergabung}
            </p>
          </div>

          <div className="mt-4 bg-gray-50 rounded-md p-4">
            <h5 className="font-semibold text-sm text-green-800">
              Ringkasan Kinerja
            </h5>
            <p className="text-sm text-gray-700">
              Tingkat kehadiran:{" "}
              <span className="font-semibold">{selected.kehadiran}%</span>
            </p>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setSelected(null)}
              className="px-4 py-2 rounded-md bg-white border"
            >
              Tutup
            </button>
            <button className="px-4 py-2 rounded-md bg-red-500 text-white">
              Hapus
            </button>
          </div>
        </Modal>
      )}

      {showAdd && (
        <Modal title="Tambah Karyawan Baru" onClose={() => setShowAdd(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowAdd(false);
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Nama Lengkap
              </label>
              <input
                required
                className="w-full mt-1 px-3 py-2 rounded-md border"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full mt-1 px-3 py-2 rounded-md border"
                placeholder="nama@unand.ac.id"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Nomor Telepon
              </label>
              <input
                className="w-full mt-1 px-3 py-2 rounded-md border"
                placeholder="+62 812-3456-7890"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Posisi/Jabatan
              </label>
              <select className="w-full mt-1 px-3 py-2 rounded-md border">
                <option>Pustakawan</option>
                <option>Admin Perpus</option>
                <option>Referensi</option>
                <option>Petugas Sirkulasi</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Tanggal Bergabung
              </label>
              <input
                type="date"
                className="w-full mt-1 px-3 py-2 rounded-md border"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-2 rounded-full"
              >
                Simpan
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ManajemenKaryawan;

/* Components */

const DetailItem = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
    <span className="text-green-600">{icon}</span>
    {text}
  </div>
);

const StatusBadge = ({ status }) => {
  const styles =
    status === "Aktif"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles}`}>
      {status}
    </span>
  );
};

const ActionButton = ({ color, icon, label }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <button
      className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-semibold ${colors[color]}`}
    >
      {icon} {label}
    </button>
  );
};

/* Dummy Data */

const karyawanList = [
  {
    nama: "Ahmad Fauzi",
    posisi: "Pustakawan",
    initial: "AF",
    email: "ahmad.fauzi@unand.ac.id",
    telepon: "+62 812-3456-7890",
    bergabung: "15 Jan 2023",
    kehadiran: 95,
    status: "Aktif",
  },
  {
    nama: "Siti Rahma",
    posisi: "Admin Perpus",
    initial: "SR",
    email: "siti.rahma@unand.ac.id",
    telepon: "+62 813-4567-8901",
    bergabung: "20 Mar 2023",
    kehadiran: 98,
    status: "Aktif",
  },
  {
    nama: "Dewi Lestari",
    posisi: "Katalogis",
    initial: "DL",
    email: "dewi.lestari@unand.ac.id",
    telepon: "+62 815-6789-0123",
    bergabung: "05 Sep 2023",
    kehadiran: 97,
    status: "Aktif",
  },
  {
    nama: "Eko Prasetyo",
    posisi: "Referensi",
    initial: "EP",
    email: "eko.prasetyo@unand.ac.id",
    telepon: "+62 816-7890-1234",
    bergabung: "12 Feb 2024",
    kehadiran: 94,
    status: "Aktif",
  },
  {
    nama: "Budi Santoso",
    posisi: "Petugas Sirkulasi",
    initial: "BS",
    email: "budi.santoso@unand.ac.id",
    telepon: "+62 814-5678-9012",
    bergabung: "10 Jun 2022",
    kehadiran: 92,
    status: "Aktif",
  },
  {
    nama: "Rina Wulandari",
    posisi: "Pustakawan",
    initial: "RW",
    email: "rina.wulandari@unand.ac.id",
    telepon: "+62 817-8901-2345",
    bergabung: "18 Nov 2022",
    kehadiran: 88,
    status: "Nonaktif",
  },
];
