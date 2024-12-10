import React from "react";
export function PlaneOrientationImg({
  planeImage,
  marker
}) {
  return <img src={planeImage} alt="betaLogo" style={{
    width: 75,
    height: 75,
    transform: `rotate(${marker.trueTrack}deg)`
  }}></img>;
}
  