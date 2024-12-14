import { PanelHeader } from "./PanelHeader";
import { PinSelectedFlight } from "./PinSelectedFlight";
import React from "react";
import { Paper } from "@mui/material";
import FlightDetails from "./FlightDetails/FlightDetails";
import { CloseSelectedFlightPanel } from "./CloseSelectedFlightPanel";

const SelectedFlightPanel = ({
  setSelectedMarker,
  selectedMarker,
  pinnedFlights,
  setPinnedFlights,
  mapRef,
  setCachedPinnedPlaneData,
}) => {
  const handleClose = () => {
    setSelectedMarker(null);
    // mapRef.current.setView([44.0, -72.7], 8);
  };

  return (selectedMarker &&
      <Paper
        style={{
          position: "fixed",
          bottom: "50px",
          left: "50px",
          zIndex: 1000,
          padding: "20px",
        }}
        elevation={4}
      >
        <PinSelectedFlight
          pinnedFlights={pinnedFlights}
          setPinnedFlights={setPinnedFlights}
          setCachedPinnedPlaneData={setCachedPinnedPlaneData}
          markerToPin={selectedMarker}
          leftPosition={8}
          topPosition={8}
          positionType={"absolute"}
        />
        <PanelHeader selectedMarker={selectedMarker} />
        <CloseSelectedFlightPanel handleClose={handleClose} />
        <FlightDetails marker={selectedMarker} mapRef={mapRef} />
      </Paper>
  );
};

export default SelectedFlightPanel;
