import { AQI_LEVELS, POLLUTANTS } from "./constants";

// ── Utility Helpers ──

export const getLevel = (aqi) =>
  AQI_LEVELS.find((l) => aqi <= l.max) ?? AQI_LEVELS.at(-1);

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
  if (mode === "worst") return copy.sort((a, b) => b.aqi - a.aqi);
  if (mode === "best") return copy.sort((a, b) => a.aqi - b.aqi);
  return copy.sort((a, b) => a.city.localeCompare(b.city));
};
