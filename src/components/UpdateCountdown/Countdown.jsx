import { Typography, Paper } from "@mui/material";
import React, { useState, useEffect } from "react";

const Countdown = ({ futureTime }) => {
  const [secondsLeft, setSecondsLeft] = useState(null);

  useEffect(() => {
    if (!futureTime) return;

    // Function to calculate seconds left
    const updateCountdown = () => {
      const now = new Date();
      const timeDifference = Math.max(0, Math.floor((futureTime - now) / 1000)); // Calculate seconds
      setSecondsLeft(timeDifference);
    };

    // Update the countdown every second
    const interval = setInterval(updateCountdown, 1000);

    // Call once immediately to avoid 1-second delay
    updateCountdown();

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [futureTime]);

  if (secondsLeft === null) {
    return <p>Loading...</p>;
  }

  return (
    <Paper className="countdownPanel">
    <Typography>
      Next Update: {secondsLeft} seconds
    </Typography>
    </Paper>
  );
};

export default Countdown;
