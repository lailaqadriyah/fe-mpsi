import React, { useState } from "react";
import AsideTendik from "../../components/AsideTendik";
import Topbar from "../../components/Topbar";

const LaporanHarian = () => {
  const [tanggal, setTanggal] = useState( new Date().toISOString().slice(0,10) );
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
    setJenis(""); setJudul(""); setDeskripsi(""); setHasil(""); setDok(null); setCatatan("");
    alert("Laporan terkirim (demo)");
  };

  return (
    <div className="flex bg-[#f3fff5] min-h-screen">
      <AsideTendik />

      <main className="flex-1 p-8">
        <Topbar title="Laporan Harian" subtitle="Buat dan kirim laporan kegiatan harian Anda" />

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-green-800 font-semibold text-lg mb-4">Buat Laporan Harian Baru</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Tanggal Laporan</label>
                <input type="date" value={tanggal} onChange={(e)=>setTanggal(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md border" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Jenis Kegiatan</label>
                <select value={jenis} onChange={(e)=>setJenis(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md border bg-white">
                  <option value="">Pilih Jenis Kegiatan</option>
                  <option value="Katalogisasi">Katalogisasi</option>
                  <option value="Sirkulasi">Sirkulasi</option>
                  <option value="Referensi">Referensi</option>
                  <option value="Administrasi">Administrasi</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Judul Kegiatan</label>
              <input value={judul} onChange={e=>setJudul(e.target.value)} placeholder="Masukkan judul kegiatan" className="w-full mt-1 px-3 py-2 rounded-md border" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Deskripsi Kegiatan</label>
              <textarea value={deskripsi} onChange={e=>setDeskripsi(e.target.value)} rows={5} placeholder="Jelaskan detail kegiatan yang telah dilakukan..." className="w-full mt-1 px-3 py-2 rounded-md border" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Hasil/Output</label>
              <textarea value={hasil} onChange={e=>setHasil(e.target.value)} rows={3} placeholder="Jelaskan hasil atau output dari kegiatan..." className="w-full mt-1 px-3 py-2 rounded-md border" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Dokumentasi (opsional)</label>
              <div className="mt-1 border-2 border-dashed rounded-md p-4 text-center text-sm text-gray-500">
                <input type="file" onChange={e=>setDok(e.target.files[0])} />
                <div className="mt-2 text-xs text-gray-400">Klik untuk upload foto atau dokumen</div>
                {dok && <div className="mt-2 text-sm text-gray-700">File: {dok.name}</div>}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Catatan Tambahan</label>
              <input value={catatan} onChange={e=>setCatatan(e.target.value)} placeholder="Catatan atau kendala yang dihadapi (opsional)" className="w-full mt-1 px-3 py-2 rounded-md border" />
            </div>

            <div className="pt-4">
              <button type="submit" className="px-5 py-2 rounded-full bg-green-600 text-white">Kirim Laporan</button>
            </div>
          </form>
        </div>

      </main>
    </div>
  );
};

export default LaporanHarian;
