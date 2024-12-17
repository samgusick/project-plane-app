import React from "react";
import {
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  ListItemIcon,
  Grid2,
  Button,
  Typography,
  Grid,
} from "@mui/material";

import { PinSelectedFlight } from "./SelectedFlightPanel/PinSelectedFlight";
import { CountryFlag } from "./SelectedFlightPanel/FlightDetails/FlightDetailsTable/CountryFlag";
import { PlaneOrientationImg } from "./SelectedFlightPanel/FlightDetails/FlightDetailsTable/PlaneOrientationImg";
import planeImage from "../images/beta_air_llc_logo_shadow.png";

export const PlaneListItem = ({
  pinnedFlights,
  setPinnedFlights,
  setCachedPinnedPlaneData,
  plane,
  setSelectedMarker,
  mapRef,
  pinHidden
}) => {
  return (
    <ListItem key={plane.icao24}>
      <Avatar style={{
        marginRight: "15px"
      }}>
        <CountryFlag marker={plane} />
      </Avatar>

      

      <Button 
        sx={{
          width: "100%",
          backgroundColor: "green",
          textTransform:"none"
        }}
        variant="contained"
        onClick={() => {
          console.log(plane.icao24);
          setSelectedMarker(plane.icao24);
          mapRef.current.setView([plane.latitude, plane.longitude]);
        }}
      >
        <Typography>{plane.icao24}</Typography>
      </Button>

      <Box width={"30px"} height={"30px"} marginRight={"15px"} marginLeft={"15px"}>
        <PlaneOrientationImg planeImage={planeImage} marker={plane} />
      </Box>
      
      {!pinHidden ? (<PinSelectedFlight
        pinnedFlights={pinnedFlights}
        setPinnedFlights={setPinnedFlights}
        setCachedPinnedPlaneData={setCachedPinnedPlaneData}
        markerToPin={plane}
      />) : (<></>)}
    </ListItem>
  );
};
