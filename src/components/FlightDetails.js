import React from "react";
import { Paper, Typography, IconButton, ListItemText } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useRef, useState } from "react";
import TwoColumnList from "./TwoColumnList";

const FlightDetails = ({ selectedMarker, pinnedFlights, setPinnedFlights }) => {
  const [timeDifference, setTimeDifference] = useState(null);

  const {
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
  } = selectedMarker || {};

  const addToPinnedFlights = () => {
    if (!pinnedFlights.some((flight) => flight.callsign === callsign)) {
      setPinnedFlights((prev) => [
        ...prev,
        {
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
        },
      ]);
    }
  };

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
    selectedMarker && (
      <Paper
        style={{
          position: "fixed",
          top: "50px",
          right: "50px",
          zIndex: 1000,
          padding: "20px",
          maxWidth: "300px",
        }}
        elevation={4}
      >
        <IconButton
          aria-label="add"
          onClick={() => {
            !pinnedFlights.some(
              (flight) => flight.callsign === selectedMarker.callsign
            ) &&
              setPinnedFlights((prevPinnedFlights) => [
                ...prevPinnedFlights,
                selectedMarker,
              ]);
          }}
        >
          <AddBoxIcon />
        </IconButton>
        <TwoColumnList selectedMarker={selectedMarker}></TwoColumnList>
        {/* {Object.entries(selectedMarker).map(([key, value], index) => (
          <ListItemText key={index} primary={`${key.toUpperCase().replace('_', ' ')}`} secondary={`${value}`} />
        ))} */}
      </Paper>
    )
  );
};

export default FlightDetails;
