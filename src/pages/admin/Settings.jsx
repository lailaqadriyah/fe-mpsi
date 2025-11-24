import React from "react";
import Aside from "../../components/Aside";
import Topbar from "../../components/Topbar";

const Settings = () => {
	return (
		<div className="flex bg-green-50 min-h-screen">
			<Aside />

			<main className="flex-1 p-8">
				<Topbar title="Pengaturan Sistem" subtitle="Konfigurasi parameter dan aturan sistem manajemen SDM" />

				<div className="space-y-6">
					{/* Aturan Absensi */}
					<section className="bg-white rounded-xl shadow p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="font-semibold text-green-800">Aturan Absensi</h2>
							<div className="text-sm text-gray-500">&nbsp;</div>
						</div>

						<div className="space-y-6">
							<div>
								<h3 className="text-sm font-semibold text-gray-700 mb-2">Jadwal Kerja Default</h3>
								<p className="text-xs text-gray-500 mb-2">Tetapkan aturan standar untuk menghitung keterlambatan.</p>
								<div className="flex items-center gap-4">
									<select className="px-3 py-2 rounded-md border w-64 text-sm">
										<option>Waktu Normal</option>
										<option>Waktu Fleksibel</option>
									</select>
									<button className="bg-green-600 text-white px-4 py-2 rounded-md">Simpan Aturan</button>
								</div>
							</div>

							<div>
								<h3 className="text-sm font-semibold text-gray-700 mb-2">Toleransi Keterlambatan</h3>
								<p className="text-xs text-gray-500 mb-2">Berapa menit batas maksimal keterlambatan yang masih diizinkan.</p>
								<div className="flex items-center gap-4">
									<input type="number" className="px-3 py-2 rounded-md border w-40 text-sm" defaultValue={15} />
									<button className="bg-green-600 text-white px-4 py-2 rounded-md">Simpan Toleransi</button>
								</div>
							</div>
						</div>
					</section>

					{/* Pengaturan Tugas & Laporan */}
					<section className="bg-white rounded-xl shadow p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="font-semibold text-green-800">Pengaturan Tugas & Laporan</h2>
							<div className="text-sm text-gray-500">&nbsp;</div>
						</div>

						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-sm font-semibold text-gray-700 mb-1">Wajib Lapor Harian</h3>
									<p className="text-xs text-gray-500">Aktifkan jika karyawan wajib mengirimkan laporan harian melalui sistem.</p>
								</div>
								<div>
									<label className="inline-flex items-center">
										<input type="checkbox" className="form-checkbox h-5 w-5 text-green-600" defaultChecked />
									</label>
								</div>
							</div>

							<div>
								<h3 className="text-sm font-semibold text-gray-700 mb-1">Batas Waktu Laporan</h3>
								<p className="text-xs text-gray-500 mb-2">Batas jam terakhir pengiriman laporan harian per hari kerja.</p>
								<div className="flex items-center gap-4">
									<input type="time" className="px-3 py-2 rounded-md border text-sm" defaultValue="17:30" />
									<button className="bg-green-600 text-white px-4 py-2 rounded-md">Simpan Batas Waktu</button>
								</div>
							</div>
						</div>
					</section>

					{/* Keamanan & Akun */}
					<section className="bg-white rounded-xl shadow p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="font-semibold text-green-800">Keamanan & Akun</h2>
							<div className="text-sm text-gray-500">&nbsp;</div>
						</div>

						<div className="space-y-4">
							<div>
								<h3 className="text-sm font-semibold text-gray-700 mb-2">Ubah Password Admin</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<input type="password" placeholder="Password Baru" className="px-3 py-2 rounded-md border" />
									<input type="password" placeholder="Konfirmasi Password Baru" className="px-3 py-2 rounded-md border" />
								</div>
								<div className="mt-3">
									<button className="bg-green-600 text-white px-4 py-2 rounded-md">Ubah Password</button>
								</div>
							</div>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
};

export default Settings;

