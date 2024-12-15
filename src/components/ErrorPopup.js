import React from "react";
import { Paper, Typography } from "@mui/material";

const ErrorPopup = ({}) => {
  return (
    <div>
      <Paper
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "white",
          padding: "1rem",
          width: "100%",
          height: "100%",
          opacity: "50%",
          zIndex: 1000, // Ensures it appears on top of other elements
        }}
      ></Paper>
      <Paper
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        padding: "1rem",
        transform: "translate(-50%, -50%)",
        zIndex: 1000, // Ensures it appears on top of other elements
      }}>
        <Typography variant="h3">API Limit Hit</Typography>
        <Typography variant="h6">Check back tommorow</Typography>
      </Paper>
    </div>
  );
};

export default ErrorPopup;
