import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "Student", // Varsayılan rol
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basit validasyon
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      setError("Lütfen tüm alanları doldurunuz");
      setLoading(false);
      return;
    }

    try {
      // Register API isteği
      const response = await api.post("/auth/register", formData);

      if (response.status === 200) {
        alert("Kayıt başarılı! Giriş yapabilirsiniz.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError(err.response?.data || "Kayıt işlemi başarısız oldu");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Kayıt Ol
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Ad"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Soyad"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Şifre"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading}
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Rol</InputLabel>
            <Select
              name="role"
              value={formData.role}
              label="Rol"
              onChange={handleChange}
              disabled={loading}
            >
              <MenuItem value="Student">Öğrenci</MenuItem>
              <MenuItem value="Teacher">Öğretmen</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Kayıt Ol"}
          </Button>
        </form>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2">
            Zaten hesabınız var mı?{" "}
            <Link to="/login" style={{ textDecoration: "none" }}>
              Giriş Yap
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
