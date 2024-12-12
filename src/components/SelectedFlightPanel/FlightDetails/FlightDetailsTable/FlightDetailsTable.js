import { PlaneOrientationImg } from "./PlaneOrientationImg";
import React from "react";
import { CountryFlag } from "./CountryFlag.js";
import { FlightDetailsTableRows } from "./FlightDetailsTableRows.js";
import { Box, Button, Paper, Table, TableBody, TableContainer, TableRow } from "@mui/material";
import TableCell from '@mui/material/TableCell';
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
    <TableContainer component={Paper}>
      <Table sx={{ "& .MuiTableCell-root": { padding: 0.5 } }}>
        <TableBody>
          <TableRow>
            <TableCell
              style={{
                padding: "15px",
              }}
            >
              <CountryFlag marker={marker} planeData={planeData} />
            </TableCell>
            <TableCell
              style={{
                textAlign: "center",
                padding: "15px",
              }}
            >
              <PlaneOrientationImg planeImage={planeImage} marker={marker} />
            </TableCell>
          </TableRow>

          <FlightDetailsTableRows
            marker={marker}
            ContactTimeDifference={ContactTimeDifference}
          />
        </TableBody>
      </Table>
      </TableContainer>

      {mapRef && marker && (<Button variant="contained" color="primary" className="findFlightButton" sx={{marginTop: "20px"}} onClick={() => recenterPlane(marker.latitude, marker.longitude)}>
        Recenter
      </Button>)}
    </>
  );
}
