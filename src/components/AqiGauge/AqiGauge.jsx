// gauge components extracted for cleaner code organization

import {
  getAqiLevel,
} from "../../utils/aqiHelper";
import "./AqiGauge.css";
const getLevel = (aqi) => getAqiLevel(aqi);

export default function AqiGauge({ aqi }) {
  const level = getLevel(aqi);
  const pct = Math.min((aqi / 500) * 100, 100);
  const segments = [
    { color: getAqiLevel(0).color, width: "10%" },
    { color: getAqiLevel(100).color, width: "10%" },
    { color: getAqiLevel(150).color, width: "10%" },
    { color: getAqiLevel(200).color, width: "10%" },
    { color: getAqiLevel(299).color, width: "19%" },
    { color: getAqiLevel(300).color, width: "41%" },
  ];
  const labels = [
    { text: "0", position: "0%" },
    { text: "50", position: "10%" },
    { text: "100", position: "20%" },
    { text: "150", position: "30%" },
    { text: "200", position: "40%" },
    { text: "300", position: "59%" },
    { text: "500", position: "100%" },
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
        {labels.map((label, i) => (
          <span key={i} style={{ left: label.position }} className="aqi-gauge-label-item">{label.text}</span>
        ))}
      </div>
      <div
        className="aqi-gauge-readout"
        style={{ color: level.color }}
      >
        <span className="aqi-gauge-num">{aqi}</span>
        <span className="aqi-gauge-label">{level.level}</span>
      </div>
    </div>
  );
}
