import { username } from "../config/config";
import { password } from "../config/config";

export const fetchOpenSkyData = async () => {
  try {
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
      return "error";
    }

    const { states } = await response.json();

    if (!states) {
      return [];
    }

    const customKeys = [
      "icao24",
      "callsign",
      "originCountry",
      "timePosition",
      "lastContact",
      "longitude",
      "latitude",
      "baroAltitude",
      "onGround",
      "velocity",
      "trueTrack",
      "verticalRate",
      "sensors",
      "geoAltitude",
      "squawk",
      "spi",
      "positionSource",
    ];

    const formattedStates = states.map((stateArray) =>
      Object.fromEntries(
        stateArray.map((value, index) => [customKeys[index], value])
      )
    );

    return formattedStates;
  } catch (error) {
    return "error";
  }
};
