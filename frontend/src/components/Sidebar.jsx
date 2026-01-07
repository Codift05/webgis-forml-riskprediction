import React, { useMemo, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import SimulationPanel from './SimulationPanel';
import { DashboardIcon, ChartIcon, InfoIcon, BoltIcon } from './Icons';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Sidebar = ({ data, onOpenMethodology }) => {
    const [showSim, setShowSim] = useState(false);

    const stats = useMemo(() => {
        if (!data || !data.features) return { low: 0, medium: 0, high: 0, total: 0 };

        const counts = { low: 0, medium: 0, high: 0, total: data.features.length };
        data.features.forEach(f => {
            const level = f.properties.risk_level;
            if (level === 'Low') counts.low++;
            if (level === 'Medium') counts.medium++;
            if (level === 'High') counts.high++;
        });
        return counts;
    }, [data]);

    const barData = {
        labels: ['Rendah', 'Sedang', 'Tinggi'],
        datasets: [
            {
                label: 'Area',
                data: [stats.low, stats.medium, stats.high],
                backgroundColor: ['#4ade80', '#eab308', '#f87171'], // Pastel Green, Yellow, Red
                borderRadius: 5,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#64748b' } },
            y: { grid: { display: false }, ticks: { display: false } }
        }
    };

    const donutData = {
        labels: ['Rendah', 'Sedang', 'Tinggi'],
        datasets: [
            {
                data: [stats.low, stats.medium, stats.high],
                backgroundColor: ['#4ade80', '#eab308', '#f87171'],
                borderWidth: 0,
            },
        ],
    };

    return (
        <div className="sidebar modern-sidebar">
            <div className="sidebar-header">
                <div className="logo-icon">🌿</div>
                <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>EnviroGuard</h2>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>WebGIS Risiko Sampah</span>
                </div>
            </div>

            <div className="nav-menu">
                <div className="nav-item active">
                    <DashboardIcon /> <span>Overview</span>
                </div>
                <div style={{ padding: '0 20px', marginBottom: '15px' }}>
                    <div className="stats-grid">
                        <div className="stat-card low">
                            <span className="label">Rendah</span>
                            <span className="value">{stats.low}</span>
                        </div>
                        <div className="stat-card mid">
                            <span className="label">Sedang</span>
                            <span className="value">{stats.medium}</span>
                        </div>
                        <div className="stat-card high">
                            <span className="label">Tinggi</span>
                            <span className="value">{stats.high}</span>
                        </div>
                    </div>
                </div>

                <div className="card-modern">
                    <div className="card-header">
                        <ChartIcon /> <span>Distribusi Risiko</span>
                    </div>
                    <div style={{ height: '140px' }}>
                        <Bar data={barData} options={chartOptions} />
                    </div>
                </div>

                <div className="card-modern">
                    <div className="card-header">
                        <ChartIcon /> <span>Komposisi Wilayah</span>
                    </div>
                    <div style={{ height: '140px', display: 'flex', justifyContent: 'center' }}>
                        <Doughnut data={donutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { boxWidth: 10 } } } }} />
                    </div>
                </div>

                <div className="action-area">
                    <button className="btn-modern-outline" onClick={onOpenMethodology}>
                        <InfoIcon /> Metodologi
                    </button>
                    <button className={`btn-modern-primary ${showSim ? 'active' : ''}`} onClick={() => setShowSim(!showSim)}>
                        <BoltIcon /> {showSim ? 'Tutup Simulasi' : 'Simulasi Kebijakan'}
                    </button>
                </div>

                {showSim && <SimulationPanel />}
            </div>

            <div className="sidebar-footer">
                <p>&copy; 2024 Manado Smart City</p>
            </div>
        </div>
    );
};

export default Sidebar;
