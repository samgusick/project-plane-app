import React from "react";
export function PanelHeader({selectedMarker}) {
  return <h1>{`Aircraft ${selectedMarker.icao}`}</h1>;
}
  