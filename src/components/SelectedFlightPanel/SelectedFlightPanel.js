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
  setCachedPinnedPlaneData,
}) => {
  const handleClose = () => {
    setSelectedMarker(null);
    // mapRef.current.setView([44.0, -72.7], 8);
  };

  if (selectedMarker) {
    return (
      selectedMarker && (
        <Paper
          sx={{
            pointerEvents: "auto",
            overflow: "auto",
          }}
          elevation={4}
        >
          <Grid2 container padding={2}>
            <Grid2 size={2}>
              <PinSelectedFlight
                pinnedFlights={pinnedFlights}
                setPinnedFlights={setPinnedFlights}
                setCachedPinnedPlaneData={setCachedPinnedPlaneData}
                markerToPin={selectedMarker}
              />
            </Grid2>
            <Grid2 size={8}>
              <PanelHeader selectedMarker={selectedMarker} />
            </Grid2>
            <Grid2 size={2}>
              <CloseSelectedFlightPanel handleClose={handleClose} />
            </Grid2>
          </Grid2>
          <Paper sx={{ padding: "15px" }}>
            <FlightDetails marker={selectedMarker} mapRef={mapRef} />
          </Paper>
        </Paper>
      )
    );
  }
};

export default SelectedFlightPanel;
