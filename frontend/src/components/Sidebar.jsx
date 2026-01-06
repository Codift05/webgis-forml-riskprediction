import React, { useMemo } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
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

const Sidebar = ({ data }) => {
    const stats = useMemo(() => {
        if (!data || !data.features) return { low: 0, medium: 0, high: 0, total: 0 };

        const counts = { low: 0, medium: 0, high: 0, total: data.features.length };
        data.features.forEach(f => {
            const level = f.properties.risk_level.toLowerCase();
            if (counts[level] !== undefined) counts[level]++;
        });
        return counts;
    }, [data]);

    const barData = {
        labels: ['Low', 'Medium', 'High'],
        datasets: [
            {
                label: 'Risk Areas',
                data: [stats.low, stats.medium, stats.high],
                backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
                borderColor: ['#16a34a', '#ca8a04', '#dc2626'],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#cbd5e1' } },
            title: { display: false },
        },
        scales: {
            y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.1)' } },
            x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
        }
    };

    const donutData = {
        labels: ['Low', 'Medium', 'High'],
        datasets: [
            {
                data: [stats.low, stats.medium, stats.high],
                backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
                borderWidth: 0,
            },
        ],
    };

    return (
        <div className="sidebar">
            <div className="title">
                WebGIS Risk Prediction
            </div>

            <div className="card">
                <h3>Overview</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
                    <div>
                        <div className="stat-value" style={{ color: '#ef4444' }}>{stats.high}</div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>High Risk</div>
                    </div>
                    <div>
                        <div className="stat-value" style={{ color: '#eab308' }}>{stats.medium}</div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Medium</div>
                    </div>
                    <div>
                        <div className="stat-value" style={{ color: '#22c55e' }}>{stats.low}</div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Low</div>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3>Risk Distribution</h3>
                <Bar data={barData} options={chartOptions} />
            </div>

            <div className="card">
                <h3>Composition</h3>
                <div style={{ height: '200px', display: 'flex', justifyContent: 'center' }}>
                    <Doughnut data={donutData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                </div>
            </div>

            <div className="card">
                <h3>About</h3>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                    This system predicts environmental risk in Manado based on population, waste volume, and spatial features using Random Forest.
                </p>
            </div>
        </div>
    );
};

export default Sidebar;
