import React, { useState, useEffect, useRef, useMemo } from "react";
import { Helmet } from "react-helmet";
import L from "leaflet";
import Map from "./Map";
import PinnedFlightsPanel from "./PinnedFlightsPanel/PinnedFlightsPanel";
import SelectedFlightPanel from "./SelectedFlightPanel/SelectedFlightPanel";
import ErrorPopup from "./ErrorPopup";
import { usePolling } from "./APIPollingHook";
import { fetchOpenSkyData } from "./fetchOpenSkyData";
import betaLogoShadow from "../images/beta_air_llc_logo_shadow.png";
import betaLogoBlue from "../images/beta_air_llc_logo_shadow_orange.png";
import { Typography, Paper } from "@mui/material";
import planeClickedImg from "../images/planeClickedImg.png";
import Countdown from "./UpdateCountdown/Countdown";

export const defaultMapCenter = [44.0, -72.7];

const MapPage = () => {
  // State variables
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [pinnedFlights, setPinnedFlights] = useState([]);
  const [planeData, setPlaneData] = useState(null);
  const [cachedPinnedPlaneData, setCachedPinnedPlaneData] = useState([]);
  const [isFirstPlaneClicked, setIsFirstPlaneClicked] = useState(false);
  const [showPinnedFlightsOnly, setShowPinnedFlightsOnly] = useState(false);
  const [nextDataUpdateTime, setNextDataUpdateTime] = useState(null);
  const [APIFailed, setAPIFailed] = useState(false);
  // Refs
  const markersRef = useRef({});
  const mapRef = useRef(null);


  // Icons for map markers
  const unfilledPlaneIcon = L.icon({
    iconUrl: betaLogoShadow,
    iconSize: [84, 65],
    iconAnchor: [42, 32.5],
  });

  const filledPlaneIcon = L.icon({
    iconUrl: betaLogoBlue,
    iconSize: [84, 65],
    iconAnchor: [42, 32.5],
  });

  const updateInterval = 20000;
  // Fetch data with polling
  const data = usePolling(fetchOpenSkyData, 20000);

  // Update plane data and countdown timer
  useEffect(() => {
    if (data === "error") {
      setAPIFailed(true);
      
    } else {
      if (APIFailed) {
        setAPIFailed(false);
      }
      setPlaneData(data);
      setNextDataUpdateTime(new Date(Date.now() + updateInterval));
    }
  }, [data]);

  // Handle first plane click
  useEffect(() => {
    if (selectedMarker && !isFirstPlaneClicked) {
      setIsFirstPlaneClicked(true);
    }
  }, [selectedMarker]);

  // Cache pinned flights' data
  useEffect(() => {
    if (pinnedFlights && planeData) {
      setCachedPinnedPlaneData((prevCache) => {
        const updatedCache = pinnedFlights
          .map(
            (icao) =>
              planeData.find((plane) => plane.icao24 === icao) ||
              prevCache.find((plane) => plane.icao24 === icao)
          )
          .filter(Boolean);

        if (updatedCache.length === 0) {
          setShowPinnedFlightsOnly(false);
        }

        return updatedCache;
      });
    }
  }, [pinnedFlights, planeData]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      const mapInstance = L.map("map", {
        center: defaultMapCenter,
        zoom: 8,
        dragging: false,
        doubleClickZoom: false,
        zoomControl: false,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);

      mapRef.current = mapInstance;
    }
  }, []);

  // Selected plane data
  const selectedPlaneData =
    planeData?.find((plane) => plane.icao24 === selectedMarker) || null;

  const cachedSelectedPlaneData =
    cachedPinnedPlaneData?.find((plane) => plane.icao24 === selectedMarker) ||
    null;

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      {/* Helmet for loading Leaflet styles and scripts */}
      <Helmet>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""
        ></script>
      </Helmet>

      {/* Countdown Timer */}
      {/* <Countdown futureTime={nextDataUpdateTime} /> */}

      {/* Map Component */}
      <Map
        unfilledPlaneIcon={unfilledPlaneIcon}
        filledPlaneIcon={filledPlaneIcon}
        planeData={showPinnedFlightsOnly ? cachedPinnedPlaneData : planeData}
        mapRef={mapRef}
        setSelectedMarker={setSelectedMarker}
        markersRef={markersRef}
        selectedMarker={selectedMarker}
        pinnedFlights={pinnedFlights}
      />

      {/* Pinned Flights Panel */}
      {
        <PinnedFlightsPanel
          setSelectedMarker={setSelectedMarker}
          pinnedFlights={cachedPinnedPlaneData}
          setPinnedFlights={setPinnedFlights}
          setCachedPinnedPlaneData={setCachedPinnedPlaneData}
          planeData={cachedPinnedPlaneData}
          mapRef={mapRef}
          setShowPinnedFlightsOnly={setShowPinnedFlightsOnly}
          showPinnedFlightsOnly={showPinnedFlightsOnly}
        />
      }

      {/* Selected Flight Panel */}
      {isFirstPlaneClicked ? (
        selectedMarker && (
          <SelectedFlightPanel
            setSelectedMarker={setSelectedMarker}
            selectedMarker={cachedSelectedPlaneData || selectedPlaneData}
            setPinnedFlights={setPinnedFlights}
            setCachedPinnedPlaneData={setCachedPinnedPlaneData}
            pinnedFlights={cachedPinnedPlaneData}
            mapRef={mapRef}
          />
        )
      ) : (
        <Paper
          className="selectedFlightPanel"
          style={{ textAlign: "center" }}
          elevation={4}
        >
          <Typography variant="h6">Select a Plane to Start!</Typography>
          <img
            src={planeClickedImg}
            alt="Click a plane to start"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </Paper>
      )}

      {APIFailed && <ErrorPopup />}
    </div>
  );
};

export default MapPage;
