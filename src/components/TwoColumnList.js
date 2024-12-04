import React from 'react';
import { Grid, List, ListItem, ListItemText } from '@mui/material';

const TwoColumnList = ({ selectedMarker }) => {
  return (
    <List>
      <Grid container spacing={0}>
        {Object.entries(selectedMarker).map(([key, value], index) => (
          <Grid item xs={6} key={index}>
            <ListItem>
              <ListItemText
                primary={`${key.toUpperCase().replace('_', ' ')}`}
                secondary={`${value}`}
              />
            </ListItem>
          </Grid>
        ))}
      </Grid>
    </List>
  );
};

export default TwoColumnList;