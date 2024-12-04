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
import "ace-builds/src-noconflict/theme-clouds";

const Editor = () => {
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
    java: "java",
    javascript: "javascript",
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
          { caption: "print", value: "print()", meta: "Python built-in" },
          { caption: "def", value: "def function_name():\n    pass", meta: "Function definition" },
          { caption: "if", value: "if condition:\n    pass", meta: "Condition block" },
          { caption: "for", value: "for i in range():\n    pass", meta: "Loop structure" },
        ];
        const javaCompletions = [
          { caption: "System.out.println", value: "System.out.println();", meta: "Java print" },
          { caption: "public class", value: "public class ClassName {\n\n}", meta: "Class template" },
          { caption: "for loop", value: "for (int i = 0; i < n; i++) {\n\n}", meta: "Loop structure" },
        ];
        const cppCompletions = [
          { caption: "cout", value: "cout << \"\";", meta: "C++ print" },
          { caption: "#include", value: "#include <iostream>", meta: "Include library" },
          { caption: "int main", value: "int main() {\n\n    return 0;\n}", meta: "Main function" },
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
      ? `import java.util.*;
class Main {
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
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <FormControlLabel value="python3" control={<Radio />} label="Python" />
            <FormControlLabel value="cpp" control={<Radio />} label="C++" />
            <FormControlLabel value="java" control={<Radio />} label="Java" />
            <FormControlLabel value="javascript" control={<Radio />} label="JavaScript" />
          </RadioGroup>
          </FormControl>

          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
            <Button
              variant="contained"
              onClick={createRequest}
              startIcon={<PlayArrowRoundedIcon />}
              disabled={executing}
              size="small"
              sx={{
                backgroundColor: "#4caf50",
                "&:hover": { backgroundColor: "#388e3c" },
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
                backgroundColor: "#ff9800",
                "&:hover": { backgroundColor: "#f57c00" },
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
                backgroundColor: "#2196f3",
                "&:hover": { backgroundColor: "#1976d2" },
              }}
            >
              Download
            </Button>
          </Box>

          {executing && <LinearProgress />}

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

          <Box
            sx={{
              flex: 1,
              backgroundColor: "#f9f9f9",
              padding: 2,
              overflowY: "auto",
              borderRadius: 1,
              border: "1px solid #ccc",
              whiteSpace: "pre-wrap",
              color: textColor,
            }}
          >
            {currentFile.output || "Output will appear here..."}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Editor;
