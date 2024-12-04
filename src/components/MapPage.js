import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import Map from "./Map";
import PinnedFlightsList from "./PinnedFlightsList";
import FlightDetails from "./FlightDetails";

const MapPage = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedCallsign, setSelectedCallsign] = useState(null);
  const [pinnedFlights, setPinnedFlights] = useState([]);

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
        setSelectedMarker={setSelectedMarker}
        setSelectedCallsign={setSelectedCallsign}
        setPinnedFlights={setPinnedFlights}
        selectedCallsign={selectedCallsign}
        pinnedFlights={pinnedFlights}
      />
      <PinnedFlightsList
        pinnedFlights={pinnedFlights}
        setPinnedFlights={setPinnedFlights}
      />
      <FlightDetails
        selectedMarker={selectedMarker}
        setPinnedFlights={setPinnedFlights}
        pinnedFlights={pinnedFlights}
      />
    </div>
  );
};

export default MapPage;
