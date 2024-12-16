import React from "react";
import { Grid2, Paper } from "@mui/material";
import FlightDetails from "./FlightDetails/FlightDetails";
import { List, Typography } from "@mui/material";
import { PlaneListItem } from "../PlaneListItem";
import { PinSelectedFlight } from "./PinSelectedFlight";
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
      <Paper className="selectedFlightPanel" elevation={4}>
        <Grid2 container justifyContent={"center"} justifyItems={"center"}>
          <Grid2 size={10}>
            <Typography variant="h6">Selected Flight</Typography>
          </Grid2>
          <Grid2 size={2} textAlign={"center"}>
            <PinSelectedFlight
              pinnedFlights={pinnedFlights}
              setPinnedFlights={setPinnedFlights}
              setCachedPinnedPlaneData={setCachedPinnedPlaneData}
              markerToPin={selectedMarker}
            />
          </Grid2>
        </Grid2>
        <List>
          <PlaneListItem
            pinnedFlights={pinnedFlights}
            setPinnedFlights={setPinnedFlights}
            setCachedPinnedPlaneData={setCachedPinnedPlaneData}
            plane={selectedMarker}
            setSelectedMarker={setSelectedMarker}
            mapRef={mapRef}
            pinHidden={true}
          />
        </List>
        <FlightDetails marker={selectedMarker} mapRef={mapRef} />
      </Paper>
    )
  );
};

export default SelectedFlightPanel;
