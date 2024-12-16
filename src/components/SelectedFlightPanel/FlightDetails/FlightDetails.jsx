import { FlightDetailsTable } from './FlightDetailsTable/FlightDetailsTable';
import React from "react";
import planeImage from "../../../images/beta_air_llc_logo.png"
import { useEffect, useState } from "react";

const FlightDetails = ({ marker, mapRef }) => {
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

      <FlightDetailsTable marker={marker} planeImage={planeImage} ContactTimeDifference={ContactTimeDifference} mapRef={mapRef} />

  );
};

export default FlightDetails;
