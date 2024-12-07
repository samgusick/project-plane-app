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
import TwoColumnList from "./TwoColumnList";

export function PinnedFlightsAccordion({ setPinnedFlights, flight }) {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ArrowDownwardIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Typography>
          <IconButton
            sx={{ padding: 0 }}
            onClick={() => {
              setPinnedFlights((prevPinnedFlights) =>
                prevPinnedFlights.filter(
                  (item) => item.callsign !== flight.callsign
                )
              );
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Typography>
        <Typography sx={{ width: "33%", flexShrink: 0 }}>
          Aircraft {flight.icao}
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          {flight.origin_country}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <TwoColumnList marker={flight}></TwoColumnList>
      </AccordionDetails>
    </Accordion>
  );
}
