import React from "react";
export function PanelHeader({ selectedMarker }) {

  if (selectedMarker){
    return <h1>{`Aircraft ${selectedMarker.icao24}`}</h1>;

  }
}
