import React from "react";
import Switch from "@mui/material/Switch";
import PushPinIcon from "@mui/icons-material/PushPin";
import {
  FormControlLabel,
  Paper,
  Typography,
} from "@mui/material";
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
    <Paper
      className="pinnedFlightsPanel"
    >
      {pinnedFlights.length > 0 ? (
        <>
          <Typography variant="h6" style={{ marginBottom: "10px" }}>
            Pinned Flights
          </Typography>

          <FormControlLabel
            control={
              <Switch
                sx={{
                  '& .Mui-checked': {
                    color: 'green', // Checked thumb color
                  },
                  '& .Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#4caf50', // Checked track color
                  },
              }}
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
            }}
          >
            <List sx={{ maxHeight: "30vh", padding: 0}}>
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
