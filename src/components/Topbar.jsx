import React from "react";
import { FiBell, FiLogOut } from "react-icons/fi";

const Topbar = ({ title, subtitle }) => {
  return (
    <div className="sticky top-0 z-30 mb-6">
      <div className="bg-white py-3 rounded-md shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-green-700 px-6">
            {title}
          </h1>
          {subtitle && <p className="text-sm text-gray-500 ml-12">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-[#C8E6C9] px-5 py-2 rounded-full">
            <div className="w-9 h-9 flex items-center justify-center bg-[#43A047] text-white rounded-full font-bold">
              A
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-green-800">Admin</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>

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
