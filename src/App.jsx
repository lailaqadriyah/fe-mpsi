import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Login from './pages/admin/Login';
import Aside from './components/Aside';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import ManajemenKaryawan from './pages/admin/ManajemenKaryawan';


function App() {
 return (
     <Router>
    <>
    <main>
      <Routes>
          <Route path="/" element={<Aside />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          <Route path="/admin/manajemenKaryawan" element={<ManajemenKaryawan />} />
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
