import { PanelHeader } from "./PanelHeader";
import { PinSelectedFlight } from "./PinSelectedFlight";
import React, { useEffect, useState } from "react";
import { Paper } from "@mui/material";
import FlightDetails from "./FlightDetails/FlightDetails";
import { CloseSelectedFlightPanel } from "./CloseSelectedFlightPanel";

const SelectedFlightPanel = ({
  setSelectedMarker,
  setSelectedCallsign,
  selectedMarker,
  pinnedFlights,
  setPinnedFlights,
  mapRef,
}) => {
  const [timeDifference, setTimeDifference] = useState(null);
  const [markerActive, setMarkerActive] = useState(true);

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
        <PanelHeader selectedMarker={selectedMarker} />
        <PinSelectedFlight
          pinnedFlights={pinnedFlights}
          setPinnedFlights={setPinnedFlights}
          markerToPin={selectedMarker}
        />
        <CloseSelectedFlightPanel handleClose={handleClose} />
        <FlightDetails marker={selectedMarker} />
      </Paper>
    )
  );
};

export default SelectedFlightPanel;
