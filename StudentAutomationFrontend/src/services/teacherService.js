import api from "./api";

export const teacherService = {
  getAllTeachers: async () => {
    try {
      const response = await api.get("/teachers");
      return response.data;
    } catch (error) {
      console.error("Öğretmenler getirilirken hata:", error);
      throw error;
    }
  },

  getTeacherById: async (id) => {
    try {
      const response = await api.get(`/teachers/${id}`);
      return response.data;
    } catch (error) {
      console.error("Öğretmen getirilirken hata:", error);
      throw error;
    }
  },

  createTeacher: async (teacherData) => {
    try {
      const response = await api.post("/teachers", teacherData);
      return response.data;
    } catch (error) {
      console.error("Öğretmen oluşturulurken hata:", error);
      throw error;
    }
  },

  updateTeacher: async (id, teacherData) => {
    try {
      const response = await api.put(`/teachers/${id}`, teacherData);
      return response.data;
    } catch (error) {
      console.error("Öğretmen güncellenirken hata:", error);
      throw error;
    }
  },

  deleteTeacher: async (id) => {
    try {
      const response = await api.delete(`/teachers/${id}`);
      return response.data;
    } catch (error) {
      console.error("Öğretmen silinirken hata:", error);
      throw error;
    }
  },
};
