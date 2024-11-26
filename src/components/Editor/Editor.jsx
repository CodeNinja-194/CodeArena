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
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/CloudDownload";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import RefreshIcon from "@mui/icons-material/Refresh";
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
  const textColor = "#333";
  const inputOutputBackground = "#ffffff";

  const languageMap = {
    cpp: "c_cpp",
    c: "c_cpp",
    java: "java",
    python3: "python",
  };

  const defaultFile = {
    lang: "python3",
    code: `print("Welcome to Codetantra")`,
    output: "",
  };

  const currentFile = files[activeTab] || defaultFile;
  const editorLang = languageMap[currentFile.lang] || "python";

  // Code Snippets for each language
  const codeSnippets = {
    python: [
      { caption: "print", value: "print()", description: "Python print statement" },
      { caption: "for loop", value: "for i in range():\n    pass", description: "Python for loop" },
      { caption: "def function", value: "def function_name():\n    pass", description: "Python function" },
      { caption: "if statement", value: "if condition:\n    pass", description: "Python if statement" },
    ],
    java: [
      { caption: "System.out.println", value: "System.out.println();", description: "Java print" },
      { caption: "for loop", value: "for (int i = 0; i < n; i++) {\n    // your code\n}", description: "Java for loop" },
      { caption: "public class", value: "public class ClassName {\n    public static void main(String[] args) {\n        // your code\n    }\n}", description: "Java class template" },
    ],
    cpp: [
      { caption: "cout", value: "cout << \"\";", description: "C++ print statement" },
      { caption: "for loop", value: "for (int i = 0; i < n; i++) {\n    // your code\n}", description: "C++ for loop" },
      { caption: "int main", value: "int main() {\n    // your code\n    return 0;\n}", description: "C++ main function" },
    ]
  };

  // Load files and input from localStorage
  useEffect(() => {
    const savedFiles = localStorage.getItem("files");
    const savedInput = localStorage.getItem("input");
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles));
    } else {
      setFiles([defaultFile]);
    }
    if (savedInput) {
      setInput(savedInput);
    }
  }, []);

  // Save files and input to localStorage
  useEffect(() => {
    localStorage.setItem("files", JSON.stringify(files));
    localStorage.setItem("input", input);
  }, [files, input]);

  // Handle Cmd + Enter or Ctrl + Enter to run code
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.key === "Enter" && (event.metaKey || event.ctrlKey))) {
        event.preventDefault(); // Prevent default enter behavior
        createRequest(); // Run code on Cmd+Enter or Ctrl+Enter
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [files, input, activeTab]);

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
        ? `import java.util.*;\n    class Main {\n    public static void main(String[] args) {\n        System.out.println("Welcome to Codetantra");\n    }\n}`
        : `#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Welcome to Codetantra";\n    return 0;\n}`;
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
    };
    const blob = new Blob([currentFile.code], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `code.${languageArrayExtension[currentFile.lang]}`);
  };

  // Insert Snippet into the current code
  const insertSnippet = (snippet) => {
    const updatedFiles = [...files];
    updatedFiles[activeTab].code += snippet.value; // Append the snippet
    setFiles(updatedFiles);
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

      <Box sx={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 2 }}>
        <AceEditor
          mode={editorLang}
          theme="chrome"
          name={`editor-${activeTab}`}
          onChange={updateCode}
          value={currentFile.code}
          fontSize={16}
          enableBasicAutocompletion
          enableLiveAutocompletion
          style={{
            height: "calc(100vh - 48px)",
            width: "100%",
            backgroundColor: editorBackgroundColor,
            color: textColor,
          }}
        />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Snippet Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Insert Snippet</InputLabel>
            <Select
              value=""
              label="Insert Snippet"
              onChange={(e) => insertSnippet(e.target.value)}
            >
              {codeSnippets[editorLang]?.map((snippet, index) => (
                <MenuItem key={index} value={snippet}>
                  {snippet.caption} - {snippet.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Language Selection */}
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ color: textColor }}>
              Language
            </FormLabel>
            <RadioGroup
              row
              value={currentFile.lang}
              onChange={(e) => updateLanguage(e.target.value)}
              sx={{ display: "flex", justifyContent: "space-evenly" }}
            >
              <FormControlLabel value="python3" control={<Radio />} label="Python" />
              <FormControlLabel value="c" control={<Radio />} label="C" />
              <FormControlLabel value="cpp" control={<Radio />} label="C++" />
              <FormControlLabel value="java" control={<Radio />} label="Java" />
            </RadioGroup>
          </FormControl>

          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
            <Button
              sx={{ flex: 1 }}
              variant="contained"
              color="primary"
              onClick={createRequest}
              disabled={executing}
            >
              {executing ? <LinearProgress size={24} /> : <PlayArrowRoundedIcon />}
              Run
            </Button>
            <Button
              sx={{ flex: 1 }}
              variant="outlined"
              onClick={handleClear}
            >
              <RefreshIcon />
              Clear
            </Button>
            <Button
              sx={{ flex: 1 }}
              variant="outlined"
              onClick={handleDownloadCode}
            >
              <DownloadIcon />
              Download
            </Button>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          padding: 2,
          backgroundColor: "#333",
          color: "#fff",
          maxHeight: "40vh",
          overflowY: "auto",
        }}
      >
        <pre>{currentFile.output}</pre>
      </Box>
    </Box>
  );
}

export default Editor;
