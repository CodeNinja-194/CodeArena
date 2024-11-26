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
  Slider,
  IconButton,
  Snackbar,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/CloudDownload";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import AceEditor from "react-ace";
import { saveAs } from "file-saver";
import * as firebase from 'firebase/app';
import 'firebase/database';

// Import necessary Ace modules
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-chrome"; // Light theme for Ace Editor

// Initialize Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

function Editor() {
  const [activeTab, setActiveTab] = useState(0);
  const [files, setFiles] = useState([]);
  const [input, setInput] = useState("");
  const [executing, setExecuting] = useState(false);
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState(16);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const isDarkTheme = theme === "dark";

  // Language map and default file setup
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

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem("files", JSON.stringify(files));
      localStorage.setItem("input", input);
    }, 5000); // auto-save every 5 seconds

    return () => clearInterval(interval); // clean up on component unmount
  }, [files, input]);

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

  // Editor language change logic
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
        : `#include <iostream>
using namespace std;
int main() {
    cout << "Welcome to Codetantra";
    return 0;
}`;
    setFiles(updatedFiles);
  };

  // Template insertion logic
  const templates = {
    python3: `def main():
    print("Hello, Codetantra!")`,
    java: `class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Codetantra!");
    }
}`,
    cpp: `#include <iostream>
using namespace std;
int main() {
    cout << "Hello, Codetantra!";
    return 0;
}`,
  };

  const handleTemplateSelection = (template) => {
    setSelectedTemplate(template);
    updateCode(templates[template]);
  };

  // Update code logic
  const updateCode = (newCode) => {
    const updatedFiles = [...files];
    updatedFiles[activeTab].code = newCode;
    setFiles(updatedFiles);
  };

  // Run code logic
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

  // Clear code logic
  const handleClear = () => {
    updateCode("");
    setInput("");
    const updatedFiles = [...files];
    updatedFiles[activeTab].output = "";
    setFiles(updatedFiles);
  };

  // Download code logic
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

  // Theme toggle functionality
  const toggleTheme = () => {
    setTheme(isDarkTheme ? "light" : "dark");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: isDarkTheme ? "#121212" : "#f5f5f5",
        display: "grid",
        gridTemplateRows: "auto 1fr",
        overflow: "hidden",
      }}
    >
      <Tabs value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)} variant="scrollable" scrollButtons="auto">
        {files.map((file, index) => (
          <Tab key={index} label={`File ${index + 1}`} />
        ))}
        <Button onClick={handleAddFile} sx={{ minWidth: "2rem", color: "primary.main" }}>
          +
        </Button>
      </Tabs>

      <Box sx={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 2 }}>
        <AceEditor
          mode={editorLang}
          theme={isDarkTheme ? "monokai" : "chrome"}
          name={`editor-${activeTab}`}
          onChange={updateCode}
          value={currentFile.code}
          fontSize={fontSize}
          showGutter={lineNumbers}
          enableBasicAutocompletion
          enableLiveAutocompletion
          setOptions={{
            enableSnippets: true,
            showLineNumbers: lineNumbers,
            showPrintMargin: false,
            fontSize: fontSize,
          }}
        />
        <Box sx={{ padding: 2 }}>
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel component="legend">Language</FormLabel>
            <RadioGroup
              row
              value={currentFile.lang}
              onChange={(event) => updateLanguage(event.target.value)}
            >
              <FormControlLabel value="python3" control={<Radio />} label="Python" />
              <FormControlLabel value="cpp" control={<Radio />} label="C++" />
              <FormControlLabel value="java" control={<Radio />} label="Java" />
            </RadioGroup>
          </FormControl>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <IconButton onClick={toggleTheme}>
              <Brightness4Icon />
            </IconButton>

            <Button onClick={createRequest} disabled={executing}>
              <PlayArrowRoundedIcon /> Run
            </Button>
            <Button onClick={handleClear}>
              <ClearIcon />
            </Button>
            <Button onClick={handleDownloadCode}>
              <DownloadIcon />
            </Button>
          </Box>

          <Snackbar
            open={snackbarOpen}
            message="Code saved automatically."
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Editor;
