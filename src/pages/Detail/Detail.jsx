import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getThaiAqiLevel } from '../../utils/aqiHelper';

import './Detail.css';
import MainAqiWidget from '../../components/MainAqiWidget/MainAqiWidget';
import AqiForecast from '../../components/AqiForecast/AqiForecast';

const API_TOKEN = import.meta.env.VITE_AQI_API_TOKEN;
const BASE_URL = "https://api.waqi.info/feed";

function Detail() {
  const { cityName = "here" } = useParams(); 
  
  const [aqiData, setAqiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCityData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BASE_URL}/${cityName}/?token=${API_TOKEN}`);
        const result = await response.json();

        if (result?.status === "ok") {
          
          if (result?.data?.status === "error") {
            setError(`ไม่พบข้อมูลสถานี: ${result?.data?.msg || 'ไม่ทราบสาเหตุ'}`); 
          } else {
            setAqiData(result?.data);
          }
          
        } else {
          setError(result?.data || "ไม่พบข้อมูลสำหรับเมืองที่ระบุ");
        }
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCityData();
  }, [cityName]);
  
  const levelData = getThaiAqiLevel(aqiData?.aqi);

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>กำลังดึงข้อมูลสภาพอากาศของ {cityName}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>ขออภัย! เกิดข้อผิดพลาด</h2>
        <p>{error}</p>
        <Link to="/">กลับไปหน้าหลัก</Link>
      </div>
    );
  }

  return (
    <div className="detail-page-container">
      <header className="detail-header">
        <Link to="/list" className="detail-back-btn">
          <i className="fa-solid fa-chevron-left"></i>
        </Link>
        <h1>รายงานคุณภาพอากาศ: {aqiData?.city?.name}</h1>
      </header>
      <main>
        {aqiData && <MainAqiWidget aqiData={aqiData} levelData={levelData} />}

        <div className="detail-bottom-widgets-layout">

          {/* left  */}
          {aqiData?.forecast?.daily?.pm25?.length > 0 ? (
            <div className="detail-layout-col-left">
              <AqiForecast aqiData={aqiData} />
            </div>
          ) : (
            <div className="detail-layout-col-full">
              <div className="detail-forecast-empty-card">
                <i className="fa-solid fa-calendar-xmark"></i>
                <p>ไม่มีข้อมูลพยากรณ์ล่วงหน้าสำหรับสถานีนี้</p>
              </div>
            </div>
          )}

          {/* right */}
          <div style={{ width: '50%' }}>
          </div>

        </div>
      </main>
      
      <footer>
        <p>คำแนะนำสุขภาพจะปรากฏที่นี่ตามระดับ AQI</p>
      </footer>
    </div>
  );
};

export default Detail;