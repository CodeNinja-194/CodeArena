import DownloadIcon from "@mui/icons-material/CloudDownload";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Box,
  Button,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  useTheme,
} from "@mui/material";
import { useState } from "react";
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
    { lang: "python3", code: `print("Welcome to Codetantra")` },
  ]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [executing, setExecuting] = useState(false);

  const theme = useTheme(); // Get the current theme
  const isDarkTheme = theme.palette.mode === "dark";

  // Colors based on theme
  const editorBackgroundColor = "#f5f5f5";
  const textColor = "#333";
  const inputOutputBackground = "#ffffff";
  const inputOutputBorder = "#ddd";
  const dropdownBackground = "#ffffff";
  const dropdownTextColor = "#333";

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
    setOutput(""); // Clear output
    setInput(""); // Clear input
  };

  const handleAddFile = () => {
    const newFile = { lang: "python3", code: `print("Welcome to Codetantra")` };
    setFiles([...files, newFile]);
    setActiveTab(files.length);
    setInput(""); // Clear input for new file
    setOutput(""); // Clear output for new file
  };

  const handleDeleteFile = (index) => {
    if (files.length > 1) {
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      setActiveTab(Math.max(0, activeTab - 1));
      setInput(""); // Clear input after file deletion
      setOutput(""); // Clear output after file deletion
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
    return 0;
}`;
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
      setOutput(result.data?.output || result.data?.error || "Error occurred");
      setExecuting(false);
    } catch (error) {
      setOutput("Network Error or Server Down");
      setExecuting(false);
    }
  };

  const handleClear = () => {
    updateCode(""); // Reset code
    setInput(""); // Clear input
    setOutput(""); // Clear output
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
    <>
      <Box
        sx={{
          height: "100vh",
          display: "grid",
          gridTemplateRows: "auto 1fr",
          overflow: "hidden", // Prevent scrolling
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
            theme="chrome" // Light theme
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
            <Select
              value={currentFile.lang}
              onChange={(e) => updateLanguage(e.target.value)}
              disabled={executing}
              sx={{
                backgroundColor: dropdownBackground,
                color: dropdownTextColor,
                borderRadius: 1,
                marginBottom: "1rem",
                border: `1px solid ${inputOutputBorder}`,
              }}
            >
              <MenuItem value="python3">Python</MenuItem>
              <MenuItem value="c">C</MenuItem>
              <MenuItem value="cpp">C++</MenuItem>
              <MenuItem value="java">Java</MenuItem>
            </Select>

            <Button variant="contained" onClick={createRequest} startIcon={<PlayArrowRoundedIcon />} disabled={executing}>
              Run
            </Button>
            <Button variant="contained" onClick={handleClear} startIcon={<RefreshIcon />}>
              Clear
            </Button>
            <Button variant="contained" onClick={handleDownloadCode} startIcon={<DownloadIcon />}>
              Download
            </Button>

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
                border: `1px solid ${inputOutputBorder}`,
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
                border: `1px solid ${inputOutputBorder}`,
                height: "30%",
              }}
            >
              {output}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Editor;
