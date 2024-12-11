import React, { useEffect, useState } from "react";
import PushPinIcon from "@mui/icons-material/PushPin";
import { IconButton } from "@mui/material";

export function PinSelectedFlight({
  pinnedFlights,
  setPinnedFlights,
  markerToPin,
}) {
  const handleTogglePinnedFlights = () => {
    if (setPinnedFlights) {
      setPinnedFlights((prev) => {
        // Check if the selectedMarker is already in pinnedFlights
        if (prev.some((icao24) => icao24 === markerToPin.icao24)) {
          // Remove the selectedMarker
          return prev.filter(
            (icao24) => icao24 !== markerToPin.icao24
          );
        } else {
          // Add the selectedMarker
          return [...prev, markerToPin.icao24];
        }
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
      color={isPinned ? "primary" : "default"} // Conditional color based on isPinned
      aria-label="toggle-pin"
      onClick={handleTogglePinnedFlights}
      // sx={{
      //   position: "absolute",
      //   top: 8,
      //   left: 8,
      // }}
    >
      <PushPinIcon />
    </IconButton>
  );
}
