# CodeArena — Premium Online Compiler

CodeArena is an innovative, feature-rich online compiler designed to streamline coding experiences. With support for 6+ programming languages, 10+ beautiful themes, and powerful development tools, CodeArena is your go-to platform for coding endeavors.

![CodeArena](https://img.shields.io/badge/CodeArena-Premium%20Compiler-10b981?style=for-the-badge)
![SolidJS](https://img.shields.io/badge/SolidJS-1.9.10-2c4f7c?style=for-the-badge&logo=solid)
![Monaco Editor](https://img.shields.io/badge/Monaco%20Editor-0.55.1-blue?style=for-the-badge)

## ✨ Features

### 🚀 Core Features
- **Multi-Language Support**: Code in Python, JavaScript, TypeScript, Java, C++, and C with full syntax highlighting
- **Instant Execution**: Run your code instantly with real-time output and error handling
- **Multiple Themes**: Choose from 10+ beautiful dark and light themes including Night Owl, Dracula, GitHub Dark, Monokai, and more
- **Save & Download**: Save your code locally or download it as files with one click
- **Multiple Files**: Work with multiple files simultaneously with a tabbed interface
- **Easy Sharing**: Copy code with one click and share your solutions quickly

### 🎨 Advanced Features
- **IntelliSense**: Full code completion and IntelliSense support for all languages
- **Syntax Highlighting**: Beautiful syntax highlighting for all supported languages
- **Customizable Font Size**: Adjust editor font size to your preference
- **Auto-Save**: Automatic local storage of your code
- **Input/Output**: Support for stdin input and console output
- **Responsive Design**: Seamless coding experience on any device

### 🌈 Themes Available
1. Night Owl
2. Dracula
3. GitHub Dark
4. Monokai
5. One Dark
6. Solarized Dark
7. VS Dark
8. VS Light
9. High Contrast Dark
10. High Contrast Light

### 💻 Supported Languages
- **Python 3** (.py)
- **JavaScript** (.js)
- **TypeScript** (.ts)
- **Java** (.java)
- **C++** (.cpp)
- **C** (.c)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/codearena.git
cd codearena
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 📖 Usage

### Basic Usage

1. **Select Your Language**: Choose from the supported programming languages in the sidebar
2. **Write Your Code**: Start coding in the Monaco editor with full IntelliSense support
3. **Run Code**: Click the "Run" button to execute your code
4. **View Output**: See the results in the console output panel
5. **Save/Download**: Save your code locally or download it as a file

### Advanced Features

- **Multiple Files**: Click the "+" button to add new files
- **Switch Themes**: Change themes from the Configuration panel
- **Adjust Font Size**: Use the Settings panel to customize font size
- **Input Support**: Enter stdin input in the Input field before running

## 🛠️ Technology Stack

- **Framework**: [SolidJS](https://www.solidjs.com/) - A declarative JavaScript library
- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/) - The editor that powers VS Code
- **Routing**: [@solidjs/router](https://github.com/solidjs/solid-router) - Official router for SolidJS
- **Build Tool**: [Vite](https://vitejs.dev/) - Next generation frontend tooling
- **Icons**: [solid-icons](https://github.com/x64bits/solid-icons) - Icon library for SolidJS

## 📁 Project Structure

```
codearena/
├── public/
│   └── favicon.png
├── src/
│   ├── components/       # Reusable components
│   ├── pages/
│   │   ├── Landing.jsx   # Landing page
│   │   └── Editor.jsx    # Code editor page
│   ├── utils/
│   │   ├── api.js        # API integration
│   │   └── themes.js     # Theme configurations
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css          # Global styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Features in Detail

### Real-Time Code Execution
Execute your code instantly and see results in real-time. The compiler supports stdin input and provides detailed output.

### Beautiful Themes
Choose from a variety of professionally designed themes that reduce eye strain and improve your coding experience.

### Code Management
- Create multiple files
- Switch between files with tabs
- Delete files when no longer needed
- Automatic code saving

### Developer Experience
- Full IntelliSense support
- Syntax highlighting
- Code formatting
- Bracket matching
- Error detection

## 🌐 API Integration

CodeArena uses a code execution API to run your code. The API endpoint is configured in `src/utils/api.js`. You can modify this to use your own backend service.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@codearena.dev or open an issue on GitHub.

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the amazing code editor
- [SolidJS](https://www.solidjs.com/) for the reactive framework
- All theme creators for their beautiful color schemes

---

Made with ❤️ by the CodeArena team
