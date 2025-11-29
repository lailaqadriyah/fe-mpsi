import React from "react";
import { FiLogOut } from "react-icons/fi";

const Topbar = ({ title, subtitle }) => {
  return (
    <div className="sticky top-0 z-30">
      <div className="bg-white py-3 rounded-md shadow-sm flex items-center justify-between">
        
        {/* Kiri: Judul */}
        <div>
          <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-[#1B5E20] to-[#43A047] bg-clip-text text-transparent px-6">
            {title}
          </h1>
          {subtitle && <p className="text-sm text-gray-500 ml-12">{subtitle}</p>}
        </div>

        {/* Kanan: Profil & Tombol Logout */}
        <div className="flex items-center gap-4">
          
          {/* Profil Admin */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9] px-5 py-2 rounded-full shadow-sm">
            <div className="w-10 h-10 flex items-center justify-center bg-[#2E7D32] text-white rounded-full font-bold text-lg shadow-sm">
              A
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-[#1B5E20] leading-tight">Admin</p>
              <p className="text-xs text-gray-500 leading-tight">Administrator</p>
            </div>
          </div>

          {/* Tombol Logout (Sekarang ada di dalam div flex gap-4) */}
          <button className="bg-gradient-to-r from-[#FF5252] to-[#F44336] hover:shadow-lg hover:opacity-90 transition-all text-white font-semibold px-6 py-2.5 rounded-[10px] flex items-center gap-2 text-sm mr-6">
            <FiLogOut className="text-lg" />
            Logout
          </button>

        </div>
      </div>
    </div>
  );
};

export default Topbar;