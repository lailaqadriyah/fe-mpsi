import React, { useState } from "react";
import { FiMail, FiLock, FiInfo } from "react-icons/fi";
import unandLogo from "../../assets/img/unand.png";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    return (
        <div className="min-h-screen w-full overflow-x-hidden relative flex items-center justify-center 
                        bg-gradient-to-br from-green-800 via-green-600 to-green-400">

            {/* Circles Background */}
            <div className="absolute w-72 h-72 bg-white opacity-20 rounded-full bottom-10 left-10 blur-3xl"></div>
            <div className="absolute w-96 h-96 bg-white opacity-20 rounded-full top-10 right-10 blur-3xl"></div>

            {/* Content Wrapper */}
            <div className="w-full max-w-6xl flex flex-wrap items-center justify-between gap-6 relative z-10 px-4">

                {/* LEFT CARD */}
                <div className="flex-1 hidden md:flex">
                    <div className="bg-gradient-to-br from-green-800 to-green-600 rounded-3xl p-10 shadow-2xl text-white w-full relative overflow-hidden">

                        {/* Transparent circles */}
                        <div className="absolute w-40 h-40 bg-white opacity-10 rounded-full top-4 left-4"></div>
                        <div className="absolute w-32 h-32 bg-white opacity-10 rounded-full bottom-4 right-6"></div>

                        {/* Logo */}
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

                {/* RIGHT CARD */}
                <div className="flex-1 max-w-md w-full">
                    <div className="bg-white rounded-3xl shadow-2xl p-10">

                        <h2 className="text-3xl font-bold text-green-700 mb-1">Selamat Datang!</h2>
                        <p className="text-gray-500 mb-6">Silakan masuk untuk melanjutkan</p>

                        <form className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <div className="relative mt-1">
                                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="nama@unand.ac.id"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <div className="relative mt-1">
                                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Masukkan password Anda"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>

                            {/* Remember & Forgot */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 text-green-600 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
                                </label>

                                <button className="text-sm text-green-600 hover:underline">
                                    Lupa Password?
                                </button>
                            </div>

                            {/* Button */}
                            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2">
                                <span>Masuk</span>
                            </button>

                            {/* Info */}
                            <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg p-3">
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
