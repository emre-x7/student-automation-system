import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Book as BookIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
      roles: ["Admin", "Teacher", "Student"],
    },
    {
      text: "Öğrenciler",
      icon: <PeopleIcon />,
      path: "/students",
      roles: ["Admin", "Teacher"],
    },
    {
      text: "Öğretmenler",
      icon: <SchoolIcon />,
      path: "/teachers",
      roles: ["Admin"],
    },
    {
      text: "Dersler",
      icon: <BookIcon />,
      path: "/courses",
      roles: ["Admin", "Teacher"],
    },
    {
      text: "Not İşlemleri",
      icon: <GradeIcon />,
      path: "/grades",
      roles: ["Teacher"],
    },
    {
      text: "Notlarım",
      icon: <AssignmentIcon />,
      path: "/my-grades",
      roles: ["Student"],
    },

    {
      text: "Profilim",
      icon: <PersonIcon />,
      path: "/student-profile",
      roles: ["Student"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          top: "64px",
          height: "calc(100vh - 64px)",
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#e3f2fd",
                  color: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#bbdefb",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    location.pathname === item.path ? "#1976d2" : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight:
                    location.pathname === item.path ? "bold" : "normal",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
