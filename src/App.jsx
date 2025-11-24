import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Login from './pages/admin/Login';
import Aside from './components/Aside';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import ManajemenKaryawan from './pages/admin/ManajemenKaryawan';
import ManajemenTugas from './pages/admin/ManajemenTugas';
import MonitoringAktivitas from './pages/admin/MonitoringAktivitas';
import LaporanRekap from './pages/admin/Laporan';
import Absensi from './pages/admin/Absensi';
import Settings from './pages/admin/Settings';
import DashboardTendik from './pages/tendik/DashboardTendik';
import AbsensiDigital from './pages/tendik/AbsensiDigital';
import LaporanHarian from './pages/tendik/LaporanHarian';
import DaftarTugas from './pages/tendik/DaftarTugas';
import RiwayatAktivitas from './pages/tendik/RiwayatAktivitas';
import Profil from './pages/tendik/Profil';


function App() {
 return (
     <Router>
    <>
    <main>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          <Route path="/admin/manajemenKaryawan" element={<ManajemenKaryawan />} />
          <Route path="/admin/manajemenTugas" element={<ManajemenTugas />} />
          <Route path="/admin/monitoringAktivitas" element={<MonitoringAktivitas />} />
          <Route path="/admin/laporan" element={<LaporanRekap />} />
          <Route path="/admin/absensi" element={<Absensi />} />
          <Route path="/admin/settings" element={<Settings />} />

          <Route path="/tendik/dashboardTendik" element={<DashboardTendik />} />
          <Route path="/tendik/absensiDigital" element={<AbsensiDigital />} />
          <Route path="/tendik/laporanHarian" element={<LaporanHarian />} />
          <Route path="/tendik/daftarTugas" element={<DaftarTugas />} />
          <Route path="/tendik/riwayatAktivitas" element={<RiwayatAktivitas />} />
          <Route path="/tendik/profil" element={<Profil />} />
          {/* <Route path="/detail-kursus/:id" element={<DetailKursus />} />
          <Route path="/bayar-kursus/:id" element={<Pembayaran />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/modul/:id" element={<Modul />} />
          <Route path="/tambah-kursus" element={<TambahKursus />} /> */}

      </Routes>
    </main>
    </>
     </Router>
  )
}

export default App
