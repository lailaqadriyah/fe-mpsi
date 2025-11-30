import React from "react";
import { FiX } from "react-icons/fi";
import { motion } from "framer-motion";

const Modal = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* dim background and capture clicks */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* modal panel dengan animasi */}
      <motion.div
        onClick={(e) => e.stopPropagation()} // supaya klik di dalam panel tidak menutup modal
        className="relative bg-white rounded-2xl shadow-lg w-[90%] max-w-2xl p-6 z-10"
        initial={{ opacity: 0, y: 80, scale: 0.9 }}   // posisi awal: agak turun & kecil
        animate={{ opacity: 1, y: 0, scale: 1 }}       // posisi akhir: normal
        exit={{ opacity: 0, y: 80, scale: 0.9 }}       // (dipakai kalau nanti kamu pakai AnimatePresence)
        transition={{ duration: 0.5, ease: "easeOut" }} // ⬅️ KECEPATAN ANIMASI DI SINI
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-green-800">
              {title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            type="button"
          >
            <FiX className="text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">{children}</div>
      </motion.div>
    </div>
  );
};

export default Modal;
