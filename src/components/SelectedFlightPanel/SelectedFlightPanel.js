import React from "react";
import { Paper } from "@mui/material";
import FlightDetails from "./FlightDetails/FlightDetails";
import { List, Typography } from "@mui/material";
import { PlaneListItem } from "../PlaneListItem";

const SelectedFlightPanel = ({
  setSelectedMarker,
  selectedMarker,
  pinnedFlights,
  setPinnedFlights,
  mapRef,
  setCachedPinnedPlaneData,
}) => {

  return (
    selectedMarker && (
      <Paper
        style={{
          position: "fixed",
          bottom: "50px",
          left: "50px",
          zIndex: 1000,
          padding: "20px",
          height: "38vh", // Set a maximum height to prevent overflow
          width: "20vw",
          overflow: "hidden"
        }}
        elevation={4}
      >
        <Typography variant="h6">
            Selected Flight
          </Typography>
        <List>
          <PlaneListItem 
            pinnedFlights={pinnedFlights}
            setPinnedFlights={setPinnedFlights}
            setCachedPinnedPlaneData={setCachedPinnedPlaneData}
            plane={selectedMarker}
            setSelectedMarker={setSelectedMarker}
            mapRef={mapRef}
          />
        </List>
        <FlightDetails marker={selectedMarker} mapRef={mapRef} />
      </Paper>
    )
  );
};

export default SelectedFlightPanel;
