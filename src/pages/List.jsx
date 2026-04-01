import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAqiLevel } from "../utils/aqiHelper";
import Loading from "../components/Loading/Loading";
import Error from "../components/Error/Error";
import "./List.css";

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

export default function List() {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllCitiesData = async () => {
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
                  station: result?.data?.city?.station?.name || "",
                };
              }
              return null;
            } catch (err) {
              console.error(`Failed to fetch ${cityName}:`, err);
              return null;
            }
          }),
        );

        const validCities = cityData
          .filter((city) => city !== null)
          .sort((a, b) => b.aqi - a.aqi);

        setCities(validCities);
      } catch (err) {
        setError("ไม่สามารถดึงข้อมูลคุณภาพอากาศได้");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllCitiesData();
  }, []);

  if (isLoading) {
    return <Loading message="กำลังดึงข้อมูลคุณภาพอากาศของเมืองไทย..." />;
  }

  if (error) {
    return <Error message={error} backLink="/" backText="กลับไปหน้าแรก" />;
  }

  return (
    <div className="list-page-container">
      <header className="list-header">
        <h1>รายชื่อคุณภาพอากาศ (ทั่วประเทศไทย)</h1>
        <p className="list-subtitle">ข้อมูลอากาศจากสถานีต่างๆ ทั่วประเทศไทย</p>
      </header>

      <main className="list-content">
        {cities.length === 0 ? (
          <div className="empty-state">
            <p>ไม่พบข้อมูลคุณภาพอากาศ</p>
          </div>
        ) : (
          <div className="cities-grid">
            {cities.map((city, index) => {
              const levelData = getAqiLevel(city.aqi);
              return (
                <Link
                  key={city.id}
                  to={`/detail/${city.city}`}
                  className="city-card"
                >
                  <div className="city-card-header">
                    <h3>{city.city}</h3>
                    <span className="rank-badge">#{index + 1}</span>
                  </div>
                  <div className="city-card-body">
                    <div className="aqi-display">
                      <div
                        className="aqi-number"
                        style={{ color: levelData.color }}
                      >
                        {city.aqi}
                      </div>
                      <div className="aqi-info">
                        <p
                          className="aqi-level"
                          style={{ color: levelData.color }}
                        >
                          {levelData.level}
                        </p>
                        <p className="aqi-meaning">{levelData.meaning}</p>
                      </div>
                    </div>
                  </div>
                  <div className="city-card-footer">
                    <span className="view-details">ดูรายละเอียด →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
