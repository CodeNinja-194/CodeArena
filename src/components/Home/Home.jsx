import { Box, Button, Container, Typography, Grid } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CustomContext } from "../../utils/customContext";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const { theme, isDarkMode } = useContext(CustomContext);

  // Light background color logic
  const getLightBackgroundColor = () => {
    return isDarkMode ? "#2c2c2c" : "#f9f9f9";
  };

  // Dynamic Greeting Logic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Dynamic Tagline
  const getTagline = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Start your day with powerful coding tools.";
    if (hour < 18) return "Boost your afternoon with seamless collaboration.";
    return "End your day by exploring new coding horizons.";
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
          gap: "3rem",
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
          {/* Dynamic Greeting */}
          <Typography
            variant="h6"
            sx={{
              color: isDarkMode ? "#dcdcdc" : "#555",
              fontSize: "1.2rem",
              fontWeight: 500,
              fontFamily: "Poppins, sans-serif",
              marginBottom: "0.5rem",
            }}
          >
            {`${getGreeting()}, Guest!`}
          </Typography>

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
            {getTagline()}
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

        {/* Right Section - Feature Boxes */}
        <Grid container spacing={3} sx={{ maxWidth: "600px" }}>
          {/* Feature 1 */}
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                padding: "2rem",
                borderRadius: "16px",
                backgroundColor: isDarkMode ? "#3c3c3c" : "#ffffff",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: isDarkMode ? "#f9f9f9" : "#333",
                  fontWeight: 600,
                  marginBottom: "1rem",
                }}
              >
                Real-time Collaboration
              </Typography>
              <Typography
                sx={{
                  color: isDarkMode ? "#dcdcdc" : "#555",
                  fontSize: "1rem",
                  lineHeight: 1.6,
                }}
              >
                Work together in real time on code with your team, making collaboration smooth.
              </Typography>
            </Box>
          </Grid>

          {/* Feature 2 */}
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                padding: "2rem",
                borderRadius: "16px",
                backgroundColor: isDarkMode ? "#3c3c3c" : "#ffffff",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: isDarkMode ? "#f9f9f9" : "#333",
                  fontWeight: 600,
                  marginBottom: "1rem",
                }}
              >
                Live Code Preview
              </Typography>
              <Typography
                sx={{
                  color: isDarkMode ? "#dcdcdc" : "#555",
                  fontSize: "1rem",
                  lineHeight: 1.6,
                }}
              >
                See changes instantly with live previews while you code.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;
