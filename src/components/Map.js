import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { OPENSKY_CREDENTIALS } from "../config/config";
import betaLogo from "../images/beta_air_llc_logo.png";
import "leaflet-rotatedmarker";

const Map = ({
  setSelectedMarker,
  setSelectedCallsign,
  setPinnedFlights,
  selectedCallsign,
  pinnedFlights,
  mapRef
}) => {
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) {
      const mapInstance = L.map("map", {
        center: [44.0, -72.7],
        zoom: 8,
        dragging: false,
        doubleClickZoom: false,
        zoomControl: false,
        scrollWheelZoom: false
      }
      );
      mapRef.current = mapInstance;


  
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);
    }

    const fetchPlaneData = async () => {
      try {
        const { username, password } = OPENSKY_CREDENTIALS;
        const credentials = btoa(`${username}:${password}`);

        const lamin = 42.7;
        const lamax = 45.0;
        const lomin = -73.4377;
        const lomax = -71.4657;

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

        // Remove previous markers
        markersRef.current.forEach((marker) =>
          mapRef.current.removeLayer(marker)
        );
        markersRef.current = [];

        const { states } = data;
        let updatedSelectedMarker = null;

        if (states) {
          states.forEach((plane) => {
            const [
              icao,
              callsign,
              origin_country,
              time_position,
              last_contact,
              longitude,
              latitude,
              baro_altitude,
              on_ground,
              velocity,
              true_track,
              vertical_rate,
              sensors,
              geo_altitude,
              squawk,
              spi,
              position_source,
              category,
            ] = plane;

            // Check if lat and lng are valid numbers
            if (isFinite(latitude) && isFinite(longitude)) {
              const greenIcon = L.icon({
                iconUrl: betaLogo,
                iconSize: [84, 65],
                iconAnchor: [42, 32.5],
              });

              const marker = L.marker([latitude, longitude], {
                icon: greenIcon,
              }).addTo(mapRef.current);
              
              mapRef.current.on("click", () => {
                mapRef.current.setView([44.0, -72.7], 8);
                setSelectedMarker(null);
                setSelectedCallsign(null);
              });

              marker.on("click", () => {
                mapRef.current.setView([latitude, longitude], 12);
                setSelectedMarker({
                  icao,
                  callsign,
                  origin_country,
                  time_position,
                  last_contact,
                  longitude,
                  latitude,
                  baro_altitude,
                  on_ground,
                  velocity,
                  true_track,
                  vertical_rate,
                  sensors,
                  geo_altitude,
                  squawk,
                  spi,
                  position_source,
                  category,
                });
                setSelectedCallsign(callsign);
              });

              marker.setRotationAngle(true_track || 0);
              marker.setRotationOrigin("center");

              markersRef.current.push(marker);

              // If the marker matches the previously selected callsign, track it
              if (callsign === selectedCallsign) {
                updatedSelectedMarker = {
                  icao,
                  callsign,
                  origin_country,
                  time_position,
                  last_contact,
                  longitude,
                  latitude,
                  baro_altitude,
                  on_ground,
                  velocity,
                  true_track,
                  vertical_rate,
                  sensors,
                  geo_altitude,
                  squawk,
                  spi,
                  position_source,
                  category,
                };
                mapRef.current.setView([latitude, longitude], 12);
              }

              // Update pinned flights if callsign exists
              setPinnedFlights((prevPinnedFlights) => {
                return prevPinnedFlights.map((flight) =>
                  flight.callsign === callsign
                    ? {
                        ...flight,
                        icao,
                        callsign,
                        origin_country,
                        time_position,
                        last_contact,
                        longitude,
                        latitude,
                        baro_altitude,
                        on_ground,
                        velocity,
                        true_track,
                        vertical_rate,
                        sensors,
                        geo_altitude,
                        squawk,
                        spi,
                        position_source,
                        category,
                      }
                    : flight
                );
              });
            } else {
              console.warn(`Skipping plane with invalid coordinates: ${plane}`);
            }
          });
        }

        // Update the selected marker to the updated data if found
        if (updatedSelectedMarker) {
          setSelectedMarker(updatedSelectedMarker);
        }
      } catch (error) {
        console.error("Error fetching plane data:", error);
      }
    };

    fetchPlaneData();
    const intervalId = setInterval(fetchPlaneData, 30000);

    return () => clearInterval(intervalId);
  }, [
    selectedCallsign,
    setPinnedFlights,
    setSelectedCallsign,
    setSelectedMarker,
    mapRef
  ]);

  return <div id="map" style={{ height: "100%", width: "100%" }} />;
};

export default Map;
