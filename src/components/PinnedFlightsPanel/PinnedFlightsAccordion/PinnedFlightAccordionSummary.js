import React from "react";
import { AccordionSummary, IconButton, Typography } from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export function PinnedFlightAccordionSummary({ setPinnedFlights, flight}) {
  return (
    <AccordionSummary
      expandIcon={<ArrowDownwardIcon />}
      aria-controls="panel1bh-content"
      id="panel1bh-header"
    >
      <Typography>
        <IconButton
          sx={{
            padding: 0,
          }}
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
