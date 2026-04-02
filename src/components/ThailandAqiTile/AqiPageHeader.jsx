import { getLevel } from "../../utils/helpers";

export default function AqiPageHeader({
  worst,
  best,
  dangerous,
  cities,
  refreshing,
  onRefresh,
}) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="aqipage-header">
      <div className="header-left">
        <h1 className="aqipage-title">คุณภาพอากาศประเทศไทย</h1>
        <p className="aqipage-subtitle">
          {dateStr} · {timeStr} น. · {cities.length} สถานีตรวจวัด
        </p>
      </div>

      <div className="header-right">
        <div className="summary-stats">
          {worst && (
            <div className="summary-stat">
              <span className="summary-stat-label">แย่ที่สุด</span>
              <span
                className="summary-stat-value"
                style={{
                  color: getLevel(worst.aqi).color,
                }}
              >
                {worst.aqi}
              </span>
              <span className="summary-stat-city">{worst.city}</span>
            </div>
          )}
          {best && (
            <div className="summary-stat">
              <span className="summary-stat-label">ดีที่สุด</span>
              <span
                className="summary-stat-value"
                style={{ color: getLevel(best.aqi).color }}
              >
                {best.aqi}
              </span>
              <span className="summary-stat-city">{best.city}</span>
            </div>
          )}
          {dangerous > 0 && (
            <div className="summary-stat summary-stat--alert">
              <span className="summary-stat-label">อันตราย</span>
              <span className="summary-stat-value" style={{ color: "#ef4444" }}>
                {dangerous}
              </span>
              <span className="summary-stat-city">สถานี</span>
            </div>
          )}
        </div>

        <button
          className={`refresh-btn ${refreshing ? "refreshing" : ""}`}
          onClick={onRefresh}
          disabled={refreshing}
          title="รีเฟรชข้อมูล"
        >
          ↻
        </button>
      </div>
    </div>
  );
}
