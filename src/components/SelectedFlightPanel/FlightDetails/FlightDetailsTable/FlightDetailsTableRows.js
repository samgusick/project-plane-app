import { TableCell, TableRow } from "@mui/material";

export function FlightDetailsTableRows({ marker, ContactTimeDifference }) {
  return Object.entries(marker).map(([key, value], index) => {

    const formatKey = (inputString) => {
      
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
        <tr key={index}>
          <TableCell>{key.toUpperCase().replace("_", " ")}</TableCell>
          <TableCell>{value}°</TableCell>
        </tr>
      );
    } else if (key === "baro Altitude" || key === "geo Altitude") {
      if (value && value !== "N/A") {
        return (
          <tr key={index}>
            <TableCell>{key.toUpperCase().replace("_", " ")}</TableCell>
            <TableCell>
              {(value * 3.28084).toFixed(0)}ft ({value.toFixed(0)}m)
            </TableCell>
          </tr>
        );
      } else {
        return (
          <tr key={index}>
            <TableCell>{key.toUpperCase().replace("_", " ")}</TableCell>
            <TableCell>{value}</TableCell>
          </tr>
        );
      }
    } else if (key === "velocity" || key === "vertical Rate") {
      return (
        <tr key={index}>
          <TableCell>{key.toUpperCase().replace("_", " ")}</TableCell>
          <TableCell>{value}m/s</TableCell>
        </tr>
      );
    } else if (
      key === "category" ||
      key === "spi" ||
      key === "position Source" ||
      key === "sensors" ||
      key === "on Ground" ||
      key === "time Position" || 
      key === "callsign"
    ) {
      return;
    } else {
      return (
        <tr key={index}>
          <TableCell>{key.toUpperCase().replace("_", " ")}</TableCell>
          <TableCell>{value}</TableCell>
        </tr>
      );
    }
  });
}
