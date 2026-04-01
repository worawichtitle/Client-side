import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAqiLevel } from '../../utils/aqiHelper';

import './Detail.css';
import MainAqiWidget from '../../components/MainAqiWidget/MainAqiWidget';
import AqiForecast from '../../components/AqiForecast/AqiForecast';
import HealthAdvice from '../../components/HealthAdvice/HealthAdvice';
import Loading from '../../components/Loading/Loading';
import Error from '../../components/Error/Error';

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
  
  const levelData = getAqiLevel(aqiData?.aqi);
  if (isLoading) {
    return <Loading message={`กำลังดึงข้อมูลสภาพอากาศของ ${cityName}...`} />;
  }

  if (error) {
    return <Error message={error} backLink="/list" backText="กลับไปหน้ารายการ" />;
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
          <div className="detail-layout-col-left">
            <AqiForecast aqiData={aqiData} />
          </div>

          {/* right */}
          <div className="detail-layout-col-right">
            <HealthAdvice levelData={levelData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Detail;