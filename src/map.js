import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import L from "leaflet";
import betaLogo from "./images/beta_air_llc_logo.png";
import { OPENSKY_CREDENTIALS } from "./config/config";
import "leaflet-rotatedmarker";
import { Avatar, Box, ListItemText, Paper, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";

const MapPage = () => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedCallsign, setSelectedCallsign] = useState(null);
  const [timeDifference, setTimeDifference] = useState(null);
  const [pinnedFlights, setPinnedFlights] = useState([]);

  useEffect(() => {
    if (!mapRef.current) {
      const mapInstance = L.map("map").setView([44.0, -72.7], 8);
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

            if (latitude && longitude) {
              const greenIcon = L.icon({
                iconUrl: betaLogo,
                iconSize: [84, 65],
                iconAnchor: [42, 32.5],
              });

              const marker = L.marker([latitude, longitude], {
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
                        baro_altitude,
                        velocity,
                      }
                    : flight
                );
              });
            }
          });
        }

        // Update the selected marker to the updated data if found
        if (updatedSelectedMarker) {
          setSelectedMarker(updatedSelectedMarker);
        }
      } catch (error) {
        console.error("Error fetching or processing plane data:", error);
      }
    };

    fetchPlaneData();
    const intervalId = setInterval(fetchPlaneData, 30000);

    return () => clearInterval(intervalId);
  }, [selectedCallsign]);

  useEffect(() => {
    if (selectedMarker) {
      const interval = setInterval(() => {
        const currentUnixTime = Math.floor(Date.now() / 1000);
        setTimeDifference(currentUnixTime - selectedMarker.last_contact);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [selectedMarker]);

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossorigin=""
        />
        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossorigin=""
        ></script>
      </Helmet>
      <div id="map" style={{ height: "100%", width: "100%" }}></div>

      <Paper
        style={{
          position: "fixed",
          top: "20%",
          left: "10%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
          padding: "20px",
          maxWidth: "300px",
        }}
        elevation={4}
      >
        <Typography variant="h6">Pinned Flights</Typography>
        <List>
          {pinnedFlights.length > 0 &&
            pinnedFlights.map((flight) => (
              <ListItem key={flight.callsign}>
                <ListItemAvatar>
                  <Avatar>
                    <ImageIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={flight.callsign}
                  secondary={`Altitude: ${flight.baro_altitude}`}
                ></ListItemText>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => {
                    // Remove the flight with the matching callsign
                    setPinnedFlights((prevPinnedFlights) =>
                      prevPinnedFlights.filter(
                        (item) => item.callsign !== flight.callsign // Ensure you're comparing callsigns correctly
                      )
                    );
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
        </List>
      </Paper>

      {selectedMarker && (
        <Paper
          style={{
            position: "fixed",
            top: "50%",
            left: "60%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            padding: "20px",
            maxWidth: "300px",
          }}
          elevation={4}
        >
          <Typography variant="h6">
            Callsign: {selectedMarker.callsign || "N/A"}
          </Typography>
          <IconButton
            aria-label="add"
            onClick={() => {
              !pinnedFlights.some(
                (flight) => flight.callsign === selectedMarker.callsign
              ) &&
                setPinnedFlights((prevPinnedFlights) => [
                  ...prevPinnedFlights,
                  {
                    callsign: selectedMarker.callsign,
                    baro_altitude: selectedMarker.baro_altitude,
                    velocity: selectedMarker.velocity,
                  },
                ]);
            }}
          >
            <AddBoxIcon />
          </IconButton>
          <Typography variant="body2">ICAO: {selectedMarker.icao}</Typography>
          <Typography variant="body2">
            Time since last contact: {timeDifference}s
          </Typography>
          <Typography variant="body2">
            Barometric Altitude: {selectedMarker.baro_altitude} m
          </Typography>
          <Typography variant="body2">
            Velocity: {selectedMarker.velocity} m/s
          </Typography>
        </Paper>
      )}
    </div>
  );
};

export default MapPage;
