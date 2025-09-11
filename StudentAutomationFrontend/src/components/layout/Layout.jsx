import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🎓 Öğrenci Otomasyon Sistemi
          </Typography>

          {user && (
            <>
              <Typography variant="body1" sx={{ mr: 2 }}>
                {user.firstName} {user.lastName} ({user.role})
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Çıkış Yap
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {user && <Sidebar />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "64px",
          ml: user ? "240px" : "0px",
          width: user ? "calc(100% - 240px)" : "100%",
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "#fafafa",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
