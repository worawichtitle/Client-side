import { getAqiLevel, getColorFromClass } from "../../utils/aqiHelper";
import { POLLUTANTS } from "./constants";

// ── Color Mappings (from CSS classes) ──
const CLASS_COLORS = {
  "aqi-green": { color: "#22c55e", bg: "#f0fdf4", textColor: "#15803d" },
  "aqi-yellow": { color: "#eab308", bg: "#fefce8", textColor: "#854d0e" },
  "aqi-orange": { color: "#f97316", bg: "#fff7ed", textColor: "#9a3412" },
  "aqi-red": { color: "#ef4444", bg: "#fef2f2", textColor: "#991b1b" },
  "aqi-purple": { color: "#a855f7", bg: "#faf5ff", textColor: "#6b21a8" },
  "aqi-maroon": { color: "#6a0dad", bg: "#f3e5fb", textColor: "#4a0080" },
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
  { max: 300, label: "มีผลกระทบอย่างมาก" },
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
