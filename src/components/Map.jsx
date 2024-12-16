import React, { useEffect, useRef } from "react";
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
  const planePositions = useRef({}); // Store plane positions for interpolation

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
    }
  };

  const interpolatePosition = (start, angle, speed, timeElapsed) => {
    const distance = speed * timeElapsed; // distance = speed * time
    const deltaLat = (distance * Math.cos((angle * Math.PI) / 180)) / 111139; // Convert meters to degrees
    const deltaLng =
      (distance * Math.sin((angle * Math.PI) / 180)) /
      (111139 * Math.cos((start.lat * Math.PI) / 180)); // Account for Earth's curvature
    return {
      lat: start.lat + deltaLat,
      lng: start.lng + deltaLng,
    };
  };

  const animateMarkers = () => {
    const updatedMarkers = markersRef.current;
    const now = Date.now();

    Object.keys(planePositions.current).forEach((icao24) => {
      const { position, lastUpdate, angle, speed } = planePositions.current[icao24];
      const elapsedTime = (now - lastUpdate) / 1000; // Convert to seconds

      if (updatedMarkers[icao24]) {
        const newPosition = interpolatePosition(position, angle, speed, elapsedTime);
        updatedMarkers[icao24].setLatLng(newPosition);
        position.lat = newPosition.lat;
        position.lng = newPosition.lng;
        planePositions.current[icao24].lastUpdate = now;
      }
    });

    requestAnimationFrame(animateMarkers);
  };

  const updateMarker = (plane, updatedMarkers) => {
    const { icao24, latitude, longitude, trueTrack, velocity } = plane;
    const newPosition = { lat: latitude, lng: longitude };

    if (!updatedMarkers[icao24]) {
      const newMarker = L.marker([latitude, longitude], { icon: greyIcon })
        .addTo(mapRef.current)
        .on("click", () => setSelectedMarker(icao24))
        .on("mouseover", () => newMarker.setIcon(blueIcon))
        .on("mouseout", () => newMarker.setIcon(greyIcon));

      newMarker.setRotationAngle(trueTrack);
      updatedMarkers[icao24] = newMarker;
    } else {
      updatedMarkers[icao24].setLatLng(newPosition);
      updatedMarkers[icao24].setRotationAngle(trueTrack);
    }

    // Update position tracking
    planePositions.current[icao24] = {
      position: newPosition,
      lastUpdate: Date.now(),
      angle: trueTrack || 0,
      speed: velocity || 0,
    };
  };

  useEffect(() => {
    initializeMap();

    if (!planeData) return;

    const updatedMarkers = { ...markersRef.current };

    planeData.forEach((plane) => updateMarker(plane, updatedMarkers));
    markersRef.current = updatedMarkers;

    removeStaleMarkers(updatedMarkers);

    // Start animation loop
    if (Object.keys(planePositions.current).length > 0) {
      requestAnimationFrame(animateMarkers);
    }
  }, [planeData]);

  useEffect(() => {
    // Update marker icons based on the selected marker
    Object.keys(markersRef.current).forEach((icao24) => {
      const marker = markersRef.current[icao24];
      if (icao24 === selectedMarker) {
        marker.off("mouseout");
        marker.setIcon(blueIcon);
      } else {
        marker.on("mouseout", () => marker.setIcon(greyIcon));
        marker.setIcon(greyIcon);
      }
    });
  }, [selectedMarker]);

  const removeStaleMarkers = (updatedMarkers) => {
    Object.keys(updatedMarkers).forEach((icao24) => {
      if (
        !planeData.some((plane) => plane.icao24 === icao24) &&
        !pinnedFlights.includes(icao24)
      ) {
        mapRef.current.removeLayer(updatedMarkers[icao24]);
        delete updatedMarkers[icao24];
        delete planePositions.current[icao24];
      }
    });
  };

  return <div id="map" style={{ height: "100%", width: "100%" }} />;
};

export default Map;
