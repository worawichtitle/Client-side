import { Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Map from "./pages/Map";
import List from "./pages/List";
import Advice from "./pages/Advice";
import Detail from "./pages/Detail/Detail";
import NotFound from "./pages/NotFound";


function App() {
  return (
    <div className="app-container">
      <Navbar />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/map" />} />
          <Route path="/map" element={<Map />} />
          <Route path="/list" element={<List />} />
          <Route path="/advice" element={<Advice />} />
          <Route path="/detail/:cityName" element={<Detail />} />
          <Route path="/detail" element={<Navigate to="/detail/here" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App
