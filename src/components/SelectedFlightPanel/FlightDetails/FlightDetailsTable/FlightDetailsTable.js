import { PlaneOrientationImg } from "./PlaneOrientationImg";
import React from "react";
import { CountryFlag } from "./CountryFlag.js";
export function FlightDetailsTable({
  marker,
  planeImage,
  ContactTimeDifference,
}) {
  return (
    <table id="flightDetailsTable">
      <tbody>
        <tr>
          <td
            style={{
              padding: "15px",
            }}
          >
            <CountryFlag marker={marker} />
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
        {Object.entries(marker).map(([key, value], index) => {
          if (value === undefined || value === null) {
            value = "N/A";
          }

          if (key === "last_contact") {
            return (
              <tr key={index}>
                <td>{key.toUpperCase().replace("_", " ")}</td>
                <td>{ContactTimeDifference}s</td>
              </tr>
            );
          } else if (key === "true_track") {
            return (
              <tr key={index}>
                <td>{key.toUpperCase().replace("_", " ")}</td>
                <td>{value}°</td>
              </tr>
            );
          } else if (key === "baro_altitude" || key === "geo_altitude") {
            if (value && value != "N/A") {
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
            key === "position_source" ||
            key === "sensors" ||
            key === "on_ground" ||
            key === "icao" ||
            key === "time_position"
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
        })}
      </tbody>
    </table>
  );
}
