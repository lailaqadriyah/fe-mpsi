import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { motion } from "framer-motion";

// Menambahkan prop 'maxWidth' dengan default 'max-w-2xl'
const Modal = ({ title, children, onClose, maxWidth = "max-w-2xl" }) => {
  
  // --- EFEK KUNCI SCROLL ---
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* dim background */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* modal panel */}
      <motion.div
        onClick={(e) => e.stopPropagation()}
        // 🔥 UPDATE DI SINI: Menggunakan variabel ${maxWidth} agar lebar bisa diatur dari luar
        className={`relative bg-white rounded-2xl shadow-lg w-full ${maxWidth} p-6 z-10 max-h-[90vh] flex flex-col`}
        initial={{ opacity: 0, y: 80, scale: 0.9 }}   
        animate={{ opacity: 1, y: 0, scale: 1 }}       
        exit={{ opacity: 0, y: 80, scale: 0.9 }}       
        transition={{ duration: 0.3, ease: "easeOut" }} 
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

        {/* Area konten */}
        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            {children}
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;