import DownloadIcon from "@mui/icons-material/CloudDownload";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import RefreshIcon from "@mui/icons-material/Refresh";
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
  InputLabel,
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
  const [files, setFiles] = useState([]);
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

  // Load the state from localStorage on mount
  useEffect(() => {
    const savedFiles = localStorage.getItem("files");
    const savedInput = localStorage.getItem("input");
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles));
    } else {
      // Default file
      setFiles([{ lang: "python3", code: `print("Welcome to Codetantra")`, output: "" }]);
    }
    if (savedInput) {
      setInput(savedInput);
    }
  }, []);

  // Save the state to localStorage whenever files or input changes
  useEffect(() => {
    localStorage.setItem("files", JSON.stringify(files));
    localStorage.setItem("input", input);
  }, [files, input]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setInput(""); // Reset input field when switching files
  };

  const handleAddFile = () => {
    const newFile = { lang: "python3", code: `print("Welcome to Codetantra")`, output: "" };
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
      >
        {files.map((file, index) => (
          <Tab
            key={index}
            label={`File ${index + 1}`}
            onDoubleClick={() => handleDeleteFile(index)}
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
                "&:hover": {
                  backgroundColor: "#388e3c", // Darker green on hover
                },
              }}
            >
              Run
            </Button>
            <Button
              variant="contained"
              onClick={handleClear}
              startIcon={<RefreshIcon />}
              size="small"
              sx={{
                backgroundColor: "#ff9800", // Orange background for 'Clear'
                "&:hover": {
                  backgroundColor: "#f57c00", // Darker orange on hover
                },
              }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              onClick={handleDownloadCode}
              startIcon={<DownloadIcon />}
              size="small"
              sx={{
                backgroundColor: "#2196f3", // Blue background for 'Download'
                "&:hover": {
                  backgroundColor: "#1976d2", // Darker blue on hover
                },
              }}
            >
              Download
            </Button>
          </Box>

          {executing && <LinearProgress />}

          <InputLabel sx={{ color: textColor }}>Input</InputLabel>
          <TextField
            multiline
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            variant="outlined"
            sx={{
              backgroundColor: inputOutputBackground,
              color: textColor,
              borderRadius: 1,
              border: `1px solid #ccc`,
            }}
          />

          <InputLabel sx={{ color: textColor }}>Output</InputLabel>
          <Box
            sx={{
              backgroundColor: inputOutputBackground,
              color: textColor,
              padding: 2,
              overflowY: "auto",
              whiteSpace: "pre-line",
              borderRadius: 1,
              border: `1px solid #ccc`,
              height: "30%",
            }}
          >
            {currentFile.output}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Editor;
