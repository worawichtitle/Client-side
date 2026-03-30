import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getThaiAqiLevel } from '../../utils/aqiHelper';

import './Detail.css';
import MainAqiWidget from '../../components/MainAqiWidget/MainAqiWidget';

const API_TOKEN = "";
const BASE_URL = "https://api.waqi.info/feed";

const Detail = () => {
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
          
          if (result.data?.status === "error") {
            setError(`ไม่พบข้อมูลสถานี: ${result.data?.msg || 'ไม่ทราบสาเหตุ'}`); 
          } else {
            setAqiData(result.data);
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
        <Link to="/list" className="back-btn">
          <i className="fa-solid fa-chevron-left"></i>
        </Link>
        <h1>รายงานคุณภาพอากาศ: {aqiData?.city?.name}</h1>
      </header>
      <main>
        {aqiData && <MainAqiWidget aqiData={aqiData} levelData={levelData} />}

        <section className="detail-section">
          <h3>พยากรณ์ล่วงหน้า (PM 2.5)</h3>
          <ul>
            {aqiData?.forecast?.daily?.pm25?.slice(0, 5).map((item, index) => (
              <li key={index}>
                วันที่: {item.day} | ค่าเฉลี่ย: {item.avg}
              </li>
            ))}
          </ul>
        </section>

        <section className="detail-section">
          <h3>ผลกระทบ</h3>
        </section>
      </main>
      
      <footer>
        <p>คำแนะนำสุขภาพจะปรากฏที่นี่ตามระดับ AQI</p>
      </footer>
    </div>
  );
};

export default Detail;