import React from 'react';

const MethodologyModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex',
            justifyContent: 'center', alignItems: 'center'
        }}>
            <div style={{
                backgroundColor: '#1e293b', width: '600px', maxHeight: '80vh',
                overflowY: 'auto', padding: '30px', borderRadius: '12px',
                color: '#f8fafc', boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0, color: '#60a5fa' }}>Metodologi: Risiko Sampah</h2>
                    <button onClick={onClose} style={{
                        background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer'
                    }}>&times;</button>
                </div>

                <div style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
                    <p>Sistem ini menggunakan algoritma <strong>Machine Learning (Random Forest Classifier)</strong> untuk memprediksi tingkat risiko penumpukan sampah liar secara spasial.</p>

                    <h3 style={{ color: '#eab308' }}>1. Variabel Input (Fitur)</h3>
                    <ul style={{ paddingLeft: '20px', color: '#cbd5e1' }}>
                        <li><strong>Kepadatan Penduduk (Pop Density)</strong>: Jumlah penduduk per km². Semakin padat, potensi sampah semakin tinggi.</li>
                        <li><strong>Jarak ke TPS (Distance to TPS)</strong>: Jarak Euclidean ke Tempat Pembuangan Sementara terdekat. Semakin jauh, risiko buang sampah sembarangan semakin tinggi.</li>
                        <li><strong>Volume Sampah (Waste Volume)</strong>: Estimasi timbulan sampah harian berdasarkan jenis kawasan (Pasar &gt; Pemukiman &gt; Sekolah).</li>
                        <li><strong>Akses Jalan</strong>: Kualitas infrastruktur jalan (Baik/Sedang/Buruk).</li>
                    </ul>

                    <h3 style={{ color: '#eab308' }}>2. Model Machine Learning</h3>
                    <p>Random Forest dipilih karena:</p>
                    <ul style={{ paddingLeft: '20px', color: '#cbd5e1' }}>
                        <li>Akurasi tinggi pada data non-linear.</li>
                        <li>Tahan terhadap <em>overfitting</em> (dibandingkan Decision Tree biasa).</li>
                        <li>Dapat menangani variabel numerik dan kategorikal sekaligus.</li>
                    </ul>

                    <h3 style={{ color: '#eab308' }}>3. Interpretasi Output</h3>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <span style={{ padding: '4px 8px', backgroundColor: '#ef4444', borderRadius: '4px', fontSize: '0.8rem' }}>Tinggi</span> Area prioritas penanganan segera.
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                        <span style={{ padding: '4px 8px', backgroundColor: '#eab308', borderRadius: '4px', color: 'black', fontSize: '0.8rem' }}>Sedang</span> Area perlu pengawasan berkala.
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                        <span style={{ padding: '4px 8px', backgroundColor: '#22c55e', borderRadius: '4px', fontSize: '0.8rem' }}>Rendah</span> Area terkendali.
                    </div>
                </div>

                <div style={{ marginTop: '30px', textAlign: 'right' }}>
                    <button onClick={onClose} style={{
                        padding: '10px 20px', backgroundColor: '#2563eb', color: 'white',
                        border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600'
                    }}>Tutup</button>
                </div>
            </div>
        </div>
    );
};

export default MethodologyModal;
