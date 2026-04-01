// ── Health Recommendations ──

export const HEALTH_RECS = [
  {
    icon: "🟢",
    title: "คุณภาพอากาศดีเยี่ยม",
    text: "สามารถทำกิจกรรมกลางแจ้งได้ตามปกติ ไม่มีข้อจำกัด",
  },
  {
    icon: "🟡",
    title: "ควรระวังเป็นพิเศษ",
    text: "ผู้ที่แพ้ง่ายควรพิจารณาลดการออกกำลังกายกลางแจ้งในระยะเวลานาน",
  },
  {
    icon: "🟠",
    title: "กลุ่มเสี่ยงควรระวัง",
    text: "เด็ก ผู้สูงอายุ และผู้มีโรคระบบทางเดินหายใจ ควรลดกิจกรรมกลางแจ้ง และสวมหน้ากาก N95",
  },
  {
    icon: "🔴",
    title: "ทุกคนควรระวัง",
    text: "ลดกิจกรรมกลางแจ้ง กลุ่มเสี่ยงควรหลีกเลี่ยงโดยสิ้นเชิง สวมหน้ากาก N95 เสมอ",
  },
  {
    icon: "🟣",
    title: "แจ้งเตือนฉุกเฉิน",
    text: "ทุกคนควรอยู่ในอาคาร ปิดหน้าต่างและประตู เปิดเครื่องฟอกอากาศ หลีกเลี่ยงกิจกรรมกลางแจ้งทุกชนิด",
  },
];

// ── Pollutant Metadata ──

export const POLLUTANTS = {
  pm25: {
    label: "PM2.5",
    unit: "µg/m³",
    safeLimit: 25,
    dangerLimit: 75,
    max: 250,
    desc: "อนุภาคขนาดเล็กมาก",
  },
  pm10: {
    label: "PM10",
    unit: "µg/m³",
    safeLimit: 50,
    dangerLimit: 150,
    max: 430,
    desc: "อนุภาคขนาดกลาง",
  },
  o3: {
    label: "O₃",
    unit: "ppb",
    safeLimit: 54,
    dangerLimit: 124,
    max: 200,
    desc: "โอโซน",
  },
  no2: {
    label: "NO₂",
    unit: "ppb",
    safeLimit: 53,
    dangerLimit: 100,
    max: 200,
    desc: "ไนโตรเจนไดออกไซด์",
  },
  so2: {
    label: "SO₂",
    unit: "ppb",
    safeLimit: 35,
    dangerLimit: 185,
    max: 500,
    desc: "ซัลเฟอร์ไดออกไซด์",
  },
  co: {
    label: "CO",
    unit: "ppm",
    safeLimit: 4.4,
    dangerLimit: 12,
    max: 50,
    desc: "คาร์บอนมอนอกไซด์",
  },
};

// ── Sort Options ──

export const SORT_OPTIONS = [
  { id: "worst", label: "แย่สุด→ดีสุด" },
  { id: "best", label: "ดีสุด→แย่สุด" },
  { id: "alpha", label: "ตามตัวอักษร" },
];

// ── UI Text Labels ──

export const LABELS = {
  pageTitle: "คุณภาพอากาศประเทศไทย",
  loading: "กำลังโหลดข้อมูลคุณภาพอากาศทั่วประเทศ",
  loadingSub: "กำลังดึงข้อมูลจากทุกสถานีตรวจวัด",
  error: "ไม่สามารถดึงข้อมูลคุณภาพอากาศได้ กรุณาลองใหม่อีกครั้ง",
  retry: "ลองใหม่",
  ranking: "การจัดอันดับ",
  stations: "สถานี",
  search: "🔍 ค้นหาสถานี...",
  noResults: "ไม่พบสถานีที่ตรงกับ",
  selectedDetail: "รายละเอียดสถานีที่เลือก",
  seeDetail: "ดูรายละเอียด →",
  pollutants: "ค่ามลพิษในอากาศ",
  loadingPollutants: "กำลังโหลดข้อมูลมลพิษ...",
  noPollutantData: "ไม่มีข้อมูลมลพิษสำหรับสถานีนี้",
  aqiLevel: "ระดับคุณภาพอากาศ (AQI)",
  overview: "สรุปภาพรวม",
  goodQuality: "สถานีคุณภาพดี",
  concerning: "สถานีที่น่ากังวล",
  dangerous: "สถานีอันตราย",
  worst: "แย่ที่สุด",
  average: "ค่าเฉลี่ย",
  best: "ดีที่สุด",
};
