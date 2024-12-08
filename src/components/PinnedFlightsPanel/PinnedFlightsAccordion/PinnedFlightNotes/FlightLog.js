import React, { useState } from "react";
import {
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";

const FlightLog = () => {
  // State to store the list of notes
  const [notes, setNotes] = useState([]);
  // State to track the current input message
  const [currentNote, setCurrentNote] = useState("");

  // Function to handle adding a new note
  const handleAddNote = () => {
    if (currentNote.trim()) {
      const newNote = {
        note: currentNote,
        timestamp: new Date().toLocaleString(), // Current date and time
      };
      setNotes([...notes, newNote]); // Add the new note to the list
      setCurrentNote(""); // Reset the input field
    }
  };

  // Function to handle removing a note
  const handleRemoveNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index)); // Remove note by index
  };

  return (
    <Paper sx={{padding: '15px', marginTop: '5px',}}>
      {/* Title with flight details */}
      <Typography variant="h6">Notes</Typography>

      {/* List to display all notes as accordions */}
      <div>
        {notes.map((noteObj, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {/* Display date and time as summary */}
              <Typography sx={{ color: "text.secondary" }}>
                {noteObj.timestamp}
              </Typography>
              {/* Remove button */}
            </AccordionSummary>
            <AccordionDetails>
              {/* Display the note as details */}
              <Typography>{noteObj.note}</Typography>
              <Typography>
                <IconButton
                  onClick={() => handleRemoveNote(index)}
                  aria-label="delete"
                >
                  <CloseIcon />
                </IconButton>
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>

      {/* TextField for entering a new message */}
      <TextField
        label="Add a note"
        variant="outlined"
        fullWidth
        value={currentNote}
        onChange={(e) => setCurrentNote(e.target.value)} // Update input value
        multiline
        rows={4}
        margin="normal"
      />

      {/* Button to submit the new note */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddNote}
        disabled={!currentNote.trim()} // Disable if the input is empty
      >
        Add Note
      </Button>
    </Paper>
  );
};

export default FlightLog;
