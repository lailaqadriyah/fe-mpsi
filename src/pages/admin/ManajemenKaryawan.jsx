import React, { useState, useEffect } from "react";
import Aside from "../../components/Aside";
import Topbar from "../../components/Topbar";
import {
  FiMail,
  FiPhone,
  FiCalendar,
  FiEye,
  FiEyeOff,
  FiEdit,
  FiTrash2,
  FiCreditCard,
  FiUserPlus,
  FiSearch,
  FiX
} from "react-icons/fi";
import Modal from "../../components/Modal";
import Swal from 'sweetalert2';

const ManajemenKaryawan = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  // Modal
  const [showModalForm, setShowModalForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState("");

  // 🔥 NEW: SHOW/HIDE PASSWORD
  const [showPassword, setShowPassword] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    position: "",
    joinDate: "",
    role: "TENAGA"
  });

  // FETCH USERS
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:4000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok) {
        setUsers(result.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.position && user.position.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchPosition = filterPosition === "" || user.position === filterPosition;

    return matchSearch && matchPosition;
  });

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ name: "", email: "", password: "", phone: "", position: "", joinDate: "", role: "TENAGA" });
    setShowModalForm(true);
  };

  const openEditModal = (user) => {
    setIsEditMode(true);
    setEditId(user.id);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      phone: user.phone || "",
      position: user.position || "",
      joinDate: user.joinDate ? user.joinDate.split("T")[0] : "",
      role: user.role?.name || "TENAGA"
    });
    setSelected(null);
    setShowModalForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!formData.position) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Silakan pilih posisi jabatan."
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
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: isEditMode ? "Data berhasil diperbarui." : "Karyawan baru berhasil ditambahkan.",
          timer: 1500,
          showConfirmButton: false
        });
        setShowModalForm(false);
        fetchUsers();
      } else {
        const err = await response.json();
        Swal.fire({ icon: "error", title: "Gagal", text: err.message });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: "Terjadi kesalahan koneksi." });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!"
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://localhost:4000/api/admin/users/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          Swal.fire("Terhapus!", "Data telah dihapus.", "success");
          setSelected(null);
          fetchUsers();
        }
      } catch (err) {
        Swal.fire("Error", "Kesalahan sistem.", "error");
      }
    }
  };

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() : "US";
  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";

  return (
    <div className="flex bg-gradient-to-b from-[#E8F5E9] to-[#DCEDC8] min-h-screen">
      <Aside />

      <main className="flex-1 overflow-y-auto">
        <Topbar title="Manajemen Karyawan" subtitle="Kelola data tenaga kependidikan perpustakaan" />

        <div className="w-full flex justify-end pr-8">
          <button
            onClick={openAddModal}
            className="bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white px-4 py-2 rounded-lg mt-6 flex items-center gap-2"
          >
            <FiUserPlus /> Tambah Karyawan
          </button>
        </div>

        {/* SEARCH */}
        <div className="flex items-start gap-6 mb-8 p-8">
          <div className="flex-1 bg-white rounded-xl shadow px-4 py-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 relative w-full">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama karyawan..."
                  className="w-full pl-10 py-2.5 border rounded-lg"
                />
              </div>
              <select
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
                className="w-full md:w-48 px-4 py-2.5 border rounded-lg bg-gray-50"
              >
                <option value="">Semua Posisi</option>
                <option value="Pustakawan">Pustakawan</option>
                <option value="Admin Perpus">Admin Perpus</option>
                <option value="Staff Sirkulasi">Staff Sirkulasi</option>
                <option value="Staff Referensi">Staff Referensi</option>
                <option value="Tenaga Teknis">Tenaga Teknis</option>
              </select>
            </div>
          </div>
        </div>

        {/* LIST */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-16 mb-8">
          {loading ? (
            <p className="col-span-full text-center">Memuat...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="col-span-full text-center text-gray-600">Tidak ada data.</p>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-2xl p-5 shadow">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-700 text-white font-bold text-2xl">
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <h3 className="font-bold">{user.name}</h3>
                    <p className="text-xs text-gray-500">{user.position}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelected(user)}
                  className="mt-4 w-full bg-blue-50 text-blue-700 py-2 rounded-lg text-sm"
                >
                  <FiEye /> Detail
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      {/* MODAL DETAIL */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 relative">
            <button
              className="absolute right-5 top-5 text-gray-500"
              onClick={() => setSelected(null)}
            >
              <FiX size={20} />
            </button>

            <h3 className="text-xl font-bold mb-4">Detail Karyawan</h3>

            <p><b>Nama:</b> {selected.name}</p>
            <p><b>Email:</b> {selected.email}</p>
            <p><b>Jabatan:</b> {selected.position}</p>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => handleDelete(selected.id)}
                className="bg-red-100 text-red-700 px-5 py-2 rounded-lg flex items-center gap-2"
              >
                <FiTrash2 /> Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FORM */}
      {showModalForm && (
        <Modal title={isEditMode ? "Edit Data Karyawan" : "Tambah Karyawan"} onClose={() => setShowModalForm(false)}>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">

            <div>
              <label className="text-xs font-bold block mb-1.5">Nama Lengkap</label>
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1.5">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg"
                placeholder="nama@unand.ac.id"
              />
            </div>

            {/* 🔥 FIELD PASSWORD + ICON SHOW/HIDE */}
            <div className="relative">
              <label className="text-xs font-bold block mb-1.5">
                Password {isEditMode && <span className="text-gray-400">(Kosongkan jika tidak diubah)</span>}
              </label>

              <input
                type={showPassword ? "text" : "password"}
                required={!isEditMode}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg pr-12"
                placeholder={isEditMode ? "Biarkan kosong untuk password lama" : "Password untuk login"}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1.5">Nomor Telepon</label>
              <input
                value={formData.phone}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, "")}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg"
                placeholder="+62 812-3456-7890"
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1.5">Posisi</label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg bg-gray-50"
              >
                <option value="">Pilih Jabatan</option>
                <option value="Pustakawan">Pustakawan</option>
                <option value="Admin Perpus">Admin Perpus</option>
                <option value="Staff Sirkulasi">Staff Sirkulasi</option>
                <option value="Staff Referensi">Staff Referensi</option>
                <option value="Tenaga Teknis">Tenaga Teknis</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1.5">Tanggal Bergabung</label>
              <input
                type="date"
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-green-700 text-white px-6 py-2 rounded-lg"
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
