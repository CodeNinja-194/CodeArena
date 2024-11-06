import CircleIcon from "@mui/icons-material/Circle";
import { AppBar, Box, Button, Container, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomContext } from "../../utils/customContext";
import { blueTheme, greenTheme, orangeTheme, yellowTheme } from "../../utils/cutomTheme";
import "./Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useContext(CustomContext);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Function to get the circle color based on the current theme
  const getCircleColor = (themeColor) => {
    switch (themeColor) {
      case blueTheme:
        return "#42a5f5"; // Blue
      case greenTheme:
        return "#66bb6a"; // Green
      case orangeTheme:
        return "#ff7043"; // Orange
      case yellowTheme:
        return "#ffeb3b"; // Yellow
      default:
        return "#fff"; // Default color
    }
  };

  return (
    <AppBar position="static" className="navbar-container">
      <Container className="navbar-content" maxWidth="xl">
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          className="navbar-logo"
        >
          CodeArena
        </Typography>

        {/* Left Section - Home & Editor Links */}
        <Box className="navbar-links">
          <Button
            onClick={() => navigate("/")}
            className="navbar-button"
          >
            Home
          </Button>
          <Button
            onClick={() => navigate("/editor")}
            className="navbar-button"
          >
            Editor
          </Button>
        </Box>

        {/* Right Section - Theme Switcher */}
        <Box className="navbar-theme-switcher">
          <CircleIcon
            onClick={() => setTheme(orangeTheme)}
            className="navbar-icon"
            style={{ color: getCircleColor(orangeTheme) }}
          />
          <CircleIcon
            onClick={() => setTheme(greenTheme)}
            className="navbar-icon"
            style={{ color: getCircleColor(greenTheme) }}
          />
          <CircleIcon
            onClick={() => setTheme(blueTheme)}
            className="navbar-icon"
            style={{ color: getCircleColor(blueTheme) }}
          />
          <CircleIcon
            onClick={() => setTheme(yellowTheme)}
            className="navbar-icon"
            style={{ color: getCircleColor(yellowTheme) }}
          />
        </Box>

        {/* Hamburger Menu for Mobile */}
        <div className={`navbar-hamburger ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </Container>
    </AppBar>
  );
}

export default Navbar;