import React from "react";
import { Typography, Box, Paper, Grid, Card, CardContent } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="h6">
          Hoş geldiniz, {user?.firstName} {user?.lastName}!
        </Typography>
        <Typography color="textSecondary">
          Rolünüz: {user?.role} (DEBUG: {typeof user?.role})
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* ADMIN PANEL */}
        {user?.role === "Admin" && (
          <>
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📊 Öğrenci Yönetimi
                  </Typography>
                  <Typography>Tüm öğrencileri görüntüle ve yönet</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    👨‍🏫 Öğretmen Yönetimi
                  </Typography>
                  <Typography>Öğretmenleri görüntüle ve yönet</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📚 Ders Yönetimi
                  </Typography>
                  <Typography>Dersleri oluştur ve yönet</Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {/* TEACHER PANEL */}
        {user?.role === "Teacher" && (
          <>
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📝 Derslerim
                  </Typography>
                  <Typography>Verdiğim dersleri görüntüle</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🎯 Not Girişi
                  </Typography>
                  <Typography>Öğrenci notlarını gir ve güncelle</Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {/* STUDENT PANEL */}
        {user?.role === "Student" && (
          <>
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📖 Notlarım
                  </Typography>
                  <Typography>Ders notlarımı görüntüle</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📅 Devamsızlık
                  </Typography>
                  <Typography>Devamsızlık bilgilerimi görüntüle</Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
