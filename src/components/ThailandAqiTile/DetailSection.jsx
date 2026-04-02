import { useNavigate } from "react-router-dom";
import { POLLUTANTS } from "../../data/constants";
import AqiGauge from "../AqiGauge/AqiGauge";
import { getPollutantColor, getPollutantStatus } from "../../utils/helpers";

export default function DetailSection({
  selectedCity,
  pollutants,
  pollutantsLoading,
}) {
  const navigate = useNavigate();

  if (!selectedCity) return null;

  return (
    <div className="aqipage-section detail-section">
      <div className="detail-header">
        <div>
          <p className="section-label" style={{ margin: 0 }}>
            รายละเอียดสถานีที่เลือก
          </p>
          <h2 className="detail-city-name">{selectedCity.city}</h2>
        </div>
        <button
          className="detail-navigate-btn"
          onClick={() => navigate(`/detail/@${selectedCity.id}`)}
        >
          ดูรายละเอียด →
        </button>
      </div>

      <AqiGauge aqi={selectedCity.aqi} />

      <div className="pollutant-section">
        <p className="section-label">ค่ามลพิษในอากาศ</p>
        {pollutantsLoading ? (
          <div className="loading-inline">
            <div className="loading-spinner small" /> กำลังโหลดข้อมูลมลพิษ...
          </div>
        ) : pollutants && Object.keys(pollutants).some((k) => POLLUTANTS[k]) ? (
          <div className="pollutant-grid">
            {Object.entries(pollutants)
              .filter(([k]) => POLLUTANTS[k])
              .map(([key, val]) => {
                const meta = POLLUTANTS[key];
                const v = typeof val.v === "number" ? val.v : parseFloat(val.v);
                const pct = Math.min((v / meta.max) * 100, 100);
                const color = getPollutantColor(key, v);
                const status = getPollutantStatus(key, v);
                return (
                  <div key={key} className="pollutant-card">
                    <div className="pollutant-top">
                      <div>
                        <span className="pollutant-name">{meta.label}</span>
                        <span className="pollutant-desc">{meta.desc}</span>
                      </div>
                      <div className="pollutant-val-wrap">
                        <span className="pollutant-val">
                          {isNaN(v) ? "—" : v.toFixed(1)}
                        </span>
                        <span className="pollutant-unit">{meta.unit}</span>
                      </div>
                    </div>
                    <div className="pollutant-track">
                      <div
                        className="pollutant-fill"
                        style={{ width: `${pct}%`, background: color }}
                      />
                      {/* safe threshold marker */}
                      <div
                        className="pollutant-safe-mark"
                        style={{
                          left: `${Math.min((meta.safeLimit / meta.max) * 100, 100)}%`,
                        }}
                        title={`เกณฑ์ปลอดภัย: ${meta.safeLimit} ${meta.unit}`}
                      />
                    </div>
                    <span className="pollutant-status" style={{ color }}>
                      {status}
                    </span>
                  </div>
                );
              })}
          </div>
        ) : (
          <p className="no-data-text">ไม่มีข้อมูลมลพิษสำหรับสถานีนี้</p>
        )}
      </div>
    </div>
  );
}
