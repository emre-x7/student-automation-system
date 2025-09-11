// src/pages/grades/Grades.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import { gradeService } from "../../services/gradeService";
import { useAuth } from "../../contexts/AuthContext";

const Grades = () => {
  const { user } = useAuth(); // kullanıcı rolünü buradan alıyoruz
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === "Student") {
          const myGrades = await gradeService.getMyGrades();
          setGrades(myGrades);
        } else if (user?.role === "Teacher") {
          const myCourses = await gradeService.getTeacherCoursesWithStudents();
          setCourses(myCourses);
        }
      } catch (err) {
        console.error("Not işlemleri verisi alınırken hata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleUpdateGrade = async (courseId, studentId, grade) => {
    try {
      await gradeService.updateGrade(courseId, studentId, grade);
      alert("Not güncellendi!");
    } catch (err) {
      alert("Not güncellenirken hata oluştu.");
      console.error(err);
    }
  };

  const handleUpdateAttendance = async (courseId, studentId, attendance) => {
    try {
      await gradeService.updateAttendance(courseId, studentId, attendance);
      alert("Devamsızlık güncellendi!");
    } catch (err) {
      alert("Devamsızlık güncellenirken hata oluştu.");
      console.error(err);
    }
  };

  const handleUpdateComment = async (courseId, studentId, comment) => {
    try {
      await gradeService.updateComment(courseId, studentId, comment);
      alert("Yorum güncellendi!");
    } catch (err) {
      alert("Yorum güncellenirken hata oluştu.");
      console.error(err);
    }
  };

  if (loading) return <Typography>Yükleniyor...</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {user?.role === "Student" ? "Notlarım" : "Derslerim"}
      </Typography>

      {user?.role === "Student" && (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ders</TableCell>
                <TableCell>Kod</TableCell>
                <TableCell>Not</TableCell>
                <TableCell>Devamsızlık</TableCell>
                <TableCell>Öğretmen Yorumu</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grades.map((g) => (
                <TableRow key={g.courseId}>
                  <TableCell>{g.courseName}</TableCell>
                  <TableCell>{g.courseCode}</TableCell>
                  <TableCell>{g.grade ?? "-"}</TableCell>
                  <TableCell>{g.attendance ?? "-"}</TableCell>
                  <TableCell>{g.teacherComment ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {user?.role === "Teacher" &&
        courses.map((course) => (
          <Box key={course.id} mb={4}>
            <Typography variant="h6" gutterBottom>
              {course.name} ({course.code})
            </Typography>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Öğrenci</TableCell>
                    <TableCell>Not</TableCell>
                    <TableCell>Devamsızlık</TableCell>
                    <TableCell>Yorum</TableCell>
                    <TableCell>İşlem</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {course.students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          defaultValue={student.grade ?? ""}
                          onBlur={(e) =>
                            handleUpdateGrade(
                              course.id,
                              student.id,
                              Number(e.target.value)
                            )
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          defaultValue={student.attendance ?? ""}
                          onBlur={(e) =>
                            handleUpdateAttendance(
                              course.id,
                              student.id,
                              Number(e.target.value)
                            )
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          defaultValue={student.teacherComment || ""}
                          onBlur={(e) =>
                            handleUpdateComment(
                              course.id,
                              student.id,
                              e.target.value
                            )
                          }
                          multiline
                          maxRows={3}
                          size="small"
                          fullWidth
                          placeholder="Öğrenci için yorum yazın..."
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            alert("Değişiklikler kaydedildi.");
                          }}
                        >
                          Kaydet
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        ))}
    </Box>
  );
};

export default Grades;
