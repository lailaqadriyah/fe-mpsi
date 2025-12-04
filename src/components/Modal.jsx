import React, { useEffect } from "react"; // Tambahkan useEffect
import { FiX } from "react-icons/fi";
import { motion } from "framer-motion";

const Modal = ({ title, children, onClose }) => {
  
  // --- EFEK KUNCI SCROLL ---
  useEffect(() => {
    // Saat Modal muncul (mount), kunci scroll body
    document.body.style.overflow = 'hidden';

    // Saat Modal ditutup (unmount), kembalikan scroll seperti semula
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

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
        className="relative bg-white rounded-2xl shadow-lg w-[90%] max-w-2xl p-6 z-10 max-h-[90vh] flex flex-col" // Tambahkan max-h dan flex-col agar konten bisa di-scroll jika panjang
        initial={{ opacity: 0, y: 80, scale: 0.9 }}   
        animate={{ opacity: 1, y: 0, scale: 1 }}       
        exit={{ opacity: 0, y: 80, scale: 0.9 }}       
        transition={{ duration: 0.5, ease: "easeOut" }} 
      >
        <div className="flex items-start justify-between mb-4 flex-shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-green-800">
              {title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
            type="button"
          >
            <FiX className="text-gray-600" />
          </button>
        </div>

        {/* Area konten yang bisa di-scroll secara independen */}
        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            {children}
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;