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
        <tr key={index}>
          <td>{key.toUpperCase().replace("_", " ")}</td>
          <td>{ContactTimeDifference}s</td>
        </tr>
      );
    } else if (key === "true Track") {
      return (
        <tr key={index}>
          <td>{key.toUpperCase().replace("_", " ")}</td>
          <td>{value}°</td>
        </tr>
      );
    } else if (key === "baro Altitude" || key === "geo Altitude") {
      if (value && value !== "N/A") {
        return (
          <tr key={index}>
            <td>{key.toUpperCase().replace("_", " ")}</td>
            <td>
              {(value * 3.28084).toFixed(0)}ft ({value.toFixed(0)}m)
            </td>
          </tr>
        );
      } else {
        return (
          <tr key={index}>
            <td>{key.toUpperCase().replace("_", " ")}</td>
            <td>{value}</td>
          </tr>
        );
      }
    } else if (key === "velocity") {
      return (
        <tr key={index}>
          <td>{key.toUpperCase().replace("_", " ")}</td>
          <td>{value}m/s</td>
        </tr>
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
        <tr key={index}>
          <td>{key.toUpperCase().replace("_", " ")}</td>
          <td>{value}</td>
        </tr>
      );
    }
  });
}
