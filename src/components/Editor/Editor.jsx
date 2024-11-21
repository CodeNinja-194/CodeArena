import { useState, useEffect } from "react";
import AceEditor from "react-ace";
import { saveAs } from "file-saver";
import {
  Box,
  Button,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  CloudDownload as DownloadIcon,
  FileCopy as CopyIcon,
  PlayArrowRounded as RunIcon,
  Refresh as ClearIcon,
} from "@mui/icons-material";

import ace from "ace-builds";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-dracula";

// ACE editor configuration
ace.config.set(
  "basePath",
  "https://cdn.jsdelivr.net/npm/ace-builds@1.4.3/src-noconflict/"
);
ace.config.setModuleUrl(
  "ace/mode/javascript_worker",
  "https://cdn.jsdelivr.net/npm/ace-builds@1.4.3/src-noconflict/worker-javascript.js"
);

const defaultCode = {
  python3: `print("Welcome to Codetantra")`,
  c: `#include <stdio.h>
int main() {
    printf("Welcome to Codetantra");
    return 0;
}`,
  cpp: `#include <iostream>
using namespace std;
int main() {
    cout << "Welcome to Codetantra";
    return 0;
}`,
  java: `class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to Codetantra");
    }
}`,
};

function Editor() {
  const [code, setCode] = useState(defaultCode.python3);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [lang, setLang] = useState("python3");
  const [editorLang, setEditorLang] = useState("python");
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    switch (lang) {
      case "cpp":
      case "c":
        setEditorLang("c_cpp");
        break;
      case "java":
        setEditorLang("java");
        break;
      default:
        setEditorLang("python");
    }
    setCode(defaultCode[lang]);
  }, [lang]);

  const handleCopyCode = () => navigator.clipboard.writeText(code);
  const handleDownloadCode = () => {
    const extensions = { python3: "py", c: "c", cpp: "cpp", java: "java" };
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `code.${extensions[lang]}`);
  };

  const handleClear = () => {
    setCode(defaultCode.python3);
    setInput("");
    setOutput("");
  };

  const createRequest = async () => {
    setExecuting(true);
    try {
      const response = await fetch("https://code-box.onrender.com/api/v1/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ src: code, lang, stdin: input }),
      });
      const result = await response.json();
      setOutput(result.data.output || result.data.error || "Error occurred");
    } catch (err) {
      setOutput("Network Error or Server Down");
    } finally {
      setExecuting(false);
    }
  };

  return (
    <Box
      backgroundColor="background.default"
      sx={{
        display: "grid",
        gridTemplateColumns: "9fr 3fr",
        height: "100vh",
        gap: 2,
      }}
    >
      {/* Code Editor */}
      <AceEditor
        mode={editorLang}
        theme="dracula"
        value={code}
        onChange={setCode}
        fontSize={17}
        showPrintMargin={false}
        style={{ width: "100%", height: "100%" }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
        }}
      />

      {/* Side Panel */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Language Selector and Buttons */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            disabled={executing}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="python3">Python</MenuItem>
            <MenuItem value="c">C</MenuItem>
            <MenuItem value="cpp">C++</MenuItem>
            <MenuItem value="java">Java</MenuItem>
          </Select>
          <Button
            variant="contained"
            startIcon={<RunIcon />}
            onClick={createRequest}
            disabled={executing}
          >
            Run
          </Button>
          <Button variant="contained" startIcon={<ClearIcon />} onClick={handleClear}>
            Clear
          </Button>
        </Box>

        {/* Copy and Download Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" startIcon={<CopyIcon />} onClick={handleCopyCode}>
            Copy
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleDownloadCode}>
            Download
          </Button>
        </Box>

        {/* Progress Indicator */}
        {executing && <LinearProgress />}

        {/* Input Section */}
        <Box>
          <InputLabel>Input</InputLabel>
          <TextField
            multiline
            rows={5}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            sx={{ width: "100%", backgroundColor: "background.paper" }}
          />
        </Box>

        {/* Output Section */}
        <Box>
          <InputLabel>Output</InputLabel>
          <Box
            sx={{
              backgroundColor: "background.paper",
              color: "text.primary",
              padding: 2,
              borderRadius: 1,
              height: "30%",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
            }}
          >
            {output}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Editor;
