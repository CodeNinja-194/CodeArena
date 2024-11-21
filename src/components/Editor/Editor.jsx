import DownloadIcon from "@mui/icons-material/CloudDownload";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit"; // Edit icon for file name
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  LinearProgress,
  Radio,
  RadioGroup,
  TextField,
  Tab,
  Tabs,
  IconButton,
  useTheme,
} from "@mui/material";
import { useState, useEffect } from "react";
import AceEditor from "react-ace";
import { saveAs } from "file-saver";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-chrome"; // Light theme for Ace Editor

function Editor() {
  const [activeTab, setActiveTab] = useState(0);
  const [files, setFiles] = useState([
    { lang: "python3", code: `print("Welcome to Codetantra")`, output: "", name: "python3.py" },
  ]);
  const [input, setInput] = useState("");
  const [executing, setExecuting] = useState(false);

  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === "dark";

  const editorBackgroundColor = isDarkTheme ? "#f5f5f5" : "#ffffff";
  const textColor = "#333"; // Uniform text color
  const inputOutputBackground = "#ffffff"; // White background for non-editor fields

  const languageMap = {
    cpp: "c_cpp",
    c: "c_cpp",
    java: "java",
    python3: "python",
  };

  const currentFile = files[activeTab] || {};
  const editorLang = languageMap[currentFile.lang] || "python";

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setInput("");
  };

  const handleAddFile = () => {
    const newFile = { lang: "python3", code: `print("Welcome to Codetantra")`, output: "", name: "python3.py" };
    setFiles([...files, newFile]);
    setActiveTab(files.length);
    setInput("");
  };

  const handleDeleteFile = (index) => {
    if (files.length > 1) {
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      setActiveTab(Math.max(0, activeTab - 1));
      setInput("");
    }
  };

  const updateCode = (newCode) => {
    const updatedFiles = [...files];
    updatedFiles[activeTab].code = newCode;
    setFiles(updatedFiles);
  };

  const updateLanguage = (newLang) => {
    const updatedFiles = [...files];
    updatedFiles[activeTab].lang = newLang;
    updatedFiles[activeTab].code =
      newLang === "python3"
        ? `print("Welcome to Codetantra")`
        : newLang === "java"
        ? `import java.util.*;
class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to Codetantra");
    }
}`
        : newLang === "cpp"
        ? `#include <iostream>
using namespace std;
int main() {
    cout << "Welcome to Codetantra";
    return 0;
}`
        : `#include <stdio.h>
int main() {
    printf("Welcome to Codetantra");
    return 0}`;
    setFiles(updatedFiles);
  };

  const createRequest = async () => {
    try {
      setExecuting(true);
      const response = await fetch(
        "https://code-box.onrender.com/api/v1/submit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            src: currentFile.code,
            lang: currentFile.lang,
            stdin: input,
          }),
        }
      );
      const result = await response.json();
      const updatedFiles = [...files];
      updatedFiles[activeTab].output = result.data?.output || result.data?.error || "Error occurred";
      setFiles(updatedFiles);
      setExecuting(false);
    } catch (error) {
      const updatedFiles = [...files];
      updatedFiles[activeTab].output = "Network Error or Server Down";
      setFiles(updatedFiles);
      setExecuting(false);
    }
  };

  const handleClear = () => {
    updateCode("");
    setInput("");
    const updatedFiles = [...files];
    updatedFiles[activeTab].output = "";
    setFiles(updatedFiles);
  };

  const handleDownloadCode = () => {
    const languageArrayExtension = {
      java: "java",
      python3: "py",
      cpp: "cpp",
      c: "c",
    };
    const blob = new Blob([currentFile.code], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `code.${languageArrayExtension[currentFile.lang]}`);
  };

  const handleKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      createRequest();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [files, activeTab]);

  // Function to update the file name
  const handleEditFileName = (index) => {
    const newFileName = prompt("Enter new file name", files[index].name);
    if (newFileName) {
      const updatedFiles = [...files];
      updatedFiles[index].name = newFileName;
      setFiles(updatedFiles);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: inputOutputBackground,
        display: "grid",
        gridTemplateRows: "auto 1fr",
        overflow: "hidden",
      }}
    >
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ minHeight: "36px" }} // Reduced height of tabs
      >
        {files.map((file, index) => (
          <Tab
            key={index}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <span style={{ fontSize: "14px" }}>{file.name}</span>
                <IconButton
                  size="small"
                  onClick={() => handleEditFileName(index)} // Edit file name on click
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
              </Box>
            }
            onDoubleClick={() => handleDeleteFile(index)}
            sx={{
              fontSize: "14px", // Reduced font size for file name
              padding: "4px 8px", // Smaller padding for the tab
            }}
          />
        ))}
        <Button onClick={handleAddFile} sx={{ minWidth: "2rem", color: "primary.main" }}>
          +
        </Button>
      </Tabs>

      <Box sx={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 2 }}>
        <AceEditor
          mode={editorLang}
          theme="chrome"
          name={`editor-${activeTab}`}
          onChange={updateCode}
          value={currentFile.code}
          fontSize={16}
          style={{
            height: "calc(100vh - 48px)",
            width: "100%",
            backgroundColor: editorBackgroundColor,
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            height: "calc(100vh - 48px)",
            overflowY: "auto",
          }}
        >
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ color: textColor }}>
              Language
            </FormLabel>
            <RadioGroup
              row
              value={currentFile.lang}
              onChange={(e) => updateLanguage(e.target.value)}
            >
              <FormControlLabel value="python3" control={<Radio />} label="Python" />
              <FormControlLabel value="c" control={<Radio />} label="C" />
              <FormControlLabel value="cpp" control={<Radio />} label="C++" />
              <FormControlLabel value="java" control={<Radio />} label="Java" />
            </RadioGroup>
          </FormControl>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Button
              variant="contained"
              onClick={createRequest}
              startIcon={<PlayArrowRoundedIcon />}
              disabled={executing}
              size="small"
              sx={{
                backgroundColor: "#4caf50", // Green background for 'Run'
                "&:hover": { backgroundColor: "#45a049" },
              }}
            >
              Run
            </Button>

            <Button
              variant="outlined"
              onClick={handleClear}
              startIcon={<RefreshIcon />}
              size="small"
              sx={{
                color: "#f44336", // Red color for clear
                borderColor: "#f44336",
                "&:hover": { borderColor: "#d32f2f" },
              }}
            >
              Clear
            </Button>

            <Button
              variant="outlined"
              onClick={handleDownloadCode}
              startIcon={<DownloadIcon />}
              size="small"
              sx={{
                color: "#1976d2", // Blue color for download
                borderColor: "#1976d2",
                "&:hover": { borderColor: "#1565c0" },
              }}
            >
              Download
            </Button>
          </Box>

          {executing && <LinearProgress />}
          
          {/* Input Box */}
          <Box
            sx={{
              border: "1px solid #ddd",
              padding: "8px",
              borderRadius: "4px",
              height: "150px",
              overflowY: "auto",
              backgroundColor: "#fff",
            }}
          >
            <TextField
              label="Input"
              multiline
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              minRows={4}
              sx={{
                border: "none",
                "& .MuiOutlinedInput-root": {
                  padding: 0,
                },
              }}
            />
          </Box>

          {/* Output Box */}
          <Box
            sx={{
              border: "1px solid #ddd",
              padding: "8px",
              borderRadius: "4px",
              height: "150px",
              overflowY: "auto",
              backgroundColor: "#fff",
            }}
          >
            <TextField
              label="Output"
              multiline
              fullWidth
              value={currentFile.output}
              disabled
              minRows={4}
              sx={{
                border: "none",
                "& .MuiOutlinedInput-root": {
                  padding: 0,
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Editor;
