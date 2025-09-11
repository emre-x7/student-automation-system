import api from "./api";

export const studentService = {
  // Tüm öğrencileri getir
  getAllStudents: async () => {
    try {
      const response = await api.get("/students");
      return response.data;
    } catch (error) {
      console.error("Öğrenciler getirilirken hata:", error);
      throw error;
    }
  },

  // ID'ye göre öğrenci getir
  getStudentById: async (id) => {
    try {
      const response = await api.get(`/students/${id}`);
      return response.data;
    } catch (error) {
      console.error("Öğrenci getirilirken hata:", error);
      throw error;
    }
  },

  // Yeni öğrenci oluştur
  createStudent: async (studentData) => {
    try {
      const response = await api.post("/students", studentData);
      return response.data;
    } catch (error) {
      console.error("Öğrenci oluşturulurken hata:", error);
      throw error;
    }
  },

  // Öğrenci güncelle
  updateStudent: async (id, studentData) => {
    try {
      const response = await api.put(`/students/${id}`, studentData);
      return response.data;
    } catch (error) {
      console.error("Öğrenci güncellenirken hata:", error);
      throw error;
    }
  },

  // Öğrenci sil
  deleteStudent: async (id) => {
    try {
      const response = await api.delete(`/students/${id}`);
      return response.data;
    } catch (error) {
      console.error("Öğrenci silinirken hata:", error);
      throw error;
    }
  },

  getStudentIdByUserId: async (userId) => {
    try {
      const response = await api.get(`/students/user/${userId}/id`);
      return response.data;
    } catch (error) {
      console.error("Student ID getirilirken hata:", error);
      throw error;
    }
  },
};
