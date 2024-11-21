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
} from "@mui/material";
import { useEffect, useState } from "react";
import AceEditor from "react-ace";
import { saveAs } from "file-saver";

import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-dracula";

function Editor() {
  const [activeTab, setActiveTab] = useState(0); // Track the active tab
  const [files, setFiles] = useState([
    { lang: "python3", code: `print("Welcome to Codetantra")` },
  ]); // Default file
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [executing, setExecuting] = useState(false);

  // Editor language mapping
  const languageMap = {
    cpp: "c_cpp",
    c: "c_cpp",
    java: "java",
    python3: "python",
  };

  // Get the current file
  const currentFile = files[activeTab] || {};
  const editorLang = languageMap[currentFile.lang] || "python";

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setOutput(""); // Clear output when switching tabs
  };

  // Add a new file
  const handleAddFile = () => {
    setFiles([
      ...files,
      { lang: "python3", code: `print("Welcome to Codetantra")` }, // Default Python code
    ]);
    setActiveTab(files.length); // Switch to the newly added tab
  };

  // Delete a file
  const handleDeleteFile = (index) => {
    if (files.length > 1) {
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      setActiveTab(Math.max(0, activeTab - 1)); // Adjust active tab
    }
  };

  // Update code for the current tab
  const updateCode = (newCode) => {
    const updatedFiles = [...files];
    updatedFiles[activeTab].code = newCode;
    setFiles(updatedFiles);
  };

  // Update language for the current tab
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
}`; // Reset code based on language
    setFiles(updatedFiles);
  };

  // Run the code
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

  // Clear the editor and output
  const handleClear = () => {
    updateCode("");
    setInput("");
    setOutput("");
  };

  // Download the code
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
      <Box sx={{ height: "100vh", display: "grid", gridTemplateRows: "auto 1fr" }}>
        {/* Tabs for switching between files */}
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
              onDoubleClick={() => handleDeleteFile(index)} // Delete on double-click
            />
          ))}
          <Button
            onClick={handleAddFile}
            sx={{ minWidth: "2rem", color: "primary.main" }}
          >
            +
          </Button>
        </Tabs>

        {/* Main Editor and Controls */}
        <Box sx={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 2 }}>
          {/* Editor */}
          <AceEditor
            mode={editorLang}
            theme="dracula"
            name={`editor-${activeTab}`}
            onChange={updateCode}
            value={currentFile.code}
            fontSize={16}
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
            }}
            style={{ height: "calc(100vh - 48px)", width: "100%" }}
          />

          {/* Sidebar with controls */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Language Selector */}
            <Select
              value={currentFile.lang}
              onChange={(e) => updateLanguage(e.target.value)}
              disabled={executing}
            >
              <MenuItem value="python3">Python</MenuItem>
              <MenuItem value="c">C</MenuItem>
              <MenuItem value="cpp">C++</MenuItem>
              <MenuItem value="java">Java</MenuItem>
            </Select>

            {/* Buttons */}
            <Button
              variant="contained"
              onClick={createRequest}
              startIcon={<PlayArrowRoundedIcon />}
              disabled={executing}
            >
              Run
            </Button>
            <Button variant="contained" onClick={handleClear} startIcon={<RefreshIcon />}>
              Clear
            </Button>
            <Button
              variant="contained"
              onClick={handleDownloadCode}
              startIcon={<DownloadIcon />}
            >
              Download
            </Button>

            {/* Execution Status */}
            {executing && <LinearProgress />}

            {/* Input */}
            <InputLabel>Input</InputLabel>
            <TextField
              multiline
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={5}
              variant="outlined"
              sx={{ backgroundColor: "#272822", color: "white" }}
            />

            {/* Output */}
            <InputLabel>Output</InputLabel>
            <Box
              sx={{
                backgroundColor: "#272822",
                color: "white",
                padding: 2,
                overflowY: "auto",
                whiteSpace: "pre-line",
                borderRadius: 1,
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
