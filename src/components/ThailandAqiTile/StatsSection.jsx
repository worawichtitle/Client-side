export default function StatsSection({ cities }) {
  return (
    <div className="aqipage-section stats-section">
      <p className="section-label">สรุปภาพรวม</p>
      <div className="quick-stats">
        <div className="quick-stat">
          <span className="quick-stat-icon">📊</span>
          <div>
            <span className="quick-stat-val">
              {cities.filter((c) => c.aqi <= 50).length}
            </span>
            <span className="quick-stat-desc">สถานีคุณภาพดี</span>
          </div>
        </div>
        <div className="quick-stat">
          <span className="quick-stat-icon">⚠️</span>
          <div>
            <span className="quick-stat-val">
              {cities.filter((c) => c.aqi > 100).length}
            </span>
            <span className="quick-stat-desc">สถานีที่น่ากังวล</span>
          </div>
        </div>
        <div className="quick-stat">
          <span className="quick-stat-icon">🚨</span>
          <div>
            <span className="quick-stat-val">
              {cities.filter((c) => c.aqi > 150).length}
            </span>
            <span className="quick-stat-desc">สถานีอันตราย</span>
          </div>
        </div>
      </div>
    </div>
  );
}
