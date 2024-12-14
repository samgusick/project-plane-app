import React from "react";
export function PlaneOrientationImg({
  planeImage,
  marker
}) {

  const planeAngle = marker.trueTrack || 0;

  return <img src={planeImage} alt="betaLogo" style={{
    transform: `rotate(${planeAngle}deg)`,
    objectFit: 'contain'
  }}></img>;
}
  