import React, { useState, useEffect } from "react";
import AsideTendik from "../../components/AsideTendik";
import Topbar from "../../components/Topbar";
import Modal from "../../components/Modal"; // Pastikan import Modal
import { 
  FiClock, 
  FiCheckCircle, 
  FiFileText, 
  FiChevronLeft, 
  FiChevronRight 
} from "react-icons/fi";
import Swal from "sweetalert2";

const RiwayatAktivitas = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Maksimal 5 item per halaman

  // --- STATE MODAL DETAIL ---
  const [selectedReport, setSelectedReport] = useState(null);

  // Fungsi helper parsing (sama seperti sebelumnya)
  const parseReportContent = (noteContent) => {
    if (!noteContent) return { title: "Laporan Tanpa Judul", category: "Umum", description: "-", catatan: "-", hasil: "-" };

    const firstLineEndIndex = noteContent.indexOf('\n');
    const headerLine = firstLineEndIndex !== -1 ? noteContent.substring(0, firstLineEndIndex) : noteContent;

    const categoryMatch = headerLine.match(/^\[(.*?)\]/);
    const category = categoryMatch ? categoryMatch[1] : "Umum";
    const title = headerLine.replace(/^\[.*?\]\s*/, "").trim() || "Laporan Harian";

    // Extract bagian body
    let description = "-";
    let catatan = "-";
    let hasil = "-";

    if (firstLineEndIndex !== -1) {
        const body = noteContent.substring(firstLineEndIndex).trim();
        
        // Helper regex sederhana untuk ambil konten antar keyword
        const extractSection = (text, startKeyword, endKeywords) => {
            const startIndex = text.indexOf(startKeyword);
            if (startIndex === -1) return null;
            
            let endIndex = text.length;
            endKeywords.forEach(keyword => {
                const idx = text.indexOf(keyword, startIndex + startKeyword.length);
                if (idx !== -1 && idx < endIndex) endIndex = idx;
            });
            
            return text.substring(startIndex + startKeyword.length, endIndex).trim();
        };

        const desc = extractSection(body, "Deskripsi:", ["Catatan:", "Hasil:"]);
        if (desc) description = desc;
        else description = body; // Fallback jika format tidak standar

        const note = extractSection(body, "Catatan:", ["Hasil:"]);
        if (note) catatan = note;

        const res = extractSection(body, "Hasil:", []);
        if (res) hasil = res;
    }

    return { title, category, description, catatan, hasil };
  };

  const fetchReports = async () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (!token || !user) return;

    try {
      const response = await fetch(`http://localhost:4000/api/reports?userId=${user.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        
        const formattedData = data.map(item => {
            const { title, category, description, catatan, hasil } = parseReportContent(item.note);
            
            const dateObj = new Date(item.createdAt);
            const timeStr = dateObj.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });
            
            const dateStr = new Date(item.date).toLocaleDateString("id-ID", {
                day: "numeric", month: "long", year: "numeric"
            });

            return {
                id: item.id,
                date: dateStr,
                title: title,
                category: category,
                time: `Dikirim ${timeStr}`,
                description: description,
                catatan: catatan,
                hasil: hasil,
                status: "Terkirim",
                // Simpan lampiran jika ada (dari backend include attachments)
                attachments: item.attachments || [] 
            };
        });

        setReports(formattedData);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // --- LOGIC PAGINATION ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReports = reports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reports.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] min-h-screen">
      <AsideTendik />

      <main className="flex-1">
        <Topbar title="Riwayat Aktivitas" subtitle="Rekapitulasi semua absensi dan laporan kegiatan Anda" />

        <div className="bg-white rounded-xl shadow p-6 mt-8 mx-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <FiClock className="text-xl text-green-800" />
                <h2 className="text-lg font-bold text-green-800">Laporan Terkirim</h2>
            </div>
            {/* Info Pagination Kecil */}
            <div className="text-xs text-gray-500 font-medium">
                Total: {reports.length} Laporan
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
                <p className="text-center text-gray-500 py-8">Memuat riwayat...</p>
            ) : reports.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Belum ada laporan yang dikirim.</p>
            ) : (
                <>
                    {/* --- LIST ITEM --- */}
                    {currentReports.map((r) => (
                    <div 
                        key={r.id} 
                        onClick={() => setSelectedReport(r)} // KLIK UNTUK DETAIL
                        className="group p-6 rounded-2xl bg-[#FAFAFA] border border-gray-50 hover:shadow-md hover:border-green-200 transition-all cursor-pointer relative"
                    >
                        {/* Hover hint */}
                        
                        
                        {/* Header */}
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-bold text-green-900">{r.date}</p>
                            <span className="inline-block px-4 py-1 rounded-full bg-[#C8E6C9] text-[#1B5E20] text-xs font-bold">
                                {r.status}
                            </span>
                        </div>

                        {/* Kategori */}
                        <span className="inline-block mb-1 text-[10px] uppercase font-bold tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                            {r.category}
                        </span>

                        {/* Judul */}
                        <h3 className="font-bold text-[#2E7D32] text-base mb-2 text-left group-hover:text-[#1B5E20] transition-colors">{r.title}</h3>

                        {/* Deskripsi (Truncated) */}
                        <p className="text-sm text-gray-600 leading-relaxed mb-4 text-left line-clamp-2">
                            {r.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium border-t border-dashed border-gray-200 pt-3">
                            <FiCheckCircle className="text-green-600" />
                            <span>{r.time}</span>
                            {r.attachments.length > 0 && (
                                <span className="ml-auto text-blue-500 flex items-center gap-1">
                                    <FiFileText /> {r.attachments.length} Lampiran
                                </span>
                            )}
                        </div>
                    </div>
                    ))}

                    {/* --- PAGINATION CONTROLS --- */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-green-700 hover:bg-green-50'}`}
                            >
                                <FiChevronLeft />
                            </button>

                            {/* Generate Page Numbers */}
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => paginate(i + 1)}
                                    className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${
                                        currentPage === i + 1
                                            ? 'bg-[#2E7D32] text-white shadow-md'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-green-700 hover:bg-green-50'}`}
                            >
                                <FiChevronRight />
                            </button>
                        </div>
                    )}
                </>
            )}
          </div>
        </div>

        {/* --- MODAL DETAIL (READ ONLY) --- */}
        {selectedReport && (
            <Modal 
                title={
                    <div className="flex items-center gap-2 text-[#1B5E20]">
                        <FiFileText className="text-xl" />
                        <span className="font-bold text-lg">Detail Laporan</span>
                    </div>
                }
                onClose={() => setSelectedReport(null)}
            >
                <div className="space-y-5 text-left text-sm text-gray-700">
                    {/* Header Info */}
                    <div className="grid grid-cols-2 gap-4 bg-green-50 p-4 rounded-xl border border-green-100">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-green-600 mb-1">Tanggal</p>
                            <p className="font-bold text-gray-800">{selectedReport.date}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-green-600 mb-1">Waktu Kirim</p>
                            <p className="font-bold text-gray-800">{selectedReport.time}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-[10px] uppercase font-bold text-green-600 mb-1">Kategori</p>
                            <span className="inline-block px-3 py-1 rounded bg-white border border-green-200 text-xs font-semibold text-green-700">
                                {selectedReport.category}
                            </span>
                        </div>
                    </div>

                    {/* Judul */}
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Judul Kegiatan</p>
                        <p className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
                            {selectedReport.title}
                        </p>
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Deskripsi Kegiatan</p>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <p className="leading-relaxed whitespace-pre-wrap">{selectedReport.description}</p>
                        </div>
                    </div>

                    {/* Catatan & Hasil */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Catatan / Kendala</p>
                            <p className="text-gray-800 font-medium">{selectedReport.catatan}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Hasil</p>
                            <p className="text-gray-800 font-medium">{selectedReport.hasil}</p>
                        </div>
                    </div>

                    {/* Lampiran */}
                    {selectedReport.attachments && selectedReport.attachments.length > 0 && (
                        <div className="pt-4 border-t border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Lampiran Dokumen</p>
                            <div className="flex flex-col gap-2">
                                {selectedReport.attachments.map((att, idx) => (
                                    <a 
                                        key={idx} 
                                        href={`http://localhost:4000${att.url}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors group"
                                    >
                                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600">
                                            <FiFileText />
                                        </div>
                                        <span className="text-sm font-medium text-gray-600 group-hover:text-blue-700 truncate">
                                            {att.filename}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tombol Tutup */}
                    <div className="flex justify-end pt-4">
                        <button 
                            onClick={() => setSelectedReport(null)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm font-bold transition-colors"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </Modal>
        )}

      </main>
    </div>
  );
};

export default RiwayatAktivitas;