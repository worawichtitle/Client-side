import { getLevel, AQI_THRESHOLDS } from "../../utils/helpers";

export default function LegendSection({ cities }) {
  return (
    <div className="aqipage-section">
      <p className="section-label">ระดับคุณภาพอากาศ (AQI)</p>
      <div className="legend-list">
        {AQI_THRESHOLDS.map((threshold, i) => {
          const levelData = getLevel(threshold.max);
          const count = cities.filter((c) => {
            const prev = AQI_THRESHOLDS[i - 1];
            return c.aqi <= threshold.max && (!prev || c.aqi > prev.max);
          }).length;

          // Generate range text dynamically from thresholds
          let rangeText = "";
          if (i === 0) {
            rangeText = `0–${threshold.max}`;
          } else if (threshold.max === Infinity) {
            rangeText = `${AQI_THRESHOLDS[i - 1].max + 1}+`;
          } else {
            const prevMax = AQI_THRESHOLDS[i - 1].max;
            rangeText = `${prevMax + 1}–${threshold.max}`;
          }

          return (
            <div key={threshold.label} className="legend-item">
              <span
                className="legend-dot"
                style={{ background: levelData.color }}
              />
              <div className="legend-info">
                <span className="legend-label">{threshold.label}</span>
                <span className="legend-range">{rangeText}</span>
              </div>
              {count > 0 && (
                <span
                  className="legend-count"
                  style={{
                    background: levelData.color + "22",
                    color: levelData.textColor,
                  }}
                >
                  {count} สถานี
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
