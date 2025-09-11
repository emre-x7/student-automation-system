import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

const CourseDetailModal = ({ open, onClose, course, onUpdate }) => {
  if (!course) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Ders Detayları</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Ders Kodu:</Typography>
          <Typography variant="body1">{course.code}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Ders Adı:</Typography>
          <Typography variant="body1">{course.name}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Öğretmen:</Typography>
          <Typography variant="body1">
            {course.teacherName || "Belirtilmemiş"}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Açıklama:</Typography>
          <Typography variant="body2">{course.description || "Yok"}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Kapat</Button>
        <Button variant="contained" onClick={() => onUpdate(course)}>
          Düzenle
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseDetailModal;
