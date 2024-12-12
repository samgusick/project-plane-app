import { PinnedFlightsAccordion } from './PinnedFlightsAccordion/PinnedFlightsAccordion';
import React from "react";
import {
  Paper,
  Typography,
} from "@mui/material";
import { map } from 'leaflet';

const PinnedFlightsList = ({ pinnedFlights, setPinnedFlights, mapRef }) => {
  return (
    <Paper
    className='pinnedFlightsPanelPaper'
    sx={{
      pointerEvents: "auto",
      overflow: "auto",
    }}
    >
      <Typography variant="h6" style={{ marginBottom: "10px" }}>
        Pinned Flights
      </Typography>
      <div
        style={{
          overflowY: "auto", // Make this section scrollable
        }}
      >
        {pinnedFlights.map((plane) => (
          
          <PinnedFlightsAccordion
            key={plane.icao24}
            plane={plane} // Use a unique key for each flight
            pinnedFlights={pinnedFlights}
            setPinnedFlights={setPinnedFlights} // Pass setPinnedFlights to modify the list
            mapRef={mapRef}
          />
        ))}
      </div>
    </Paper>
  );
};

export default PinnedFlightsList;
