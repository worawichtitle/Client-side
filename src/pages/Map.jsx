import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapLevel from '../components/MapLevel/MapLevel';
import MapPopup from '../components/MapPopup/MapPopup';

let DefaultIcon = L.icon({
    iconUrl: "-",
    iconSize: [40, 60],
    iconAnchor: [21, 60]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function Map() {
    const API_TOKEN = import.meta.env.VITE_AQI_API_TOKEN;
    const navigate = useNavigate();
    const [stations, setStations] = useState([]);
    const position = [13.7563, 100.5018]; // พิกัดเริ่มต้น (กรุงเทพฯ)

    const fetchStations = async (bounds) => {
        const url = `https://api.waqi.info/map/bounds/?latlng=${bounds}&token=${API_TOKEN}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.status === "ok") setStations(data.data);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    function MapEvents() {
        const map = useMapEvents({
            moveend: () => {
                const b = map.getBounds();
                const boundsStr = `${b.getSouth()},${b.getWest()},${b.getNorth()},${b.getEast()}`;
                fetchStations(boundsStr);
            },
        });
        return null;
    }

    return (
        <div style={{ height: 'calc(100vh - 160px)', width: '100%' }}>
        <MapContainer
            center={position}
            zoom={11} 
            scrollWheelZoom={true}
            style={{ height: '90%', width: '100%', borderRadius: '10px', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}
        >
            {/* 1. แผนที่พื้นหลัง (OSM_URL เดิมของคุณ) */}
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* 2. ชั้นข้อมูลฝุ่น (WAQI_URL เดิมของคุณ) */}
            <TileLayer
            url={`https://tiles.waqi.info/tiles/usepa-aqi/{z}/{x}/{y}.png?token=${API_TOKEN}`}
            attribution='Air Quality Tiles &copy; <a href="http://waqi.info">waqi.info</a>'
            />

            <MapEvents />

            {stations.map((s) => {
                let closeTimeout;
                return (
                    <Marker 
                        key={s.uid} 
                        position={[s.lat, s.lon]}
                        opacity={0}
                        eventHandlers={{
                            mouseover: (e) => {
                                clearTimeout(closeTimeout);
                                e.target.openPopup();
                            },
                            mouseout: (e) => {
                                closeTimeout = setTimeout(() => {
                                    e.target.closePopup();
                                }, 200);
                            },
                            click: () => navigate(`/detail/@${s.uid}`), // กดแล้วไปหน้า detail
                        }}
                    >
                        <MapPopup station={s} navigate={navigate} />
                    </Marker>
                );
            })}
        </MapContainer>
        <MapLevel />
        </div>
    );
}

