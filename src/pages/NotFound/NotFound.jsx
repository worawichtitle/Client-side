import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-code">404</h1>
        <h2>ขออภัย ไม่พบหน้าที่คุณต้องการ</h2>
        <p>ดูเหมือนว่าพิกัดที่คุณตามหาจะถูกหมอกควันบังจนหาไม่เจอ...</p>
        
        <Link to="/" className="back-home-btn">
          กลับไปหน้าหลัก
        </Link>
      </div>
    </div>
  );
}