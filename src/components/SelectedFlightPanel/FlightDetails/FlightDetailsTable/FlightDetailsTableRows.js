import { TableRow } from "@mui/material";
import TableCell from '@mui/material/TableCell';

export function FlightDetailsTableRows({ marker, ContactTimeDifference }) {
  return Object.entries(marker).map(([key, value], index) => {

    const formatKey = (inputString) => {
      // // Capitalize the first letter
      // const capitalizedString = inputString.charAt(0).toUpperCase() + inputString.slice(1);
    
      // Add spaces before capital letters
      return inputString.replace(/([A-Z])/g, ' $1').trim();
    }
  
    key = formatKey(key);

    if (value === undefined || value === null) {
      value = "N/A";
    }

    if (key === "last Contact") {
      return (
        <TableRow key={index}>
          <TableCell>{key.toUpperCase().replace("_", " ")}</TableCell>
          <TableCell>{ContactTimeDifference}s</TableCell>
        </TableRow>
      );
    } else if (key === "true Track") {
      return (
        <TableRow key={index}>
          <TableCell>{key.toUpperCase().replace("_", " ")}</TableCell>
          <TableCell>{value}°</TableCell>
        </TableRow>
      );
    } else if (key === "baro Altitude" || key === "geo Altitude") {
      if (value && value !== "N/A") {
        return (
          <TableRow key={index}>
            <TableCell>{key.toUpperCase().replace("_", " ")}</TableCell>
            <TableCell>
              {(value * 3.28084).toFixed(0)}ft ({value.toFixed(0)}m)
            </TableCell>
          </TableRow>
        );
      } else {
        return (
          <TableRow key={index}>
            <TableCell>{key.toUpperCase().replace("_", " ")}</TableCell>
            <TableCell>{value}</TableCell>
          </TableRow>
        );
      }
    } else if (key === "velocity") {
      return (
        <TableRow key={index}>
          <TableCell>{key.toUpperCase().replace("_", " ")}</TableCell>
          <TableCell>{value}m/s</TableCell>
        </TableRow>
      );
    } else if (
      key === "category" ||
      key === "spi" ||
      key === "position Source" ||
      key === "sensors" ||
      key === "on Ground" ||
      key === "icao24" ||
      key === "time Position"
    ) {
      return;
    } else {
      return (
        <TableRow key={index}>
          <TableCell>{key.toUpperCase().replace("_", " ")}</TableCell>
          <TableCell>{value}</TableCell>
        </TableRow>
      );
    }
  });
}
