// Loading, error, and gauge components extracted for cleaner code organization

import { getAqiLevel, getColorFromClass } from "../../utils/aqiHelper";

const getLevel = (aqi) => getAqiLevel(aqi);

export function AqiGauge({ aqi }) {
  const level = getLevel(aqi);
  const pct = Math.min((aqi / 300) * 100, 100);
  const segments = [
    { color: "#22c55e", width: "16.7%" },
    { color: "#eab308", width: "16.7%" },
    { color: "#f97316", width: "16.7%" },
    { color: "#ef4444", width: "16.7%" },
    { color: "#a855f7", width: "33.2%" },
  ];
  return (
    <div className="aqi-gauge">
      <div className="aqi-gauge-track">
        {segments.map((s, i) => (
          <div
            key={i}
            className="aqi-gauge-seg"
            style={{ width: s.width, background: s.color }}
          />
        ))}
        <div className="aqi-gauge-needle" style={{ left: `${pct}%` }} />
      </div>
      <div className="aqi-gauge-labels">
        <span>0</span>
        <span>50</span>
        <span>100</span>
        <span>150</span>
        <span>200</span>
        <span>300+</span>
      </div>
      <div className="aqi-gauge-readout" style={{ color: getColorFromClass(level.class) }}>
        <span className="aqi-gauge-num">{aqi}</span>
        <span className="aqi-gauge-label">{level.label}</span>
      </div>
    </div>
  );
}

export function LoadingState({ loadingText, loadingSub }) {
  return (
    <div className="aqipage-loading">
      <div className="loading-spinner" />
      <p>{loadingText}</p>
      <span className="loading-sub">{loadingSub}</span>
    </div>
  );
}

export function ErrorState({ error, onRetry, retryLabel }) {
  return (
    <div className="aqipage-error">
      <span className="error-icon">⚠️</span>
      <p>{error}</p>
      <button className="retry-btn" onClick={onRetry}>
        {retryLabel}
      </button>
    </div>
  );
}
