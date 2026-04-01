import { getAqiLevel, getColorFromClass } from "../../utils/aqiHelper";
import { POLLUTANTS } from "./constants";

// ── Color Mappings (from CSS classes) ──
const CLASS_COLORS = {
  "aqi-green": { color: "#00E400", bg: "#D4FFCE", textColor: "#005412" },
  "aqi-yellow": { color: "#FFFF00", bg: "#FFFACD", textColor: "#8B8B00" },
  "aqi-orange": { color: "#FF7E00", bg: "#FFE4B5", textColor: "#8B3E00" },
  "aqi-red": { color: "#FF0000", bg: "#FFE4E1", textColor: "#8B0000" },
  "aqi-purple": { color: "#670099", bg: "#E6D5F0", textColor: "#340052" },
  "aqi-maroon": { color: "#7E0123", bg: "#F0D9E8", textColor: "#3F0012" },
  "aqi-unknown": { color: "#999", bg: "#f5f5f5", textColor: "#666" },
};

// ── Utility Helpers ──

export const getLevel = (aqi) => {
  const aqiLevel = getAqiLevel(aqi);
  const colors = CLASS_COLORS[aqiLevel.class] || CLASS_COLORS["aqi-unknown"];
  return { ...aqiLevel, ...colors };
};

export const getAqiIndex = (aqi) => {
  return AQI_THRESHOLDS.findIndex((t) => aqi <= t.max);
};

// ── AQI Thresholds ──
export const AQI_THRESHOLDS = [
  { max: 50, label: "ดี" },
  { max: 100, label: "ปานกลาง" },
  { max: 150, label: "เริ่มมีผลกระทบ" },
  { max: 200, label: "มีผลกระทบ" },
  { max: 299, label: "มีผลกระทบอย่างมาก" },
  { max: Infinity, label: "เป็นอันตราย" },
];

export const getPollutantColor = (key, value) => {
  const p = POLLUTANTS[key];
  if (!p) return "#22c55e";
  if (value <= p.safeLimit) return "#22c55e";
  if (value <= p.dangerLimit) return "#f97316";
  return "#ef4444";
};

export const getPollutantStatus = (key, value) => {
  const p = POLLUTANTS[key];
  if (!p) return "อยู่ในเกณฑ์ปกติ";
  if (value <= p.safeLimit) return "อยู่ในเกณฑ์ปลอดภัย";
  if (value <= p.dangerLimit) return "เกินเกณฑ์ปกติ";
  return "อยู่ในระดับอันตราย";
};

export const sortCities = (cities, mode) => {
  const copy = [...cities];
  if (mode === "worst") {
    return copy.sort((a, b) => {
      const aqiA = typeof a.aqi === "number" ? a.aqi : Number(a.aqi) || 0;
      const aqiB = typeof b.aqi === "number" ? b.aqi : Number(b.aqi) || 0;
      return aqiB - aqiA; // Highest first
    });
  }
  if (mode === "best") {
    return copy.sort((a, b) => {
      const aqiA = typeof a.aqi === "number" ? a.aqi : Number(a.aqi) || 0;
      const aqiB = typeof b.aqi === "number" ? b.aqi : Number(b.aqi) || 0;
      return aqiA - aqiB; // Lowest first
    });
  }
  return copy.sort((a, b) => a.city.localeCompare(b.city, "th"));
};
