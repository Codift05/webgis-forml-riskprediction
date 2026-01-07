import React, { useState } from 'react';
import axios from 'axios';

const SimulationPanel = () => {
    const [inputs, setInputs] = useState({
        pop_density: 3000,
        dist_tps: 500,
        waste_volume: 50,
        road_access: 'Moderate',
        zone_type: 'Residential'
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handlePredict = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/predict', inputs);
            setResult(response.data);
        } catch (err) {
            console.error(err);
            alert('Gagal melakukan prediksi. Pastikan backend berjalan.');
        }
        setLoading(false);
    };

    return (
        <div className="card-modern" style={{ marginTop: '20px', border: '2px solid #3b82f6', background: '#eff6ff' }}>
            <h3 style={{ color: '#1d4ed8', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⚡ Simulasi (What-If)
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '15px' }}>
                Uji skenario: Ubah parameter untuk prediksi risiko baru.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                    <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>Jarak ke TPS</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="range" name="dist_tps" min="50" max="5000" step="50" value={inputs.dist_tps} onChange={handleChange} style={{ flex: 1 }} />
                        <span style={{ fontSize: '0.8rem', width: '50px', textAlign: 'right' }}>{inputs.dist_tps} m</span>
                    </div>
                </div>

                <div>
                    <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>Kepadatan Penduduk</label>
                    <input type="number" name="pop_density" value={inputs.pop_density} onChange={handleChange}
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }} />
                </div>

                <div>
                    <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>Volume Sampah (kg)</label>
                    <input type="number" name="waste_volume" value={inputs.waste_volume} onChange={handleChange}
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }} />
                </div>

                <div>
                    <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>Akses Jalan</label>
                    <select name="road_access" value={inputs.road_access} onChange={handleChange}
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }}>
                        <option value="Good">Baik</option>
                        <option value="Moderate">Sedang</option>
                        <option value="Poor">Buruk</option>
                    </select>
                </div>

                <button onClick={handlePredict} disabled={loading} style={{
                    marginTop: '10px', padding: '12px', backgroundColor: '#eab308', color: 'black', fontWeight: 'bold',
                    border: 'none', borderRadius: '10px', cursor: 'pointer', width: '100%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    {loading ? 'Menghitung...' : 'Hitung Risiko'}
                </button>

                {result && (
                    <div style={{ marginTop: '15px', padding: '12px', background: 'white', borderRadius: '10px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Hasil Prediksi AI:</div>
                        <div style={{
                            fontSize: '1.4rem', fontWeight: '800', margin: '4px 0',
                            color: result.risk_level === 'High' ? '#ef4444' : result.risk_level === 'Medium' ? '#eab308' : '#22c55e'
                        }}>
                            {result.risk_level === 'High' ? 'TINGGI' : result.risk_level === 'Medium' ? 'SEDANG' : 'RENDAH'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Confidence: {(result.risk_score * 100).toFixed(1)}%</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SimulationPanel;
