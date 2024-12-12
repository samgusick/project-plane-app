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
export function PinnedFlightsAccordion({ pinnedFlights, setPinnedFlights, plane, mapRef }) {
  
  // const selectedPlaneData = planeData && callsign
  // ? planeData.find((plane) => plane.callsign === callsign)
  // : null;
  // console.log(callsign);
  // console.log(selectedPlaneData);

  if (plane) {

    return (
      <Accordion>
        <PinnedFlightAccordionSummary pinnedFlights={pinnedFlights} setPinnedFlights={setPinnedFlights} plane={plane}/>
        <AccordionDetails>
          <FlightDetails marker={plane} mapRef={mapRef} />
          <FlightLog />
        </AccordionDetails>
      </Accordion>
    );
  }
}
