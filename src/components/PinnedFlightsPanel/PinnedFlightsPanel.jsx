import React from "react";
import Switch from "@mui/material/Switch";
import PushPinIcon from "@mui/icons-material/PushPin";
import { FormControlLabel, Paper, Typography } from "@mui/material";
import List from "@mui/material/List";
import { PlaneListItem } from "../PlaneListItem";

const PinnedFlightsList = ({
  pinnedFlights,
  setPinnedFlights,
  mapRef,
  setCachedPinnedPlaneData,
  setShowPinnedFlightsOnly,
  setSelectedMarker,
}) => {
  return (
    <Paper className="pinnedFlightsPanel" style={{}}>
      {pinnedFlights.length > 0 ? (
        <>
          <Typography variant="h6" style={{ marginBottom: "10px" }}>
            Pinned Flights
          </Typography>

          <FormControlLabel
            control={
              <Switch
              sx={{
                "& .MuiSwitch-thumb": {
                  color: "green", // Default thumb color
                },
                "& .MuiSwitch-track": {
                  backgroundColor: "lightgreen", // Default track color
                },
                "&.Mui-checked .MuiSwitch-thumb": {
                  color: "darkgreen", // Checked thumb color
                },
                "& .Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "green !important", // Checked track color
                },
              }}
                onChange={() => {
                  setShowPinnedFlightsOnly((prevValue) => !prevValue);
                }}
              />
            }
            label="Pinned Flights Only"
          />

          <div>
            <List
              sx={{
                padding: 0,
                margin: 0,
                maxHeight: "254px",
                overflow: "auto",
              }}
            >
              {pinnedFlights.map((plane) => (
                <PlaneListItem
                  key={plane.icao24}
                  pinnedFlights={pinnedFlights}
                  setPinnedFlights={setPinnedFlights}
                  setCachedPinnedPlaneData={setCachedPinnedPlaneData}
                  plane={plane}
                  setSelectedMarker={setSelectedMarker}
                  mapRef={mapRef}
                />
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
