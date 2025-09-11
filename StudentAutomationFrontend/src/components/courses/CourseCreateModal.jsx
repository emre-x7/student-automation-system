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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { courseService } from "../../services/courseService";
import { teacherService } from "../../services/teacherService";

const CourseCreateModal = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    teacherId: "",
  });
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teachersLoading, setTeachersLoading] = useState(false);
  const [error, setError] = useState("");

  // Öğretmenleri yükle
  const fetchTeachers = async () => {
    try {
      setTeachersLoading(true);
      const teacherData = await teacherService.getAllTeachers();
      setTeachers(teacherData);
    } catch (err) {
      console.error("Öğretmenler yüklenemedi:", err);
      setError("Öğretmenler yüklenirken hata oluştu");
    } finally {
      setTeachersLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchTeachers();
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const newCourse = await courseService.createCourse(formData);
      onSave(newCourse);
      onClose();
      // Formu sıfırla
      setFormData({
        name: "",
        code: "",
        description: "",
        teacherId: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Ders oluşturulurken hata oluştu"
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
        name: "",
        code: "",
        description: "",
        teacherId: "",
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
            📚 Yeni Ders Oluştur
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
                label="Ders Adı"
                value={formData.name}
                onChange={handleChange("name")}
                required
                margin="normal"
                disabled={loading}
                placeholder="Örn: Matematik 101"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ders Kodu"
                value={formData.code}
                onChange={handleChange("code")}
                required
                margin="normal"
                disabled={loading}
                placeholder="Örn: MAT101"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Açıklama"
                value={formData.description}
                onChange={handleChange("description")}
                margin="normal"
                disabled={loading}
                multiline
                rows={3}
                placeholder="Ders hakkında kısa açıklama..."
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                margin="normal"
                required
                disabled={loading || teachersLoading}
              >
                <InputLabel>Öğretmen</InputLabel>
                <Select
                  value={formData.teacherId}
                  onChange={handleChange("teacherId")}
                  label="Öğretmen"
                >
                  {teachersLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={16} /> Yükleniyor...
                    </MenuItem>
                  ) : (
                    teachers.map((teacher) => (
                      <MenuItem key={teacher.id} value={teacher.id}>
                        {teacher.firstName} {teacher.lastName} -{" "}
                        {teacher.branch}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            İptal
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || teachersLoading || !formData.teacherId}
          >
            {loading ? <CircularProgress size={24} /> : "Ders Oluştur"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CourseCreateModal;
