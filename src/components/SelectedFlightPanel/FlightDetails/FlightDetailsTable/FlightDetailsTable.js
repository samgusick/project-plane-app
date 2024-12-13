import { PlaneOrientationImg } from "./PlaneOrientationImg";
import React from "react";
import { CountryFlag } from "./CountryFlag.js";
import { FlightDetailsTableRows } from "./FlightDetailsTableRows.js";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  ThemeProvider,
  createTheme
} from "@mui/material";
export function FlightDetailsTable({
  marker,
  planeImage,
  ContactTimeDifference,
  planeData,
  mapRef,
}) {
  function recenterPlane(latitude, longitude) {
    mapRef.current.setView([latitude, longitude]);
  }

  const theme = createTheme({
    components: {
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: "1px", // Apply custom padding globally
          },
        },
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Table>
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

      {mapRef && marker && (
        <Button
          variant="contained"
          color="primary"
          className="findFlightButton"
          sx={{ marginTop: "20px" }}
          onClick={() => recenterPlane(marker.latitude, marker.longitude)}
        >
          Recenter
        </Button>
      )}
    </ThemeProvider>
  );
}
