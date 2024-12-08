import React from "react";
import PushPinIcon from "@mui/icons-material/PushPin";
import { IconButton } from "@mui/material";

export function PinSelectedFlight({ handleAddToPinnedFlights }) {
  return (
    <IconButton
      aria-label="add"
      onClick={handleAddToPinnedFlights}
      sx={{
        position: "absolute",
        top: 8,
        left: 8,
      }}
    >
      <PushPinIcon />
    </IconButton>
  );
}
