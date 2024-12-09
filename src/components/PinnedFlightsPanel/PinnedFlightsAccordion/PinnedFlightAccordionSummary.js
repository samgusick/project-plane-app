import React from "react";
import { AccordionSummary, IconButton, Typography } from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { PinSelectedFlight } from "../../SelectedFlightPanel/PinSelectedFlight";

export function PinnedFlightAccordionSummary({ pinnedFlights, setPinnedFlights, flight}) {
  return (
    <AccordionSummary
      expandIcon={<ArrowDownwardIcon />}
      aria-controls="panel1bh-content"
      id="panel1bh-header"
    >
      <Typography>
        <PinSelectedFlight pinnedFlights={pinnedFlights} markerToPin={flight} setPinnedFlights={setPinnedFlights}/>
      </Typography>
      <Typography
        sx={{
          width: "33%",
          flexShrink: 0,
        }}
      >
        Aircraft {flight.icao}
      </Typography>
      <Typography
        sx={{
          color: "text.secondary",
        }}
      >
        {flight.origin_country}
      </Typography>
    </AccordionSummary>
  );
}
