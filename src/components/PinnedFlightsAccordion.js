import FlightLog from './FlightLog';
import React from "react";
import PushPinIcon from "@mui/icons-material/PushPin";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Typography,
  List,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import FlightDetails from "./SelectedFlightPanel/FlightDetails/FlightDetails";

export function PinnedFlightsAccordion({ setPinnedFlights, flight }) {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ArrowDownwardIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Typography>
          <IconButton
            sx={{ padding: 0 }}
            onClick={() => {
              setPinnedFlights((prevPinnedFlights) =>
                prevPinnedFlights.filter(
                  (item) => item.callsign !== flight.callsign
                )
              );
            }}
          >
            <PushPinIcon />
          </IconButton>
        </Typography>
        <Typography sx={{ width: "33%", flexShrink: 0 }}>
          Aircraft {flight.icao}
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          {flight.origin_country}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <FlightDetails marker={flight} />
        <FlightLog />
      </AccordionDetails>
    </Accordion>
  );
}
