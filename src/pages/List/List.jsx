import { useState, useEffect, useCallback } from "react";
import "./List.css";
import "../../components/ThailandAqiTile/ThailandAqiTile.css";
import { HEALTH_RECS, LABELS } from "../../data/constants";
import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";
import { getLevel, sortCities, getAqiIndex } from "../../utils/helpers";
import AqiPageHeader from "../../components/ThailandAqiTile/AqiPageHeader";
import HealthAlert from "../../components/ThailandAqiTile/HealthAlert";
import LeftSidebar from "../../components/ThailandAqiTile/LeftSidebar";
import DetailSection from "../../components/ThailandAqiTile/DetailSection";
import LegendSection from "../../components/ThailandAqiTile/LegendSection";
import StatsSection from "../../components/ThailandAqiTile/StatsSection";

const API_TOKEN = import.meta.env.VITE_AQI_API_TOKEN;
const BASE_URL = "https://api.waqi.info";

// Thailand geographic bounds: (lat1,lng1,lat2,lng2)
// Southwest: 5.6°N, 97.3°E | Northeast: 20.5°N, 105.6°E
const THAILAND_BOUNDS = "5.6,97.3,20.5,105.6";

export default function List() {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [pollutants, setPollutants] = useState(null);
  const [pollutantsLoading, setPollutantsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState("worst");
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) setRefreshing(true);
      else setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.waqi.info/map/bounds/?latlng=${THAILAND_BOUNDS}&token=${API_TOKEN}`,
        );
        const result = await res.json();

        if (result?.status === "ok" && result?.data) {
          const validStations = result.data.filter((station) => {
            const aqi = station.aqi;
            const validAqi =
              aqi !== null &&
              aqi !== undefined &&
              aqi !== "-" &&
              aqi !== "" &&
              !isNaN(Number(aqi));

            const lat = station.lat || station.latitude;
            const lon = station.lon || station.longitude;
            const cityName = (station.city?.name || station.station?.name || "")
              .trim()
              .toLowerCase();

            // Exclude known Malaysian areas
            const malaysianCities = [
              "kangar",
              "perlis",
              "tanah merah",
              "kelantan",
              "kota bharu",
              "langkawi",
              "kedah",
            ];
            const isMalaysia =
              malaysianCities.some((city) => cityName.includes(city)) ||
              cityName.includes("malaysia");

            // Thailand bounds
            const inThailand =
              lat >= 6.5 &&
              lat <= 20.5 &&
              lon >= 97.3 &&
              lon <= 105.6 &&
              !isMalaysia;

            console.log(
              `Station: ${cityName}, Lat: ${lat}, Lon: ${lon}, Valid: ${validAqi && inThailand}`,
            );

            return validAqi && inThailand;
          });
          const cityData = validStations.map((station) => ({
            id: station.uid || station.idx,
            city: station.city?.name || station.station?.name || "Unknown",
            aqi: Number(station.aqi),
            iaqi: station.iaqi || {},
            time: station.time?.s || null,
            geo: station.city?.geo || station.station?.geo || null,
          }));

          setCities(cityData);

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

  // Derived data
  const sortedAll = sortCities(cities, "worst");
  const worst = sortedAll[0] ?? null;
  const best = sortedAll[sortedAll.length - 1] ?? null;
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

  const worstRec = worst ? HEALTH_RECS[getAqiIndex(worst.aqi)] : null;
  const worstLevel = worst ? getLevel(worst.aqi) : null;

  if (isLoading) {
    return <Loading message={LABELS.loading} />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <div className="list-page-container">
      <div className="aqipage">
        <AqiPageHeader
          worst={worst}
          best={best}
          dangerous={dangerous}
          cities={cities}
          refreshing={refreshing}
          onRefresh={() => fetchAll(true)}
        />

        <HealthAlert
          worst={worst}
          worstRec={worstRec}
          worstLevel={worstLevel}
          dangerous={dangerous}
        />

        <div className="aqipage-body">
          <LeftSidebar
            cities={cities}
            displayCities={displayCities}
            selectedCity={selectedCity}
            maxAqi={maxAqi}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortMode={sortMode}
            onSortChange={setSortMode}
            onCityClick={handleCityClick}
          />

          <div className="aqipage-right">
            <DetailSection
              selectedCity={selectedCity}
              pollutants={pollutants}
              pollutantsLoading={pollutantsLoading}
            />
            <LegendSection cities={cities} />
            <StatsSection cities={cities} />
          </div>
        </div>
      </div>
    </div>
  );
}
