import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  LinearProgress,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  TextField,
  useTheme,
  Switch,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/CloudDownload";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import RefreshIcon from "@mui/icons-material/Refresh";
import AceEditor from "react-ace";
import { saveAs } from "file-saver";
import { useSnackbar } from "notistack";

// Ace Mode Imports
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-chrome"; // Light theme

function Editor() {
  const { enqueueSnackbar } = useSnackbar(); // For snackbar notifications

  const [activeTab, setActiveTab] = useState(0);
  const [files, setFiles] = useState([]);
  const [input, setInput] = useState("");
  const [executing, setExecuting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16); // Default font size

  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === "dark";

  const languageMap = {
    cpp: "c_cpp",
    c: "c_cpp",
    java: "java",
    python3: "python",
    javascript: "javascript", // Added JavaScript
  };

  const defaultFile = {
    lang: "python3",
    code: `print("Welcome to Codetantra")`,
    output: "",
  };

  const currentFile = files[activeTab] || defaultFile;
  const editorLang = languageMap[currentFile.lang] || "python";

  useEffect(() => {
    const savedFiles = localStorage.getItem("files");
    const savedInput = localStorage.getItem("input");
    const savedTheme = localStorage.getItem("isDarkMode");
    const savedFontSize = localStorage.getItem("fontSize");

    if (savedFiles) {
      setFiles(JSON.parse(savedFiles));
    } else {
      setFiles([defaultFile]);
    }
    if (savedInput) {
      setInput(savedInput);
    }
    if (savedTheme) {
      setIsDarkMode(JSON.parse(savedTheme));
    }
    if (savedFontSize) {
      setFontSize(Number(savedFontSize));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("files", JSON.stringify(files));
    localStorage.setItem("input", input);
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
    localStorage.setItem("fontSize", fontSize);
  }, [files, input, isDarkMode, fontSize]);

  // Auto Save functionality
  useEffect(() => {
    const autoSave = setInterval(() => {
      localStorage.setItem("files", JSON.stringify(files));
      localStorage.setItem("input", input);
    }, 10000); // Auto save every 10 seconds

    return () => clearInterval(autoSave); // Clear interval on unmount
  }, [files, input]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setInput("");
  };

  const handleAddFile = () => {
    const newFile = { ...defaultFile };
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
        ? `class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to Codetantra");
    }
}`
        : newLang === "javascript"
        ? `console.log("Welcome to Codetantra");`
        : `#include <iostream>
using namespace std;
int main() {
    cout << "Welcome to Codetantra";
    return 0;
}`;
    setFiles(updatedFiles);
  };

  const createRequest = async () => {
    try {
      setExecuting(true);
      const response = await fetch("https://code-box.onrender.com/api/v1/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          src: currentFile.code,
          lang: currentFile.lang,
          stdin: input,
        }),
      });
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
      javascript: "js", // Added JavaScript
    };
    const blob = new Blob([currentFile.code], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `code.${languageArrayExtension[currentFile.lang]}`);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const changeFontSize = (size) => {
    setFontSize(size);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: isDarkMode ? "#121212" : "#f5f5f5",
        display: "grid",
        gridTemplateRows: "auto 1fr",
        overflow: "hidden",
      }}
    >
      <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
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

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
        <Button variant="contained" onClick={createRequest} disabled={executing} startIcon={<PlayArrowRoundedIcon />}>
          Run Code
        </Button>
        <Button onClick={handleClear} variant="outlined" startIcon={<RefreshIcon />}>
          Clear
        </Button>
        <Button onClick={handleDownloadCode} variant="outlined" startIcon={<DownloadIcon />}>
          Download Code
        </Button>

        <FormControlLabel
          control={<Switch checked={isDarkMode} onChange={toggleTheme} />}
          label="Dark Mode"
        />

        <FormControl sx={{ ml: 2 }}>
          <FormLabel>Font Size</FormLabel>
          <RadioGroup value={fontSize} onChange={(e) => changeFontSize(e.target.value)}>
            <FormControlLabel value={12} control={<Radio />} label="12px" />
            <FormControlLabel value={16} control={<Radio />} label="16px" />
            <FormControlLabel value={20} control={<Radio />} label="20px" />
          </RadioGroup>
        </FormControl>
      </Box>

      <AceEditor
        mode={editorLang}
        theme={isDarkMode ? "monokai" : "chrome"}
        onChange={updateCode}
        value={currentFile.code}
        name="code-editor"
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          fontSize: fontSize,
          showLineNumbers: true,
        }}
      />

      <Box sx={{ overflowY: "auto", p: 2, maxHeight: "calc(100vh - 230px)", backgroundColor: "#f5f5f5" }}>
        {executing ? (
          <LinearProgress />
        ) : (
          <TextField
            value={currentFile.output}
            fullWidth
            variant="outlined"
            multiline
            rows={12}
            readOnly
            sx={{ bgcolor: "#f5f5f5" }}
          />
        )}
      </Box>
    </Box>
  );
}

export default Editor;
