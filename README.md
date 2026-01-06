# WebGIS Berbasis Machine Learning untuk Prediksi Risiko Lingkungan 🌍
### Studi Kasus: Risiko Penumpukan Sampah Perkotaan di Kota Manado

<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Lambang_Kota_Manado.png" alt="Logo Kota Manado" width="100"/>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <!-- Tambahkan Logo Universitas/Instansi Lain di Sini -->
  <!-- <img src="URL_LOGO_KAMPUS" alt="Logo Universitas" width="100"/> -->
</div>

<br/>

<div align="center">

![Python](https://img.shields.io/badge/Python-3.9%2B-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-005571?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.3-F7931E?style=for-the-badge&logo=scikit-learn)

</div>

## 📌 Tentang Proyek
Proyek ini bertujuan untuk mengembangkan sistem **WebGIS Interaktif** yang mampu memprediksi tingkat risiko lingkungan (khususnya penumpukan sampah liar) di Kota Manado. Sistem ini mengintegrasikan **Analisis Spasial** dengan algoritma **Machine Learning (Random Forest)** untuk memberikan wawasan berbasis data bagi pengambil keputusan.

### ✨ Fitur Utama
*   **Peta Interaktif**: Visualisasi risiko wilayah (High/Medium/Low) menggunakan warna indikator.
*   **Prediksi Cerdas**: Menggunakan ML untuk memprediksi risiko berdasarkan Kepadatan Penduduk, Jarak ke TPS, dan Volume Sampah.
*   **Dashboard Analitik**: Grafik statistik real-time mengenai distribusi risiko di seluruh kota.
*   **Detail Wilayah**: Klik pada titik peta untuk melihat skor risiko dan faktor penyebab dominan.

## 🛠️ Arsitektur Teknologi
Sistem ini dibangun dengan arsitektur modern terpisah (Client-Server):

*   **Backend**: Python (FastAPI)
    *   *Machine Learning*: Scikit-Learn (Random Forest Classifier)
    *   *Data Processing*: Pandas, GeoPandas
*   **Frontend**: React.js (Vite)
    *   *Maps*: Leaflet & React-Leaflet
    *   *Charts*: Chart.js 
*   **Data Format**: GeoJSON

## 🚀 Cara Menjalankan

### Prasyarat
*   Python 3.8+
*   Node.js & NPM

### 1. Backend (API & Model)
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/Mac
# source venv/bin/activate

pip install -r requirements.txt

# Generate Data Dummy (Jika data asli belum tersedia)
python generate_data.py

# Latih Model
python train_model.py

# Jalankan Server
uvicorn app.main:app --reload
```
*Server akan berjalan di: `http://localhost:8000`*

### 2. Frontend (Web Interface)
```bash
cd frontend
npm install
npm run dev
```
*Aplikasi bisa diakses di: `http://localhost:5173`*

## ⚠️ Disclaimer Data
> **Catatan Penting untuk Penguji/Dosen:**
> Saat ini, sistem menggunakan **Data Sintetis (Dummy Generated)** yang disimulasikan menyerupai karakteristik geografis Kota Manado. 
> *   Koordinat titik dibuat random di dalam bounding box Manado.
> *   Variabel (Penduduk, Sampah) dibangkitkan dengan pola logika fuzzy untuk keperluan demonstrasi prototipe.
> 
> Sistem ini siap menerima **Dataset Riil** (Format GeoJSON/CSV) tanpa mengubah struktur kode utama.

## 👥 Kontributor
Dibuat oleh **[Nama Anda/Tim]** untuk memenuhi tugas [Mata Kuliah/Skripsi].

---
<div align="center">
  Copyright © 2026 WebGIS Manado Project
</div>
