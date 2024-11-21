import CircleIcon from "@mui/icons-material/Circle";
import { AppBar, Box, Button, Container, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomContext } from "../../utils/customContext";
import { greenTheme, orangeTheme, yellowTheme } from "../../utils/cutomTheme";
import "./Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useContext(CustomContext);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Function to get the circle color based on the current theme
  const getCircleColor = (themeColor) => {
    switch (themeColor) {
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
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#f9f9f9", // Light background color
        boxShadow: "none",
        height: "48px", // Make Navbar thinner
        justifyContent: "center",
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
            color: "#333",
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
              color: "#333",
              textTransform: "none",
              fontWeight: "500",
            }}
          >
            Home
          </Button>
          <Button
            onClick={() => navigate("/editor")}
            sx={{
              color: "#333",
              textTransform: "none",
              fontWeight: "500",
            }}
          >
            Editor
          </Button>
        </Box>

        {/* Theme Switcher */}
        <Box sx={{ display: "flex", gap: "0.5rem" }}>
          <CircleIcon
            onClick={() => setTheme(orangeTheme)}
            sx={{
              color: getCircleColor(orangeTheme),
              cursor: "pointer",
            }}
          />
          <CircleIcon
            onClick={() => setTheme(greenTheme)}
            sx={{
              color: getCircleColor(greenTheme),
              cursor: "pointer",
            }}
          />
          <CircleIcon
            onClick={() => setTheme(yellowTheme)}
            sx={{
              color: getCircleColor(yellowTheme),
              cursor: "pointer",
            }}
          />
        </Box>
      </Container>
    </AppBar>
  );
}

export default Navbar;
