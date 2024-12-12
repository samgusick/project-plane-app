import React from "react";
import { Typography } from "@mui/material";
export function PanelHeader({ selectedMarker }) {

  if (selectedMarker){
    return (<Typography variant="h6" style={{ marginBottom: "10px" }}>
    {`Aircraft ${selectedMarker.icao24}`}
  </Typography>);
  }
}
