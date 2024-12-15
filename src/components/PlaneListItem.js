import React from "react";
import {
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  ListItemIcon,
} from "@mui/material";
import { PinSelectedFlight } from "./SelectedFlightPanel/PinSelectedFlight";
import { CountryFlag } from "./SelectedFlightPanel/FlightDetails/FlightDetailsTable/CountryFlag";
import { PlaneOrientationImg } from "./SelectedFlightPanel/FlightDetails/FlightDetailsTable/PlaneOrientationImg";
import planeImage from "../images/beta_air_llc_logo.png";
export const PlaneListItem = ({
  pinnedFlights,
  setPinnedFlights,
  setCachedPinnedPlaneData,
  plane,
  setSelectedMarker,
  mapRef,
}) => {
  return (
    <ListItem
      key={plane.icao24}
      secondaryAction={
        <PinSelectedFlight
          pinnedFlights={pinnedFlights}
          setPinnedFlights={setPinnedFlights}
          setCachedPinnedPlaneData={setCachedPinnedPlaneData}
          markerToPin={plane}
        />
      }
    >
      <ListItemButton
        onClick={() => {
          setSelectedMarker(plane.icao24);
          mapRef.current.setView([plane.latitude, plane.longitude]);
        }}
      >
        <ListItemAvatar>
          <Avatar>
            <CountryFlag marker={plane} />
          </Avatar>
        </ListItemAvatar>
        <ListItemIcon>
          <Box width={"40px"} height={"40px"}>
            <PlaneOrientationImg planeImage={planeImage} marker={plane} />
          </Box>
        </ListItemIcon>

        <ListItemText primary={`${plane.callsign || "Callsign Unavailable"}`} />
      </ListItemButton>
    </ListItem>
  );
};
