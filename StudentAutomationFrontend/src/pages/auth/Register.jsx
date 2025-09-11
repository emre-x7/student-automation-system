import React from "react";
import { Typography, Box, Paper } from "@mui/material";

const Register = () => {
  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Kayıt Ol
        </Typography>
        <Typography align="center">
          Kayıt sayfası yapım aşamasında...
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
