export const getAqiLevel = (aqi) => {
  if (aqi === undefined || aqi === null)
    return { level: "ไม่มีข้อมูล", class: "aqi-unknown", color: "#999" };
  if (aqi <= 50) return { level: "ดี", class: "aqi-green", color: "#66bb6a" };
  if (aqi <= 100) return { level: "ปานกลาง", class: "aqi-yellow", color: "#ffc107" };
  if (aqi <= 150) return { level: "เริ่มมีผลกระทบ", class: "aqi-orange", color: "#ff9800" };
  if (aqi <= 200) return { level: "มีผลกระทบ", class: "aqi-red", color: "#ef5350" };
  if (aqi < 300) return { level: "มีผลกระทบอย่างมาก", class: "aqi-purple", color: "#7b1fa2" };
  return { level: "เป็นอันตราย", class: "aqi-maroon", color: "#880e4f" };
};
