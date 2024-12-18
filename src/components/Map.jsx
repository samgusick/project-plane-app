import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-rotatedmarker";
import { defaultMapCenter } from "./MapPage";
import * as turf from "@turf/turf";

const TILE_LAYER_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_LAYER_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Data from <a href="https://opensky-network.org">The OpenSky Network</a>';

const Map = ({
  mapRef,
  markersRef,
  planeData,
  setSelectedMarker,
  unfilledPlaneIcon,
  filledPlaneIcon,
  selectedMarker,
  pinnedFlights,
}) => {
  const vermontGeoJSONRef = useRef(null);
  const planePositions = useRef({}); // Store plane positions for interpolation

  const initializeMap = async () => {
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
      const response = await fetch("/VTData.json");
      const geojsonData = await response.json();
      vermontGeoJSONRef.current = geojsonData;

      L.geoJSON(geojsonData, {
        style: (feature) => ({
          fillOpacity: 0.1,
          color: "green",
          weight: 2,
        }),
      }).addTo(mapInstance);

      L.control.zoom({
        position: "bottomright"
      })
      .addTo(mapInstance);
    }
  };

  const isPointInVermont = (lat, lng) => {
    if (!vermontGeoJSONRef.current) return false;

    const point = turf.point([lng, lat]);
    const vermontPolygon = turf.polygon(
      vermontGeoJSONRef.current.features[0].geometry.coordinates
    );

    return turf.booleanPointInPolygon(point, vermontPolygon);
  };

  const animateMarkers = () => {
    const now = Date.now();
    Object.keys(planePositions.current).forEach((icao24) => {
      const { position, lastUpdate, angle, speed } =
        planePositions.current[icao24];
      const elapsedTime = (now - lastUpdate) / 1000;

      if (markersRef.current[icao24]) {
        const newPosition = interpolatePosition(
          position,
          angle,
          speed,
          elapsedTime
        );
        markersRef.current[icao24].setLatLng(newPosition);
        position.lat = newPosition.lat;
        position.lng = newPosition.lng;
        planePositions.current[icao24].lastUpdate = now;
      }
    });
    requestAnimationFrame(animateMarkers);
  };

  const interpolatePosition = (start, angle, speed, timeElapsed) => {
    const distance = speed * timeElapsed;
    const deltaLat = (distance * Math.cos((angle * Math.PI) / 180)) / 111139;
    const deltaLng =
      (distance * Math.sin((angle * Math.PI) / 180)) /
      (111139 * Math.cos((start.lat * Math.PI) / 180));
    return {
      lat: start.lat + deltaLat,
      lng: start.lng + deltaLng,
    };
  };

  const updateMarker = (plane, updatedMarkers) => {
    const { icao24, latitude, longitude, trueTrack, velocity } = plane;
    const newPosition = { lat: latitude, lng: longitude };

    if (!updatedMarkers[icao24] && isPointInVermont(latitude, longitude)) {
      const newMarker = L.marker([latitude, longitude], { icon: unfilledPlaneIcon })
        .addTo(mapRef.current)
        .on("click", () => setSelectedMarker(icao24))
        .on("mouseover", () => newMarker.setIcon(filledPlaneIcon))
        .on("mouseout", () => newMarker.setIcon(unfilledPlaneIcon));
      newMarker.setRotationAngle(trueTrack);
      updatedMarkers[icao24] = newMarker;
    } else if (isPointInVermont(latitude, longitude)) {
      updatedMarkers[icao24].setLatLng(newPosition);
      updatedMarkers[icao24].setRotationAngle(trueTrack);
    }

    planePositions.current[icao24] = {
      position: newPosition,
      lastUpdate: Date.now(),
      angle: trueTrack || 0,
      speed: velocity || 0,
    };
  };

  const removeStaleMarkers = (updatedMarkers) => {
    Object.keys(updatedMarkers).forEach((icao24) => {
      const marker = updatedMarkers[icao24];
      const position = marker.getLatLng(); // Get marker's position as { lat, lng }

      if (
        (!planeData.some((plane) => plane.icao24 === icao24) &&
          !pinnedFlights.includes(icao24)) ||
        (!isPointInVermont(position.lat, position.lng) &&
          !pinnedFlights.includes(icao24))
      ) {
        mapRef.current.removeLayer(marker);
        delete updatedMarkers[icao24];
        delete planePositions.current[icao24];
      }
    });
  };

  useEffect(() => {
    (async () => {
      await initializeMap();
    })();
  }, []);

  useEffect(() => {
    if (!planeData) return;

    const updatedMarkers = { ...markersRef.current };
    planeData.forEach((plane) => updateMarker(plane, updatedMarkers));
    markersRef.current = updatedMarkers;

    removeStaleMarkers(updatedMarkers);

    if (Object.keys(planePositions.current).length > 0) {
      requestAnimationFrame(animateMarkers);
    }
  }, [planeData]);

  useEffect(() => {
    Object.keys(markersRef.current).forEach((icao24) => {
      const marker = markersRef.current[icao24];
      if (icao24 === selectedMarker) {
        marker.off("mouseout");
        marker.setIcon(filledPlaneIcon);
      } else {
        marker.on("mouseout", () => marker.setIcon(unfilledPlaneIcon));
        marker.setIcon(unfilledPlaneIcon);
      }
    });
  }, [selectedMarker]);

  return <div id="map" style={{ height: "100%", width: "100%" }} />;
};

export default Map;
