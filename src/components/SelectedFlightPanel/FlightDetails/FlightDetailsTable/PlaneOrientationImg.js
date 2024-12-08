import React from "react";
export function PlaneOrientationImg({
  planeImage,
  marker
}) {
  return <img src={planeImage} style={{
    width: 75,
    height: 75,
    transform: `rotate(${marker.true_track}deg)`
  }}></img>;
}
  