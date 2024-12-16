import FlightLog from "./PinnedFlightNotes/FlightLog";
import React from "react";

import { Accordion, AccordionDetails } from "@mui/material";
import FlightDetails from "../../SelectedFlightPanel/FlightDetails/FlightDetails";
import { PinnedFlightAccordionSummary } from "./PinnedFlightAccordionSummary";

export function PinnedFlightsAccordion({
  pinnedFlights,
  setPinnedFlights,
  plane,
  mapRef,
  setCachedPinnedPlaneData,
}) {
  if (plane) {
    return (
      <Accordion>
        <PinnedFlightAccordionSummary
          pinnedFlights={pinnedFlights}
          setPinnedFlights={setPinnedFlights}
          plane={plane}
          setCachedPinnedPlaneData={setCachedPinnedPlaneData}
        />
        <AccordionDetails>
          <FlightDetails marker={plane} mapRef={mapRef} />
          <FlightLog />
        </AccordionDetails>
      </Accordion>
    );
  }
}
