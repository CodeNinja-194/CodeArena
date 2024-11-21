import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import { 
  Box, 
  Button, 
  InputLabel, 
  LinearProgress, 
  MenuItem, 
  Select, 
  TextField, 
  useTheme 
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/CloudDownload";
import CopyIcon from "@mui/icons-material/FileCopy";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import RefreshIcon from "@mui/icons-material/Refresh";
import { saveAs } from "file-saver";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-dracula";

function Editor() {
  const theme = useTheme(); // Access Material-UI theme

  const [output, setOutput] = useState("");
  const [lang, setLang] = useState("python3"); // Default language is Python
  const [input, setInput] = useState("");
  const [executing, setExecuting] = useState(false);
  const [editorlang, setEditorLang] = useState("python");
  const [code, setCode] = useState(`print("Welcome to Codetantra")`); // Default Python code

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
    python3: `print("Welcome to Codetantra")`,
  };

  useEffect(() => {
    if (lang === "cpp" || lang === "c") {
      setEditorLang("c_cpp");
      setCode(defaultCodeArray[lang]);
    } else if (lang === "java") {
      setEditorLang("java");
      setCode(defaultCodeArray.java);
    } else if (lang === "python3") {
      setEditorLang("python");
      setCode(defaultCodeArray.python3);
    }
  }, [lang]);

  const handleCopyCode = () => navigator.clipboard.writeText(code);
  const handleDownloadCode = () => {
    const ext = { java: "java", python3: "py", cpp: "cpp", c: "c" }[lang];
    saveAs(new Blob([code], { type: "text/plain;charset=utf-8" }), `code.${ext}`);
  };

  const createRequest = async () => {
    try {
      setExecuting(true);
      const response = await fetch("https://code-box.onrender.com/api/v1/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ src: code, lang, stdin: input }),
      });
      const res = await response.json();
      setOutput(res);
    } catch {
      setOutput("Network Error or Server Down");
    } finally {
      setExecuting(false);
    }
  };

  const handleClear = () => {
    setCode(defaultCodeArray.python3);
    setInput("");
    setOutput("");
  };

  return (
    <Box
      backgroundColor={theme.palette.background.default}
      sx={{
        display: "grid",
        height: "100vh",
        gridTemplateColumns: "repeat(12, 1fr)",
        gridGap: "0 20px",
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
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
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
      <div style={{ gridColumn: "span 3", height: "100vh", padding: "0px 0px" }}>
        <Box sx={{ display: "inline-flex", gap: 2, alignItems: "center" }}>
          <Select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            disabled={executing}
            sx={{
              color: theme.palette.primary.main,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            {["python3", "c", "cpp", "java"].map((l) => (
              <MenuItem key={l} value={l} sx={{ color: theme.palette.text.primary }}>
                {l.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            color="primary"
            onClick={createRequest}
            startIcon={<PlayArrowRoundedIcon />}
          >
            Run
          </Button>
          <Button variant="contained" color="primary" onClick={handleClear} startIcon={<RefreshIcon />}>
            Clear
          </Button>
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCopyCode}
            startIcon={<CopyIcon />}
            sx={{ marginRight: 2 }}
          >
            Copy
          </Button>
          <Button variant="contained" color="primary" onClick={handleDownloadCode} startIcon={<DownloadIcon />}>
            Download
          </Button>
        </Box>
        {executing && <LinearProgress />}
        <InputLabel sx={{ color: theme.palette.text.primary, margin: "10px 0" }}>Input</InputLabel>
        <TextField
          multiline
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        />
        <InputLabel sx={{ color: theme.palette.text.primary, margin: "10px 0" }}>Output</InputLabel>
        <Box
          sx={{
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
            overflow: "auto",
            whiteSpace: "pre-line",
            fontFamily: "monospace",
            height: "70%",
          }}
        >
          {output?.data?.output || output?.data?.error || output}
        </Box>
      </div>
    </Box>
  );
}

export default Editor;
