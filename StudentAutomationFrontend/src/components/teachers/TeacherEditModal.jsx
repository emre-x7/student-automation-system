import React, { useState, useEffect } from "react";
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
import { teacherService } from "../../services/teacherService";

const TeacherEditModal = ({ open, onClose, teacher, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    branch: "",
    password: "", // opsiyonel şifre değişimi
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (teacher) {
      setFormData({
        firstName: teacher.firstName || "",
        lastName: teacher.lastName || "",
        email: teacher.email || "",
        branch: teacher.branch || "",
        password: "", // şifre her zaman boş başlar
      });
    }
  }, [teacher]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const updatedTeacher = await teacherService.updateTeacher(
        teacher.id,
        formData
      );
      onSave(updatedTeacher);
      onClose();
    } catch (err) {
      setError("Öğretmen güncellenirken hata oluştu");
      console.error("Update error:", err);
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Typography variant="h5" component="div">
            ✏️ Öğretmen Düzenle
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
                label="Branş"
                value={formData.branch}
                onChange={handleChange("branch")}
                required
                margin="normal"
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Yeni Şifre"
                type="password"
                value={formData.password}
                onChange={handleChange("password")}
                margin="normal"
                disabled={loading}
                helperText="Boş bırakırsanız şifre değişmez"
                placeholder="Yeni şifre (opsiyonel)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            İptal
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Kaydet"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TeacherEditModal;
