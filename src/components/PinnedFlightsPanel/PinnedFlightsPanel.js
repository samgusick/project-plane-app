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
      style={{
        position: "fixed",
        top: "50px",
        right: "50px",
        zIndex: 1000,
        padding: "20px",
        minWidth: "300px",
        maxHeight: "80vh", // Set a maximum height to prevent overflow
      }}
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
          />
        ))}
      </div>
    </Paper>
  );
};

export default PinnedFlightsList;
