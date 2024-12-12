export function FlightDetailsTableRows({ marker, ContactTimeDifference }) {
  return Object.entries(marker).map(([key, value], index) => {
    if (value === undefined || value === null) {
      value = "N/A";
    }

    if (key === "lastContact") {
      return (
        <tr key={index}>
          <td>{key.toUpperCase().replace("_", " ")}</td>
          <td>{ContactTimeDifference}s</td>
        </tr>
      );
    } else if (key === "trueTrack") {
      return (
        <tr key={index}>
          <td>{key.toUpperCase().replace("_", " ")}</td>
          <td>{value}°</td>
        </tr>
      );
    } else if (key === "baroAltitude" || key === "geoAltitude") {
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
      key === "positionSource" ||
      key === "sensors" ||
      key === "onGround" ||
      key === "icao24" ||
      key === "timePosition"
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
