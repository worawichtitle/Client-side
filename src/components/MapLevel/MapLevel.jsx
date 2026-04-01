import { useState } from "react";
import "./MapLevel.css";

const LEVELS = [
  {
    range: '0–50',
    label: 'ดี',
    bg: '#009865',
    text: '#fff',
    description: 'คุณภาพอากาศดี และมลพิษทางอากาศก็มีความเสี่ยงเพียงเล็กน้อยหรือไม่มีเลย',
  },
  {
    range: '51–100',
    label: 'ปานกลาง',
    bg: '#eab308',
    text: '#222',
    description: 'คุณภาพอากาศยอมรับได้ แต่ผู้ที่ไวต่อมลพิษอาจมีความกังวลเรื่องสุขภาพ',
  },
  {
    range: '101–150',
    label: 'เริ่มมีผลกระทบ',
    bg: '#f97316',
    text: '#fff',
    description: 'กลุ่มเสี่ยงอาจได้รับผลกระทบต่อสุขภาพ ประชาชนทั่วไปมักไม่ได้รับผลกระทบ',
  },
  {
    range: '151–200',
    label: 'มีผลกระทบ',
    bg: '#CC0033',
    text: '#fff',
    description: 'ทุกคนอาจเริ่มมีผลกระทบต่อสุขภาพ กลุ่มเสี่ยงจะมีอาการรุนแรงขึ้น',
  },
  {
    range: "201–299",
    label: "มีผลกระทบอย่างมาก",
    bg: "#670099",
    text: "#fff",
    description:
      "แจ้งเตือนภาวะฉุกเฉิน ประชากรทุกคนมีแนวโน้มได้รับผลกระทบสูงขึ้น",
  },
  {
    range: "300+",
    label: "เป็นอันตราย",
    bg: "#7E0123",
    text: "#fff",
    description:
      "ภาวะวิกฤต ทุกคนได้รับผลกระทบต่อสุขภาพอย่างรุนแรง ควรอยู่ในอาคารและหลีกเลี่ยงกิจกรรมกลางแจ้งทุกชนิด",
  },
];

function MapLevel() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="maplevel-wrapper">
      {LEVELS.map((level, i) => (
        <div
          key={i}
          className={`maplevel-item ${hovered === i ? "active" : ""}`}
          style={{ "--bg": level.bg, "--txt": level.text }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          <span className="maplevel-label">{level.label}</span>
          <div className="maplevel-tooltip">
            <span className="maplevel-tooltip-range">AQI {level.range}</span>
            <span className="maplevel-tooltip-desc">{level.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MapLevel;
