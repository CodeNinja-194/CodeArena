import { AppBar, Box, Button, Container, Typography } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomContext } from "../../utils/customContext";

// Theme imports
export const orangeTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FF7722",
    },
    background: {
      default: "#1f1e1d",
      secondary: "#FFFFFF",
    },
    text: {
      primary: "#181715",
    },
    light: {
      main: "#FFFFFF",
    },
  },

  MuiTextField: {
    styleOverrides: {
      root: {
        borderRadius: "10px",
        label: {
          color: "#FFFFFF",
        },
      },
    },
  },
});

export const blueTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2196F3",
    },
    background: {
      default: "#19202b",
    },
    text: {
      primary: "#001e3c",
      secondary: "#FFFFFF",
    },
    light: {
      main: "#FFFFFF",
    },
  },

  MuiTextField: {
    styleOverrides: {
      root: {
        borderRadius: "10px",
        label: {
          color: "#FFFFFF",
        },
      },
    },
  },
});

export const greenTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "rgb(144, 214, 208)",
    },
    background: {
      default: "#101426",
    },
    text: {
      primary: "#222B45",
      secondary: "#000",
    },
    light: {
      main: "#FFFFFF",
    },
  },

  MuiTextField: {
    styleOverrides: {
      root: {
        borderRadius: "10px",
        label: {
          color: "#FFFFFF",
        },
      },
    },
  },
});

export const yellowTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FFBA09",
    },
    background: {
      default: "#1f1e1d",
    },
    text: {
      primary: "#181715",
      secondary: "#000",
    },
    light: {
      main: "#FFFFFF",
    },
  },

  MuiTextField: {
    styleOverrides: {
      root: {
        borderRadius: "10px",
        label: {
          color: "#FFFFFF",
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#7ca8eb",
    },
    background: {
      default: "#cfd7e3",
    },
    text: {
      primary: "#001e3c",
    },
    light: {
      main: "#000",
    },
  },

  MuiTextField: {
    styleOverrides: {
      root: {
        borderRadius: "10px",
        label: {
          color: "#FFFFFF",
        },
      },
    },
  },
});

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
      </Container>
    </AppBar>
  );
}

export default Navbar;
