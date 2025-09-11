import React, { useState } from "react";
import {
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  List as ListIcon,
  BarChart as StatsIcon,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import TeacherListModal from "../../components/teachers/TeacherListModal";
import TeacherCreateModal from "../../components/teachers/TeacherCreateModal";
import TeacherEditModal from "../../components/teachers/TeacherEditModal";

const Teachers = () => {
  const { user } = useAuth();
  const [listModalOpen, setListModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Yetki kontrolü
  if (user?.role !== "Admin") {
    return (
      <Box>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            🚫 Erişim Engellendi
          </Typography>
          <Alert severity="error">
            Bu sayfaya yalnızca Admin kullanıcıları erişebilir.
          </Alert>
        </Paper>
      </Box>
    );
  }

  const handleEditTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setEditModalOpen(true);
  };

  const handleCreateTeacher = (newTeacher) => {
    setRefreshKey((prev) => prev + 1); // Liste yenilensin
  };

  const handleUpdateTeacher = (updatedTeacher) => {
    setRefreshKey((prev) => prev + 1); // Liste yenilensin
  };

  const handleDeleteTeacher = (deletedTeacher) => {
    setRefreshKey((prev) => prev + 1); // Liste yenilensin
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          👨‍🏫 Öğretmen Yönetimi
        </Typography>
        <Typography color="textSecondary">
          Öğretmenleri görüntüleme, ekleme ve yönetme işlemleri
        </Typography>
        <Chip
          label="Sadece Admin Erişebilir"
          color="primary"
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📋 Tüm Öğretmenler
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Sistemdeki tüm öğretmenleri listele ve yönet
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<ListIcon />}
                onClick={() => setListModalOpen(true)}
                fullWidth
              >
                Öğretmenleri Listele
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ➕ Yeni Öğretmen
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Sisteme yeni öğretmen ekle
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setCreateModalOpen(true)}
                fullWidth
              >
                Öğretmen Ekle
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 İstatistikler
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Öğretmen performans istatistikleri
              </Typography>
              <Button
                variant="outlined"
                size="small"
                color="secondary"
                startIcon={<StatsIcon />}
                disabled
                fullWidth
              >
                İstatistikleri Gör
              </Button>
              <Typography
                variant="caption"
                display="block"
                sx={{ mt: 1, color: "text.secondary" }}
              >
                * Yakında geliyor...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          🔧 Öğretmen Yönetimi Özellikleri
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              ✅ Öğretmen listeleme ve görüntüleme
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ✅ Yeni öğretmen ekleme
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ✅ Öğretmen bilgilerini güncelleme
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              ✅ Öğretmen silme (Admin yetkisi)
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ✅ Branş bazında filtreleme
            </Typography>
            <Typography variant="body2" color="textSecondary">
              🚧 İstatistik ve raporlama (yapım aşamasında)
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Modal Components */}
      <TeacherListModal
        key={refreshKey}
        open={listModalOpen}
        onClose={() => setListModalOpen(false)}
        onEdit={handleEditTeacher}
        onDelete={handleDeleteTeacher}
      />

      <TeacherCreateModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateTeacher}
      />

      <TeacherEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        teacher={selectedTeacher}
        onSave={handleUpdateTeacher}
      />
    </Box>
  );
};

export default Teachers;
