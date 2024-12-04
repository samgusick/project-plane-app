import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Typography,
  List,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

export function PinnedFlightsAccordion({ setPinnedFlights, flight }) {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ArrowDownwardIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Typography>
        <IconButton sx={{padding: 0}}

        onClick={() => {
          setPinnedFlights((prevPinnedFlights) =>
            prevPinnedFlights.filter((item) => item.callsign !== flight.callsign)
          );
        }}
      >
        <DeleteIcon />
      </IconButton>
        </Typography>
        <Typography sx={{ width: "33%", flexShrink: 0 }}>
          {flight.callsign}
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          {flight.origin_country}
        </Typography>
      </AccordionSummary>


      <AccordionDetails style={{ maxHeight: "400px", overflowY: "auto" }}>
        <List>
          {Object.entries(flight).map(([key, value], index) => (
            <ListItemText
              key={index}
              primary={`${key.toUpperCase().replace('_', ' ')}:`}
              secondary={`${value}`}
            />
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}
