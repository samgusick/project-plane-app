import React from "react";
import { AccordionSummary, IconButton, Typography } from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { PinSelectedFlight } from "../../SelectedFlightPanel/PinSelectedFlight";

export function PinnedFlightAccordionSummary({
  pinnedFlights,
  setPinnedFlights,
  plane,
  setCachedPinnedPlaneData
}) {
  return (
    <AccordionSummary
      expandIcon={<ArrowDownwardIcon />}
      aria-controls="panel1bh-content"
      id="panel1bh-header"
    >
      <Typography>
        <PinSelectedFlight
          pinnedFlights={pinnedFlights}
          markerToPin={plane}
          setPinnedFlights={setPinnedFlights}
          leftPosition={0}
          topPosition={0}
          setCachedPinnedPlaneData={setCachedPinnedPlaneData}
        />
      </Typography>
      <Typography
        sx={{
          width: "33%",
          flexShrink: 0,
        }}
      >
        Aircraft {plane.icao24}
      </Typography>
      <Typography
        sx={{
          color: "text.secondary",
        }}
      >
        {plane.originCountry}
      </Typography>
    </AccordionSummary>
  );
}
