import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
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
    const [hoveredStation, setHoveredStation] = useState(null);
    const [position, setPosition] = useState([13.7563, 100.5018]); // พิกัดเริ่มต้น (กรุงเทพฯ)
    const mapRef = useRef(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords = [pos.coords.latitude, pos.coords.longitude];
                setPosition(coords);
                if (mapRef.current) {
                    mapRef.current.flyTo(coords, 11);
                }
            },
            () => {}
        );
    }, []);

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
            mousemove: (e) => {
            let found = null;
            for (const s of stations) {
                const markerPoint = map.latLngToContainerPoint([s.lat, s.lon]);
                const adjustedPoint = L.point(markerPoint.x, markerPoint.y - 30);
                const mousePoint = e.containerPoint;
                const dist = adjustedPoint.distanceTo(mousePoint);
                if (dist < 30) {
                    found = s;
                    break;
                }
            }
            setHoveredStation(found);
            },
        });
        return null;
    }

    return (
        <div style={{ height: 'calc(100vh - 160px)', width: '100%' }}>
        <MapContainer
            ref={mapRef}
            center={position}
            zoom={11} 
            scrollWheelZoom={true}
            style={{ height: '90%', width: '100%', borderRadius: '10px', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}
        >
            {/* 1. แผนที่พื้นหลัง (OSM_URL) */}
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* 2. ชั้นข้อมูลฝุ่น (WAQI_URL) */}
            <TileLayer
            url={`https://tiles.waqi.info/tiles/usepa-aqi/{z}/{x}/{y}.png?token=${API_TOKEN}`}
            attribution='Air Quality Tiles &copy; <a href="http://waqi.info">waqi.info</a>'
            />

            <MapEvents />

            {stations.map((s) => {
                return (
                    <Marker
                        key={s.uid}
                        position={[s.lat, s.lon]}
                        opacity={0}
                        ref={(ref) => {
                            if (ref && hoveredStation?.uid === s.uid) ref.openPopup();
                            if (ref && hoveredStation?.uid !== s.uid) ref.closePopup();
                        }}
                        eventHandlers={{
                            click: () => navigate(`/detail/@${s.uid}`),
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

