import { OPENSKY_CREDENTIALS } from "../config/config";

export const fetchOpenSkyData = async () => {
    const { username, password } = OPENSKY_CREDENTIALS;
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
    
    console.log("planes loaded");
    
    const { states } = await response.json();
    return states;
  };