import React, { useEffect, useState } from "react";
import { Paper, IconButton } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CloseIcon from "@mui/icons-material/Close";
import TwoColumnList from "./TwoColumnList";

const FlightDetails = ({ setSelectedMarker, setSelectedCallsign, selectedMarker, pinnedFlights, setPinnedFlights, mapRef}) => {
  const [timeDifference, setTimeDifference] = useState(null);
  const [markerActive, setMarkerActive] = useState(true);

  useEffect(() => {
    if (selectedMarker) {
      setMarkerActive(true); // Reactivate the marker when a new one is selected
      const interval = setInterval(() => {
        const currentUnixTime = Math.floor(Date.now() / 1000);
        setTimeDifference(currentUnixTime - selectedMarker.last_contact);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [selectedMarker]);

  const handleAddToPinnedFlights = () => {
    if (!pinnedFlights.some((flight) => flight.callsign === selectedMarker.callsign)) {
      setPinnedFlights((prev) => [...prev, selectedMarker]);
    }
  };

  const handleClose = () => {
    setSelectedCallsign(null);
    setSelectedMarker(null);
    mapRef.current.setView([44.0, -72.7], 8);
  };

  return (
    selectedMarker &&
    markerActive && (
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
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
        <IconButton aria-label="add" onClick={handleAddToPinnedFlights}>
          <AddBoxIcon />
        </IconButton>
        <TwoColumnList selectedMarker={selectedMarker} />
      </Paper>
    )
  );
};

export default FlightDetails;
