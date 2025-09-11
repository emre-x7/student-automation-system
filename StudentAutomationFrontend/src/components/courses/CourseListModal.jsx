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
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Group as GroupIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { courseService } from "../../services/courseService";
import CourseStudentManagementModal from "./CourseStudentManagementModal";

const CourseListModal = ({
  open,
  onClose,
  onEdit,
  onDelete,
  onManageStudents,
  onViewDetails,
}) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [studentManagementModalOpen, setStudentManagementModalOpen] =
    useState(false);
  const [selectedCourseForManagement, setSelectedCourseForManagement] =
    useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (err) {
      setError("Dersler getirilirken hata oluştu");
      console.error("Fetch courses error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCourses();
    }
  }, [open]);

  const handleDelete = async (course) => {
    if (
      !window.confirm(
        `${course.name} (${course.code}) dersini silmek istediğinize emin misiniz?`
      )
    ) {
      return;
    }

    try {
      await courseService.deleteCourse(course.id);
      setCourses(courses.filter((c) => c.id !== course.id));
      if (onDelete) onDelete(course);
    } catch (err) {
      alert("Ders silinirken hata oluştu");
      console.error("Delete course error:", err);
    }
  };

  const handleEdit = (course) => {
    if (onEdit) onEdit(course);
    onClose();
  };

  const handleManageStudents = (course) => {
    setSelectedCourseForManagement(course);
    setStudentManagementModalOpen(true);
  };

  const handleViewDetails = (course) => {
    if (onViewDetails) onViewDetails(course);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div">
          📚 Ders Listesi
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
                  <TableCell>Ders Kodu</TableCell>
                  <TableCell>Ders Adı</TableCell>
                  <TableCell>Öğretmen</TableCell>
                  <TableCell>Açıklama</TableCell>
                  <TableCell align="center">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <Chip
                        label={course.code}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.teacherName}</TableCell>
                    <TableCell>
                      {course.description
                        ? course.description.length > 50
                          ? course.description.substring(0, 50) + "..."
                          : course.description
                        : "Açıklama yok"}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="info"
                        size="small"
                        onClick={() => handleViewDetails(course)}
                        title="Detayları Görüntüle"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleManageStudents(course)}
                        title="Öğrenci Yönetimi"
                      >
                        <GroupIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        size="small"
                        onClick={() => handleEdit(course)}
                        title="Düzenle"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(course)}
                        title="Sil"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {courses.length === 0 && (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography color="text.secondary">
                  Henüz ders kaydı bulunmamaktadır
                </Typography>
              </Box>
            )}
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Kapat</Button>
      </DialogActions>
      <CourseStudentManagementModal
        open={studentManagementModalOpen}
        onClose={() => setStudentManagementModalOpen(false)}
        course={selectedCourseForManagement}
        onStudentsUpdated={() => {}}
      />
    </Dialog>
  );
};

export default CourseListModal;
