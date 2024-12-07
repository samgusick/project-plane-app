import { PinnedFlightsAccordion } from './PinnedFlightsAccordion';
import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const PinnedFlightsList = ({ pinnedFlights, setPinnedFlights }) => {
  return (
    <Paper
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
        {pinnedFlights.map((flight, index) => (
          <PinnedFlightsAccordion
            key={flight.callsign} // Use a unique key for each flight
            flight={flight} // Pass the flight as a prop
            setPinnedFlights={setPinnedFlights} // Pass setPinnedFlights to modify the list
          />
        ))}
      </div>
    </Paper>
  );
};

export default PinnedFlightsList;
