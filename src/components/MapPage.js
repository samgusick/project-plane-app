import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import L from "leaflet";
import Map from "./Map";
import PinnedFlightsPanel from "./PinnedFlightsPanel/PinnedFlightsPanel";
import SelectedFlightPanel from "./SelectedFlightPanel/SelectedFlightPanel";
import ErrorPopup from "./ErrorPopup";
import { usePolling } from "./APIPollingHook";
import { fetchOpenSkyData } from "./fetchOpenSkyData";
import betaLogoShadow from "../images/beta_air_llc_logo_shadow.png";
import betaLogoOrange from "../images/beta_air_llc_logo_shadow_orange.png";
import { Typography } from "@mui/material";
import { Paper } from "@mui/material";
import planeClickedImg from "../images/planeClickedImg.png";

const MapPage = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [pinnedFlights, setPinnedFlights] = useState([]);
  const [loadFlights, setLoadFlights] = useState(true);
  const [planeData, setPlaneData] = useState(null);
  const [cachedPinnedPlaneData, setCachedPinnedPlaneData] = useState([]); // new state for cached data
  const [isFirstPlaneClicked,setIsFirstPlaneClicked] = useState(false);
  const [showPinnedFlightsOnly, setShowPinnedFlightsOnly] = useState(false); 


  const markersRef = useRef({}); // Use an object to track markers by icao24

  const greyIcon = L.icon({
    iconUrl: betaLogoShadow, // Ensure this variable is defined
    iconSize: [84, 65],
    iconAnchor: [42, 32.5],
  });

  const orangeIcon = L.icon({
    iconUrl: betaLogoOrange, // Ensure this variable is defined
    iconSize: [84, 65],
    iconAnchor: [42, 32.5],
  });

  const data = usePolling(fetchOpenSkyData, 30000);


  useEffect(() => {
    setPlaneData(data);
  }, [data]);

  useEffect(() => {
    if (selectedMarker && !isFirstPlaneClicked) {
      setIsFirstPlaneClicked(true);
    }
  }, [selectedMarker])

  useEffect(() => {
    if (pinnedFlights && planeData) {
      setCachedPinnedPlaneData((prevCache) => {
        // Update existing cached data and add new data
        const updatedCache = pinnedFlights.map((icao) => {
          // Find the latest plane data for the pinned flight
          const latestPlane = planeData.find((plane) => plane.icao24 === icao);

          // Check if it's already in the cache
          const cachedPlane = prevCache.find((plane) => plane.icao24 === icao);

          // Return the latest plane data if found, otherwise keep the cached one
          return latestPlane || cachedPlane;
        });

        const UpdatedCacheAfterFilter = updatedCache.filter(Boolean);

        if (updatedCache.length === 0) {
          setShowPinnedFlightsOnly(false);
        }
        // Filter out any cached planes that are no longer in pinnedFlights
        return UpdatedCacheAfterFilter; // Ensure no null or undefined values
      });
    }
  }, [pinnedFlights, planeData]);

  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      const mapInstance = L.map("map", {
        center: [44.0, -72.7],
        zoom: 8,
        dragging: false,
        doubleClickZoom: false,
        zoomControl: false,
        scrollWheelZoom: false,
      });
      mapRef.current = mapInstance;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);
    }
  }, []);


  const selectedPlaneData =
    planeData && selectedMarker
      ? planeData.find((plane) => plane.icao24 === selectedMarker)
      : null;

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossorigin=""
        />
        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossorigin=""
        ></script>
      </Helmet>
      <Map
        greyIcon={greyIcon}
        orangeIcon={orangeIcon}
        planeData={showPinnedFlightsOnly ? cachedPinnedPlaneData : planeData}
        mapRef={mapRef}
        setSelectedMarker={setSelectedMarker}
        markersRef={markersRef}
        selectedMarker={selectedMarker}
      />
      {cachedPinnedPlaneData && (
        <PinnedFlightsPanel
          pinnedFlights={cachedPinnedPlaneData}
          setPinnedFlights={setPinnedFlights}
          setCachedPinnedPlaneData={setCachedPinnedPlaneData}
          planeData={cachedPinnedPlaneData}
          mapRef={mapRef}
          setShowPinnedFlightsOnly={setShowPinnedFlightsOnly}
          showPinnedFlightsOnly={showPinnedFlightsOnly}
        />
      )}
      {isFirstPlaneClicked ? ( selectedMarker &&
        <SelectedFlightPanel
        setSelectedMarker={setSelectedMarker}
        selectedMarker={selectedPlaneData}
        planeData={planeData}
        setPinnedFlights={setPinnedFlights}
        setCachedPinnedPlaneData={setCachedPinnedPlaneData}
        pinnedFlights={cachedPinnedPlaneData}
        mapRef={mapRef}
      />
      ) : (
        <Paper
        style={{
          position: "fixed",
          bottom: "50px",
          left: "50px",
          zIndex: 1000,
          padding: "20px",
        }}
        elevation={4}
      >
        <Typography variant="h6">Select a Plane to Start!</Typography>
        <img src={planeClickedImg}></img>
        </Paper>
      )}
      {!loadFlights && <ErrorPopup />}
    </div>
  );
};

export default MapPage;
