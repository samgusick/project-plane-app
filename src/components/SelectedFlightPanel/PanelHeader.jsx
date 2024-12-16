import { Typography } from "@mui/material";
import React from "react";
export function PanelHeader({ selectedMarker }) {

  if (selectedMarker){
    return (
      <>
      <Typography variant="h6">Selected Aircraft</Typography>
      <Typography>{`ICAO: ${selectedMarker.icao24}`}</Typography>
      </>
    );

  }
}
