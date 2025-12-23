import React, { useState, useEffect } from "react";
import AsideTendik from "../../components/AsideTendik";
import Topbar from "../../components/Topbar";
import {
  FiFlag, FiUser, FiCheckCircle, FiMessageSquare, FiPlayCircle, FiEye, FiCalendar, FiAlertCircle, FiSave, FiDownload
} from "react-icons/fi";
import Modal from "../../components/Modal";
import Swal from "sweetalert2";

const DaftarTugas = () => {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("Semua Tugas");
  const [selectedTask, setSelectedTask] = useState(null);

  // State Modal Catatan
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentTaskNote, setCurrentTaskNote] = useState(null);
  const [noteText, setNoteText] = useState("");

  const [stats, setStats] = useState([
    { label: "Pending", value: 0, color: "text-orange-500" },
    { label: "On Progress", value: 0, color: "text-blue-500" },
    { label: "Selesai Bulan Ini", value: 0, color: "text-green-600" },
  ]);

  const tabs = ["Semua Tugas", "Pending", "On Progress", "Selesai"];

  // Helper Mappings
  const mapStatusBEtoFE = (status) => {
    switch (status) {
      case 'PENDING': return 'Pending';
      case 'DALAM_PROGERSS': return 'On Progress';
      case 'SELESAI': return 'Selesai';
      default: return status;
    }
  };

  const mapPrioritasBEtoFE = (prio) => {
    switch (prio) {
      case 'TINGGI': return 'Prioritas Tinggi';
      case 'NORMAL': return 'Prioritas Normal';
      default: return 'Prioritas Normal';
    }
  };

  const checkIsOverdue = (dateString, status) => {
    if (!dateString || status === 'Selesai') return false;
    const deadline = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    return deadline < today;
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

  // --- API FETCH TASKS ---
  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    // Ambil ID user yang sedang login dari localStorage
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const currentUserId = user ? user.id : null;

    if (!token) return;

    try {
      const response = await fetch("http://localhost:4000/api/tasks", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();

        const formattedTasks = data.map(t => {
          // --- LOGIKA FILTER KOMENTAR ---
          // Cari komentar di array 'comments' yang authorId-nya sama dengan user login
          const myComment = t.comments.find(c => c.authorId === currentUserId);
          const catatanPribadi = myComment ? myComment.text : ""; // Jika ada ambil text-nya, jika tidak kosong

          return {
            id: t.id,
            judul: t.title,
            deskripsi: t.description || "-",
            status: mapStatusBEtoFE(t.status),
            rawDate: t.dueDate,
            deadline: t.dueDate ? new Date(t.dueDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }) : "-",
            prioritas: mapPrioritasBEtoFE(t.prioritas),
            assigner: t.createdBy ? t.createdBy.name : "Admin",

            // Simpan catatan pribadi user ini
            catatan: catatanPribadi
          };
        });

        setTasks(formattedTasks);
        calculateStats(formattedTasks);
      }
    } catch (error) {
      console.error("Gagal mengambil data tugas:", error);
    }
  };

  const calculateStats = (taskList) => {
    const baru = taskList.filter(t => t.status === "Pending").length;
    const progress = taskList.filter(t => t.status === "On Progress").length;
    const selesai = taskList.filter(t => t.status === "Selesai").length;

    setStats([
      { label: "Pending", value: baru, color: "text-orange-500" },
      { label: "On Progress", value: progress, color: "text-blue-500" },
      { label: "Selesai", value: selesai, color: "text-green-600" },
    ]);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // --- HANDLER UPDATE STATUS ---
  const handleUpdateStatus = async (id, newStatusBE) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:4000/api/tasks/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatusBE })
      });

      if (response.ok) {
        Swal.fire("Berhasil", "Status tugas diperbarui", "success");
        fetchTasks();
      }
    } catch (error) {
      Swal.fire("Error", "Terjadi kesalahan koneksi", "error");
    }
  };

  // --- HANDLER MODAL CATATAN ---
  const handleOpenNoteModal = (task) => {
    setCurrentTaskNote(task);
    setNoteText(task.catatan); // Isi form dengan catatan yang sudah ada (jika ada)
    setShowNoteModal(true);
  };

  // --- HANDLER SIMPAN CATATAN (KE ROUTE BARU) ---
  const handleSaveNote = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      // Kita kirim 'text' karena backend membacanya sebagai 'text' untuk tabel TaskComment
      const response = await fetch(`http://localhost:4000/api/tasks/${currentTaskNote.id}/note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text: noteText })
      });

      if (response.ok) {
        Swal.fire("Tersimpan", "Catatan berhasil diperbarui", "success");
        setShowNoteModal(false);
        fetchTasks(); // Refresh agar tampilan tombol berubah (Tambah -> Edit)
      } else {
        Swal.fire("Gagal", "Gagal menyimpan catatan", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Terjadi kesalahan koneksi", "error");
    }
  };

  // --- HANDLER GENERATE PDF ---
  const generatePDF = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Not logged in");
      return;
    }

    try {
      // Call backend API (no loading notification)
      const response = await fetch("http://localhost:4000/api/tasks/export/pdf", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) {
        console.error("Failed to generate PDF");
        return;
      }

      // Convert response to blob
      const blob = await response.blob();

      // Download file silently
      try {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Daftar_Tugas_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();

        // Cleanup after a short delay
        setTimeout(() => {
          try {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          } catch (e) {
            // Ignore cleanup errors
          }
        }, 100);
      } catch (downloadError) {
        console.warn('Download warning:', downloadError);
      }

      // No success notification - just silent download

    } catch (error) {
      console.error("Error generating PDF:", error);
      // No error notification shown to user
    }
  };

  return (
    <div className="flex bg-gradient-to-b from-[#E8F5E9] via-[#E8F5E9] to-[#DCEDC8] min-h-screen">
      <AsideTendik />

      <main className="flex-1">
        <Topbar title="Daftar Tugas" subtitle="Kelola dan selesaikan tugas yang diberikan" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center h-32">
              <h3 className={`text-4xl font-bold ${s.color}`}>{s.value}</h3>
              <p className="text-gray-500 text-sm mt-2 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* PDF Export Button */}
        <div className="flex justify-end mr-8 ml-8 mb-4">
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white rounded-xl shadow-md hover:shadow-lg transition-all font-bold text-sm cursor-pointer"
          >
            <FiDownload className="text-lg" />
            Generate PDF
          </button>
        </div>

        <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 flex flex-wrap sm:flex-nowrap overflow-x-auto mr-8 ml-8">
          {tabs.map((t, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(t)}
              className={`flex-1 text-center px-4 py-3 text-sm font-semibold transition-all duration-200 rounded-lg whitespace-nowrap ${activeTab === t
                ? 'bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-5 p-8">
          {(() => {
            const filtered = activeTab === "Semua Tugas" ? tasks : tasks.filter((tt) => tt.status === activeTab);

            if (filtered.length === 0) {
              return (
                <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                  Tidak ada tugas untuk kategori ini.
                </div>
              );
            }

            return filtered.map((task, i) => {
              const isOverdue = checkIsOverdue(task.rawDate, task.status);

              return (
                <div key={i} className={`bg-white p-6 rounded-2xl shadow-sm border transition-shadow hover:shadow-md relative ${isOverdue ? 'border-l-4 border-l-red-500' : 'border-gray-100'}`}>

                  <div className="flex justify-between items-start mb-2 pr-28">
                    <h3 className="text-lg font-bold leading-tight text-gray-800">{task.judul}</h3>
                  </div>

                  <div className="absolute top-6 right-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-600`}>
                      {task.status}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm mb-5 leading-relaxed max-w-4xl whitespace-pre-wrap">{linkifyText(task.deskripsi)}</p>

                  <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs font-medium text-gray-500 mb-6">
                    <div className={`flex items-center gap-1.5 ${isOverdue ? "text-red-600 font-bold bg-red-50 px-2 py-1 rounded-md" : ""}`}>
                      <FiCalendar className={isOverdue ? "text-red-600" : "text-gray-400"} />
                      <span>{isOverdue ? `Terlambat: ${task.deadline}` : `Deadline: ${task.deadline}`}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FiFlag className={task.prioritas === "Prioritas Tinggi" ? "text-red-500" : "text-green-600"} />
                      <span>{task.prioritas}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FiUser className="text-gray-400" />
                      <span>{task.assigner}</span>
                    </div>

                    {/* Tanda Ada Catatan */}
                    {task.catatan && (
                      <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                        <FiMessageSquare /> Ada Catatan
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-50">

                    {task.status === "Pending" && (
                      <button
                        onClick={() => handleUpdateStatus(task.id, 'DALAM_PROGERSS')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 text-xs font-bold hover:bg-green-200 transition-colors cursor-pointer"
                      >
                        <FiPlayCircle /> Mulai Tugas
                      </button>
                    )}
                    {task.status === "On Progress" && (
                      <button
                        onClick={() => handleUpdateStatus(task.id, 'SELESAI')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 text-xs font-bold hover:bg-green-200 transition-colors"
                      >
                        <FiCheckCircle /> Tandai Selesai
                      </button>
                    )}

                    {task.status !== "Selesai" && (
                      <button
                        onClick={() => handleOpenNoteModal(task)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        <FiMessageSquare className="text-sm" />
                        {/* Ubah teks tombol jika sudah ada catatan */}
                        {task.catatan ? "Lihat/Edit Catatan" : "Tambah Catatan"}
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedTask(task)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      <FiEye className="text-sm" /> Lihat Detail
                    </button>
                  </div>

                </div>
              );
            });
          })()}
        </div>

        {/* MODAL 1: DETAIL TUGAS */}
        {selectedTask && (
          <Modal title="Detail Tugas" onClose={() => setSelectedTask(null)}>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-800 text-lg">{selectedTask.judul}</h4>
                <div className="mt-1 flex gap-2">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold">{selectedTask.status}</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold">{selectedTask.prioritas}</span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Deskripsi</p>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{linkifyText(selectedTask.deskripsi)}</p>
              </div>

              {/* Tampilkan Catatan Pribadi di Detail */}
              {selectedTask.catatan ? (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-600 uppercase font-bold mb-1 flex items-center gap-1">
                    <FiMessageSquare /> Catatan Anda
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedTask.catatan}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">Belum ada catatan untuk tugas ini.</p>
              )}

              <div className="flex justify-end mt-4">
                <button onClick={() => setSelectedTask(null)} className="px-4 py-2 bg-gray-200 rounded text-sm font-bold">Tutup</button>
              </div>
            </div>
          </Modal>
        )}

        {/* MODAL 2: FORM INPUT/EDIT CATATAN */}
        {showNoteModal && (
          <Modal
            title={<div className="flex items-center gap-2"><FiMessageSquare /> <span>Catatan Tugas</span></div>}
            onClose={() => setShowNoteModal(false)}
          >
            <form onSubmit={handleSaveNote} className="space-y-4 mt-2">
              <div>
                <p className="text-xs font-bold text-gray-500 mb-2">Tugas: {currentTaskNote?.judul}</p>
                <textarea
                  autoFocus
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition placeholder-gray-400"
                  placeholder="Tuliskan catatan progres, kendala, atau informasi tambahan di sini..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2 shadow-md"
                >
                  <FiSave /> Simpan Catatan
                </button>
              </div>
            </form>
          </Modal>
        )}

      </main>
    </div>
  );
};

export default DaftarTugas;