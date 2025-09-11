import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { courseService } from "../../services/courseService";
import { teacherService } from "../../services/teacherService";

const CourseEditModal = ({ open, onClose, course, onSave }) => {
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
      if (course) {
        setFormData({
          name: course.name || "",
          code: course.code || "",
          description: course.description || "",
          teacherId: course.teacherId || "",
        });
      }
    }
  }, [open, course]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const updatedCourse = await courseService.updateCourse(
        course.id,
        formData
      );
      onSave(updatedCourse);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Ders güncellenirken hata oluştu"
      );
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

  if (!course) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>✏️ Ders Düzenle</DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Ders Adı"
              value={formData.name}
              onChange={handleChange("name")}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              label="Ders Kodu"
              value={formData.code}
              onChange={handleChange("code")}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              label="Açıklama"
              value={formData.description}
              onChange={handleChange("description")}
              margin="normal"
              multiline
              rows={3}
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Öğretmen</InputLabel>
              <Select
                value={formData.teacherId}
                onChange={handleChange("teacherId")}
                label="Öğretmen"
              >
                {teachers.map((teacher) => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    {teacher.firstName} {teacher.lastName} - {teacher.branch}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
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

export default CourseEditModal;
