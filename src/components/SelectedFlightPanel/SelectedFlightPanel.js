import { PanelHeader } from "./PanelHeader";
import { PinSelectedFlight } from "./PinSelectedFlight";
import React from "react";
import { Grid2, Paper } from "@mui/material";
import FlightDetails from "./FlightDetails/FlightDetails";
import { CloseSelectedFlightPanel } from "./CloseSelectedFlightPanel";

const SelectedFlightPanel = ({
  setSelectedMarker,
  selectedMarker,
  pinnedFlights,
  setPinnedFlights,
  mapRef,
}) => {
  const handleClose = () => {
    setSelectedMarker(null);
    // mapRef.current.setView([44.0, -72.7], 8);
  };

  if (selectedMarker){

  return (
    selectedMarker &&
    (
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
        
        <PinSelectedFlight
          pinnedFlights={pinnedFlights}
          setPinnedFlights={setPinnedFlights}
          markerToPin={selectedMarker}
          leftPosition={8}
          topPosition={8}
          positionType={"absolute"}
        />
        <PanelHeader selectedMarker={selectedMarker} />
        <CloseSelectedFlightPanel handleClose={handleClose} />
        <FlightDetails marker={selectedMarker} mapRef={mapRef}/>
      </Paper>
    )
  );  
  }
};

export default SelectedFlightPanel;
