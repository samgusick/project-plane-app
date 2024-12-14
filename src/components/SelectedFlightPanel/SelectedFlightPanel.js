import { PanelHeader } from "./PanelHeader";
import { PinSelectedFlight } from "./PinSelectedFlight";
import React from "react";
import { Grid2, ListItem, ListItemText, Paper } from "@mui/material";
import FlightDetails from "./FlightDetails/FlightDetails";
import { CloseSelectedFlightPanel } from "./CloseSelectedFlightPanel";
import { List, IconButton, ListItemAvatar, Avatar, Box } from "@mui/material";
import { CountryFlag } from "./FlightDetails/FlightDetailsTable/CountryFlag";
import { PlaneOrientationImg } from "./FlightDetails/FlightDetailsTable/PlaneOrientationImg";
import planeImage from "../../images/beta_air_llc_logo_shadow.png";

const SelectedFlightPanel = ({
  setSelectedMarker,
  selectedMarker,
  pinnedFlights,
  setPinnedFlights,
  mapRef,
  setCachedPinnedPlaneData,
}) => {
  const handleClose = () => {
    setSelectedMarker(null);
    // mapRef.current.setView([44.0, -72.7], 8);
  };

  return (
    selectedMarker && (
      <Paper
        style={{
          position: "fixed",
          bottom: "50px",
          left: "50px",
          zIndex: 1000,
          padding: "20px",
          height: "40vh", // Set a maximum height to prevent overflow
          width: "20vw",
        }}
        elevation={4}
      >

            {/* <img
              src={planeImage}
              style={{ transform: `rotate(${selectedMarker.trueTrack}deg)`, objectFit: "contain" }}
            />


            <CountryFlag marker={selectedMarker}/> */}


        <List>
          <ListItem
            secondaryAction={
              <PinSelectedFlight
                pinnedFlights={pinnedFlights}
                setPinnedFlights={setPinnedFlights}
                setCachedPinnedPlaneData={setCachedPinnedPlaneData}
                markerToPin={selectedMarker}
              />
            }
          >
            <ListItemAvatar>
              <Avatar>
                <CountryFlag marker={selectedMarker}/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={selectedMarker.callsign} />
          </ListItem>
        </List>

        {/* <CloseSelectedFlightPanel handleClose={handleClose} /> */}
        <FlightDetails marker={selectedMarker} mapRef={mapRef} />
      </Paper>
    )
  );
};

export default SelectedFlightPanel;
