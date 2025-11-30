import React, { useState } from "react";
import { FiMail, FiLock, FiInfo, FiEye, FiEyeOff } from "react-icons/fi";
import unandLogo from "/src/assets/img/unand.png";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // placeholder kalau mau dipakai nanti
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // pesan error di bawah password
  const [showPassword, setShowPassword] = useState(false); // ⬅️ toggle lihat password

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // reset error setiap klik login

    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Simpan token & user
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Popup sukses
        await Swal.fire({
          icon: "success",
          title: "Login berhasil",
          text: "Selamat datang di sistem manajemen SDM.",
          showConfirmButton: false,
          timer: 1500,
        });

        // Redirect sesuai role
        if (data.user.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/tendik/dashboardTendik");
        }
      } else {
        // Login gagal (username / password salah)
        setErrorMessage("Username atau Password salah.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      // Error koneksi / server
      setErrorMessage("Gagal terhubung ke server. Pastikan backend sudah berjalan.");
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan",
        text: "Tidak dapat terhubung ke server.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden relative flex items-center justify-center bg-[linear-gradient(to_right,#1E5128,#2D7F4F,#4E9F3D,#8BC34A)]">
      {/* Circles Background */}
      <div className="absolute w-72 h-72 bg-white opacity-20 rounded-full bottom-10 left-10 blur-3xl"></div>
      <div className="absolute w-96 h-96 bg-white opacity-20 rounded-full top-10 right-10 blur-3xl"></div>

      {/* Content Wrapper - Combined Card */}
      <div className="w-full max-w-4xl relative z-10 px-4">
        <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          {/* LEFT (green) */}
          <div className="hidden md:flex md:w-1/2 bg-[linear-gradient(to_bottom_right,#1B5E20,#2E7D32,#43A047)] p-10 relative text-white items-center justify-center">
            {/* Decorative Circles inside Green Panel (Corner Curves) */}
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-white opacity-10 rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-white opacity-10 rounded-full pointer-events-none"></div>

            <div className="w-full">
              <div className="flex justify-center mb-6">
                <img
                  src={unandLogo}
                  alt="Logo Unand"
                  className="w-28 drop-shadow-lg"
                />
              </div>

              <h1 className="text-3xl font-bold text-center">Manajemen SDM</h1>
              <p className="text-lg text-center opacity-90">Perpustakaan</p>
              <p className="text-xl font-semibold text-center mb-6">
                Universitas Andalas
              </p>

              <div className="text-center space-y-1 opacity-90">
                <p className="text-sm">Sistem Terintegrasi untuk</p>
                <p className="text-sm">Pengelolaan</p>
                <p className="text-sm">Sumber Daya Manusia</p>
                <p className="text-sm">Perpustakaan</p>
              </div>
            </div>
          </div>

          {/* RIGHT (white) */}
          <div className="w-full md:w-1/2 p-10 bg-white">
            <h2 className="text-3xl font-bold text-[#1B5E20] mb-1">
              Selamat Datang!
            </h2>
            <p className="text-gray-500 mb-6">
              Silakan masuk untuk melanjutkan
            </p>

            <form className="space-y-4" onSubmit={handleLogin}>
              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative mt-1">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@unand.ac.id"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative mt-1">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}  // ⬅️ type dinamis
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password Anda"
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  />

                  {/* Tombol show/hide password */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? (
                      <FiEyeOff className="text-lg" />
                    ) : (
                      <FiEye className="text-lg" />
                    )}
                  </button>
                </div>

                {/* Pesan error di bawah password */}
                {errorMessage && (
                  <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
                )}
              </div>

              {/* Remember & Forgot (placeholder, bisa diisi nantinya) */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  {/* nanti kalau mau, bisa tambahkan checkbox rememberMe di sini */}
                </label>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#2E7D32] via-[#43A047] to-[#66BB6A] hover:bg-green-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mb-4 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                <span>{loading ? "Memproses..." : "Masuk"}</span>
              </button>

              {/* Info */}
              <div className="flex items-start gap-2 bg-[linear-gradient(to_right,#E8F5E9,#C8E6C9)] rounded-lg p-3">
                <FiInfo className="text-green-600 mt-0.5" />
                <p className="text-xs text-green-700">
                  Login otomatis mendeteksi role berdasarkan email Anda
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
