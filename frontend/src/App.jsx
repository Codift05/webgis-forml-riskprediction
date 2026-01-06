import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import './index.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch Data from Backend
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/risk-data');
        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load risk data. Ensure backend is running.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: 'white' }}>
        Loading WebGIS Data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#ef4444' }}>
        {error}
      </div>
    );
  }

  return (
    <div className="App">
      <Sidebar data={data} />
      <MapView data={data} />
    </div>
  );
}

export default App;
