import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

export function CloseSelectedFlightPanel({ handleClose }) {
  return (
    <IconButton
      onClick={handleClose}
      // sx={{
      //   position: "absolute",
      //   top: 8,
      //   right: 8,
      // }}
    >
      <CloseIcon />
    </IconButton>
  );
}
