import React from 'react';
import './MainAqiWidget.css';

function MainAqiWidget({ aqiData, levelData }) {
  if (!aqiData) return null;

  const { aqi, time, iaqi, city } = aqiData;

  const formattedTime = new Date(time.iso).toLocaleString('th-TH', 
    { 
        year: 'numeric', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
    }
  );
  const smallStats = [
    { label: 'PM 2.5', value: iaqi?.pm25?.v || '-', unit: '', icon: 'fa-solid fa-smog' },
    { label: 'PM 10', value: iaqi?.pm10?.v || '-', unit: '', icon: 'fa-solid fa-lungs' },
    { label: 'O3 (โอโซน)', value: iaqi?.o3?.v || '-', unit: '', icon: 'fa-solid fa-cloud' },
    { label: 'NO2 (ไนโตรเจน)', value: iaqi?.no2?.v || '-', unit: '', icon: 'fa-solid fa-car-side' },
    { label: 'อุณหภูมิ', value: iaqi?.t?.v || '-', unit: '°C', icon: 'fa-solid fa-temperature-half' },
    { label: 'ความชื้น', value: iaqi?.h?.v || '-', unit: '%', icon: 'fa-solid fa-droplet' },
    { label: 'แรงลม', value: iaqi?.w?.v || '-', unit: 'm/s', icon: 'fa-solid fa-wind' },
    { label: 'ความกดอากาศ', value: iaqi?.p?.v || '-', unit: 'hPa', icon: 'fa-solid fa-gauge-high' }
  ];

  return (
    <div className={`widget ${levelData.class}`}>
      
      <div className="widget-header-bar">
        <i className="fa-solid fa-location-dot widget-icon-city"></i>
        <span className="widget-city-name">{city?.name || 'สถานีตรวจวัด'}</span>
      </div>
      <div className="widget-content">
        <div className="widget-body">
          
          {/* ฝั่งซ้าย */}
          <div className="widget-main">
            <span className="widget-label">AQI (PM 2.5)</span>
            <span className="widget-big-num">{aqi}</span>
            <span className="widget-status">{levelData.level}</span>
          </div>

          {/* ฝั่งขวา */}
          <div className="widget-side">
            {smallStats.map((stat, idx) => (
              <div key={idx} className="widget-small-stat">
                <div className="stat-label-with-icon">
                  <i className={`${stat.icon} widget-icon-small`}></i>
                  <span className="stat-label">{stat.label}</span>
                </div>
                <span className="stat-value">
                  {stat.value} <small>{stat.unit}</small>
                </span>
              </div>
            ))}
          </div>

        </div>
        <div className="widget-footer-time">
          <i className="fa-regular fa-clock widget-icon-time"></i>
          อัปเดตข้อมูล: {formattedTime} น.
        </div>
      </div>
    </div>
  );
}

export default MainAqiWidget;