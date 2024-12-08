import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import L from "leaflet";
import Map from "./Map";
import PinnedFlightsList from "./PinnedFlightsList";
import SelectedFlightPanel from "./SelectedFlightPanel/SelectedFlightPanel";
import ErrorPopup from "./ErrorPopup";

const MapPage = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedCallsign, setSelectedCallsign] = useState(null);
  const [pinnedFlights, setPinnedFlights] = useState([]);
  const [loadFlights, setLoadFlights] = useState(true);

  const mapRef = useRef(null);

  const resetMapView = () => {
    if (mapRef.current) {
      setSelectedCallsign(null);
      setSelectedMarker(null);
      mapRef.current.setView([44.0, -72.7], 8);
    }
  };

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

  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current && selectedMarker) {
        mapRef.current.setView(
          [selectedMarker.latitude, selectedMarker.longitude],
          12
        );
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedMarker]);

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
        selectedMarker={selectedMarker}
        setSelectedMarker={setSelectedMarker}
        setSelectedCallsign={setSelectedCallsign}
        setPinnedFlights={setPinnedFlights}
        setLoadFlights={setLoadFlights}
        loadFlights={loadFlights}
        selectedCallsign={selectedCallsign}
        pinnedFlights={pinnedFlights}
        mapRef={mapRef}
        resetMapView={resetMapView}
      />
      <PinnedFlightsList
        pinnedFlights={pinnedFlights}
        setPinnedFlights={setPinnedFlights}
      />
      <SelectedFlightPanel
        setSelectedMarker={setSelectedMarker}
        setSelectedCallsign={setSelectedCallsign}
        selectedMarker={selectedMarker}
        setPinnedFlights={setPinnedFlights}
        pinnedFlights={pinnedFlights}
        mapRef={mapRef}
      />
      {!loadFlights && <ErrorPopup />}
    </div>
  );
};

export default MapPage;
