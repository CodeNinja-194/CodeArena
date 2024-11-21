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
  const [files, setFiles] = useState([
    { lang: "python3", code: `print("Welcome to Codetantra")`, output: "", name: "python3.py" },
  ]);
  const [input, setInput] = useState("");
  const [executing, setExecuting] = useState(false);
  const [editingFileName, setEditingFileName] = useState(null);
  const [newFileName, setNewFileName] = useState("");

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

  const languageExtension = {
    python3: "py",
    cpp: "cpp",
    java: "java",
    c: "c",
  };

  const currentFile = files[activeTab] || {};
  const editorLang = languageMap[currentFile.lang] || "python";

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setInput("");
  };

  const handleAddFile = () => {
    const newLang = "python3"; // Default language
    const newFileName = `${newLang}.${languageExtension[newLang]}`;
    const newFile = { lang: newLang, code: `print("Welcome to Codetantra")`, output: "", name: newFileName };
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
    
    // Renaming the file based on the language
    updatedFiles[activeTab].name = `${newLang}.${languageExtension[newLang]}`;
    setFiles(updatedFiles);
  };

  const handleRenameFile = (index) => {
    setEditingFileName(index);
    setNewFileName(files[index].name); // Set the current name for editing
  };

  const saveFileName = (index) => {
    const updatedFiles = [...files];
    updatedFiles[index].name = newFileName;
    setFiles(updatedFiles);
    setEditingFileName(null);
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
    const blob = new Blob([currentFile.code], { type: "text/plain;charset=utf-8" });
    saveAs(blob, currentFile.name);
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
            label={
              editingFileName === index ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    size="small"
                    sx={{ width: "100px" }}
                  />
                  <Button onClick={() => saveFileName(index)}>Save</Button>
                </Box>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {file.name}
                  <Button onClick={() => handleRenameFile(index)}>✏️</Button>
                </Box>
              )
            }
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
                backgroundColor: "#1976d2", // Blue color for download
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              Download
            </Button>
          </Box>

          {executing && <LinearProgress />}
          
          {/* Changed Input and Output Fields */}
          <TextField
            label="Input"
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            sx={{ backgroundColor: "#f5f5f5" }}
          />
          <TextField
            label="Output"
            variant="outlined"
            value={currentFile.output}
            disabled
            sx={{
              backgroundColor: "#f5f5f5",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Editor;
