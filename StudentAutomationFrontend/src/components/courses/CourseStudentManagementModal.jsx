import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { courseService } from "../../services/courseService";
import { studentService } from "../../services/studentService";

const CourseStudentManagementModal = ({
  open,
  onClose,
  course,
  onStudentsUpdated,
}) => {
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [error, setError] = useState("");

  // Dersin kayıtlı öğrencilerini ve tüm öğrencileri getir
  const fetchData = async () => {
    if (!course) return;

    try {
      setLoading(true);
      setError("");

      // 1. Dersin mevcut öğrencilerini getir
      const courseWithStudents = await courseService.getCourseWithStudents(
        course.id
      );
      setEnrolledStudents(courseWithStudents.students || []);

      // 2. Tüm öğrencileri getir (dropdown için)
      setStudentsLoading(true);
      const allStudentsData = await studentService.getAllStudents();
      setAllStudents(allStudentsData);
    } catch (err) {
      setError("Veriler getirilirken hata oluştu.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    if (open && course) {
      fetchData();
    }
  }, [open, course]);

  // Öğrenciyi derse ekle
  const handleAddStudent = async () => {
    if (!selectedStudentId) return;

    try {
      setLoading(true);
      await courseService.addStudentToCourse(course.id, selectedStudentId);

      // Listeyi yenile
      await fetchData();
      setSelectedStudentId("");

      if (onStudentsUpdated) onStudentsUpdated();
      alert("Öğrenci derse eklendi!");
    } catch (err) {
      alert(
        "Öğrenci eklenirken hata oluştu: " + (err.response?.data || err.message)
      );
      console.error("Add student error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Öğrenciyi dersten çıkar
  const handleRemoveStudent = async (studentId) => {
    if (
      !window.confirm(
        "Bu öğrenciyi dersten çıkarmak istediğinize emin misiniz?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await courseService.removeStudentFromCourse(course.id, studentId);

      // Listeyi yenile
      await fetchData();

      if (onStudentsUpdated) onStudentsUpdated();
      alert("Öğrenci dersten çıkarıldı!");
    } catch (err) {
      alert("Öğrenci çıkarılırken hata oluştu.");
      console.error("Remove student error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!course) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div">
          👥 {course.name} - Öğrenci Yönetimi
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {course.code}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* ÖĞRENCİ EKLEME BÖLÜMÜ */}
        <Box sx={{ mb: 3, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Öğrenci Ekle
          </Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <FormControl
              sx={{ minWidth: 200 }}
              disabled={studentsLoading || loading}
            >
              <InputLabel>Öğrenci Seçin</InputLabel>
              <Select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                label="Öğrenci Seçin"
              >
                {allStudents
                  .filter(
                    (student) =>
                      !enrolledStudents.some(
                        (enrolled) => enrolled.studentId === student.id
                      )
                  )
                  .map((student) => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} -{" "}
                      {student.studentNumber}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddStudent}
              disabled={!selectedStudentId || loading}
            >
              Ekle
            </Button>
          </Box>
        </Box>

        {/* KAYITLI ÖĞRENCİLER LİSTESİ */}
        <Typography variant="h6" gutterBottom>
          Kayıtlı Öğrenciler ({enrolledStudents.length})
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" sx={{ py: 3 }}>
            <CircularProgress />
          </Box>
        ) : enrolledStudents.length === 0 ? (
          <Typography color="textSecondary" sx={{ py: 2 }}>
            Bu derse kayıtlı öğrenci bulunmamaktadır.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Öğrenci No</TableCell>
                  <TableCell>Ad Soyad</TableCell>
                  <TableCell>Not</TableCell>
                  <TableCell>Devamsızlık</TableCell>
                  <TableCell align="center">İşlem</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enrolledStudents.map((student) => (
                  <TableRow key={student.studentId}>
                    <TableCell>{student.studentNumber}</TableCell>
                    <TableCell>{student.studentName}</TableCell>
                    <TableCell>{student.grade || "-"}</TableCell>
                    <TableCell>
                      {student.attendance !== null &&
                      student.attendance !== undefined
                        ? `${student.attendance} gün`
                        : "-"}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleRemoveStudent(student.studentId)}
                        disabled={loading}
                        title="Öğrenciyi Çıkar"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseStudentManagementModal;
