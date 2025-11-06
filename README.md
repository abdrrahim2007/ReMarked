# ReMarked: AI-Powered Markdown Viewer

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Technology: JavaScript](https://img.shields.io/badge/tech-JavaScript-blue.svg)
![Technology: HTML5](https://img.shields.io/badge/tech-HTML5-orange.svg)
![Technology: CSS3](https://img.shields.io/badge/tech-CSS3-blueviolet.svg)

ReMarked is a sophisticated, browser-based Markdown viewer that not only renders your documents beautifully but also enhances your reading and study experience with powerful AI tools. Powered by the Google Gemini API, ReMarked can instantly summarize complex documents and generate study questions and answers, turning any Markdown file into an interactive learning resource.

---

## ✨ Features

*   **Dynamic Markdown Rendering**: Supports loading and rendering Markdown files from both remote URLs and local uploads.
*   **Syntax Highlighting**: Beautiful, clear code block highlighting powered by `highlight.js`.
*   **Mathematical Notation**: Full support for LaTeX mathematical formulas and equations via `MathJax`.
*   **AI-Powered Summarization**: Instantly generate a concise summary of the entire document with a single click.
*   **AI-Powered Q&A Generation**: Automatically create relevant study questions and answers based on the document's content.
*   **Responsive UI**: A clean, modern interface with a collapsible navigation sidebar that works seamlessly on both desktop and mobile devices.
*   **Robust API Integration**: Features a resilient API client with an exponential backoff retry mechanism for reliable communication with the AI service.
*   **Accessible Modals**: AI-generated content is displayed in an accessible modal window.

---

## 🛠️ Tech Stack

This project is built with modern web technologies and leverages several powerful libraries:

*   **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
*   **Markdown Parsing**: [marked.js](https://marked.js.org/)
*   **Syntax Highlighting**: [highlight.js](https://highlightjs.org/)
*   **Math Rendering**: [MathJax](https://www.mathjax.org/)
*   **AI Services**: [Google Gemini API](https://ai.google.dev/)

---

## ⚙️ Setup and Installation

To run this project locally, follow these simple steps.

### Prerequisites

You need a modern web browser and a local web server to handle file requests correctly (due to browser security policies with the `file://` protocol). The [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension for VS Code is a great option.

### 1. Clone the Repository

```bash
git clone https://github.com/abdrrahim2007/ReMarked.git
cd ReMarked
```
## Confugure your API
### 1. Open the parser/main.js file.

### 2. Find the following line (near the top):
```javascript
const API_KEY = "GEMINI-API-KEY";
```
### 2. Replace it with your API key

## ⚙️ Configuration
You can easily customize the default Markdown file that loads when the page is opened.

### 1. Open parser/main.js.

### 2. Find the file_link variable:
```javascript
const file_link = "https://raw.githubusercontent.com/abdrrahim2007/abdrrahim2007/refs/heads/main/README.md";
```
### 3. Change the URL to point to any other raw Markdown file you want to load by default.
