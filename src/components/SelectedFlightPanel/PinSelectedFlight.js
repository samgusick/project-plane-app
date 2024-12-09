import React, { useEffect, useState } from "react";
import PushPinIcon from "@mui/icons-material/PushPin";
import { IconButton } from "@mui/material";

export function PinSelectedFlight({
  pinnedFlights,
  setPinnedFlights,
  markerToPin,
}) {
  const handleTogglePinnedFlights = () => {
    setPinnedFlights((prev) => {
      // Check if the selectedMarker is already in pinnedFlights
      if (prev.some((flight) => flight.callsign === markerToPin.callsign)) {
        // Remove the selectedMarker
        return prev.filter(
          (flight) => flight.callsign !== markerToPin.callsign
        );
      } else {
        // Add the selectedMarker
        return [...prev, markerToPin];
      }
    });
  };

  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    setIsPinned(
      pinnedFlights.some((flight) => flight.callsign === markerToPin.callsign)
    );
  }, [pinnedFlights, markerToPin]); // Dependency array updated

  return (
    <IconButton
      color={isPinned ? "primary" : "default"} // Conditional color based on isPinned
      aria-label="toggle-pin"
      onClick={handleTogglePinnedFlights}
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
