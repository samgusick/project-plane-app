import { PinnedFlightsAccordion } from "./PinnedFlightsAccordion/PinnedFlightsAccordion";
import React from "react";
import pinnedFlightExampleImg from "../../images/pinnedFlightExample.png";
import Switch from "@mui/material/Switch";
import PushPinIcon from "@mui/icons-material/PushPin";
import {
  FormControlLabel,
  FormGroup,
  ListItemAvatar,
  ListItemButton,
  Paper,
  Typography,
} from "@mui/material";
import { map } from "leaflet";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import { PinSelectedFlight } from "../SelectedFlightPanel/PinSelectedFlight";
import { CountryFlag } from "../SelectedFlightPanel/FlightDetails/FlightDetailsTable/CountryFlag";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";

const PinnedFlightsList = ({
  pinnedFlights,
  setPinnedFlights,
  mapRef,
  setCachedPinnedPlaneData,
  setShowPinnedFlightsOnly,
  setSelectedMarker

}) => {
  return (
    <Paper
      className="pinnedFlightsPanelPaper"
      style={{
        position: "fixed",
        top: "50px",
        left: "50px",
        zIndex: 1000,
        padding: "20px",
        width: "20vw",
        height: "40vh", // Set a maximum height to prevent overflow
      }}
    >
      {pinnedFlights.length > 0 ? (
        <>
          <Typography variant="h6" style={{ marginBottom: "10px" }}>
            Pinned Flights
          </Typography>

          <FormControlLabel
            control={
              <Switch
                onChange={() => {
                  setShowPinnedFlightsOnly((prevValue) => !prevValue);
                }}
              />
            }
            label="Pinned Flights Only"
          />

          <div
            style={{
              overflowY: "auto", // Make this section scrollable
              maxHeight: "calc(80vh - 40px)", // Adjust maxHeight to leave space for the header
            }}
          >
            <List sx={{maxHeight: "30vh"}}>
              {pinnedFlights.map((plane) => (
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
                  <ListItemButton onClick={() => {setSelectedMarker(plane.icao24);}}>
                    <ListItemAvatar>
                      <Avatar>
                        <CountryFlag marker={plane} />
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText primary={plane.callsign} />
                  </ListItemButton>
                </ListItem>
                // <PinnedFlightsAccordion
                //   key={plane.icao24}
                //   plane={plane} // Use a unique key for each flight
                //   pinnedFlights={pinnedFlights}
                //   setPinnedFlights={setPinnedFlights} // Pass setPinnedFlights to modify the list
                //   mapRef={mapRef}
                //   setCachedPinnedPlaneData={setCachedPinnedPlaneData}
                // />
              ))}
            </List>
          </div>
        </>
      ) : (
        <>
          <Typography variant="h6" style={{ marginBottom: "10px" }}>
            Pin Flights
          </Typography>
          <Typography>
            Pin flights with the <PushPinIcon fontSize="small"></PushPinIcon>{" "}
            Icon
          </Typography>
        </>
      )}
    </Paper>
  );
};

export default PinnedFlightsList;
