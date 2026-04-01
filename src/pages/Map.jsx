import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapLevel from '../components/MapLevel/MapLevel';

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

    // ข้อมูลคำแนะนำตามระดับสี เดี๋ยวเปลี่ยนเป็นตาม utils
    const getAdvice = (aqi) => {
        if (aqi <= 50) return { text: "ดี", color: "#00e400" };
        if (aqi <= 100) return { text: "ปานกลาง", color: "#ffff00" };
        if (aqi <= 150) return { text: "เริ่มมีผลต่อกลุ่มเสี่ยง", color: "#ff7e00" };
        if (aqi <= 200) return { text: "ไม่ดีต่อสุขภาพ", color: "#ff0000" };
        return { text: "อันตราย", color: "#8f3f97" };
    };
    
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
                const info = getAdvice(s.aqi);
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
                        <Popup offset={[0, -40]}>
                            <div style={{ textAlign: 'center', padding: '5px' }}>
                                <strong>{s.station.name}</strong><br />
                                AQI: <span style={{ color: info.color, fontWeight: 'bold' }}>{s.aqi}</span><br />
                                สถานะ: {info.text}
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
        <MapLevel />
        </div>
    );
}

