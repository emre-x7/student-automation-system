import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { gradeService } from "../../services/gradeService";

const MyGrades = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Öğrenci notlarını getir
  const fetchMyGrades = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await gradeService.getMyGrades();
      setGrades(data);
    } catch (err) {
      setError("Notlarınız getirilirken bir hata oluştu.");
      console.error("Fetch grades error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGrades();
  }, []);

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
          📖 Notlarım ve Devamsızlık Bilgilerim
        </Typography>
        <Typography color="textSecondary">
          Tüm derslerinize ait not, devamsızlık ve öğretmen yorumlarını buradan
          görüntüleyebilirsiniz.
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {grades.length === 0 ? (
        <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
          <Typography color="textSecondary">
            Henüz hiç dersiniz bulunmamaktadır veya notlarınız girilmemiştir.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ders Kodu</TableCell>
                <TableCell>Ders Adı</TableCell>
                <TableCell align="center">Not</TableCell>
                <TableCell align="center">Devamsızlık</TableCell>
                <TableCell>Öğretmen Yorumu</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grades.map((grade, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Chip
                      label={grade.courseCode}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{grade.courseName}</TableCell>
                  <TableCell align="center">
                    {grade.grade ? (
                      <Chip
                        label={grade.grade}
                        color={grade.grade >= 50 ? "success" : "error"}
                        variant="filled"
                      />
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Girilmemiş
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {grade.attendance !== null &&
                    grade.attendance !== undefined ? (
                      <Chip
                        label={`${grade.attendance} Gün`}
                        color={grade.attendance > 5 ? "error" : "warning"}
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Girilmemiş
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {grade.teacherComment || (
                      <Typography variant="body2" color="textSecondary">
                        Yorum yok
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default MyGrades;
