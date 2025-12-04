import React, { useState } from "react";
import AsideTendik from "../../components/AsideTendik";
import Topbar from "../../components/Topbar";
import { FiSend, FiUploadCloud } from "react-icons/fi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const LaporanHarian = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // State untuk Tab (Harian / Perencanaan)
  const [activeTab, setActiveTab] = useState("harian"); // 'harian' | 'perencanaan'

  // State Form
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [catatan, setCatatan] = useState(""); 
  const [dok, setDok] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire("Error", "Anda harus login terlebih dahulu", "error");
      navigate("/");
      return;
    }

    if (!judul || !deskripsi) {
      Swal.fire("Peringatan", "Judul dan Deskripsi wajib diisi!", "warning");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("date", new Date(tanggal).toISOString());

      // Tentukan Prefix berdasarkan Tab yang aktif
      const jenisLaporan = activeTab === "harian" ? "Laporan Harian" : "Laporan Perencanaan";
      
      // Format catatan: [Jenis] Judul ...
      const combinedNote = `[${jenisLaporan}] ${judul}\n\nDeskripsi:\n${deskripsi}\n\nCatatan:\n${catatan || "-"}`;
      
      formData.append("note", combinedNote);

      if (dok) {
        formData.append("attachments", dok);
      }

      const response = await fetch("http://localhost:4000/api/reports", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: `${jenisLaporan} berhasil dikirim.`,
          timer: 2000,
          showConfirmButton: false
        });

        // Reset form
        setJudul("");
        setDeskripsi("");
        setCatatan("");
        setDok(null);
      } else {
        const errData = await response.json();
        throw new Error(errData.message || "Gagal mengirim laporan");
      }

    } catch (error) {
      console.error("Error submit laporan:", error);
      Swal.fire("Gagal", error.message || "Terjadi kesalahan koneksi", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#F0F4F0] min-h-screen font-sans">
      <AsideTendik />

      <main className="flex-1 bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] overflow-y-auto">
        <Topbar title="Laporan" />

        <div className="mt-8 mx-8">
          
          {/* --- TAB NAVIGATION (Sesuai Desain) --- */}
          <div className="flex rounded-xl overflow-hidden border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab("harian")}
              className={`flex-1 py-4 text-sm font-bold transition-all duration-200 
                ${activeTab === "harian" 
                  ? "bg-[#2E7D32] text-white" 
                  : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
            >
              Laporan Harian
            </button>
            <button
              onClick={() => setActiveTab("perencanaan")}
              className={`flex-1 py-4 text-sm font-bold transition-all duration-200 
                ${activeTab === "perencanaan" 
                  ? "bg-[#2E7D32] text-white" 
                  : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
            >
              Laporan Perencanaan
            </button>
          </div>

          {/* --- FORM CARD --- */}
          <div className="bg-white rounded-b-xl shadow-sm p-8 min-h-[500px] mb-8">
            
            <h2 className="text-[#1B5E20] font-bold text-xl mb-8 text-left">
              {activeTab === "harian" ? "Buat Laporan Harian Baru" : "Buat Laporan Perencanaan Baru"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Tanggal */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 text-left">
                  Tanggal Laporan
                </label>
                <div className="relative max-w-md">
                    <input
                    type="date"
                    required
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-600 outline-none text-gray-700 bg-white"
                    />
                </div>
              </div>

              {/* Judul Kegiatan */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 text-left">
                  Judul Kegiatan
                </label>
                <input
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Masukan judul kegiatan"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-600 outline-none placeholder-gray-400"
                />
              </div>

              {/* Deskripsi Kegiatan */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 text-left">
                  Deskripsi Kegiatan
                </label>
                <textarea
                  required
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  rows={5}
                  placeholder="Jelaskan detail kegiatan yang telah dilakukan..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-600 outline-none placeholder-gray-400 resize-none"
                />
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 text-left">
                  Catatan
                </label>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  rows={3}
                  placeholder="Catatan atau kendala yang dihadapi (opsional)"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-600 outline-none placeholder-gray-400 resize-none"
                />
              </div>

              {/* Dokumentasi (Hanya muncul di Laporan Harian sesuai logika umum, tapi jika desain mau dua-duanya ada, biarkan saja) */}
              {activeTab === "harian" && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 text-left">
                        Dokumentasi (opsional)
                    </label>
                    <div className="mt-1 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative bg-gray-50">
                        <input
                        type="file"
                        onChange={(e) => setDok(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/*,.pdf,.doc,.docx"
                        />
                        <div className="flex flex-col items-center justify-center text-gray-500 gap-2">
                            <FiUploadCloud className="text-3xl text-gray-400"/>
                            <p className="text-sm font-medium">
                                {dok ? (
                                <span className="text-green-600 font-bold">File terpilih: {dok.name}</span>
                                ) : (
                                "Klik untuk upload foto atau dokumen"
                                )}
                            </p>
                        </div>
                    </div>
                  </div>
              )}

              {/* Tombol Submit */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-[#43A047] hover:bg-[#2E7D32] text-white px-10 py-3 rounded-lg font-bold text-sm shadow-lg flex items-center gap-2 transition-all transform active:scale-95 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Mengirim..." : activeTab === "harian" ? "Kirim Laporan" : "Simpan Perencanaan"}
                  {!loading && <FiSend className="text-lg" />}
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LaporanHarian;