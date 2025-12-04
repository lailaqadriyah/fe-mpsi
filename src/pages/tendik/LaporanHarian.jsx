import React, { useState } from "react";
import AsideTendik from "../../components/AsideTendik";
import Topbar from "../../components/Topbar";
import { FiSend } from "react-icons/fi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const LaporanHarian = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // State Form
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [jenis, setJenis] = useState("");
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [hasil, setHasil] = useState(""); // Bisa difungsikan sebagai "Catatan" juga sesuai desain
  const [catatan, setCatatan] = useState(""); // Field tambahan sesuai UI
  const [dok, setDok] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire("Error", "Anda harus login terlebih dahulu", "error");
      navigate("/");
      return;
    }

    // Validasi sederhana
    if (!judul || !deskripsi) {
      Swal.fire("Peringatan", "Judul dan Deskripsi wajib diisi!", "warning");
      return;
    }

    setLoading(true);

    try {
      // 1. Siapkan FormData untuk upload file & data teks
      const formData = new FormData();
      formData.append("date", new Date(tanggal).toISOString());

      // 2. Gabungkan data form menjadi satu string formatted untuk kolom 'note' di DB
      // Format:
      // [Jenis Kegiatan] Judul Kegiatan
      // Deskripsi: ...
      // Catatan/Hasil: ...
      const combinedNote = `[${jenis || "Umum"}] ${judul}\n\nDeskripsi:\n${deskripsi}\n\nCatatan:\n${catatan || "-"}\n\nHasil:\n${hasil || "-"}`;
      
      formData.append("note", combinedNote);

      // 3. Tambahkan file jika ada (nama field harus 'attachments' sesuai backend route)
      if (dok) {
        formData.append("attachments", dok);
      }

      // 4. Kirim ke Backend
      const response = await fetch("http://localhost:4000/api/reports", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
          // Jangan set Content-Type secara manual saat menggunakan FormData, 
          // browser akan mengaturnya otomatis dengan boundary yang benar.
        },
        body: formData,
      });

      if (response.ok) {
        await Swal.fire({
          icon: "success",
          title: "Laporan Terkirim",
          text: "Laporan harian Anda berhasil disimpan ke sistem.",
          timer: 2000,
          showConfirmButton: false
        });

        // Reset form
        setJenis("");
        setJudul("");
        setDeskripsi("");
        setHasil("");
        setCatatan("");
        setDok(null);
        // Opsional: Redirect ke riwayat atau dashboard
        // navigate("/tendik/riwayatAktivitas"); 
      } else {
        const errData = await response.json();
        throw new Error(errData.message || "Gagal mengirim laporan");
      }

    } catch (error) {
      console.error("Error submit laporan:", error);
      Swal.fire("Gagal", error.message || "Terjadi kesalahan koneksi ke server", "error");
    } finally {
      setLoading(false);
    }
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
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-64 px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-700 item-left"
              />
            </div>

            {/* Jenis Kegiatan (Dropdown biar lebih rapi, optional) */}
            <div>
               <label className="block text-xs font-bold text-gray-700 mb-1.5 text-left">
                Jenis Kegiatan
              </label>
              <select 
                value={jenis}
                onChange={(e) => setJenis(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white text-gray-700"
              >
                <option value="">-- Pilih Jenis Kegiatan --</option>
                <option value="Administrasi">Administrasi</option>
                <option value="Layanan Sirkulasi">Layanan Sirkulasi</option>
                <option value="Katalogisasi">Katalogisasi</option>
                <option value="Referensi">Layanan Referensi</option>
                <option value="Teknis">Teknis & Pemeliharaan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {/* Judul Kegiatan */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 text-left">
                Judul Kegiatan <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: Input Data Buku Baru"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-400"
              />
            </div>

            {/* Deskripsi Kegiatan */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 text-left">
                Deskripsi Kegiatan <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                rows={4}
                placeholder="Jelaskan detail kegiatan yang telah dilakukan..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-400"
              />
            </div>

            {/* Catatan Tambahan */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 text-left">
                Catatan / Kendala (Opsional)
              </label>
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                rows={2}
                placeholder="Catatan atau kendala yang dihadapi..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-400"
              />
            </div>

            {/* Hasil (Opsional - jika diperlukan untuk report admin) */}
            {/* <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 text-left">
                Hasil / Output (Opsional)
              </label>
              <input
                value={hasil}
                onChange={(e) => setHasil(e.target.value)}
                placeholder="Contoh: 50 buku terdata"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none placeholder-gray-400"
              />
            </div> */}

            {/* Dokumentasi (Upload) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 text-left">
                Dokumentasi (Foto/Dokumen)
              </label>
              <div className="mt-1 border border-dashed border-gray-300 rounded-lg p-3 text-center hover:bg-gray-50 transition-colors relative">
                <input
                  type="file"
                  onChange={(e) => setDok(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*,.pdf,.doc,.docx"
                />
                <div className="text-xs font-bold text-gray-500">
                  {dok ? (
                    <span className="text-green-600">File terpilih: {dok.name}</span>
                  ) : (
                    "Klik untuk upload foto atau dokumen bukti kegiatan"
                  )}
                </div>
              </div>
            </div>

            {/* Tombol Submit */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`bg-[#43A047] hover:bg-[#2E7D32] text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                <FiSend className="text-lg" />
                {loading ? "Mengirim..." : "Kirim Laporan"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LaporanHarian;