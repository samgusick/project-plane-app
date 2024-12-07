import React, { useEffect, useState } from "react";
import { Paper, IconButton } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CloseIcon from "@mui/icons-material/Close";
import TwoColumnList from "./TwoColumnList";
import PushPinIcon from "@mui/icons-material/PushPin";

const FlightDetails = ({
  setSelectedMarker,
  setSelectedCallsign,
  selectedMarker,
  pinnedFlights,
  setPinnedFlights,
  mapRef,
}) => {
  const [timeDifference, setTimeDifference] = useState(null);
  const [markerActive, setMarkerActive] = useState(true);

  const handleAddToPinnedFlights = () => {
    if (
      !pinnedFlights.some(
        (flight) => flight.callsign === selectedMarker.callsign
      )
    ) {
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
          bottom: "50px",
          left: "50px",
          zIndex: 1000,
          padding: "20px",
          maxWidth: "300px",
        }}
        elevation={4}
      >
        <h1>{`Aircraft ${selectedMarker.icao}`}</h1>
        <IconButton
          aria-label="add"
          onClick={handleAddToPinnedFlights}
          sx={{ position: "absolute", top: 8, left: 8 }}
        >
          <PushPinIcon />
        </IconButton>
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <TwoColumnList marker={selectedMarker} />
      </Paper>
    )
  );
};

export default FlightDetails;
