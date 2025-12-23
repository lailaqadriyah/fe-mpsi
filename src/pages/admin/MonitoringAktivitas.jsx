import React, { useState, useEffect } from "react";
import Aside from "../../components/Aside";
import Topbar from "../../components/Topbar";
import Modal from "../../components/Modal";
import {
  FiSearch,
  FiEye,
  FiFileText,
  FiRefreshCw,
  FiCalendar,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiFilter
} from "react-icons/fi";

const MonitoringAktivitas = () => {
  const [loading, setLoading] = useState(false);

  // --- STATE DATA ---
  const [tableReports, setTableReports] = useState([]);
  const [filteredTableReports, setFilteredTableReports] = useState([]);
  const [chartData, setChartData] = useState([]);

  const [selectedReport, setSelectedReport] = useState(null);

  // --- STATE FILTER & INPUT ---
  const [keywordInput, setKeywordInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [activeKeyword, setActiveKeyword] = useState("");
  const [selectedType, setSelectedType] = useState("Semua Laporan");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // --- 1. HELPER: PARSE KONTEN LAPORAN ---
  const parseReportContent = (noteContent) => {
    if (!noteContent) return { title: "Laporan Tanpa Judul", category: "Umum", description: "-", hasil: "-" };

    const firstLineEndIndex = noteContent.indexOf('\n');
    const headerLine = firstLineEndIndex !== -1 ? noteContent.substring(0, firstLineEndIndex) : noteContent;

    const categoryMatch = headerLine.match(/^\[(.*?)\]/);
    const category = categoryMatch ? categoryMatch[1] : "Lainnya";
    const title = headerLine.replace(/^\[.*?\]\s*/, "").trim() || "Laporan Harian";

    let description = "-";
    let hasil = "-";

    if (firstLineEndIndex !== -1) {
      const body = noteContent.substring(firstLineEndIndex).trim();
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

      const note = extractSection(body, "Catatan:", ["Hasil:"]);
      if (note) hasil = note;
    }

    return { title, category, description, hasil };
  };

  // --- HELPER: WARNA BADGE KATEGORI ---
  const getCategoryBadgeStyle = (category) => {
    const lowerCat = category.toLowerCase();
    if (lowerCat.includes("perencanaan")) {
      return "bg-blue-100 text-blue-700 border-blue-200";
    } else if (lowerCat.includes("harian")) {
      return "bg-green-100 text-green-700 border-green-200";
    } else {
      return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Convert plain text with http(s) links into clickable anchors that open in a new tab
  // Preserve newline characters entered by the admin
  const linkifyText = (text) => {
    if (!text) return null;
    const urlRe = /(https?:\/\/[\S]+)/g;
    const lines = text.split(/\r?\n/);
    return lines.map((line, lineIdx) => (
      <React.Fragment key={lineIdx}>
        {line.split(urlRe).map((part, idx) => {
          if (/^https?:\/\/[\S]+$/.test(part)) {
            return (
              <a key={idx} href={part} target="_blank" rel="noopener noreferrer" className="text-green-600 underline break-words">
                {part}
              </a>
            );
          }
          return <span key={idx}>{part}</span>;
        })}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // --- 2. FETCH DATA ---
  const fetchChartData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 6);

    const fromStr = start.toISOString().split('T')[0];
    const toStr = end.toISOString().split('T')[0];

    try {
      const response = await fetch(`http://localhost:4000/api/reports?from=${fromStr}&to=${toStr}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          last7Days.push(d.toISOString().split('T')[0]);
        }
        const counts = last7Days.map(dateStr => {
          const count = data.filter(item => item.date.startsWith(dateStr)).length;
          return {
            date: new Date(dateStr).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }),
            count: count
          };
        });
        setChartData(counts);
      }
    } catch (error) {
      console.error("Gagal mengambil data grafik:", error);
    }
  };

  const handleFilterClick = async () => {
    setLoading(true);
    setActiveKeyword(keywordInput);

    const token = localStorage.getItem("token");
    if (!token) return;

    let url = "http://localhost:4000/api/reports";
    const params = [];
    if (startDate) params.push(`from=${startDate}`);
    if (endDate) params.push(`to=${endDate}`);

    if (params.length > 0) url += "?" + params.join("&");

    try {
      const response = await fetch(url, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const processedData = data.map(item => {
          const { title, category, description, hasil } = parseReportContent(item.note);
          return {
            id: item.id,
            rawDate: item.date,
            tanggal: new Date(item.date).toLocaleDateString("id-ID", {
              day: "numeric", month: "long", year: "numeric"
            }),
            karyawan: item.user?.name || "Unknown",
            category: category,
            judul: title,
            deskripsi: description,
            hasil: hasil,
            attachments: item.attachments || []
          };
        });
        setTableReports(processedData);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Gagal mengambil laporan tabel:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
    handleFilterClick();
  }, []);

  // --- 4. LOGIKA FILTER KLIEN ---
  useEffect(() => {
    let result = [...tableReports];

    if (activeKeyword) {
      const lowerKey = activeKeyword.toLowerCase();
      result = result.filter(r =>
        r.karyawan.toLowerCase().includes(lowerKey) ||
        r.judul.toLowerCase().includes(lowerKey)
      );
    }

    if (selectedType !== "Semua Laporan") {
      if (selectedType === "Laporan Harian") {
        result = result.filter(r => r.category.toLowerCase().includes("harian"));
      } else if (selectedType === "Laporan Perencanaan") {
        result = result.filter(r => r.category.toLowerCase().includes("perencanaan"));
      }
    }

    setFilteredTableReports(result);
    setCurrentPage(1);
  }, [tableReports, activeKeyword, selectedType]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTableReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTableReports.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] min-h-screen font-sans">
      <Aside />

      <main className="flex-1 bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] overflow-y-auto transition-all">
        <Topbar
          title="Monitoring Aktivitas"
          subtitle="Memantau dan mengevaluasi laporan kegiatan harian karyawan"
        />

        {/* --- FILTER SECTION (SATU BARIS) --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 mt-8 ml-8 mr-8">

          <div className="flex flex-col lg:flex-row gap-4 items-end">

            {/* 1. Search Input (Lebar Fleksibel) */}
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-gray-700 mb-2 text-left">
                Cari Nama/Kata Kunci Laporan
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="Nama karyawan atau kata kunci laporan..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* 2. Tanggal Mulai (Lebar Tetap) */}
            <div className="w-full lg:w-48">
              <label className="block text-sm font-bold text-gray-700 mb-2 text-left">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-600 cursor-pointer"
              />
            </div>

            {/* 3. Tanggal Akhir (Lebar Tetap) */}
            <div className="w-full lg:w-48">
              <label className="block text-sm font-bold text-gray-700 mb-2 text-left">
                Tanggal Akhir
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-600 cursor-pointer"
              />
            </div>

            {/* 4. Tombol Filter (Sebelah Kanan Tanggal Akhir) */}
            <div className="w-full lg:w-auto">
              <button
                onClick={handleFilterClick}
                className="w-full lg:w-auto bg-[#0288D1] hover:bg-[#0277BD] text-white font-bold py-2.5 px-6 rounded-lg shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer h-[42px]"
              >
                {loading ? <FiRefreshCw className="animate-spin text-lg" /> : <FiFilter className="text-lg" />}
                Filter Data
              </button>
            </div>

          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow p-6 mb-6 ml-8 mr-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-green-800 flex items-center gap-2">
              Tren Laporan Harian (7 Hari Terakhir)
            </h2>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString("id-ID", { month: 'long', year: 'numeric' })}
            </div>
          </div>

          <div className="h-64 w-full rounded-lg p-4 border border-gray-50">
            <div className="h-full w-full rounded-lg p-6 flex items-end gap-4 justify-between">
              {(() => {
                // Calculate max count for dynamic scaling
                const maxCount = Math.max(...chartData.map(item => item.count), 1);
                // Maximum height in pixels (90% of container to leave room for labels)
                const maxHeight = 200; // h-64 = 256px minus padding

                return chartData.map((item, i) => {
                  // Calculate height as percentage of max, ensuring minimum visibility
                  const heightPx = item.count > 0
                    ? (item.count / maxCount) * maxHeight
                    : 4;

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center group">
                      <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-green-700">
                        {item.count}
                      </div>
                      <div
                        className="bg-gradient-to-t from-[#43A047] to-[#66BB6A] w-full max-w-[50px] rounded-t-md transition-all duration-500 hover:opacity-80"
                        style={{ height: `${heightPx}px`, minHeight: '4px' }}
                      />
                      <span className="text-[10px] sm:text-xs mt-2 text-gray-600 font-medium">{item.date}</span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>

        {/* TABEL RINCIAN LAPORAN */}
        <div className="bg-white rounded-xl shadow p-6 mb-6 ml-8 mr-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
            <h2 className="font-bold text-lg text-green-800 flex items-center gap-2">
              Rincian Laporan Terbaru
            </h2>

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-600">Tampilkan:</span>
              <div className="relative">
                {/* DROPDOWN FILTER TIPE - WARNA NETRAL (PUTIH) */}
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg pl-4 pr-10 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow shadow-sm hover:bg-gray-50"
                >
                  <option value="Semua Laporan">Semua Laporan</option>
                  <option value="Laporan Harian">Laporan Harian</option>
                  <option value="Laporan Perencanaan">Laporan Perencanaan</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9]">
                <tr className="text-green-900 text-sm font-bold text-left">
                  <th className="px-6 py-4 rounded-tl-xl">Tanggal</th>
                  <th className="px-6 py-4">Karyawan</th>
                  <th className="px-6 py-4">Tipe</th>
                  <th className="px-6 py-4">Judul Kegiatan</th>
                  <th className="px-6 py-4 rounded-tr-xl text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">Memuat data...</td>
                  </tr>
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">Tidak ada laporan ditemukan.</td>
                  </tr>
                ) : (
                  currentItems.map((report, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-green-50 transition-colors">
                      <td className="px-6 py-5 font-medium text-left whitespace-nowrap">
                        {report.tanggal}
                      </td>
                      <td className="px-6 py-5 font-bold text-gray-800 text-left">
                        {report.karyawan}
                      </td>

                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getCategoryBadgeStyle(report.category)}`}>
                          {report.category}
                        </span>
                      </td>

                      <td className="px-6 py-5 font-medium text-left">
                        {report.judul}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] text-[#1976D2] hover:shadow-md hover:opacity-90 px-4 py-2 rounded-lg text-xs font-bold transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <FiEye className="text-sm" /> Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 border-t border-gray-100 pt-4">
              <div className="text-xs text-gray-500 font-medium">
                Halaman {currentPage} dari {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-colors ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-green-700 hover:bg-green-50'}`}
                >
                  <FiChevronLeft />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${currentPage === i + 1
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
                  className={`p-2 rounded-lg transition-colors ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-green-700 hover:bg-green-50'}`}
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MODAL DETAIL (Sama) */}
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
            <div className="text-sm text-gray-700 space-y-5 mt-2 text-left">

              <div className="flex justify-between items-start border-b border-dashed border-gray-200 pb-3">
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5 uppercase font-bold">Karyawan</p>
                  <p className="font-bold text-lg text-gray-900">{selectedReport.karyawan}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 mb-0.5 uppercase font-bold">Tanggal</p>
                  <p className="font-medium text-green-700 flex items-center gap-1">
                    <FiCalendar /> {selectedReport.tanggal}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 mb-2 uppercase font-bold">Judul Kegiatan</p>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getCategoryBadgeStyle(selectedReport.category)}`}>
                    {selectedReport.category}
                  </span>
                  <p className="font-bold text-base text-gray-800">{selectedReport.judul}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs font-bold text-[#1B5E20] mb-2 uppercase">Deskripsi Kegiatan</p>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {linkifyText(selectedReport.deskripsi)}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-[#1B5E20] mb-1 uppercase">Catatan / Kendala</p>
                <p className="text-gray-700 text-sm leading-relaxed border-l-4 border-orange-200 pl-3 py-1">
                  {selectedReport.hasil}
                </p>
              </div>

              {selectedReport.attachments && selectedReport.attachments.length > 0 ? (
                <div className="pt-2">
                  <p className="text-xs font-bold text-[#1B5E20] mb-2 uppercase">Dokumentasi</p>
                  <div className="flex flex-col gap-2">
                    {selectedReport.attachments.map((file, idx) => (
                      <a
                        key={idx}
                        href={`http://localhost:4000${file.url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center">
                          <FiFileText />
                        </div>
                        <span className="text-sm font-medium text-gray-600 group-hover:text-blue-700 truncate flex-1">
                          {file.filename}
                        </span>
                        <FiDownload className="text-gray-400 group-hover:text-blue-600" />
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-400 italic">Tidak ada lampiran dokumen.</div>
              )}

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer"
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

export default MonitoringAktivitas;