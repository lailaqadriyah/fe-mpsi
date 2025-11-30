import React from "react";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Topbar = ({ title, subtitle }) => {
  const navigate = useNavigate();

  // Ambil data user dari localStorage
  let user = null;
  try {
    const raw = localStorage.getItem("user");
    user = raw ? JSON.parse(raw) : null;
  } catch (err) {
    user = null;
  }

  const displayName = user?.name || "Admin";
  const displayPosition =
    user?.position ||
    user?.role?.name || // kalau backend kirim role sebagai object { name: 'ADMIN' }
    user?.role || // kalau backend kirim role sebagai string "ADMIN"
    "Administrator";

  // Inisial dari nama (misal: "Ahmad Fauzi" -> "AF")
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Keluar dari sistem?",
      text: "Apakah Anda yakin ingin logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, keluar",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      // Hapus data autentikasi
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Popup sukses logout
      await Swal.fire({
        icon: "success",
        title: "Logout berhasil",
        text: "Anda telah keluar dari sistem.",
        showConfirmButton: false,
        timer: 1500,
      });

      // Arahkan ke halaman login
      navigate("/");
    }
  };

  return (
    <div className="sticky top-0 z-30">
      <div className="bg-white py-3 rounded-md shadow-sm flex items-center justify-between">
        {/* Kiri: Judul */}
        <div>
          <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-[#1B5E20] to-[#43A047] bg-clip-text text-transparent px-6">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-500 ml-12">
              {subtitle}
            </p>
          )}
        </div>

        {/* Kanan: Profil & Tombol Logout */}
        <div className="flex items-center gap-4">
          {/* Profil User dari localStorage */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9] px-5 py-2 rounded-full shadow-sm">
            <div className="w-10 h-10 flex items-center justify-center bg-[#2E7D32] text-white rounded-full font-bold text-lg shadow-sm">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-[#1B5E20] leading-tight">
                {displayName}
              </p>
              <p className="text-xs text-gray-500 leading-tight">
                {displayPosition}
              </p>
            </div>
          </div>

          {/* Tombol Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="bg-gradient-to-r from-[#FF5252] to-[#F44336] hover:shadow-lg hover:opacity-90 transition-all text-white font-semibold px-6 py-2.5 rounded-[10px] flex items-center gap-2 text-sm mr-6"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
