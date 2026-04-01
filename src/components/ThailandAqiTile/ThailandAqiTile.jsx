import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ThailandAqiTile.css";

// Thai cities to fetch AQI data for
const THAI_CITY_NAMES = [
  "Chiang Mai",
  "Bangkok",
  "Phuket",
  "Chiang Rai",
  "Ubon Ratchathani",
  "Khon Kaen",
  "Udon Thani",
  "Nakhon Ratchasima",
  "Rayong",
  "Samut Prakan",
];

const API_TOKEN = import.meta.env.VITE_AQI_API_TOKEN;
const BASE_URL = "https://api.waqi.info/feed";

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
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThaiCitiesData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const cityData = await Promise.all(
          THAI_CITY_NAMES.map(async (cityName) => {
            try {
              const response = await fetch(
                `${BASE_URL}/${cityName}/?token=${API_TOKEN}`,
              );
              const result = await response.json();

              if (result?.status === "ok" && result?.data?.status !== "error") {
                return {
                  id: cityName,
                  city: result?.data?.city?.name || cityName,
                  aqi: result?.data?.aqi || 0,
                  flag: "🇹🇭",
                };
              }
              return null;
            } catch (err) {
              console.error(`Failed to fetch ${cityName}:`, err);
              return null;
            }
          }),
        );

        // Filter out failed requests and sort by AQI descending
        const validCities = cityData
          .filter((city) => city !== null)
          .sort((a, b) => b.aqi - a.aqi);

        setCities(validCities);
      } catch (err) {
        setError("Failed to fetch Thailand AQI data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThaiCitiesData();
  }, []);

  return (
    <div className="thailand-aqi-tile">
      <div className="tile-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="tile-title">
          <h3>Thailand Air Quality Ranking</h3>
          <span className="date">
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}{" "}
            {new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </span>
        </div>
        <button className="toggle-btn">
          <span className={`chevron ${isOpen ? 'open' : ''}`}>›</span>
        </button>
      </div>

      {isOpen && (
        <div className="tile-content">
          {isLoading ? (
            <div className="loading-state">
              <p>Loading Thailand air quality data...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
            </div>
          ) : cities.length === 0 ? (
            <div className="empty-state">
              <p>No data available for Thai cities</p>
            </div>
          ) : (
            <>
              <table className="ranking-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>City</th>
                    <th>AQI</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.map((city, index) => (
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
                <button
                  className="see-full-ranking"
                  onClick={() => navigate("/list")}
                >
                  See full ranking →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
