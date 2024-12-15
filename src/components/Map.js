import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet-rotatedmarker";
import { defaultMapCenter } from "./MapPage";

const TILE_LAYER_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_LAYER_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const Map = ({
  mapRef,
  markersRef,
  planeData,
  setSelectedMarker,
  greyIcon,
  orangeIcon,
  selectedMarker,
  pinnedFlights,
}) => {

  // Helper: Reset marker icons
  const resetMarkerIcons = () => {
    Object.values(markersRef.current).forEach((marker) => {
      marker.setIcon(greyIcon);
      marker.on("mouseout", () => marker.setIcon(greyIcon));
    });
  };

  // Helper: Highlight selected marker
  const highlightSelectedMarker = () => {
    if (selectedMarker) {
      resetMarkerIcons();
      const marker = markersRef.current[selectedMarker];
      if (marker) {
        marker.off("mouseout"); // Remove mouseout to maintain orange icon
        marker.setIcon(orangeIcon);
      }
    } else {
      resetMarkerIcons();
    }
  };

  // Effect: Handle selected marker updates
  useEffect(() => {
    highlightSelectedMarker();
  }, [selectedMarker]);

  // Effect: Initialize map and manage markers
  useEffect(() => {
    if (!mapRef.current) {
      const mapInstance = L.map("map", {
        center: defaultMapCenter,
        zoom: 8,
        dragging: true,
        doubleClickZoom: true,
        zoomControl: true,
        scrollWheelZoom: true,
      });
      mapRef.current = mapInstance;

      L.tileLayer(TILE_LAYER_URL, {
        attribution: TILE_LAYER_ATTRIBUTION,
      }).addTo(mapInstance);
    }

    if (!planeData) return;

    const updatedMarkers = { ...markersRef.current };

    // Add or update markers
    planeData.forEach((plane) => {
      if (!updatedMarkers[plane.icao24]) {
        const newMarker = L.marker([plane.latitude, plane.longitude], {
          icon: greyIcon,
        }).addTo(mapRef.current);

        // Attach events to the marker
        newMarker
          .on("click", () => setSelectedMarker(plane.icao24))
          .on("mouseover", () => newMarker.setIcon(orangeIcon))
          .on("mouseout", () => newMarker.setIcon(greyIcon));

        newMarker.setRotationAngle(plane.trueTrack);
        updatedMarkers[plane.icao24] = newMarker;
      } else {
        // Update existing marker
        const marker = updatedMarkers[plane.icao24];
        marker.setLatLng([plane.latitude, plane.longitude]);
        marker.setRotationAngle(plane.trueTrack);
      }
    });

    // Remove markers for planes no longer in data and not pinned
    Object.keys(updatedMarkers).forEach((icao24) => {
      if (
        !planeData.some((plane) => plane.icao24 === icao24) &&
        !pinnedFlights.includes(icao24)
      ) {
        mapRef.current.removeLayer(updatedMarkers[icao24]);
        delete updatedMarkers[icao24];
      }
    });

    markersRef.current = updatedMarkers;
  }, [planeData, mapRef, greyIcon, orangeIcon, setSelectedMarker]);

  return <div id="map" style={{ height: "100%", width: "100%" }} />;
};

export default Map;
