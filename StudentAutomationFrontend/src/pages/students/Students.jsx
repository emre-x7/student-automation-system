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
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { studentService } from "../../services/studentService";
import StudentDetailModal from "../../components/students/StudentDetailModal";
import StudentEditModal from "../../components/students/StudentEditModal";
import StudentCreateModal from "../../components/students/StudentCreateModal";

const Students = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setDetailModalOpen(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditModalOpen(true);
  };

  const handleSaveStudent = (updatedStudent) => {
    setStudents(
      students.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
  };

  const handleCreateStudent = (newStudent) => {
    setStudents([...students, newStudent]);
  };

  // Öğrencileri getir
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getAllStudents();
      setStudents(data);
      setError("");
    } catch (err) {
      setError("Öğrenciler getirilirken hata oluştu");
      console.error("Fetch students error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Öğrenci sil
  const handleDelete = async (id) => {
    if (!window.confirm("Bu öğrenciyi silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      await studentService.deleteStudent(id);
      setStudents(students.filter((student) => student.id !== id));
      alert("Öğrenci başarıyla silindi");
    } catch (err) {
      alert("Öğrenci silinirken hata oluştu");
      console.error("Delete student error:", err);
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
          👥 Öğrenci Yönetimi
        </Typography>
        <Typography color="textSecondary">
          Öğrenci listesi, ekleme, düzenleme ve silme işlemleri
        </Typography>
        <Chip
          label={`Rol: ${user?.role}`}
          color="primary"
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </Paper>

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
                📊 Toplam Öğrenci
              </Typography>
              <Typography variant="h4" color="primary">
                {students.length}
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
                onClick={() => setCreateModalOpen(true)}
                disabled={user?.role !== "Admin" && user?.role !== "Teacher"}
              >
                Yeni Öğrenci
              </Button>
              {user?.role !== "Admin" && user?.role !== "Teacher" && (
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 1, color: "text.secondary" }}
                >
                  * Sadece Admin ve Teacher öğrenci ekleyebilir
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Öğrenci Listesi Tablosu */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Öğrenci Listesi
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Öğrenci No</TableCell>
                <TableCell>Ad Soyad</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Bölüm</TableCell>
                <TableCell>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.studentNumber}</TableCell>
                  <TableCell>
                    {student.firstName} {student.lastName}
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.department || "Belirtilmemiş"}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleViewDetails(student)}
                      title="Detayları Görüntüle"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      size="small"
                      onClick={() => handleEdit(student)}
                      disabled={
                        user?.role !== "Admin" && user?.role !== "Teacher"
                      }
                      title="Düzenle"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(student.id)}
                      disabled={user?.role !== "Admin"}
                      title="Sil (Sadece Admin)"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {students.length === 0 && !loading && (
          <Typography
            sx={{ p: 3, textAlign: "center", color: "text.secondary" }}
          >
            📝 Henüz öğrenci kaydı bulunmamaktadır
          </Typography>
        )}
      </Paper>

      {/* Modal Components */}
      <StudentDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        student={selectedStudent}
        onUpdate={(student) => {
          setDetailModalOpen(false);
          handleEdit(student);
        }}
      />

      <StudentEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        student={selectedStudent}
        onSave={handleSaveStudent}
      />

      <StudentCreateModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateStudent}
      />
    </Box>
  );
};

export default Students;
