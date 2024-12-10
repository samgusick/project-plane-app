import { PlaneOrientationImg } from "./PlaneOrientationImg";
import React from "react";
import { CountryFlag } from "./CountryFlag.js";
import { FlightDetailsTableRows } from "./FlightDetailsTableRows.js";
export function FlightDetailsTable({
  marker,
  planeImage,
  ContactTimeDifference,
  planeData
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
            <CountryFlag marker={marker} planeData={planeData}/>
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

        <FlightDetailsTableRows marker={marker} ContactTimeDifference={ContactTimeDifference}/>
      </tbody>
    </table>
  );
}
