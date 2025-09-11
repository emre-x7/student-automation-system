// src/services/gradeService.js
import api from "./api";

export const gradeService = {
  // Öğrenci kendi notlarını getirir
  getMyGrades: async () => {
    try {
      const response = await api.get("/students/me/grades");
      return response.data;
    } catch (error) {
      console.error("Notlar getirilirken hata:", error);
      throw error;
    }
  },

  // Öğretmenin kendi dersleri + öğrencilerini getirir
  getTeacherCoursesWithStudents: async () => {
    try {
      const response = await api.get("/teachers/me/courses-with-students");
      return response.data;
    } catch (error) {
      console.error("Öğretmen dersleri getirilirken hata:", error);
      throw error;
    }
  },

  // Öğrencinin notunu güncelle
  updateGrade: async (courseId, studentId, grade) => {
    try {
      const response = await api.put(
        `/courses/${courseId}/students/${studentId}/grade`,
        grade
      );
      return response.data;
    } catch (error) {
      console.error("Not güncellenirken hata:", error);
      throw error;
    }
  },

  // Öğrencinin devamsızlığını güncelle
  updateAttendance: async (courseId, studentId, attendance) => {
    try {
      const response = await api.put(
        `/courses/${courseId}/students/${studentId}/attendance`,
        attendance
      );
      return response.data;
    } catch (error) {
      console.error("Devamsızlık güncellenirken hata:", error);
      throw error;
    }
  },

  // Öğrenciye öğretmen yorumu ekle/güncelle
  updateComment: async (courseId, studentId, comment) => {
    try {
      const response = await api.put(
        `/courses/${courseId}/students/${studentId}/comment`,
        comment
      );
      return response.data;
    } catch (error) {
      console.error("Yorum güncellenirken hata:", error);
      throw error;
    }
  },
};
