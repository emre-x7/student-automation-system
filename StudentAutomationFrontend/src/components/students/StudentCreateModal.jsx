import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
import { studentService } from "../../services/studentService";

const StudentCreateModal = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    studentNumber: "",
    department: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const newStudent = await studentService.createStudent(formData);
      onSave(newStudent);
      onClose();
      // Formu sıfırla
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        studentNumber: "",
        department: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Öğrenci oluşturulurken hata oluştu"
      );
      console.error("Create error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        studentNumber: "",
        department: "",
      });
      setError("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Typography variant="h5" component="div">
            👤 Yeni Öğrenci Ekle
          </Typography>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ad"
                value={formData.firstName}
                onChange={handleChange("firstName")}
                required
                margin="normal"
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Soyad"
                value={formData.lastName}
                onChange={handleChange("lastName")}
                required
                margin="normal"
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                required
                margin="normal"
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Şifre"
                type="password"
                value={formData.password}
                onChange={handleChange("password")}
                required
                margin="normal"
                disabled={loading}
                helperText="Öğrencinin giriş şifresi"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Öğrenci No"
                value={formData.studentNumber}
                onChange={handleChange("studentNumber")}
                required
                margin="normal"
                disabled={loading}
                placeholder="Örn: 2024001"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Bölüm"
                value={formData.department}
                onChange={handleChange("department")}
                margin="normal"
                disabled={loading}
                placeholder="Örn: Bilgisayar Mühendisliği"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            İptal
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Öğrenci Ekle"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StudentCreateModal;
