import React, { useState, useEffect, useRef } from "react";
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
  Slider,
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
import "ace-builds/src-noconflict/mode-javascript"; // Adding JavaScript support
import "ace-builds/src-noconflict/mode-ruby"; // Adding Ruby support
import "ace-builds/src-noconflict/theme-chrome"; // Light theme for Ace Editor

function Editor() {
  const [activeTab, setActiveTab] = useState(0);
  const [files, setFiles] = useState([]);
  const [input, setInput] = useState("");
  const [executing, setExecuting] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [errorMarkers, setErrorMarkers] = useState([]);
  const [autoSave, setAutoSave] = useState(true);

  const theme = useTheme();
  const isDarkTheme = theme?.palette?.mode === "dark"; // Safe check for theme object

  const editorBackgroundColor = isDarkTheme ? "#f5f5f5" : "#ffffff";
  const textColor = "#333";
  const inputOutputBackground = "#ffffff";

  const languageMap = {
    cpp: "c_cpp",
    c: "c_cpp",
    java: "java",
    python3: "python",
    javascript: "javascript",
    ruby: "ruby",
  };

  const defaultFile = {
    lang: "python3",
    code: `print("Welcome to Codetantra")`,
    output: "",
    history: [],
  };

  const currentFile = files[activeTab] || defaultFile;
  const editorLang = languageMap[currentFile.lang] || "python";

  const languageTemplates = {
    python3: `def main():\n    pass\n\nif __name__ == "__main__":\n    main()`,
    java: `import java.util.*;\n    public class Main {\n    public static void main(String[] args) {\n        System.out.println("Welcome to Codetantra");\n    }\n}`,
    cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Welcome to Codetantra";\n    return 0;\n}`,
    javascript: `function main() {\n  console.log("Welcome to Codetantra");\n}\nmain();`,
    ruby: `def main\n  puts "Welcome to Codetantra"\nend\n\nmain`,
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

  // Auto-save logic
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (autoSave) {
        localStorage.setItem("files", JSON.stringify(files));
      }
    }, 10000); // Auto-save every 10 seconds
    return () => clearInterval(saveInterval);
  }, [files, autoSave]);

  // Custom completer logic for Python, Java, C++, JS, Ruby
  useEffect(() => {
    const customCompleter = {
      getCompletions: (editor, session, pos, prefix, callback) => {
        const completions = {
          python: [
            { caption: "print", value: "print()", meta: "Python built-in" },
            { caption: "def", value: "def function_name():\n    pass", meta: "Function definition" },
            { caption: "if", value: "if condition:\n    pass", meta: "Condition block" },
            { caption: "for", value: "for i in range():\n    pass", meta: "Loop structure" },
          ],
          java: [
            { caption: "System.out.println", value: "System.out.println();", meta: "Java print" },
            { caption: "public class", value: "public class ClassName {\n\n}", meta: "Class template" },
            { caption: "for loop", value: "for (int i = 0; i < n; i++) {\n\n}", meta: "Loop structure" },
          ],
          cpp: [
            { caption: "cout", value: "cout << \"\";", meta: "C++ print" },
            { caption: "#include", value: "#include <iostream>", meta: "Include library" },
            { caption: "int main", value: "int main() {\n\n    return 0;\n}", meta: "Main function" },
          ],
          javascript: [
            { caption: "console.log", value: "console.log('');", meta: "JS print" },
            { caption: "function", value: "function functionName() {\n\n}", meta: "Function definition" },
          ],
          ruby: [
            { caption: "puts", value: "puts ''", meta: "Ruby print" },
            { caption: "def", value: "def function_name\n  # code\nend", meta: "Function definition" },
          ],
        };

        const languageCompletions = completions[editorLang] || [];
        callback(null, languageCompletions);
      },
    };

    ace.acequire("ace/ext/language_tools").addCompleter(customCompleter);
  }, [editorLang]);

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
    updatedFiles[activeTab].code = languageTemplates[newLang];
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
      javascript: "js",
      ruby: "rb",
    };

    const fileExtension = languageArrayExtension[currentFile.lang] || "txt";
    const blob = new Blob([currentFile.code], { type: "text/plain" });
    saveAs(blob, `code.${fileExtension}`);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", padding: "8px", overflow: "auto" }}>
      <Tabs value={activeTab} onChange={handleTabChange} aria-label="code editor tabs" variant="scrollable" scrollButtons="auto">
        {files.map((file, index) => (
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {file.lang} {index === activeTab && <span>{file.lang}</span>}
              </Box>
            }
            key={index}
            onDelete={() => handleDeleteFile(index)}
            sx={{ minWidth: 120 }}
          />
        ))}
        <Button variant="contained" color="primary" onClick={handleAddFile} sx={{ minWidth: 120 }}>
          +
        </Button>
      </Tabs>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", padding: "8px", overflow: "auto" }}>
        <Box>
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend">Language</FormLabel>
            <RadioGroup row value={currentFile.lang} onChange={(e) => updateLanguage(e.target.value)}>
              <FormControlLabel value="python3" control={<Radio />} label="Python" />
              <FormControlLabel value="java" control={<Radio />} label="Java" />
              <FormControlLabel value="cpp" control={<Radio />} label="C++" />
              <FormControlLabel value="javascript" control={<Radio />} label="JavaScript" />
              <FormControlLabel value="ruby" control={<Radio />} label="Ruby" />
            </RadioGroup>
          </FormControl>

          <AceEditor
            mode={editorLang}
            theme="chrome"
            name="codeEditor"
            onChange={updateCode}
            value={currentFile.code}
            fontSize={fontSize}
            showPrintMargin={false}
            wrapEnabled={true}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
            }}
            width="100%"
            height="200px"
            style={{ backgroundColor: editorBackgroundColor, color: textColor }}
          />

          <TextField
            label="Input"
            multiline
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Box>

        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={createRequest}
            disabled={executing}
            startIcon={<PlayArrowRoundedIcon />}
          >
            Run
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClear}
            startIcon={<RefreshIcon />}
            sx={{ marginLeft: "8px" }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            color="default"
            onClick={handleDownloadCode}
            startIcon={<DownloadIcon />}
            sx={{ marginLeft: "8px" }}
          >
            Download
          </Button>
        </Box>

        <Box>
          {executing && <LinearProgress />}
          <pre>{currentFile.output}</pre>
        </Box>
      </Box>
    </Box>
  );
}

export default Editor;
