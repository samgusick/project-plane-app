import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet-rotatedmarker";
import { defaultMapCenter } from "./MapPage";
const TILE_LAYER_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_LAYER_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Data from <a href="https://opensky-network.org">The OpenSky Network</a>';

const Map = ({
  mapRef,
  markersRef,
  planeData,
  setSelectedMarker,
  greyIcon,
  blueIcon,
  selectedMarker,
  pinnedFlights,
}) => {
  // Helper: Initialize the map if not already initialized
  const initializeMap = () => {
    if (!mapRef.current) {
      const mapInstance = L.map("map", {
        center: defaultMapCenter,
        zoom: 8,
        dragging: true,
        doubleClickZoom: true,
        zoomControl: false,
        scrollWheelZoom: true,
      });
      mapRef.current = mapInstance;

      L.tileLayer(TILE_LAYER_URL, {
        attribution: TILE_LAYER_ATTRIBUTION,
      }).addTo(mapInstance);

      // Add grey-out effect for the entire map using an overlay
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        opacity: 1, // Grey out everything by setting opacity to 0.5
      }).addTo(mapInstance);

      // Fetch the GeoJSON file and add it to the map
      fetch("/VTData.geojson")
        .then((response) => response.json()) // Parse the GeoJSON file
        .then((geojsonData) => {
          // Add the GeoJSON data to the map

          L.geoJSON(geojsonData, {
            style: (feature) => ({
              fillOpacity: 0.1,
              color: "darkgreen",
              weight: 2,
            })
          }).addTo(mapInstance);
        })
        .catch((error) => console.error("Error loading GeoJSON file:", error));

        // Fetch the GeoJSON file and add it to the map
      fetch("/NHData.geojson")
      .then((response) => response.json()) // Parse the GeoJSON file
      .then((geojsonData) => {
        // Add the GeoJSON data to the map

        L.geoJSON(geojsonData, {
          style: (feature) => ({
            fillOpacity: 0.1,
            color: "darkRed",
            weight: 2,
          })
        }).addTo(mapInstance);
      })
      .catch((error) => console.error("Error loading GeoJSON file:", error));
    }
  };

  // Helper: Reset all marker icons to the default grey icon
  const resetMarkerIcons = () => {
    Object.values(markersRef.current).forEach((marker) => {
      marker.setIcon(greyIcon);
      marker.on("mouseout", () => marker.setIcon(greyIcon));
    });
  };

  // Helper: Highlight the selected marker by changing its icon blue
  const highlightSelectedMarker = () => {
    if (!selectedMarker) return resetMarkerIcons();

    resetMarkerIcons();
    const marker = markersRef.current[selectedMarker];
    if (marker) {
      marker.off("mouseout"); // Prevent icon reset on mouseout
      marker.setIcon(blueIcon);
    }
  };

  // Helper: Add or update a marker on the map
  const updateMarker = (plane, updatedMarkers) => {
    const { icao24, latitude, longitude, trueTrack } = plane;

    if (!updatedMarkers[icao24]) {
      // Create a new marker
      const newMarker = L.marker([latitude, longitude], { icon: greyIcon })
        .addTo(mapRef.current)
        .on("click", () => setSelectedMarker(icao24))
        .on("mouseover", () => newMarker.setIcon(blueIcon))
        .on("mouseout", () => newMarker.setIcon(greyIcon));

      newMarker.setRotationAngle(trueTrack);
      updatedMarkers[icao24] = newMarker;
    } else {
      // Update existing marker position and rotation
      const marker = updatedMarkers[icao24];
      marker.setLatLng([latitude, longitude]);
      marker.setRotationAngle(trueTrack);
    }
  };

  // Helper: Remove markers that are no longer in the plane data or pinned flights
  const removeStaleMarkers = (updatedMarkers) => {
    Object.keys(updatedMarkers).forEach((icao24) => {
      if (
        !planeData.some((plane) => plane.icao24 === icao24) &&
        !pinnedFlights.includes(icao24)
      ) {
        mapRef.current.removeLayer(updatedMarkers[icao24]);
        delete updatedMarkers[icao24];
      }
    });
  };

  // Effect: Highlight the selected marker whenever it changes
  useEffect(() => {
    highlightSelectedMarker();
  }, [selectedMarker]);

  // Effect: Initialize the map and update markers when plane data changes
  useEffect(() => {
    initializeMap();

    if (!planeData) return;

    const updatedMarkers = { ...markersRef.current };

    // Add or update markers for each plane
    planeData.forEach((plane) => updateMarker(plane, updatedMarkers));

    // Remove markers that are no longer relevant
    removeStaleMarkers(updatedMarkers);

    markersRef.current = updatedMarkers;
  }, [planeData, mapRef, greyIcon, blueIcon, setSelectedMarker, pinnedFlights]);

  return <div id="map" style={{ height: "100%", width: "100%" }} />;
};

export default Map;
