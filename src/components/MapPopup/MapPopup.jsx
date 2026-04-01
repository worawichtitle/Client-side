import React from 'react';
import { Popup } from 'react-leaflet';
import './MapPopup.css';
import { getAqiLevel } from '../../utils/aqiHelper';

const MapPopup = ({ station }) => {
    const info = getAqiLevel(station.aqi);
    const color = info.color;

    return (
        <Popup offset={[0, -40]} className="custom-aqi-popup">
            <div className="popup-container">
                <header className="popup-header">
                    <strong>{station.station.name}</strong>
                </header>
                
                <div className="popup-body">
                    <div className={`aqi-value ${info.class}`}>
                        <span className="aqi-number">{station.aqi}</span>
                        <span className="aqi-label">AQI</span>
                    </div>
                    <p className="aqi-status">สถานะ: <span style={{ color: color }}>{info.level}</span></p>
                </div>

                
            </div>
        </Popup>
    );
};

export default MapPopup;