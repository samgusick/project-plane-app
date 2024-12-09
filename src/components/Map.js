import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-rotatedmarker";
import { OPENSKY_CREDENTIALS } from "../config/config";
import betaLogoShadow from "../images/beta_air_llc_logo_shadow.png";
import betaLogoOrange from "../images/beta_air_llc_logo_shadow_orange.png";

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
  const markersRef = useRef({});
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

  useEffect(() => {
    // Initialize map instance if it doesn't already exist
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

    if (!selectedMarker) {
      Object.values(markersRef.current).forEach((otherMarker) => {
        // Reapply mouseover and mouseout events to other markers
        otherMarker.on("mouseover", () => {
          otherMarker.setIcon(orangeIcon);
        });
        otherMarker.on("mouseout", () => {
          otherMarker.setIcon(greenIcon);
        });

        // Set icon to green for other markers
        otherMarker.setIcon(greenIcon);
      });
    }

    const fetchPlaneData = async () => {
      try {
        const { username, password } = OPENSKY_CREDENTIALS;
        const credentials = btoa(`${username}:${password}`);
        const bounds = {
          lamin: 42.7,
          lamax: 45.0,
          lomin: -73.4377,
          lomax: -71.4657,
        };

        const response = await fetch(
          `https://opensky-network.org/api/states/all?lamin=${bounds.lamin}&lomin=${bounds.lomin}&lamax=${bounds.lamax}&lomax=${bounds.lomax}`,
          { headers: { Authorization: `Basic ${credentials}` } }
        );

        if (!response.ok) {
          if (response.status === 429) {
            console.warn("Rate limit hit. Suppressing log.");
            setLoadFlights(false);
          } else {
            console.error(`Error: ${response.status} ${response.statusText}`);
          }
          return;
        }

        const { states } = await response.json();
        const currentIcaos = new Set();

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

            if (isFinite(latitude) && isFinite(longitude)) {
              currentIcaos.add(icao);
              const existingMarker = markersRef.current[icao];

              if (existingMarker) {
                existingMarker.setLatLng([latitude, longitude]);
                existingMarker.setRotationAngle(true_track || 0);
                
              } else {
                const marker = L.marker([latitude, longitude], {
                  icon:
                    selectedMarker &&
                    selectedMarker.longitude === longitude &&
                    selectedMarker.latitude === latitude
                      ? orangeIcon
                      : greenIcon,
                }).addTo(mapRef.current);

                const mouseOut = (thisMarker) => {
                  thisMarker.setIcon(greenIcon);
                };

                marker.on("mouseover", () => {
                  marker.setIcon(orangeIcon);
                });
                marker.on("mouseout", () => mouseOut(marker));

                marker.on("click", () => {
                  // Reset all markers to default (greenIcon) and re-enable mouseover/mouseout
                  Object.values(markersRef.current).forEach((otherMarker) => {
                    if (otherMarker !== marker) {
                      // Reapply mouseover and mouseout events to other markers
                      otherMarker.on("mouseover", () => {
                        otherMarker.setIcon(orangeIcon);
                      });
                      otherMarker.on("mouseout", () => {
                        otherMarker.setIcon(greenIcon);
                      });

                      // Set icon to green for other markers
                      otherMarker.setIcon(greenIcon);
                    }
                  });

                  // Disable mouseout for the clicked marker
                  marker.off("mouseout");

                  // Highlight the clicked marker
                  marker.setIcon(orangeIcon);

                  // Set the clicked marker as selected
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

                  // Log clicked marker info
                  console.log(
                    "Clicked Marker Longitude:",
                    longitude,
                    "Latitude:",
                    latitude
                  );
                });

                markersRef.current[icao] = marker;
              }
            }
          });
        }

        // Remove outdated markers
        Object.keys(markersRef.current).forEach((icao) => {
          if (!currentIcaos.has(icao)) {
            const marker = markersRef.current[icao];
            mapRef.current.removeLayer(marker);
            delete markersRef.current[icao];
          }
        });
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
    selectedMarker,
    setPinnedFlights,
    setSelectedCallsign,
    setSelectedMarker,
    mapRef,
    loadFlights,
    setLoadFlights,
  ]);

  return <div id="map" style={{ height: "100%", width: "100%" }} />;
};

export default Map;
