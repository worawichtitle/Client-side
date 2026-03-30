import { Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Map from "./pages/Map";
import List from "./pages/List";
import Advice from "./pages/Advice";
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App
