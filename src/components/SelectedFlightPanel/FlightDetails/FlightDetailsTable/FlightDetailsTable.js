import { PlaneOrientationImg } from "./PlaneOrientationImg";
import React from "react";
import { CountryFlag } from "./CountryFlag.js";
import { FlightDetailsTableRows } from "./FlightDetailsTableRows.js";
import { Box, Button } from "@mui/material";
export function FlightDetailsTable({
  marker,
  planeImage,
  ContactTimeDifference,
  planeData,
  mapRef
}) {
  function recenterPlane(latitude, longitude) {
    mapRef.current.setView([latitude, longitude]);
  }

  return (
    <>
      <table id="flightDetailsTable">
        <tbody>
          <tr>
            <td
              style={{
                padding: "15px",
              }}
            >
              <CountryFlag marker={marker} planeData={planeData} />
            </td>
            <td
              style={{
                textAlign: "center",
                padding: "15px",
              }}
            >
              <PlaneOrientationImg planeImage={planeImage} marker={marker} />
            </td>
          </tr>

          <FlightDetailsTableRows
            marker={marker}
            ContactTimeDifference={ContactTimeDifference}
          />
        </tbody>
      </table>

      {mapRef && marker && (<Button variant="contained" color="primary" className="findFlightButton" sx={{marginTop: "20px"}} onClick={() => recenterPlane(marker.latitude, marker.longitude)}>
        Recenter
      </Button>)}
    </>
  );
}
