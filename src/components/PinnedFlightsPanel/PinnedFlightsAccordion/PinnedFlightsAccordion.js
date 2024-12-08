import FlightLog from "./PinnedFlightNotes/FlightLog";
import React from "react";

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
import FlightDetails from "../../SelectedFlightPanel/FlightDetails/FlightDetails";
import { PinnedFlightAccordionSummary } from "./PinnedFlightAccordionSummary";
export function PinnedFlightsAccordion({ setPinnedFlights, flight }) {
  return (
    <Accordion>
      <PinnedFlightAccordionSummary setPinnedFlights={setPinnedFlights} flight={flight}/>
      <AccordionDetails>
        <FlightDetails marker={flight} />
        <FlightLog />
      </AccordionDetails>
    </Accordion>
  );
}
