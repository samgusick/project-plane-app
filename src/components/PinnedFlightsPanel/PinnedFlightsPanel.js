import { PinnedFlightsAccordion } from './PinnedFlightsAccordion/PinnedFlightsAccordion';
import React from "react";
import {
  Paper,
  Typography,
} from "@mui/material";
import { map } from 'leaflet';

const PinnedFlightsList = ({ pinnedFlights, setPinnedFlights, mapRef, setCachedPinnedPlaneData }) => {
  return (
    <Paper
    className='pinnedFlightsPanelPaper'
      // style={{
      //   width: "100%",
      //   height: "100%"
      // }}
    >
      <Typography variant="h6" style={{ marginBottom: "10px" }}>
        Pinned Flights
      </Typography>
      <div
        style={{
          overflowY: "auto", // Make this section scrollable
          maxHeight: "calc(80vh - 40px)", // Adjust maxHeight to leave space for the header
        }}
      >
        {pinnedFlights.map((plane) => (
          
          <PinnedFlightsAccordion
            key={plane.icao24}
            plane={plane} // Use a unique key for each flight
            pinnedFlights={pinnedFlights}
            setPinnedFlights={setPinnedFlights} // Pass setPinnedFlights to modify the list
            mapRef={mapRef}
            setCachedPinnedPlaneData={setCachedPinnedPlaneData}
          />
        ))}
      </div>
    </Paper>
  );
};

export default PinnedFlightsList;
