import { getLevel } from "../../utils/helpers";

export default function HealthAlert({
  worst,
  worstRec,
  worstLevel,
  dangerous,
}) {
  if (!worst || !worstRec || !worstLevel) return null;

  return (
    <div
      className="aqipage-alert"
      style={{
        background: worstLevel.bg,
        borderLeftColor: worstLevel.color,
      }}
    >
      <span className="alert-emoji">{worstRec.icon}</span>
      <div className="alert-body">
        <p className="alert-title" style={{ color: worstLevel.textColor }}>
          {worstRec.title} · {worst.city} (AQI {worst.aqi})
        </p>
        <p className="alert-text">{worstRec.text}</p>
      </div>
      {dangerous > 1 && (
        <span className="alert-badge" style={{ background: worstLevel.color }}>
          +{dangerous - 1} สถานีอื่น
        </span>
      )}
    </div>
  );
}
