import api from "./api";

export const courseService = {
  // Tüm dersleri getir
  getAllCourses: async () => {
    try {
      const response = await api.get("/courses");
      return response.data;
    } catch (error) {
      console.error("Dersler getirilirken hata:", error);
      throw error;
    }
  },

  // ID'ye göre ders getir
  getCourseById: async (id) => {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error("Ders getirilirken hata:", error);
      throw error;
    }
  },

  // Yeni ders oluştur
  createCourse: async (courseData) => {
    try {
      const response = await api.post("/courses", courseData);
      return response.data;
    } catch (error) {
      console.error("Ders oluşturulurken hata:", error);
      throw error;
    }
  },

  // Ders güncelle
  updateCourse: async (id, courseData) => {
    try {
      const response = await api.put(`/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      console.error("Ders güncellenirken hata:", error);
      throw error;
    }
  },

  // Ders sil
  deleteCourse: async (id) => {
    try {
      const response = await api.delete(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error("Ders silinirken hata:", error);
      throw error;
    }
  },

  // Öğretmenin derslerini getir
  getCoursesByTeacher: async (teacherId) => {
    try {
      const response = await api.get(`/courses/teacher/${teacherId}`);
      return response.data;
    } catch (error) {
      console.error("Öğretmen dersleri getirilirken hata:", error);
      throw error;
    }
  },

  // Dersin öğrencilerini getir
  getCourseWithStudents: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/students`);
      return response.data;
    } catch (error) {
      console.error("Ders öğrencileri getirilirken hata:", error);
      throw error;
    }
  },

  // Derse öğrenci ekle
  addStudentToCourse: async (courseId, studentId) => {
    try {
      const response = await api.post(
        `/courses/${courseId}/students`,
        studentId
      );
      return response.data;
    } catch (error) {
      console.error("Öğrenci derse eklenirken hata:", error);
      throw error;
    }
  },

  // Öğrenciyi dersten çıkar
  removeStudentFromCourse: async (courseId, studentId) => {
    try {
      const response = await api.delete(
        `/courses/${courseId}/students/${studentId}`
      );
      return response.data;
    } catch (error) {
      console.error("Öğrenci dersten çıkarılırken hata:", error);
      throw error;
    }
  },

  // Öğrenci notu güncelle
  updateStudentGrade: async (courseId, studentId, grade) => {
    try {
      const response = await api.put(
        `/courses/${courseId}/students/${studentId}/grade`,
        grade
      );
      return response.data;
    } catch (error) {
      console.error("Öğrenci notu güncellenirken hata:", error);
      throw error;
    }
  },

  // Öğrenci devamsızlığı güncelle
  updateStudentAttendance: async (courseId, studentId, attendance) => {
    try {
      const response = await api.put(
        `/courses/${courseId}/students/${studentId}/attendance`,
        attendance
      );
      return response.data;
    } catch (error) {
      console.error("Öğrenci devamsızlığı güncellenirken hata:", error);
      throw error;
    }
  },

  // Öğrenci yorumu güncelle
  updateStudentComment: async (courseId, studentId, comment) => {
    try {
      const response = await api.put(
        `/courses/${courseId}/students/${studentId}/comment`,
        comment
      );
      return response.data;
    } catch (error) {
      console.error("Öğrenci yorumu güncellenirken hata:", error);
      throw error;
    }
  },
};
