import ErrorPopup from "./ErrorPopup.js";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { OPENSKY_CREDENTIALS } from "../config/config";
import betaLogo from "../images/beta_air_llc_logo.png";
import betaLogoShadow from "../images/beta_air_llc_logo_shadow.png";
import betaLogoOrange from "../images/beta_air_llc_logo_shadow_orange.png"
import "leaflet-rotatedmarker";

const Map = ({
  selectedMarker,
  setSelectedMarker,
  setSelectedCallsign,
  setPinnedFlights,
  setLoadFlights,
  loadFlights,
  selectedCallsign,
  pinnedFlights,
  mapRef,
  resetMapView,
}) => {
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) {
      const mapInstance = L.map("map", {
        center: [44.0, -72.7],
        zoom: 8,
        dragging: true,
        doubleClickZoom: true,
        zoomControl: true,
        scrollWheelZoom: true,
      });
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
          if (response.status === 429) {
            // Suppress 429 Too Many Requests errors
            console.warn("Rate limit hit. Suppressing log.");
            setLoadFlights(false);
          } else {
            console.error(`Error: ${response.status} ${response.statusText}`);
          }
          return;
        }

        const data = await response.json();
        const { states } = data;

        // Create a Set of current ICAOs from the new data
        const currentIcaos = new Set();
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

            // Validate coordinates
            if (isFinite(latitude) && isFinite(longitude)) {
              currentIcaos.add(icao);

              // Check if marker exists
              let marker = markersRef.current[icao];

              const orangeIcon = L.icon({
                iconUrl: betaLogoOrange,
                iconSize: [84, 65],
                iconAnchor: [42, 32.5],
              });

              const greenIcon = L.icon({
                iconUrl: betaLogoShadow,
                iconSize: [84, 65],
                iconAnchor: [42, 32.5],
              });

              if (marker) {
                // Update marker position and rotation
                marker.setLatLng([latitude, longitude]);
                marker.setRotationAngle(true_track || 0);
              
                marker.on("click", () => {
                  // Reset the previously selected marker's icon
                  if (selectedMarker && markersRef.current[selectedMarker.icao]) {
                    markersRef.current[selectedMarker.icao].setIcon(greenIcon);
                  }
              
                  // Update selected marker
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
              
                  // Set the new marker's icon to orange
                  marker.setIcon(orangeIcon);
                });
              
                marker.on("mouseover", () => {
                    marker.setIcon(orangeIcon);
                });
              
                marker.on("mouseout", () => {

                  const latLng = marker.getLatLng();
                  if (selectedMarker && [selectedMarker.latitude, selectedMarker.longitude] != [latLng.lat, latLng.lng]) {
                    marker.setIcon(greenIcon);
                  }
                });
              } else {
                // Create a new marker
                marker = L.marker([latitude, longitude], {
                  icon: greenIcon,
                }).addTo(mapRef.current);
              
                marker.on("click", () => {
                  // Reset the previously selected marker's icon
                  if (selectedMarker && markersRef.current[selectedMarker.icao]) {
                    markersRef.current[selectedMarker.icao].setIcon(greenIcon);
                  }
              
                  // Update selected marker
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
              
                  // Set the new marker's icon to orange
                  marker.setIcon(orangeIcon);
                });
              
                marker.on("mouseover", () => {
                  if (!selectedMarker || selectedMarker.icao !== icao) {
                    marker.setIcon(orangeIcon);
                  }
                });
              
                marker.on("mouseout", () => {
                  // Do not reset the icon if this is the selected marker
                  if (!selectedMarker || selectedMarker.icao !== icao) {
                    marker.setIcon(greenIcon);
                  }
                });
              
                markersRef.current[icao] = marker;
              }
              
              
              

              // Track previously selected marker
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
                // mapRef.current.setView([latitude, longitude], 12);
              }

              // Update pinned flights
              setPinnedFlights((prevPinnedFlights) =>
                prevPinnedFlights.map((flight) =>
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
                )
              );
            } else {
              console.warn(`Skipping plane with invalid coordinates: ${plane}`);
            }
          });
        }

        Object.keys(markersRef.current).forEach((icao) => {
          const marker = markersRef.current[icao];
          if (marker) {  // Check if marker exists
            if (!currentIcaos.has(icao)) {
              if (icao == selectedMarker?.icao) {  // Optional chaining to avoid issues if selectedMarker is undefined
                resetMapView();
              }
              mapRef.current.removeLayer(marker);
              delete markersRef.current[icao];
            }
          }
        });
        

        // Update selected marker
        if (updatedSelectedMarker) {
          setSelectedMarker(updatedSelectedMarker);
        }
      } catch (error) {
        if (error.message.includes("429")) {
          console.warn("Rate limit hit. Suppressing error log.");
        } else {
          console.error("Error fetching plane data:", error);
        }
      }
    };
    
    if (loadFlights) {
      fetchPlaneData();
      const intervalId = setInterval(fetchPlaneData, 30000);
  
      return () => clearInterval(intervalId);
    }
  }, [
    selectedCallsign,
    setPinnedFlights,
    setSelectedCallsign,
    setSelectedMarker,
    mapRef,
    loadFlights,
    setLoadFlights
  ]);

  return <div id="map" style={{ height: "100%", width: "100%" }} />;
};

export default Map;
