import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-rotatedmarker";
import { OPENSKY_CREDENTIALS } from "../config/config";
import betaLogoShadow from "../images/beta_air_llc_logo_shadow.png";
import betaLogoOrange from "../images/beta_air_llc_logo_shadow_orange.png";
import { usePolling } from "./APIPollingHook";
import { fetchOpenSkyData } from "./fetchOpenSkyData";

const Map = ({
  selectedMarker,
  setSelectedMarker,
  setSelectedCallsign,
  setPinnedFlights,
  setLoadFlights,
  loadFlights,
  mapRef,
  resetMapView,
}) => {
  const markersRef = useRef({});

  const planeData = usePolling(fetchOpenSkyData, 30000);

  useEffect(() => {
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

    const fetchPlaneData = async () => {
      try {
        if (planeData) {
          const states = planeData;
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
    
                  // Update selected marker if necessary
                  if (
                    selectedMarker &&
                    selectedMarker.icao === icao &&
                    selectedMarker.last_contact !== last_contact
                  ) {
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
                  }
                } else {
                  const marker = L.marker([latitude, longitude], {
                    icon: greenIcon,
                  }).addTo(mapRef.current);

                  marker.on("mouseover", () => {
                    marker.setIcon(orangeIcon);
                  });

                  marker.on("mouseout", () => {
                    marker.setIcon(greenIcon);
                  });
    
                  marker.on("click", () => {
                    Object.values(markersRef.current).forEach((otherMarker) => {
                      otherMarker.setIcon(greenIcon);
                      otherMarker.on("mouseout", () =>
                        otherMarker.setIcon(greenIcon)
                      );
                    });
    
                    marker.off("mouseout");
                    marker.setIcon(orangeIcon);
    
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
    
                // // Update pinned flights
                // setPinnedFlights((prevPinnedFlights) =>
                //   prevPinnedFlights.map((flight) =>
                //     flight.callsign === callsign
                //       ? {
                //           ...flight,
                //           icao,
                //           callsign,
                //           origin_country,
                //           time_position,
                //           last_contact,
                //           longitude,
                //           latitude,
                //           baro_altitude,
                //           on_ground,
                //           velocity,
                //           true_track,
                //           vertical_rate,
                //           sensors,
                //           geo_altitude,
                //           squawk,
                //           spi,
                //           position_source,
                //           category,
                //         }
                //       : flight
                //   )
                // );
              }
            });
          }
    
          // Remove markers for planes that are no longer visible
          Object.keys(markersRef.current).forEach((icao) => {
            if (!currentIcaos.has(icao)) {
              mapRef.current.removeLayer(markersRef.current[icao]);
              delete markersRef.current[icao];
              if (selectedMarker?.icao === icao) {
                resetMapView();
              }
            }
          });
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
    loadFlights,
    mapRef,
    resetMapView,
    setLoadFlights,
    setPinnedFlights,
    setSelectedCallsign,
    selectedMarker,
    setSelectedMarker,
    planeData,
  ]);

  return <div id="map" style={{ height: "100%", width: "100%" }} />;
};

export default Map;
