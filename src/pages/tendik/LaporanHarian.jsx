import React, { useState } from "react";
import AsideTendik from "../../components/AsideTendik";
import Topbar from "../../components/Topbar";
import { FiSend } from "react-icons/fi";

const LaporanHarian = () => {
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [jenis, setJenis] = useState("");
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [hasil, setHasil] = useState("");
  const [dok, setDok] = useState(null);
  const [catatan, setCatatan] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { tanggal, jenis, judul, deskripsi, hasil, dok, catatan };
    console.log("Kirim laporan:", payload);
    // reset form
    setJenis("");
    setJudul("");
    setDeskripsi("");
    setHasil("");
    setDok(null);
    setCatatan("");
    alert("Laporan terkirim (demo)");
  };

  return (
    <div className="flex bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] min-h-screen">
      <AsideTendik />

      <main className="flex-1">
        <Topbar
          title="Laporan Harian"
          subtitle="Buat dan kirim laporan kegiatan harian Anda"
        />

        <div className="bg-white rounded-xl shadow p-8 mt-8 mx-8 mb-8">
          <h2 className="text-[#1B5E20] font-bold text-lg mb-6 text-left">
            Buat Laporan Harian Baru
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tanggal Laporan */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 text-left">
                Tanggal Laporan
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-64 px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-700 item-left"
              />
            </div>

            {/* Judul Kegiatan */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 text-left">
                Judul Kegiatan
              </label>
              <input
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Masukkan judul kegiatan"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-400"
              />
            </div>

            {/* Deskripsi Kegiatan */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 text-left">
                Deskripsi Kegiatan
              </label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                rows={4}
                placeholder="Jelaskan detail kegiatan yang telah dilakukan..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-400"
              />
            </div>

            {/* Catatan (Sesuai gambar, ada input Catatan setelah Deskripsi) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 text-left">
                Catatan
              </label>
              <textarea
                value={catatan} // Pastikan state ini ada atau ganti dengan field yang sesuai
                onChange={(e) => setCatatan(e.target.value)}
                rows={3}
                placeholder="Catatan atau kendala yang dihadapi (opsional)"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-400"
              />
            </div>

            {/* Dokumentasi (Upload) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 text-left">
                Dokumentasi (opsional)
              </label>
              <div className="mt-1 border border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50 transition-colors relative">
                <input
                  type="file"
                  onChange={(e) => setDok(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-xs font-bold text-gray-500 text-left">
                  Klik untuk upload foto atau dokumen
                </div>
                {dok && (
                  <div className="mt-1 text-xs text-green-600 font-medium">
                    File terpilih: {dok.name}
                  </div>
                )}
              </div>
            </div>

            {/* Tombol Submit */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-[#43A047] hover:bg-[#2E7D32] text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow-md flex items-center gap-2 transition-all"
              >
                <FiSend className="text-lg" />
                Kirim Laporan
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LaporanHarian;
