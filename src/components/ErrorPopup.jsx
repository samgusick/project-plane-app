import React from "react";
import { Paper, Typography } from "@mui/material";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

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
        width: "450px",
        zIndex: 1000, // Ensures it appears on top of other elements
        textAlign: "center"
      }}>
        <WarningAmberIcon fontSize="large"/>
        <Typography variant="h3" marginBottom={"15px"} marginTop={"15px"}>API Limit Hit</Typography>
        <Typography variant="h6">OpenSky users get 4000 API credits per day. Comeback tommorrow and try again.</Typography>
      </Paper>
    </div>
  );
};

export default ErrorPopup;
