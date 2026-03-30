export const getThaiAqiLevel = (aqi) => {
  if (aqi <= 25) return { level: 'ดีมาก', class: 'aqi-blue', color: '#00BFFF', meaning: 'คุณภาพอากาศดีมาก' };
  if (aqi <= 50) return { level: 'ดี', class: 'aqi-green', color: '#00E400', meaning: 'คุณภาพอากาศดี' };
  if (aqi <= 100) return { level: 'ปานกลาง', class: 'aqi-yellow', color: '#FFFF00', meaning: 'คุณภาพอากาศปานกลาง' };
  if (aqi <= 200) return { level: 'เริ่มมีผลกระทบ', class: 'aqi-orange', color: '#FF7E00', meaning: 'เริ่มมีผลกระทบต่อสุขภาพ' };
  return { level: 'มีผลกระทบ', class: 'aqi-red', color: '#FF0000', meaning: 'มีผลกระทบต่อสุขภาพ' };
};