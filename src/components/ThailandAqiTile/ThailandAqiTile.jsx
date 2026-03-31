import { useState } from 'react';
import './ThailandAqiTile.css';

// Static Thailand city data with AQI values
const THAILAND_CITIES = [
  { id: 1, city: 'Chiang Mai', aqi: 182, flag: '🇹🇭' },
  { id: 2, city: 'Bangkok', aqi: 165, flag: '🇹🇭' },
  { id: 3, city: 'Phuket', aqi: 152, flag: '🇹🇭' },
  { id: 4, city: 'Chiang Rai', aqi: 148, flag: '🇹🇭' },
  { id: 5, city: 'Ubon Ratchathani', aqi: 145, flag: '🇹🇭' },
  { id: 6, city: 'Khon Kaen', aqi: 142, flag: '🇹🇭' },
  { id: 7, city: 'Udon Thani', aqi: 138, flag: '🇹🇭' },
  { id: 8, city: 'Nakhon Ratchasima', aqi: 135, flag: '🇹🇭' },
  { id: 9, city: 'Rayong', aqi: 128, flag: '🇹🇭' },
  { id: 10, city: 'Samut Prakan', aqi: 120, flag: '🇹🇭' },
];

const getAqiColor = (aqi) => {
  if (aqi <= 50) return 'aqi-green';
  if (aqi <= 100) return 'aqi-yellow';
  if (aqi <= 150) return 'aqi-orange';
  if (aqi <= 200) return 'aqi-red';
  return 'aqi-purple';
};

const getAqiLabel = (aqi) => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive';
  if (aqi <= 200) return 'Unhealthy';
  return 'Very Unhealthy';
};

export default function ThailandAqiTile() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="thailand-aqi-tile">
      <div className="tile-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="tile-title">
          <h3>Thailand Air Quality Ranking</h3>
          <span className="date">APR 1, 2026 01:00–02:00</span>
        </div>
        <button className="toggle-btn">
          <span className={`chevron ${isOpen ? 'open' : ''}`}>›</span>
        </button>
      </div>

      {isOpen && (
        <div className="tile-content">
          <table className="ranking-table">
            <thead>
              <tr>
                <th>#</th>
                <th>City</th>
                <th>AQI</th>
              </tr>
            </thead>
            <tbody>
              {THAILAND_CITIES.map((city, index) => (
                <tr key={city.id}>
                  <td className="ranking-number">{index + 1}</td>
                  <td className="city-name">
                    <span className="flag">{city.flag}</span>
                    {city.city}
                  </td>
                  <td>
                    <span className={`aqi-badge ${getAqiColor(city.aqi)}`}>
                      {city.aqi}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="tile-footer">
            <button className="see-full-ranking">See full ranking →</button>
          </div>
        </div>
      )}
    </div>
  );
}
