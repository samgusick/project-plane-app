import React from "react";
export function PlaneOrientationImg({
  planeImage,
  marker
}) {

  const planeAngle = marker.trueTrack || 0;

  return <img src={planeImage} alt="betaLogo" style={{
    width: 75,
    height: 75,
    transform: `rotate(${planeAngle}deg)`
  }}></img>;
}
  