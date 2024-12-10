import { FlightDetailsTable } from './FlightDetailsTable/FlightDetailsTable.js';
import React from "react";
import { Paper} from "@mui/material";
import planeImage from "../../../images/beta_air_llc_logo.png"
import { useEffect, useState } from "react";

const FlightDetails = ({ marker }) => {
  const [ContactTimeDifference, setContactTimeDifference] = useState(null);

  useEffect(() => {
    if (marker) {
      const interval = setInterval(() => {
        const currentUnixTime = Math.floor(Date.now() / 1000);
        setContactTimeDifference(currentUnixTime - marker.lastContact);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [marker]);

  return (
    <Paper sx={{padding: "15px"}}>
      <FlightDetailsTable marker={marker} planeImage={planeImage} ContactTimeDifference={ContactTimeDifference}  />
    </Paper>
  );
};

export default FlightDetails;
