import React, { useEffect, useRef, useState } from "react";
import L, { map, marker } from "leaflet";
import "leaflet-rotatedmarker";
import { OPENSKY_CREDENTIALS } from "../config/config";
import { usePolling } from "./APIPollingHook";
import { fetchOpenSkyData } from "./fetchOpenSkyData";

const Map = ({ mapRef, markersRef, planeData, setSelectedMarker, greyIcon, orangeIcon, selectedMarker }) => {
  const [leafletMarkers, setLeafletMarkers] = useState({});
  
  const markersRefSetDefaultLogos = () => {
    if (!selectedMarker) {
      Object.values(markersRef.current).forEach((otherMarker) => {
        otherMarker.setIcon(greyIcon);
        otherMarker.on("mouseout", () => otherMarker.setIcon(greyIcon));
      });
    }
  };

  useEffect(() => {
    console.log("rerender")
    markersRefSetDefaultLogos();
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

    if (!planeData) return;

    

    const updatedMarkers = { ...markersRef.current };

    // Add or update markers
    planeData.forEach((plane) => {
      if (!updatedMarkers[plane.icao24]) {
        const marker = L.marker([plane.latitude, plane.longitude], {
          icon: greyIcon,
        }).addTo(mapRef.current);

        marker.on("click", () => {
          setSelectedMarker(plane.icao24);

          Object.values(markersRef.current).forEach((otherMarker) => {
            otherMarker.setIcon(greyIcon);
            otherMarker.on("mouseout", () =>
              otherMarker.setIcon(greyIcon)
            );
          });          

          marker.off("mouseout");

          marker.setIcon(orangeIcon);
        });

        marker.on("mouseover", () => {
          marker.setIcon(orangeIcon);
        });

        marker.on("mouseout", () => {
          marker.setIcon(greyIcon);
        });
        
        marker.setRotationAngle(plane.trueTrack);
        updatedMarkers[plane.icao24] = marker;
      } else {
        // Update existing marker
        const marker = updatedMarkers[plane.icao24];
        marker.setLatLng([plane.latitude, plane.longitude]);
        marker.setRotationAngle(plane.trueTrack);
      }
    });

    // Remove markers no longer in planeData
    Object.keys(updatedMarkers).forEach((icao24) => {
      if (!planeData.some((plane) => plane.icao24 === icao24)) {
        mapRef.current.removeLayer(updatedMarkers[icao24]);
        delete updatedMarkers[icao24];
      }
    });

    markersRef.current = updatedMarkers; // Update ref with current markers
  }, [planeData, mapRef, selectedMarker]);

  return <div id="map" style={{ height: "100%", width: "100%" }} />;
};

export default Map;

