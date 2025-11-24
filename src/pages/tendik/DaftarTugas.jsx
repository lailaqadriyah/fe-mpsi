import React, { useState } from "react";
import AsideTendik from "../../components/AsideTendik";
import Topbar from "../../components/Topbar";
import { FiCalendar, FiEye, FiEdit, FiTrash2, FiFlag, FiPlus } from "react-icons/fi";
import Modal from "../../components/Modal";

const DaftarTugas = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTab, setActiveTab] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState(null);

  const initials = (name) => name.split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase();

  return (
    <div className="flex bg-[#f3fff5] min-h-screen">
      <AsideTendik />

      <main className="flex-1 p-8">
        <Topbar title="Daftar Tugas" subtitle="Kelola dan selesaikan tugas yang diberikan" />

        <div className="flex justify-end mb-4">
          <button onClick={()=>setShowCreate(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow"><FiPlus/> Tambah Tugas</button>
        </div>

        {/* Tabs */}
        <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 mb-6">
          {tabs.map((t,i)=>(
            <button key={i} onClick={()=>setActiveTab(i)} className={`px-4 py-3 text-sm font-semibold ${i===activeTab? 'bg-green-600 text-white rounded-lg' : 'text-gray-600 hover:bg-gray-50'} mr-2`}>{t}</button>
          ))}
        </div>

        <div className="space-y-4">
          {(() => {
            const filtered = activeTab===0 ? tasks : tasks.filter(tt => tt.status === tabs[activeTab]);
            if(filtered.length===0) return <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">Tidak ada tugas untuk kategori ini.</div>
            return filtered.map((task,i)=> (
              <div key={i} className="bg-white p-6 rounded-xl shadow flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-green-800">{task.judul}</h3>
                    <p className="text-sm text-gray-600 mt-1">{task.deskripsi}</p>
                  </div>
                  <StatusBadge status={task.status} />
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-bold">{task.initial}</div>
                    <div className="font-medium">{task.nama}</div>
                  </div>

                  <div className="flex items-center gap-2"><FiCalendar className="text-green-600" /> <span>Deadline: {task.deadline}</span></div>
                  <div className="flex items-center gap-2"><FiFlag className="text-green-600" /> <PrioritasBadge prioritas={task.prioritas} /></div>
                </div>

                <div className="flex gap-2">
                  <ActionButton onClick={()=>setSelected(task)} color="blue" icon={<FiEye/>} label="Detail" />
                  <ActionButton color="yellow" icon={<FiEdit/>} label="Edit" />
                  <ActionButton color="red" icon={<FiTrash2/>} label="Hapus" />
                </div>
              </div>
            ))
          })()}
        </div>

        {showCreate && (
          <Modal title="Buat Tugas Baru" onClose={()=>setShowCreate(false)}>
            <TaskForm onCancel={()=>setShowCreate(false)} onSave={(values)=>{
              const newTask = {...values, initial: initials(values.assignee), nama: values.assignee};
              setTasks(prev=>[newTask,...prev]);
              setShowCreate(false);
            }} />
          </Modal>
        )}

        {selected && (
          <Modal title={`Detail Tugas: ${selected.judul}`} onClose={()=>setSelected(null)}>
            <div className="space-y-3 text-sm text-gray-700">
              <p className="text-xs text-gray-500">Ditugaskan Kepada</p>
              <p className="font-semibold">{selected.nama}</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Deadline</p>
                  <p>{selected.deadline}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Prioritas</p>
                  <p>{selected.prioritas}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">Deskripsi</p>
                <p className="text-gray-700">{selected.deskripsi}</p>
              </div>

              <div className="flex justify-end">
                <button onClick={()=>setSelected(null)} className="px-4 py-2 rounded bg-white border">Tutup</button>
              </div>
            </div>
          </Modal>
        )}

      </main>
    </div>
  )
}

export default DaftarTugas;

/* helpers & small components */
const tabs = ["Semua Tugas", "Pending", "Dalam Progress", "Selesai", "Terlambat"];

const StatusBadge = ({status})=>{
  const styles = {
    "Dalam Progress": "bg-blue-100 text-blue-700",
    "Pending": "bg-orange-100 text-orange-700",
    "Selesai": "bg-green-100 text-green-700",
    "Terlambat": "bg-red-100 text-red-700"
  };
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]||'bg-gray-100 text-gray-700'}`}>{status}</span>
}

const PrioritasBadge = ({prioritas})=>{
  const map = {"Prioritas Normal":"bg-green-100 text-green-700","Prioritas Tinggi":"bg-orange-100 text-orange-700","Urgent":"bg-red-100 text-red-700"};
  return <span className={`px-2 py-1 rounded text-xs font-semibold ${map[prioritas]||'bg-gray-100'}`}>{prioritas}</span>
}

const ActionButton = ({color, icon, label, onClick})=>{
  const colors={blue:'bg-blue-100 text-blue-600', yellow:'bg-orange-100 text-orange-600', red:'bg-red-100 text-red-600'};
  return <button type="button" onClick={onClick} className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-semibold ${colors[color]||''}`}>{icon} {label}</button>
}

const TaskForm = ({onCancel,onSave})=>{
  const [judul,setJudul]=useState('');
  const [deskripsi,setDeskripsi]=useState('');
  const [assignee,setAssignee]=useState('Ahmad Fauzi');
  const [deadline,setDeadline]=useState('');
  const [prioritas,setPrioritas]=useState('Prioritas Normal');
  const [status,setStatus]=useState('Pending');

  const submit=(e)=>{e.preventDefault(); onSave({judul,deskripsi,assignee,deadline,prioritas,status})}

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Judul</label>
        <input required value={judul} onChange={e=>setJudul(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded" />
      </div>
      <div>
        <label className="text-sm font-medium">Deskripsi</label>
        <textarea value={deskripsi} onChange={e=>setDeskripsi(e.target.value)} rows={4} className="w-full mt-1 px-3 py-2 border rounded" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <select value={assignee} onChange={e=>setAssignee(e.target.value)} className="px-3 py-2 border rounded">
          <option>Ahmad Fauzi</option>
          <option>Siti Rahma</option>
          <option>Dewi Lestari</option>
          <option>Eko Prasetyo</option>
        </select>
        <input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} className="px-3 py-2 border rounded" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <select value={prioritas} onChange={e=>setPrioritas(e.target.value)} className="px-3 py-2 border rounded">
          <option>Prioritas Normal</option>
          <option>Prioritas Tinggi</option>
          <option>Urgent</option>
        </select>
        <select value={status} onChange={e=>setStatus(e.target.value)} className="px-3 py-2 border rounded">
          <option>Pending</option>
          <option>Dalam Progress</option>
          <option>Selesai</option>
          <option>Terlambat</option>
        </select>
      </div>
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-100 rounded">Batal</button>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Simpan</button>
      </div>
    </form>
  )
}

const initialTasks = [
  { judul: "Inventarisasi Buku Baru", deskripsi: "Katalogisasi buku baru...", status: "Dalam Progress", nama: "Ahmad Fauzi", initial: "AF", deadline: "20 Nov 2025", prioritas: "Prioritas Tinggi" },
  { judul: "Pembuatan Laporan Bulanan", deskripsi: "Menyusun laporan...", status: "Selesai", nama: "Siti Rahma", initial: "SR", deadline: "15 Nov 2025", prioritas: "Prioritas Normal" },
  { judul: "Update Database Koleksi", deskripsi: "Perbaikan metadata...", status: "Pending", nama: "Dewi Lestari", initial: "DL", deadline: "25 Nov 2025", prioritas: "Prioritas Normal" },
]
