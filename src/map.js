import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import L, { icon } from "leaflet";
import betaLogo from "./images/beta_air_llc_logo.png"; // with import
import { OPENSKY_CREDENTIALS } from "./config/config";
import "leaflet-rotatedmarker";

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
        const { username, password } = OPENSKY_CREDENTIALS;
        const credentials = btoa(`${username}:${password}`); // Base64 encode credentials

        // Vermont bounding box
        const lamin = 42.7;
        const lamax = 45.0;
        const lomin = -73.4377;
        const lomax = -71.4657;

        // Fetch live plane data for Vermont's bounding box
        const response = await fetch(
          `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`,
          {
            headers: {
              Authorization: `Basic ${credentials}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
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
              true_track,
              ,
              ,
              ,
              ,
              ,
              ,
              ,
            ] = plane;
            if (latitude && longitude) {
              console.log(true_track);

              const greenIcon = L.icon({
                iconUrl: betaLogo,
                iconSize: [168, 130], // size of the icon
                iconAnchor: [84, 65], // point of the icon which will correspond to marker's location
              });

              // Use L.marker and the plugin's rotation support
              const marker = L.marker([latitude, longitude], {
                icon: greenIcon,
              })
                .addTo(mapRef.current)
                .bindPopup(`Callsign: ${callsign || "N/A"}<br>ICAO: ${icao}`);

              // Set rotation angle
              marker.setRotationAngle(-true_track || 0);
              marker.setRotationOrigin("center");

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
    const intervalId = setInterval(fetchPlaneData, 30000);

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
