import Brightness4Icon from "@mui/icons-material/Brightness4"; // Dark mode icon
import Brightness7Icon from "@mui/icons-material/Brightness7"; // Light mode icon
import { AppBar, Box, Button, Container, IconButton, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomContext } from "../../utils/customContext";
import "./Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme, isDarkMode, setIsDarkMode } = useContext(CustomContext);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode); // Toggle dark mode state

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: isDarkMode ? "#333" : "#f9f9f9", // Dark/Light mode background
        boxShadow: "none",
        height: "48px", // Thinner Navbar
        justifyContent: "center",
        color: isDarkMode ? "#f9f9f9" : "#333", // Adjust text color
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
          {/* Dark Mode Toggle */}
          <IconButton onClick={toggleDarkMode} sx={{ color: isDarkMode ? "#f9f9f9" : "#333" }}>
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Container>
    </AppBar>
  );
}

export default Navbar;
