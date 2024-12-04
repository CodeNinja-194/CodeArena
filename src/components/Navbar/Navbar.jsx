import Brightness4Icon from "@mui/icons-material/Brightness4"; // Dark mode icon
import Brightness7Icon from "@mui/icons-material/Brightness7"; // Light mode icon
import { AppBar, Box, Button, Container, IconButton, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomContext } from "../../utils/customContext";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, setIsDarkMode, isAuthenticated, user } = useContext(CustomContext);

  // Dynamic Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Toggle Menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Toggle Dark Mode
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <AppBar
      position="static"
      className="menu-slide"
      sx={{
        backgroundColor: isDarkMode ? "#333" : "#f9f9f9",
        boxShadow: "none",
        height: "48px",
        justifyContent: "center",
        color: isDarkMode ? "#f9f9f9" : "#333",
        transition: "transform 0.3s ease-in-out", // .menu-slide inline
      }}
    >
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 1rem",
        }}
      >
        {/* Logo */}
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            color: isDarkMode ? "#f9f9f9" : "#333",
            textDecoration: "none",
          }}
        >
          CodeArena
        </Typography>

        {/* Dynamic Greeting */}
        <Typography
          sx={{
            display: { xs: "none", md: "block" },
            color: isDarkMode ? "#f9f9f9" : "#333",
            marginRight: "auto",
            marginLeft: "1rem",
          }}
        >
          {`${getGreeting()}, ${isAuthenticated ? user?.name || "User" : "Guest"}!`}
        </Typography>

        {/* Links */}
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <Button
            onClick={() => navigate("/")}
            sx={{
              color: isDarkMode ? "#f9f9f9" : "#333",
              textTransform: "none",
              fontWeight: "500",
            }}
          >
            Home
          </Button>
          <Button
            onClick={() => navigate("/editor")}
            sx={{
              color: isDarkMode ? "#f9f9f9" : "#333",
              textTransform: "none",
              fontWeight: "500",
            }}
          >
            Editor
          </Button>
        </Box>

        {/* Dark Mode Toggle */}
        <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <IconButton
            onClick={toggleDarkMode}
            className="dark-mode-toggle"
            sx={{
              color: isDarkMode ? "#f9f9f9" : "#333",
              transition: "background-color 0.3s ease", // .dark-mode-toggle inline
            }}
          >
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Container>
    </AppBar>
  );
}

export default Navbar;
