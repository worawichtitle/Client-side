import { SORT_OPTIONS } from "../../data/constants";
import { getLevel } from "../../utils/helpers";

export default function LeftSidebar({
  cities,
  displayCities,
  selectedCity,
  maxAqi,
  searchQuery,
  onSearchChange,
  sortMode,
  onSortChange,
  onCityClick,
}) {
  return (
    <div className="aqipage-left">
      <div className="left-header">
        <p className="section-label">การจัดอันดับ ({cities.length} สถานี)</p>
        <input
          type="text"
          placeholder="🔍 ค้นหาสถานี..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div className="sort-tabs">
          {SORT_OPTIONS.map((s) => (
            <button
              key={s.id}
              className={`sort-tab ${sortMode === s.id ? "active" : ""}`}
              onClick={() => onSortChange(s.id)}
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
                onClick={() => onCityClick(city)}
                style={isSelected ? { borderColor: level.color } : {}}
              >
                <div className="rank-bar-wrap">
                  <div className="rank-city-name">{city.city}</div>
                  <div className="rank-bar-track">
                    <div
                      className={`rank-bar-fill ${level.class}`}
                      style={{
                        width: `${Math.min((city.aqi / maxAqi) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="rank-right">
                  <span className={`aqi-badge ${level.class}`}>{city.aqi}</span>
                  <span className="rank-level" style={{ color: level.color }}>
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
  );
}
