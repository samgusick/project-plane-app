import React from "react";
import { FlightDetailsTableRows } from "./FlightDetailsTableRows";
import {
  Table,
  TableBody,
  ThemeProvider,
  createTheme,
} from "@mui/material";
export function FlightDetailsTable({
  marker,
  ContactTimeDifference,
}) {

  const theme = createTheme({
    components: {
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: "1px", // Apply custom padding globally
            fontSize: "small"
          },
        },
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Table>
        <TableBody>
          <FlightDetailsTableRows
            marker={marker}
            ContactTimeDifference={ContactTimeDifference}
          />
        </TableBody>
      </Table>
    </ThemeProvider>
  );
}
