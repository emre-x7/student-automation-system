import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { courseService } from "../../services/courseService";
import CourseDetailModal from "../../components/courses/CourseDetailModal";
import CourseEditModal from "../../components/courses/CourseEditModal";
import CourseCreateModal from "../../components/courses/CourseCreateModal";

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Tüm dersleri getir
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAllCourses();
      setCourses(data);
      setError("");
    } catch (err) {
      setError("Dersler getirilirken hata oluştu");
      console.error("Fetch courses error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Ders detay modalını aç
  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setDetailModalOpen(true);
  };

  // Ders düzenleme modalını aç
  const handleEdit = (course) => {
    setSelectedCourse(course);
    setEditModalOpen(true);
  };

  // Ders kaydedildiğinde state'i güncelle
  const handleSaveCourse = (updatedCourse) => {
    setCourses(
      courses.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
  };

  // Ders sil
  const handleDelete = async (id) => {
    if (!window.confirm("Bu dersi silmek istediğinize emin misiniz?")) return;

    try {
      await courseService.deleteCourse(id);
      setCourses(courses.filter((course) => course.id !== id));
      alert("Ders başarıyla silindi");
    } catch (err) {
      alert("Ders silinirken hata oluştu");
      console.error("Delete course error:", err);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          📚 Ders Yönetimi
        </Typography>
        <Typography color="textSecondary">
          Ders listesi, ekleme, düzenleme ve silme işlemleri
        </Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        🚧 Ders durum yönetimi (başladı/bitti) yakında eklenecektir.
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Toplam Ders
              </Typography>
              <Typography variant="h4" color="primary">
                {courses.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎯 İşlemler
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
              >
                Yeni Ders
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Ders Listesi Tablosu */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Ders Listesi
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ders Kodu</TableCell>
                <TableCell>Ders Adı</TableCell>
                <TableCell>Öğretmen</TableCell>
                <TableCell>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.teacherName || "Belirtilmemiş"}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleViewDetails(course)}
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      size="small"
                      onClick={() => handleEdit(course)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(course.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {courses.length === 0 && !loading && (
          <Typography
            sx={{ p: 3, textAlign: "center", color: "text.secondary" }}
          >
            📝 Henüz ders kaydı bulunmamaktadır
          </Typography>
        )}
      </Paper>

      {/* Ders Ekleme Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Yeni Ders Ekle</DialogTitle>
        <DialogContent>
          <Typography color="textSecondary" sx={{ mb: 2 }}>
            🚧 Ders ekleme formu yapım aşamasında...
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>İptal</Button>
          <Button variant="contained" disabled>
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail ve Edit Modalları */}
      <CourseDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        course={selectedCourse}
        onUpdate={handleEdit}
      />

      <CourseEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        course={selectedCourse}
        onSave={handleSaveCourse}
      />

      <CourseCreateModal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={(newCourse) => {
          setCourses([...courses, newCourse]);
          setOpenDialog(false);
        }}
      />
    </Box>
  );
};

export default Courses;
