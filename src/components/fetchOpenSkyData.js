import { username } from "../config/config";
import { password } from "../config/config";

export const fetchOpenSkyData = async () => {
  const credentials = btoa(`${username}:${password}`);
  const bounds = {
    lamin: 42.7,
    lamax: 45.0,
    lomin: -73.4377,
    lomax: -71.4657,
  };

  const response = await fetch(
    `https://opensky-network.org/api/states/all?lamin=${bounds.lamin}&lomin=${bounds.lomin}&lamax=${bounds.lamax}&lomax=${bounds.lomax}`,
    { headers: { Authorization: `Basic ${credentials}` } }
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const { states } = await response.json();

  // console.log(states);

  if (!states) {
    return [];
  }

  // Custom keys
  const customKeys = [
    "icao24", // Unique ICAO 24-bit address of the transponder
    "callsign", // Callsign of the vehicle
    "originCountry", // Country of origin
    "timePosition", // Time of last position update
    "lastContact", // Time of last update
    "longitude", // Longitude in decimal degrees
    "latitude", // Latitude in decimal degrees
    "baroAltitude", // Barometric altitude in meters
    "onGround", // Boolean indicating whether the vehicle is on the ground
    "velocity", // Velocity over ground in m/s
    "trueTrack", // Heading in decimal degrees
    "verticalRate", // Vertical rate in m/s
    "sensors", // Sensors
    "geoAltitude", // Geometric altitude in meters
    "squawk", // Squawk code
    "spi", // Whether flight status is special purpose indicator
    "positionSource", // Position source
  ];

  // Convert arrays to dictionaries
  const formattedStates = states.map((stateArray) =>
    Object.fromEntries(
      stateArray.map((value, index) => [customKeys[index], value])
    )
  );

  return formattedStates;
};
