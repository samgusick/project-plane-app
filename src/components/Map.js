import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { OPENSKY_CREDENTIALS } from "../config/config";
import betaLogo from "../images/beta_air_llc_logo.png";
import "leaflet-rotatedmarker";

const Map = ({
  selectedMarker,
  setSelectedMarker,
  setSelectedCallsign,
  setPinnedFlights,
  selectedCallsign,
  pinnedFlights,
  mapRef,
  resetMapView
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
    
              if (marker) {
                // Update marker position and rotation
                marker.setLatLng([latitude, longitude]);
                marker.setRotationAngle(true_track || 0);
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
                
              } else {
                // Create a new marker
                const greenIcon = L.icon({
                  iconUrl: betaLogo,
                  iconSize: [84, 65],
                  iconAnchor: [42, 32.5],
                });
    
                marker = L.marker([latitude, longitude], {
                  icon: greenIcon,
                }).addTo(mapRef.current);
    
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
                mapRef.current.setView([latitude, longitude], 12);
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
    
        // Remove markers not in the new data
        Object.keys(markersRef.current).forEach((icao) => {
          if (!currentIcaos.has(icao)) {
            if (icao == selectedMarker.icao) {
              resetMapView();
            }
            mapRef.current.removeLayer(markersRef.current[icao]);
            delete markersRef.current[icao];
          }
        });
    
        // Update selected marker
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
