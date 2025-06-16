import React from 'react';
import { Typography, Box } from '@mui/material';

const EditJob = () => {
  return (
    <Box sx={{ mt: 8, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Job Application
      </Typography>
      <Typography variant="body1">
        This is a placeholder for the form to edit an existing job application.
      </Typography>
    </Box>
  );
};

export default EditJob; 