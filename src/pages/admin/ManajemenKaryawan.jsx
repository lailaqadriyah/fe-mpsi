import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Aside from "../../components/Aside";
import Topbar from "../../components/Topbar";
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiCreditCard,
  FiUserPlus,
  FiSearch,
  FiList,
} from "react-icons/fi";
import Modal from "../../components/Modal";
import Swal from "sweetalert2";

// Komponen untuk tombol QuickButton
const QuickButton = ({ label, icon, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white shadow hover:shadow-md transition rounded-2xl py-6 flex flex-col items-center gap-3"
  >
    <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-700 text-xl">
      {icon}
    </div>
    <p className="font-bold text-sm">{label}</p>
  </button>
);

const ManajemenKaryawan = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  // State Modal & Mode
  const [showModalForm, setShowModalForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // State Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState("");

  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    position: "",
    joinDate: "",
    role: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  // --- HELPER: Handle Token Expired ---
  const handleAuthError = () => {
    Swal.fire({
      icon: "warning",
      title: "Sesi Habis",
      text: "Silakan login kembali untuk melanjutkan.",
      confirmButtonColor: "#2E7D32",
    }).then(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    });
  };

  // 1. FETCH DATA
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:4000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      const result = await response.json();
      if (response.ok) {
        setUsers(result.data || []);
      } else {
        console.error("Gagal mengambil data user");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔥 AUTO-OPEN MODAL JIKA DATANG DARI DASHBOARD
  useEffect(() => {
    if (location.state?.openAddModal) {
      openAddModal();
      // bersihkan state supaya refresh tidak auto-open terus
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, location.pathname, navigate]);

  // --- LOGIKA FILTER ---
  const filteredUsers = users.filter((user) => {
    const matchSearch =
      (user.name &&
        user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.position &&
        user.position.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchPosition =
      filterPosition === "" || user.position === filterPosition;

    return matchSearch && matchPosition;
  });

  // --- MODAL HANDLERS ---
  const openAddModal = () => {
    setIsEditMode(false);
    setEditId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      position: "",
      joinDate: "",
      role: "",
    });
    setShowModalForm(true);
  };

  const openEditModal = (user) => {
    setIsEditMode(true);
    setEditId(user.id);
    const formattedDate = user.joinDate
      ? new Date(user.joinDate).toISOString().split("T")[0]
      : "";

    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      phone: user.phone || "",
      position: user.position || "",
      joinDate: formattedDate,
      role: user.role?.name || "",
    });
    setSelected(null);
    setShowModalForm(true);
  };

  // 2. SUBMIT FORM (POST/PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!formData.position) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Silakan pilih posisi jabatan.",
        confirmButtonColor: "#2E7D32",
      });
      return;
    }

    const url = isEditMode
      ? `http://localhost:4000/api/admin/users/${editId}`
      : "http://localhost:4000/api/admin/users";

    const method = isEditMode ? "PUT" : "POST";
    const payload = { ...formData };
    if (isEditMode && !payload.password) delete payload.password;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: isEditMode ? "Data diperbarui." : "Karyawan baru ditambahkan.",
          showConfirmButton: false,
          timer: 1500,
        });
        setShowModalForm(false);
        fetchUsers();
      } else {
        const err = await response.json();
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: err.message || "Gagal menyimpan data",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Koneksi error",
        confirmButtonColor: "#d33",
      });
    }
  };

  // 3. DELETE
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Karyawan?",
      text: "Data tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:4000/api/admin/users/${id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 401) {
          handleAuthError();
          return;
        }

        if (response.ok) {
          await Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
          setSelected(null);
          fetchUsers();
        } else {
          Swal.fire("Gagal!", "Gagal menghapus data.", "error");
        }
      } catch (error) {
        Swal.fire("Error!", "Koneksi error.", "error");
      }
    }
  };

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "US";

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "-";

  return (
    <div className="flex bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] min-h-screen">
      <Aside />

      <main className="flex-1 bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] overflow-y-auto transition-all">
        <Topbar
          title="Manajemen Karyawan"
          subtitle="Kelola data tenaga kependidikan perpustakaan"
        />

        {/* Tambahkan QuickButton untuk "Lihat Pengajuan Cuti" */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-16 mb-2 px-4 pt-6">
          <QuickButton
            label="Tambah Karyawan"
            icon={<FiUserPlus className="text-xl" />}
            onClick={openAddModal}
          />
          <QuickButton
            label="Lihat Pengajuan Cuti"
            icon={<FiList className="text-xl" />}
            onClick={() => navigate("")}
          />
        </div>

        {/* --- SEARCH & FILTER --- */}
        <div className="flex items-start gap-6 mb-8 p-8">
          <div className="flex-1 bg-white rounded-xl shadow px-4 py-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 relative w-full">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama karyawan, email, atau posisi..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                />
              </div>
              <div className="relative w-full md:w-48">
                <select
                  value={filterPosition}
                  onChange={(e) => setFilterPosition(e.target.value)}
                  className="cursor-pointer w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 appearance-none"
                >
                  <option value="">Semua Posisi</option>
                  <option value="Pustakawan">Pustakawan</option>
                  <option value="Admin Perpus">Admin Perpus</option>
                  <option value="Staff Sirkulasi">Staff Sirkulasi</option>
                  <option value="Staff Referensi">Staff Referensi</option>
                  <option value="Tenaga Teknis">Tenaga Teknis</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 text-xs">
                  ▼
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- LIST DATA KARYAWAN --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-16 mb-8">
          {loading ? (
            <p className="col-span-full text-center text-gray-500 py-10">
              Memuat data karyawan...
            </p>
          ) : filteredUsers.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500 font-medium">
                Tidak ada karyawan yang ditemukan.
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-2xl p-5 shadow hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold text-2xl bg-gradient-to-b from-[#2E7D32] to-[#43A047] shadow-lg">
                    {getInitials(user.name)}
                  </div>
                  <div className="overflow-hidden">
                    <h3
                      className="font-bold text-green-800 truncate"
                      title={user.name}
                    >
                      {user.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-semibold mb-1">
                      {user.position || user.role?.name}
                    </p>
                    <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full bg-green-100 text-green-700">
                      Aktif
                    </span>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-dashed border-gray-100">
                  <button
                    onClick={() => setSelected(user)}
                    className="cursor-pointer w-full bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-200 transition"
                  >
                    <FiEye /> Detail
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* --- MODAL DETAIL (pakai Modal.jsx) --- */}
      {selected && (
        <Modal
          title={
            <div className="flex items-center gap-3">
              <FiCreditCard className="text-xl text-green-800" />
              <span className="text-lg font-bold text-green-800">
                Detail Data Karyawan
              </span>
            </div>
          }
          onClose={() => setSelected(null)}
        >
          <div className="p-2">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold text-3xl shadow-lg border-4 border-white ring-2 ring-green-50">
                {getInitials(selected.name)}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-[#1B5E20]">
                    {selected.name}
                  </h2>
                  <button
                    onClick={() => openEditModal(selected)}
                    className="cursor-pointer bg-[#FFF3E0] hover:bg-orange-100 text-[#E65100] px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition shadow-sm border border-orange-200"
                    type="button"
                  >
                    <FiEdit /> Edit
                  </button>
                </div>
                <span className="inline-block px-3 py-0.5 text-[11px] font-semibold rounded-full bg-green-50 text-green-700 border border-green-100">
                  {selected.role?.name || "Karyawan"}
                </span>
              </div>
            </div>

            <div className="space-y-5">
              <div className="group">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">
                  Posisi
                </label>
                <p className="text-base font-medium text-gray-800 border-b border-dashed border-gray-200 pb-2">
                  {selected.position || "-"}
                </p>
              </div>
              <div className="group">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">
                  Email
                </label>
                <p className="text-base font-medium text-gray-800 border-b border-dashed border-gray-200 pb-2">
                  {selected.email}
                </p>
              </div>
              <div className="group">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">
                  Nomor Telepon
                </label>
                <p className="text-base font-medium text-gray-800 border-b border-dashed border-gray-200 pb-2">
                  {selected.phone || "-"}
                </p>
              </div>
              <div className="group">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">
                  Tanggal Bergabung
                </label>
                <p className="text-base font-medium text-gray-800 border-b border-dashed border-gray-200 pb-2">
                  {formatDate(selected.joinDate || selected.createdAt)}
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => handleDelete(selected.id)}
                className="cursor-pointer bg-[#FFEBEE] hover:bg-[#FFCDD2] text-[#D32F2F] px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition shadow-sm hover:shadow"
                type="button"
              >
                <FiTrash2 className="text-lg" /> Hapus
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* --- MODAL FORM (TAMBAH / EDIT) --- */}
      {showModalForm && (
        <Modal
          title={
            <span className="text-2xl font-bold text-[#1B5E20]">
              {isEditMode ? "Edit Data Karyawan" : "Tambah Karyawan Baru"}
            </span>
          }
          onClose={() => setShowModalForm(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">
                Nama Lengkap
              </label>
              <input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="nama@unand.ac.id"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">
                Password{" "}
                {isEditMode && (
                  <span className="text-gray-400 font-normal">
                    (Kosongkan jika tidak ingin diubah)
                  </span>
                )}
              </label>
              <input
                type="password"
                required={!isEditMode}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                placeholder={
                  isEditMode
                    ? "Biarkan kosong untuk password lama"
                    : "Password untuk login"
                }
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">
                Nomor Telepon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="+62 812-3456-7890"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">
                Posisi/Jabatan
              </label>
              <div className="relative">
                <select
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  className="cursor-pointer w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none appearance-none bg-gray-50"
                >
                  <option value="">Pilih Jabatan</option>
                  <option value="Pustakawan">Pustakawan</option>
                  <option value="Admin Perpus">Admin Perpus</option>
                  <option value="Staff Sirkulasi">Staff Sirkulasi</option>
                  <option value="Staff Referensi">Staff Referensi</option>
                  <option value="Tenaga Teknis">Tenaga Teknis</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                  ▼
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">
                Tanggal Bergabung
              </label>
              <input
                type="date"
                value={formData.joinDate}
                onChange={(e) =>
                  setFormData({ ...formData, joinDate: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-600"
              />
            </div>
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className="cursor-pointer bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] hover:bg-[#2E7D32] text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow-md transition-all"
              >
                {isEditMode ? "Simpan Perubahan" : "Simpan Data"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ManajemenKaryawan;
