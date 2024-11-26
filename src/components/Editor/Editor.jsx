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

  // Custom completer logic for Python, Java, and C++
  useEffect(() => {
    const customCompleter = {
      getCompletions: (editor, session, pos, prefix, callback) => {
        const pythonCompletions = [
          { caption: "print", value: "print()", meta: "Python built-in function" },
          { caption: "def", value: "def function_name():\n    pass", meta: "Function definition" },
          { caption: "if", value: "if condition:\n    pass", meta: "Condition block" },
          { caption: "for", value: "for i in range():\n    pass", meta: "Loop structure" },
          { caption: "import", value: "import os", meta: "Import module" },
          { caption: "os", value: "os.getcwd()", meta: "OS module function" },
          { caption: "math", value: "import math\nmath.sqrt()", meta: "Math module function" },
        ];

        const javaCompletions = [
          { caption: "System.out.println", value: "System.out.println();", meta: "Java print" },
          { caption: "public class", value: "public class ClassName {\n\n}", meta: "Class template" },
          { caption: "for", value: "for (int i = 0; i < n; i++) {\n\n}", meta: "For loop" },
          { caption: "ArrayList", value: "ArrayList<Type> list = new ArrayList<>();", meta: "Java ArrayList" },
        ];

        const cppCompletions = [
          { caption: "cout", value: "cout << \"\";", meta: "C++ print" },
          { caption: "#include", value: "#include <iostream>", meta: "Include library" },
          { caption: "int main", value: "int main() {\n\n    return 0;\n}", meta: "Main function" },
          { caption: "vector", value: "std::vector<int> vec;", meta: "C++ vector" },
        ];

        const completions =
          editorLang === "python"
            ? pythonCompletions
            : editorLang === "java"
            ? javaCompletions
            : cppCompletions;

        callback(null, completions);
      },
    };

    ace.acequire("ace/ext/language_tools").addCompleter(customCompleter);
  }, [editorLang]);

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
          value={currentFile.code}
          onChange={updateCode}
          name="codeEditor"
          width="100%"
          height="100%"
          showPrintMargin={false}
          fontSize={14}
          enableBasicAutocompletion
          enableLiveAutocompletion
          enableSnippets
          setOptions={{
            showLineNumbers: true,
            tabSize: 2,
            wrap: true,
          }}
        />
        <Box>
          <FormControl sx={{ marginBottom: 2 }}>
            <FormLabel>Language</FormLabel>
            <RadioGroup
              row
              value={currentFile.lang}
              onChange={(e) => updateLanguage(e.target.value)}
            >
              <FormControlLabel value="python3" control={<Radio />} label="Python" />
              <FormControlLabel value="java" control={<Radio />} label="Java" />
              <FormControlLabel value="cpp" control={<Radio />} label="C++" />
            </RadioGroup>
          </FormControl>

          <TextField
            multiline
            label="Input"
            variant="outlined"
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button onClick={handleDownloadCode} startIcon={<DownloadIcon />} color="primary">
              Download Code
            </Button>
            <Button onClick={handleClear} startIcon={<RefreshIcon />} color="secondary">
              Clear
            </Button>
            <Button
              onClick={createRequest}
              startIcon={<PlayArrowRoundedIcon />}
              color="primary"
              disabled={executing}
            >
              Run Code
            </Button>
          </Box>

          {executing && <LinearProgress sx={{ marginTop: 2 }} />}
          <Box
            sx={{
              marginTop: 2,
              padding: 1,
              backgroundColor: "#f5f5f5",
              overflowY: "auto",
              height: "300px",
            }}
          >
            <pre>{currentFile.output}</pre>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Editor;
