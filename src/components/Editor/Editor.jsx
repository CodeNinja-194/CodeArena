import DownloadIcon from "@mui/icons-material/CloudDownload";
import CopyIcon from "@mui/icons-material/FileCopy";
import ace from "ace-builds";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-dracula";
import AceEditor from "react-ace";
ace.config.set(
  "basePath",
  "https://cdn.jsdelivr.net/npm/ace-builds@1.4.3/src-noconflict/"
);
ace.config.setModuleUrl(
  "ace/mode/javascript_worker",
  "https://cdn.jsdelivr.net/npm/ace-builds@1.4.3/src-noconflict/worker-javascript.js"
);

import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import RefreshIcon from "@mui/icons-material/Refresh"; // Import the refresh icon
import {
  Box,
  Button,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField
} from "@mui/material";

import { useEffect, useState } from "react";

import { saveAs } from "file-saver";

function Editor() {
  const [output, setOutput] = useState("");
  const [lang, setLang] = useState("python3"); // Default language is Python
  const [input, setInput] = useState("");
  const [executing, setExecuting] = useState(false);
  const [editorlang, setEditorLang] = useState("python");
  const [anchorEl, setAnchorEl] = useState(null);

  const defaultCodeArray = {
    cpp: `#include <iostream>
using namespace std;
int main() {
    cout << "Welcome to Codetantra";
    return 0;
}`,
    c: `#include <stdio.h>
int main() {
    printf("Welcome to Codetantra");
    return 0;
}`,
    java: `class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to Codetantra");
    }
}`,
    python3: `print("Welcome to Codetantra")`, // Default Python code
  };

  const [code, setCode] = useState(defaultCodeArray.python3); // Set default code to Python
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (lang === "cpp") {
      setEditorLang("c_cpp");
      setCode(defaultCodeArray.cpp);
    } else if (lang === "c") {
      setEditorLang("c_cpp");
      setCode(defaultCodeArray.c);
    } else if (lang === "java") {
      setEditorLang("java");
      setCode(defaultCodeArray.java);
    } else if (lang === "python3") {
      setEditorLang("python");
      setCode(defaultCodeArray.python3); // Default Python code
    }
  }, [lang]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleDownloadCode = () => {
    const languageArrayExtension = {
      java: "java",
      python3: "py",
      cpp: "cpp",
      c: "c",
    };
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `code.${languageArrayExtension[lang]}`);
  };

  const createRequest = async () => {
    try {
      let data = {
        src: code,
        lang: lang,
        stdin: input,
      };
      setExecuting(true);
      const response = await fetch(
        "https://code-box.onrender.com/api/v1/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const res = await response.json();
      setExecuting(false);
      setOutput(res);
    } catch (error) {
      setExecuting(false);
      setOutput("Network Error or Server Down");
    }
  };

  // Function to clear the editor and reset the output
  const handleClear = () => {
    setCode(defaultCodeArray.python3); // Reset to default Python code
    setInput(""); // Clear the input field
    setOutput(""); // Clear the output
  };

  return (
    <>
    <Box
  backgroundColor="background.default"
  sx={{
    display: "grid",
    height: "100vh",
    gridTemplateColumns: "repeat(12, 1fr)",
    gridGap: "0 20px",
    "& .ace_gutter": {
      backgroundColor: "background.default",
    },
    "& .ace_editor": {
      backgroundColor: "background.default",
    },
  }}
>
  <AceEditor
    placeholder=""
    mode={editorlang}
    theme="dracula"
    name="CodeBox"
    onChange={(e) => setCode(e)}
    value={code}
    fontSize={17}
    showPrintMargin={false}
    style={{
      gridColumn: "span 9",
      height: "100%",
      width: "100%",
      "& *": {
        fontFamily: "monospace",
      },
    }}
    showGutter={true}
    highlightActiveLine={true}
    setOptions={{
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true,
      showLineNumbers: true,
    }}
  />
  <div
    style={{
      gridColumn: "span 3",
      height: "100vh",
      padding: "0px 0px",
    }}
  >
    <div style={{ textAlign: "right", width: "inherit" }}>
      {/* Language Select Dropdown to the Left of the Buttons */}
      <Box sx={{ display: 'inline-flex', gap: 2, alignItems: 'center' }}>
        <Select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          inputProps={{
            name: "language",
            id: "outlined-age-native-simple",
          }}
          disabled={executing}
          sx={{
            color: "primary.main",
            height: "33px",
            backgroundColor: "dark.main",
            marginRight: 2,  // Add some space to the right of the Select box
            "& *": {
              fontFamily: "poppins",
            },
          }}
        >
          <MenuItem value="python3" sx={{ color: "light.main" }}>
            Python
          </MenuItem>
          <MenuItem value="c" sx={{ color: "light.main" }}>
            C
          </MenuItem>
          <MenuItem value="cpp" sx={{ color: "light.main" }}>
            C++
          </MenuItem>
          <MenuItem value="java" sx={{ color: "light.main" }}>
            Java
          </MenuItem>
        </Select>

        {/* Run Button */}
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={createRequest}
          sx={{
            marginTop: "6px",
            marginBottom: "9px",
            color: "text.secondary",
          }}
          startIcon={<PlayArrowRoundedIcon sx={{ color: "text.secondary" }} />}
        >
          Run
        </Button>

        {/* Clear Button */}
        <Button
          size="small"
          variant="contained"
          color="primary"
          sx={{
            marginTop: "6px",
            marginBottom: "9px",
            color: "text.secondary",
          }}
          startIcon={<RefreshIcon sx={{ color: "white" }} />}
          onClick={handleClear}
        >
          Clear
        </Button>
      </Box>

      {/* Copy and Download Buttons Side by Side */}
      <Box sx={{ display: 'inline-flex', gap: 2, marginTop: 2 }}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          sx={{
            marginTop: "6px",
            marginBottom: "9px",
            color: "text.secondary",
          }}
          onClick={handleCopyCode}
          startIcon={<CopyIcon sx={{ color: "text.secondary" }} />}
        >
          Copy
        </Button>

        <Button
          size="small"
          variant="contained"
          color="primary"
          sx={{
            marginTop: "6px",
            marginBottom: "9px",
            color: "text.secondary",
          }}
          onClick={handleDownloadCode}
          startIcon={<DownloadIcon sx={{ color: "text.secondary" }} />}
        >
          Download
        </Button>
      </Box>

      {executing && <LinearProgress size={14} style={{ color: "white", margin: "auto" }} />}
    </div>

    {/* Input and Output Areas */}
    <div>
      <InputLabel
        sx={{
          color: "primary.main",
          margin: "7px 0",
          fontFamily: "poppins",
        }}
      >
        Input
      </InputLabel>
      <TextField
        multiline
        value={input}
        onChange={(e) => setInput(e.target.value)}
        inputProps={{
          style: {
            fontSize: 20,
            height: "10rem",
            overflow: "auto",
            color: "#fff",
            borderColor: "#fff",
          },
        }}
        variant="outlined"
        sx={{
          backgroundColor: "text.primary",
          width: "inherit",
          color: "#f8f8f2",
        }}
      />
    </div>

    <div>
      <InputLabel
        sx={{
          color: "primary.main",
          margin: "7px 0",
          fontFamily: "Poppins",
        }}
      >
        Output
      </InputLabel>
      <Box
        sx={{
          textAlign: "left",
          color: "white",
          overflow: "auto",
          whiteSpace: "pre-line",
          fontFamily: "monospace",
          height: "70%",
          width: "inherit",
          fontSize: "17px",
          backgroundColor: "text.primary",
          border: "1px solid rgba(255, 255, 255, 0.23)",
          borderRadius: "4px",
        }}
      >
        {output?.data?.output || output?.data?.error || output}
      </Box>
    </div>
  </div>
</Box>
    </>
  );
}

export default Editor;