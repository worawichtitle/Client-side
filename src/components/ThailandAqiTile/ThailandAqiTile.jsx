import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./ThailandAqiTile.css";
import {
  AQI_LEVELS,
  HEALTH_RECS,
  POLLUTANTS,
  SORT_OPTIONS,
  LABELS,
} from "./constants";
import { AqiGauge, LoadingState, ErrorState } from "./components";
import {
  getLevel,
  getPollutantColor,
  getPollutantStatus,
  sortCities,
} from "./helpers";

const API_TOKEN = import.meta.env.VITE_AQI_API_TOKEN;
const BASE_URL = "https://api.waqi.info";

// Thailand geographic bounds: (lat1,lng1,lat2,lng2)
// Southwest: 5.6°N, 97.3°E | Northeast: 20.5°N, 105.6°E
const THAILAND_BOUNDS = "5.6,97.3,20.5,105.6";

// ── Main component ────────────────────────────────────────────────────────────

export default function ThailandAqiTile() {
  const navigate = useNavigate();

  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [pollutants, setPollutants] = useState(null);
  const [pollutantsLoading, setPollutantsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState("worst");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) setRefreshing(true);
      else setIsLoading(true);
      setError(null);
      try {
        // Fetch all stations within Thailand bounds
        const res = await fetch(
          `${BASE_URL}/v2/map/bounds?latlng=${THAILAND_BOUNDS}&token=${API_TOKEN}`,
        );
        const result = await res.json();

        if (result?.status === "ok" && result?.data) {
          const cityData = result.data.map((station) => ({
            id: station.uid || station.idx,
            city: station.city?.name || station.station?.name || "Unknown",
            aqi: station.aqi || 0,
            iaqi: station.iaqi || {},
            time: station.time?.s || null,
            geo: station.city?.geo || station.station?.geo || null,
          }));

          setCities(cityData);
          setLastUpdated(new Date());
          if (cityData.length > 0 && !selectedCity) {
            const sorted = sortCities(cityData, "worst");
            setSelectedCity(sorted[0]);
            setPollutants(sorted[0].iaqi);
          }
        } else {
          throw new Error("No data returned from API");
        }
      } catch (err) {
        setError(LABELS.error);
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    },
    [selectedCity],
  );

  useEffect(() => {
    fetchAll();
  }, []);

  const handleCityClick = async (city) => {
    setSelectedCity(city);
    setPollutantsLoading(true);
    try {
      // Use station ID for more detailed data
      const res = await fetch(
        `${BASE_URL}/feed/@${city.id}/?token=${API_TOKEN}`,
      );
      const result = await res.json();
      if (result?.status === "ok") setPollutants(result?.data?.iaqi || {});
      else setPollutants(city.iaqi || {});
    } catch {
      setPollutants(city.iaqi || {});
    } finally {
      setPollutantsLoading(false);
    }
  };

  // ── Derived data ──────────────────────────────────────────────────────────

  const sortedAll = sortCities(cities, "worst");
  const worst = sortedAll[0] ?? null;
  const best = sortedAll[sortedAll.length - 1] ?? null;
  const avg =
    cities.length > 0
      ? Math.round(
          cities
            .filter((c) => typeof c.aqi === "number" && !isNaN(c.aqi))
            .reduce((s, c) => s + c.aqi, 0) /
            cities.filter((c) => typeof c.aqi === "number" && !isNaN(c.aqi))
              .length,
        )
      : null;
  const dangerous = cities.filter((c) => c.aqi > 150).length;
  const maxAqi = worst?.aqi || 1;

  const displayCities = sortCities(
    searchQuery.trim()
      ? cities.filter((c) =>
          c.city.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : cities,
    sortMode,
  );

  const worstRec = worst
    ? HEALTH_RECS[AQI_LEVELS.findIndex((l) => worst.aqi <= l.max)]
    : null;
  const worstLevel = worst ? getLevel(worst.aqi) : null;

  const now = new Date();
  const dateStr = now.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // ── Render ─────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <LoadingState
        loadingText={LABELS.loading}
        loadingSub={LABELS.loadingSub}
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={() => fetchAll()}
        retryLabel={LABELS.retry}
      />
    );
  }

  return (
    <div className="aqipage">
      {/* ── Header ── */}
      <div className="aqipage-header">
        <div className="header-left">
          <h1 className="aqipage-title">คุณภาพอากาศประเทศไทย</h1>
          <p className="aqipage-subtitle">
            {dateStr} · {timeStr} น. · {cities.length} สถานีตรวจวัด
          </p>
        </div>

        <div className="header-right">
          <div className="summary-stats">
            {worst && (
              <div className="summary-stat">
                <span className="summary-stat-label">แย่ที่สุด</span>
                <span
                  className="summary-stat-value"
                  style={{ color: getLevel(worst.aqi).color }}
                >
                  {worst.aqi}
                </span>
                <span className="summary-stat-city">{worst.city}</span>
              </div>
            )}
            {/* {avg != null && (
              <div className="summary-stat">
                <span className="summary-stat-label">ค่าเฉลี่ย</span>
                <span
                  className="summary-stat-value"
                  style={{ color: getLevel(avg).color }}
                >
                  {avg}
                </span>
                <span className="summary-stat-city">{getLevel(avg).label}</span>
              </div>
            )} */}
            {best && (
              <div className="summary-stat">
                <span className="summary-stat-label">ดีที่สุด</span>
                <span
                  className="summary-stat-value"
                  style={{ color: getLevel(best.aqi).color }}
                >
                  {best.aqi}
                </span>
                <span className="summary-stat-city">{best.city}</span>
              </div>
            )}
            {dangerous > 0 && (
              <div className="summary-stat summary-stat--alert">
                <span className="summary-stat-label">อันตราย</span>
                <span
                  className="summary-stat-value"
                  style={{ color: "#ef4444" }}
                >
                  {dangerous}
                </span>
                <span className="summary-stat-city">สถานี</span>
              </div>
            )}
          </div>

          <button
            className={`refresh-btn ${refreshing ? "refreshing" : ""}`}
            onClick={() => fetchAll(true)}
            disabled={refreshing}
            title="รีเฟรชข้อมูล"
          >
            ↻
          </button>
        </div>
      </div>

      {/* ── Health alert ── */}
      {worst && worstRec && worstLevel && (
        <div
          className="aqipage-alert"
          style={{
            background: worstLevel.bg,
            borderLeftColor: worstLevel.color,
          }}
        >
          <span className="alert-emoji">{worstRec.icon}</span>
          <div className="alert-body">
            <p className="alert-title" style={{ color: worstLevel.textColor }}>
              {worstRec.title} · {worst.city} (AQI {worst.aqi})
            </p>
            <p className="alert-text">{worstRec.text}</p>
          </div>
          {dangerous > 1 && (
            <span
              className="alert-badge"
              style={{ background: worstLevel.color }}
            >
              +{dangerous - 1} สถานีอื่น
            </span>
          )}
        </div>
      )}

      {/* ── Body ── */}
      <div className="aqipage-body">
        {/* LEFT: Ranking */}
        <div className="aqipage-left">
          <div className="left-header">
            <p className="section-label">
              การจัดอันดับ ({cities.length} สถานี)
            </p>
            <input
              type="text"
              placeholder="🔍 ค้นหาสถานี..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="sort-tabs">
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s.id}
                  className={`sort-tab ${sortMode === s.id ? "active" : ""}`}
                  onClick={() => setSortMode(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="ranking-list">
            {displayCities.length > 0 ? (
              displayCities.map((city) => {
                const level = getLevel(city.aqi);
                const isSelected = selectedCity?.id === city.id;
                return (
                  <div
                    key={city.id}
                    className={`ranking-row ${isSelected ? "ranking-row--selected" : ""}`}
                    onClick={() => handleCityClick(city)}
                    style={isSelected ? { borderColor: level.color } : {}}
                  >
                    <div className="rank-bar-wrap">
                      <div className="rank-city-name">{city.city}</div>
                      <div className="rank-bar-track">
                        <div
                          className="rank-bar-fill"
                          style={{
                            width: `${Math.min((city.aqi / maxAqi) * 100, 100)}%`,
                            background: level.color,
                          }}
                        />
                      </div>
                    </div>
                    <div className="rank-right">
                      <span
                        className="aqi-badge"
                        style={{ background: level.color }}
                      >
                        {city.aqi}
                      </span>
                      <span
                        className="rank-level"
                        style={{ color: level.color }}
                      >
                        {level.label}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="no-results">ไม่พบสถานีที่ตรงกับ "{searchQuery}"</p>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="aqipage-right">
          {/* Selected city detail */}
          {selectedCity && (
            <div className="aqipage-section detail-section">
              <div className="detail-header">
                <div>
                  <p className="section-label" style={{ margin: 0 }}>
                    รายละเอียดสถานีที่เลือก
                  </p>
                  <h2 className="detail-city-name">{selectedCity.city}</h2>
                </div>
                <button
                  className="detail-navigate-btn"
                  onClick={() => navigate(`/detail/@${selectedCity.id}`)}
                >
                  ดูรายละเอียด →
                </button>
              </div>

              <AqiGauge aqi={selectedCity.aqi} />

              <div className="pollutant-section">
                <p className="section-label">ค่ามลพิษในอากาศ</p>
                {pollutantsLoading ? (
                  <div className="loading-inline">
                    <div className="loading-spinner small" />{" "}
                    กำลังโหลดข้อมูลมลพิษ...
                  </div>
                ) : pollutants &&
                  Object.keys(pollutants).some((k) => POLLUTANTS[k]) ? (
                  <div className="pollutant-grid">
                    {Object.entries(pollutants)
                      .filter(([k]) => POLLUTANTS[k])
                      .map(([key, val]) => {
                        const meta = POLLUTANTS[key];
                        const v =
                          typeof val.v === "number" ? val.v : parseFloat(val.v);
                        const pct = Math.min((v / meta.max) * 100, 100);
                        const color = getPollutantColor(key, v);
                        const status = getPollutantStatus(key, v);
                        return (
                          <div key={key} className="pollutant-card">
                            <div className="pollutant-top">
                              <div>
                                <span className="pollutant-name">
                                  {meta.label}
                                </span>
                                <span className="pollutant-desc">
                                  {meta.desc}
                                </span>
                              </div>
                              <div className="pollutant-val-wrap">
                                <span className="pollutant-val">
                                  {isNaN(v) ? "—" : v.toFixed(1)}
                                </span>
                                <span className="pollutant-unit">
                                  {meta.unit}
                                </span>
                              </div>
                            </div>
                            <div className="pollutant-track">
                              <div
                                className="pollutant-fill"
                                style={{ width: `${pct}%`, background: color }}
                              />
                              {/* safe threshold marker */}
                              <div
                                className="pollutant-safe-mark"
                                style={{
                                  left: `${Math.min((meta.safeLimit / meta.max) * 100, 100)}%`,
                                }}
                                title={`เกณฑ์ปลอดภัย: ${meta.safeLimit} ${meta.unit}`}
                              />
                            </div>
                            <span
                              className="pollutant-status"
                              style={{ color }}
                            >
                              {status}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p className="no-data-text">ไม่มีข้อมูลมลพิษสำหรับสถานีนี้</p>
                )}
              </div>
            </div>
          )}

          {/* AQI Legend */}
          <div className="aqipage-section">
            <p className="section-label">ระดับคุณภาพอากาศ (AQI)</p>
            <div className="legend-list">
              {AQI_LEVELS.map((level, i) => {
                const rec = HEALTH_RECS[i];
                const count = cities.filter((c) => {
                  const prev = AQI_LEVELS[i - 1];
                  return c.aqi <= level.max && (!prev || c.aqi > prev.max);
                }).length;
                return (
                  <div key={level.label} className="legend-item">
                    <span
                      className="legend-dot"
                      style={{ background: level.color }}
                    />
                    <div className="legend-info">
                      <span className="legend-label">{level.label}</span>
                      <span className="legend-range">
                        {i === 0
                          ? "0–50"
                          : i === 1
                            ? "51–100"
                            : i === 2
                              ? "101–150"
                              : i === 3
                                ? "151–200"
                                : "201+"}
                      </span>
                    </div>
                    {count > 0 && (
                      <span
                        className="legend-count"
                        style={{
                          background: level.color + "22",
                          color: level.textColor,
                        }}
                      >
                        {count} สถานี
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick stats */}
          <div className="aqipage-section stats-section">
            <p className="section-label">สรุปภาพรวม</p>
            <div className="quick-stats">
              <div className="quick-stat">
                <span className="quick-stat-icon">📊</span>
                <div>
                  <span className="quick-stat-val">
                    {cities.filter((c) => c.aqi <= 50).length}
                  </span>
                  <span className="quick-stat-desc">สถานีคุณภาพดี</span>
                </div>
              </div>
              <div className="quick-stat">
                <span className="quick-stat-icon">⚠️</span>
                <div>
                  <span className="quick-stat-val">
                    {cities.filter((c) => c.aqi > 100).length}
                  </span>
                  <span className="quick-stat-desc">สถานีที่น่ากังวล</span>
                </div>
              </div>
              <div className="quick-stat">
                <span className="quick-stat-icon">🚨</span>
                <div>
                  <span className="quick-stat-val">{dangerous}</span>
                  <span className="quick-stat-desc">สถานีอันตราย</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
