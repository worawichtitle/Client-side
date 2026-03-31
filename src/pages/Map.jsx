import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

export default function Map() {
    const WAQI_TOKEN = "919cfe56edba50ac69a4158fd74f1a73f4fa7ce5";
    // พิกัดเริ่มต้น (กรุงเทพฯ)
    const position = [13.7563, 100.5018]; 
    
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
            url={`https://tiles.waqi.info/tiles/usepa-aqi/{z}/{x}/{y}.png?token=${WAQI_TOKEN}`}
            attribution='Air Quality Tiles &copy; <a href="http://waqi.info">waqi.info</a>'
            />
        </MapContainer>
        </div>
    );
}

