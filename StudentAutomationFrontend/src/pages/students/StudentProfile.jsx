import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Box,
  Grid,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { studentService } from "../../services/studentService";

const StudentProfile = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);

      // TÜM öğrencileri getir
      const allStudents = await studentService.getAllStudents();

      // Email'e göre kendi öğrenci kaydını bul
      const currentStudent = allStudents.find(
        (student) => student.email === user.email
      );

      if (currentStudent) {
        setStudentData(currentStudent);
      } else {
        setError("Öğrenci profili bulunamadı.");
      }
    } catch (err) {
      setError("Profil bilgileri getirilirken hata oluştu.");
      console.error("Fetch profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStudentProfile();
    }
  }, [user]);

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

  if (error) {
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!studentData) {
    return (
      <Box>
        <Alert severity="info">Öğrenci profili bulunamadı.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          👤 Öğrenci Profilim
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Kişisel Bilgiler
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Öğrenci Numarası
              </Typography>
              <Typography variant="h6">{studentData.studentNumber}</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Ad Soyad
              </Typography>
              <Typography variant="h6">
                {studentData.firstName} {studentData.lastName}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Email
              </Typography>
              <Typography variant="body1">{studentData.email}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Akademik Bilgiler
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Bölüm
              </Typography>
              <Chip
                label={studentData.department || "Belirtilmemiş"}
                color="primary"
                variant="outlined"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Kayıt Tarihi
              </Typography>
              <Typography variant="body1">
                {new Date(studentData.enrollmentDate).toLocaleDateString(
                  "tr-TR"
                )}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentProfile;
