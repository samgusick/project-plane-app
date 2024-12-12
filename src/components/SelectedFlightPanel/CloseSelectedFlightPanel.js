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
      //   left: "100%",
      // }}
    >
      <CloseIcon fontSize="large"/>
    </IconButton>
  );
}
