import { Box, Button, Container, Typography } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CustomContext } from "../../utils/customContext"; // Import context to access the theme
import "./Home.css"; // Import the CSS file

function Home() {
  const navigate = useNavigate();
  const { theme } = useContext(CustomContext); // Access the current theme

  // Function to get the light background color based on the current theme
  const getLightBackgroundColor = (themeColor) => {
    switch (themeColor) {
      case "blue":
        return "#e3f2fd"; // Light Blue background
      case "yellow":
        return "#fff9c4"; // Light Yellow background
      default:
        return "#ffe0b2"; // Default Light background (can be light orange or any other)
    }
  };

  return (
    <Box
      sx={{
        height: "100vh", // Full screen height
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: getLightBackgroundColor(theme), // Use dynamic light background color based on theme
        padding: "3rem",
        overflow: "hidden", // Prevent content overflow
      }}
    >
      <Container maxWidth="lg" sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "3rem" }}>
        {/* Left Section with Text */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "2rem",
            width: "100%",
            maxWidth: 600,
            textAlign: "center",
            zIndex: 10,
            animation: "fadeIn 1.5s ease-in-out", // Fade-in effect for text
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: "primary.main",
              fontSize: "4rem", // Increased font size
              fontWeight: 900,
              fontFamily: "poppins",
              letterSpacing: "0.05rem",
              animation: "typing 3s steps(30) 1s 1 normal both, blink-caret 0.75s step-end infinite", // Typewriter effect for the title
              whiteSpace: "nowrap",
              overflow: "hidden", // Hide text overflow
            }}
          >
            CodeArena
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "text.secondary", // Slightly muted color for contrast
              fontSize: "1.6rem",
              fontWeight: 600,
              fontFamily: "poppins",
              textAlign: "center",
              marginBottom: "3rem",
              lineHeight: 1.5,
              animation: "slideIn 2s ease-out", // Slide-in animation for the description
              letterSpacing: "0.02rem",
            }}
          >
            A seamless online compiler for coding challenges, collaborations, and learning.
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
            {/* Button to navigate to the editor */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: "primary.main",
                color: "background.paper",
                fontSize: "1.2rem",
                fontWeight: 700,
                padding: "1rem 2.5rem", // Larger padding for emphasis
                fontFamily: "poppins",
                borderRadius: "50px", // Rounded button for a soft look
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                animation: "pulse 2s infinite", // Pulse animation on the button
                "&:hover": {
                  backgroundColor: "primary.dark", // Hover effect for the button
                  boxShadow: "0 8px 16px rgba(0,0,0,0.2)", // Stronger shadow on hover
                },
              }}
              onClick={() => navigate("/editor")}
            >
              Start Coding Now
            </Button>

            {/* Button to navigate to features */}
            <Button
              variant="outlined"
              sx={{
                color: "primary.main",
                fontSize: "1.2rem",
                fontWeight: 700,
                padding: "1rem 2.5rem", // Larger padding for emphasis
                fontFamily: "poppins",
                borderRadius: "50px",
                border: "2px solid",
                animation: "pulse 2s infinite", // Pulse animation on the button
                "&:hover": {
                  borderColor: "primary.dark", // Hover effect for the button
                  color: "primary.dark",
                },
              }}
              onClick={() => navigate("/features")}
            >
              Explore Features
            </Button>
          </Box>
        </Box>

        {/* Right Section - Visual representation of online coding */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "2rem",
            zIndex: 10,
            width: "100%",
            maxWidth: 400,
            padding: "2rem",
            borderRadius: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "background.paper",
              fontWeight: 700,
              fontFamily: "poppins",
              textAlign: "center",
              marginBottom: "1.5rem",
              fontSize: "1.8rem",
            }}
          >
            Try Our Online Compiler
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontSize: "1.2rem",
              fontWeight: 600,
              lineHeight: 1.5,
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            Write, run, and test your code instantly. It's the perfect environment for learning and collaborating.
          </Typography>

          {/* Icon or graphic for the coding interface */}
          <Box
            sx={{
              width: "100%",
              height: "200px",
              background: "url('/assets/compiler-image.svg') no-repeat center center",
              backgroundSize: "contain",
              borderRadius: "8px",
            }}
          ></Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;