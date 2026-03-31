import { getThaiAqiLevel } from '../../utils/aqiHelper';
import './AqiForecast.css';

function AqiForecast({ aqiData }) {
  const pm25Data = aqiData?.forecast?.daily?.pm25;
  if (!pm25Data || pm25Data.length === 0) {
    return null;
  }

  const todayStr = aqiData.time?.s?.split(' ')[0] || new Date().toISOString().split('T')[0];
  const todayIndex = pm25Data.findIndex((item) => item.day === todayStr);
  let displayData = pm25Data;

  if (todayIndex !== -1) {
    const start = Math.max(0, todayIndex - 3); // ย้อนหลัง 3 วัน
    const end = Math.min(pm25Data.length, todayIndex + 6); // ล่วงหน้า 5 วัน
    displayData = pm25Data.slice(start, end);
  } else {
    displayData = pm25Data.slice(0, Math.min(8, pm25Data.length)); // หา todayIndex ไม่เจอ
  }

  function formatDayLabel(dateString) {
    if (dateString === todayStr) return "วันนี้";
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div className="forecast-container">
        <div className="forecast-header">
            <h3><i className="fa-solid fa-calendar-week"></i> แนวโน้ม PM 2.5</h3>
        </div>

        <div className="forecast-list">
            {displayData.map((item) => {
            const level = getThaiAqiLevel(item.avg);
            const isToday = item.day === todayStr;
            const isPast = item.day < todayStr;

            return (
                <div 
                key={item.day}
                className={`forecast-item ${isToday ? 'forecast-item-today' : ''} ${isPast ? 'forecast-item-past' : ''}`}
                >
                    {/* date */}
                    <div className="forecast-date">
                        <span className="forecast-date-text">{formatDayLabel(item.day)}</span>
                        {isPast && <span className="forecast-badge">อดีต</span>}
                    </div>

                    {/* aqi pill */}
                    <div className={`forecast-pill ${level.class}`}>
                        <span className="forecast-num">{item.avg}</span>
                    </div>

                    {/* min max */}
                    <div className="forecast-minmax">
                        <span className="forecast-min">{item.min}</span>
                        <div className="forecast-line"></div>
                        <span className="forecast-max">{item.max}</span>
                    </div>
                </div>
            );
            })}
        </div>
    </div>
  );
}

export default AqiForecast;