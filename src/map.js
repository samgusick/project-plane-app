import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import L from "leaflet";

const MapPage = () => {
  const mapRef = useRef(null); // Reference for Leaflet map instance
  const markersRef = useRef([]); // Reference to hold marker instances

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize the map
      const mapInstance = L.map("map").setView([44.0, -72.7], 8); // Centered on Vermont
      mapRef.current = mapInstance;

      // Add a tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);
    }

    const fetchPlaneData = async () => {
      try {
        // Vermont bounding box
        const lamin = 42.7;
        const lamax = 45.0;
        const lomin = -73.4377;
        const lomax = -71.4657;

        // Fetch live plane data for Vermont's bounding box
        const response = await fetch(
          `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`
        );
        if (!response.ok) {
          console.error("Failed to fetch plane data");
          return;
        }

        const data = await response.json();

        // Clear existing markers
        markersRef.current.forEach((marker) =>
          mapRef.current.removeLayer(marker)
        );
        markersRef.current = [];

        // Add markers for planes in the bounding box
        const { states } = data; // Extract planes' states
        if (states) {
          console.log(states);
          states.forEach((plane) => {
            const [
              icao,
              callsign,
              ,
              ,
              ,
              longitude,
              latitude,
              ,
              ,
              ,
              ,
              ,
              ,
              ,
              ,
              ,
              ,
            ] = plane;
            if (latitude && longitude) {
              const marker = L.marker([latitude, longitude])
                .addTo(mapRef.current)
                .bindPopup(`Callsign: ${callsign || "N/A"}<br>ICAO: ${icao}`);
              markersRef.current.push(marker);
            }
          });
        }
      } catch (error) {
        console.error("Error fetching or processing plane data:", error);
      }
    };

    // Fetch data immediately and set up an interval to refresh every minute
    fetchPlaneData();
    const intervalId = setInterval(fetchPlaneData, 10000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
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
      <div id="map" style={{ height: "100%", width: "100%" }}></div>
    </div>
  );
};

export default MapPage;
