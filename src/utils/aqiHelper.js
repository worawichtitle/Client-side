export const getAqiLevel = (aqi) => {
  if (aqi === undefined || aqi === null) return { level: 'ไม่มีข้อมูล', class: 'aqi-unknown' };
  if (aqi <= 50) return { level: 'ดี', class: 'aqi-green' };
  if (aqi <= 100) return { level: 'ปานกลาง', class: 'aqi-yellow' };
  if (aqi <= 150) return { level: 'เริ่มมีผลกระทบ', class: 'aqi-orange' };
  if (aqi <= 200) return { level: 'มีผลกระทบ', class: 'aqi-red' };
  if (aqi <= 300) return { level: 'มีผลกระทบอย่างมาก', class: 'aqi-purple' };
  return { level: 'เป็นอันตราย', class: 'aqi-maroon' };
};