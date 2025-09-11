import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Grid,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import { studentService } from "../../services/studentService";

const StudentDetailModal = ({ open, onClose, student, onUpdate }) => {
  if (!student) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div">
          👤 Öğrenci Detayları
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Öğrenci Numarası
              </Typography>
              <Typography variant="h6">{student.studentNumber}</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Ad Soyad
              </Typography>
              <Typography variant="h6">
                {student.firstName} {student.lastName}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Email
              </Typography>
              <Typography variant="body1">{student.email}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Bölüm
              </Typography>
              <Chip
                label={student.department || "Belirtilmemiş"}
                color="primary"
                variant="outlined"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Kayıt Tarihi
              </Typography>
              <Typography variant="body1">
                {new Date(student.enrollmentDate).toLocaleDateString("tr-TR")}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Öğrenci ID
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {student.id}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          📚 Aldığı Dersler
        </Typography>
        <Typography variant="body2" color="textSecondary">
          🚧 Öğrencinin ders bilgileri yapım aşamasında...
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Kapat</Button>
        <Button variant="contained" onClick={() => onUpdate(student)}>
          Düzenle
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentDetailModal;
