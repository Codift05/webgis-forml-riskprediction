import React from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = ({ data }) => {
    const mapCenter = [1.49, 124.84]; // Manado approx center
    const zoomLevel = 13;

    const onEachFeature = (feature, layer) => {
        if (feature.properties) {
            const { risk_level, risk_score, pop_density, waste_volume, zone_type } = feature.properties;

            // Formatting
            let riskLabel = 'Rendah';
            let riskColor = '#22c55e'; // Low

            if (risk_level === 'Medium') { riskLabel = 'Sedang'; riskColor = '#eab308'; }
            if (risk_level === 'High') { riskLabel = 'Tinggi'; riskColor = '#ef4444'; }

            const popupContent = `
        <div class="popup-content">
          <h4>Risiko: <span style="color:${riskColor}">${riskLabel}</span></h4>
          <div class="popup-row"><span>Skor:</span> <strong>${risk_score.toFixed(2)}</strong></div>
          <hr style="border-color: rgba(255,255,255,0.1); margin: 5px 0;" />
          <div class="popup-row"><span>Zona:</span> ${zone_type}</div>
          <div class="popup-row"><span>Kepadatan:</span> ${Math.round(pop_density)} /km²</div>
          <div class="popup-row"><span>Vol Sampah:</span> ${Math.round(waste_volume)} kg</div>
        </div>
      `;
            layer.bindPopup(popupContent, { className: 'custom-popup' });
        }
    };

    const pointToLayer = (feature, latlng) => {
        const risk = feature.properties.risk_level;
        let color = '#22c55e'; // Low
        if (risk === 'Medium') color = '#eab308';
        if (risk === 'High') color = '#ef4444';

        const markerOptions = {
            radius: 6,
            fillColor: color,
            color: '#333', // Dark border for contrast on light map
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        return L.circleMarker(latlng, markerOptions);
    };

    return (
        <div className="map-container">
            <MapContainer
                center={mapCenter}
                zoom={zoomLevel}
                zoomControl={false}
                style={{ height: "100%", width: "100%" }}
            >
                <ZoomControl position="topright" />
                <TileLayer
                    attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
                    url="http://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                />
                {data && (
                    <GeoJSON
                        data={data}
                        pointToLayer={pointToLayer}
                        onEachFeature={onEachFeature}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default MapView;
