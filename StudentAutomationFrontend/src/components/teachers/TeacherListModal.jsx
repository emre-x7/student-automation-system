import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  CircularProgress,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { teacherService } from "../../services/teacherService";

const TeacherListModal = ({ open, onClose, onEdit, onDelete }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await teacherService.getAllTeachers();
      setTeachers(data);
    } catch (err) {
      setError("Öğretmenler getirilirken hata oluştu");
      console.error("Fetch teachers error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchTeachers();
    }
  }, [open]);

  const handleDelete = async (teacher) => {
    if (
      !window.confirm(
        `${teacher.firstName} ${teacher.lastName} isimli öğretmeni silmek istediğinize emin misiniz?`
      )
    ) {
      return;
    }

    try {
      await teacherService.deleteTeacher(teacher.id);
      setTeachers(teachers.filter((t) => t.id !== teacher.id));
      if (onDelete) onDelete(teacher);
    } catch (err) {
      alert("Öğretmen silinirken hata oluştu");
      console.error("Delete teacher error:", err);
    }
  };

  const handleEdit = (teacher) => {
    if (onEdit) onEdit(teacher);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div">
          📋 Öğretmen Listesi
        </Typography>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ad Soyad</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Branş</TableCell>
                  <TableCell align="center">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      {teacher.firstName} {teacher.lastName}
                    </TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.branch}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="secondary"
                        size="small"
                        onClick={() => handleEdit(teacher)}
                        title="Düzenle"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(teacher)}
                        title="Sil"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {teachers.length === 0 && (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography color="text.secondary">
                  Henüz öğretmen kaydı bulunmamaktadır
                </Typography>
              </Box>
            )}
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Kapat</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeacherListModal;
