import React, { useEffect, useState } from "react";
import PushPinIcon from "@mui/icons-material/PushPin";
import { IconButton } from "@mui/material";

export function PinSelectedFlight({
  pinnedFlights,
  setPinnedFlights,
  setCachedPinnedPlaneData,
  markerToPin,
  leftPosition,
  topPosition,
  positionType,
  edgeType
}) {
  const handleTogglePinnedFlights = () => {
    if (setPinnedFlights) {
      setPinnedFlights((prev) => {
        const isPinned = prev.some((icao24) => icao24 === markerToPin.icao24);
  
        // Update cachedPinnedPlaneData in sync with pinned flights
        if (setCachedPinnedPlaneData) {
          setCachedPinnedPlaneData((prevCached) =>
            isPinned
              ? prevCached.filter((plane) => plane.icao24 !== markerToPin.icao24)
              : prevCached
          );
        }
  
        // Toggle the pin status in pinnedFlights
        return isPinned
          ? prev.filter((icao24) => icao24 !== markerToPin.icao24)
          : [...prev, markerToPin.icao24];
      });
    }
  };
  

  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {

    setIsPinned(
      pinnedFlights.some((plane) => plane.icao24 === markerToPin.icao24)
    );
  }, [pinnedFlights, markerToPin]); // Dependency array updated

  return (
    <IconButton 
      className="pinIconButton"
      aria-label="toggle-pin"
      onClick={handleTogglePinnedFlights}
      edge={edgeType ? edgeType : false}
      sx={{
        position: positionType,
        top: topPosition,
        left: leftPosition,
        color: isPinned ? "green" : "default"
      }}
    >
      <PushPinIcon />
    </IconButton>
  );
}
