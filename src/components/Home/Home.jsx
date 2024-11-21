import { Box, Button, Container, Typography } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CustomContext } from "../../utils/customContext";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const { theme, isDarkMode } = useContext(CustomContext);

  // Light background color logic
  const getLightBackgroundColor = () => {
    return isDarkMode ? "#2c2c2c" : "#f9f9f9"; // Dark gray for dark mode, very light gray for light mode
  };

  const getCardBackgroundColor = () => {
    return isDarkMode ? "#3c3c3c" : "#ffffff"; // Slightly darker gray for cards in dark mode, pure white for light mode
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: getLightBackgroundColor(),
        padding: "3rem",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: "2rem",
          textAlign: "center",
        }}
      >
        {/* Left Section */}
        <Box
          sx={{
            maxWidth: "600px",
            textAlign: { xs: "center", md: "left" },
            animation: "fadeIn 1.5s ease-in-out",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: isDarkMode ? "#f9f9f9" : "#333",
              fontSize: "3rem",
              fontWeight: 900,
              fontFamily: "Poppins, sans-serif",
              marginBottom: "1rem",
            }}
          >
            CodeArena
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: isDarkMode ? "#dcdcdc" : "#555",
              fontSize: "1.2rem",
              fontWeight: 500,
              fontFamily: "Poppins, sans-serif",
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          >
            Discover the ultimate online coding platform for seamless learning,
            collaboration, and innovation.
          </Typography>

          <Box sx={{ display: "flex", gap: "1rem", justifyContent: { xs: "center", md: "flex-start" } }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: isDarkMode ? "#42a5f5" : "#4caf50",
                color: "#fff",
                padding: "0.75rem 2rem",
                borderRadius: "25px",
                fontSize: "1rem",
                fontWeight: 600,
                fontFamily: "Poppins, sans-serif",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: isDarkMode ? "#1e88e5" : "#388e3c",
                },
              }}
              onClick={() => navigate("/editor")}
            >
              Start Coding
            </Button>

            <Button
              variant="outlined"
              sx={{
                borderColor: isDarkMode ? "#42a5f5" : "#4caf50",
                color: isDarkMode ? "#42a5f5" : "#4caf50",
                padding: "0.75rem 2rem",
                borderRadius: "25px",
                fontSize: "1rem",
                fontWeight: 600,
                fontFamily: "Poppins, sans-serif",
                textTransform: "none",
                "&:hover": {
                  borderColor: isDarkMode ? "#1e88e5" : "#388e3c",
                  color: isDarkMode ? "#1e88e5" : "#388e3c",
                },
              }}
              onClick={() => navigate("/features")}
            >
              Explore Features
            </Button>
          </Box>
        </Box>

        {/* Right Section */}
        <Box
          sx={{
            maxWidth: "400px",
            width: "100%",
            padding: "2rem",
            borderRadius: "16px",
            backgroundColor: getCardBackgroundColor(),
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "1.5rem",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: isDarkMode ? "#f9f9f9" : "#333",
              fontWeight: 700,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Try Our Online Compiler
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: isDarkMode ? "#dcdcdc" : "#555",
              fontSize: "1rem",
              fontFamily: "Poppins, sans-serif",
              lineHeight: 1.6,
            }}
          >
            Instantly write, run, and debug code. Perfect for learners and professionals alike.
          </Typography>

          {/* Placeholder Image or Graphic */}
          <Box
            sx={{
              width: "100%",
              height: "150px",
              background: "url('/assets/compiler-image.svg') no-repeat center center",
              backgroundSize: "contain",
            }}
          ></Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;
