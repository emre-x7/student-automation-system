import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
} from "@mui/material";

const TeacherDetailModal = ({ open, onClose, teacher, onUpdate }) => {
  if (!teacher) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Öğretmen Detayı</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Ad:</Typography>
            <Typography>{teacher.firstName}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Soyad:</Typography>
            <Typography>{teacher.lastName}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Email:</Typography>
            <Typography>{teacher.email}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">Bölüm:</Typography>
            <Typography>{teacher.department}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Kapat</Button>
        <Button
          variant="contained"
          onClick={() => {
            onClose();
            onUpdate(teacher); // Düzenleme modalını açacak
          }}
        >
          Düzenle
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeacherDetailModal;
