// --- Global Variables ---
let currentMarkdownText = "";
let file_input = null;
let get_content = null;
const API_KEY = "GEMINI-API-KEY";

const file_link = "https://raw.githubusercontent.com/abdrrahim2007/abdrrahim2007/refs/heads/main/README.md";

document.addEventListener('DOMContentLoaded', () => {

  // --- Element Selectors ---
  const toggleBtn = document.getElementById('menu-toggle-btn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const preview = document.getElementById("preview");
  const fileInput = document.getElementById('file_input');

  // Gemini elements
  const summarizeBtn = document.getElementById('summarize-btn');
  const qaBtn = document.getElementById('qa-btn');
  const modalOverlay = document.getElementById('gemini-modal-overlay');
  const modal = document.getElementById('gemini-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  // --- Sidebar Toggle ---
  function toggleSidebar() {
    const isOpen = sidebar.classList.toggle('open');
    overlay.classList.toggle('open', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen);
  }

  if (toggleBtn && sidebar && overlay) {
    toggleBtn.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);
  }

  // --- Markdown Helpers ---
  function replaceMathTags(html) {
    html = html.replace(/<mathblock>([\s\S]*?)<\/mathblock>/g, (_, content) => `\\[${content}\\]`);
    html = html.replace(/<math>([\s\S]*?)<\/math>/g, (_, content) => `\\(${content}\\)`);
    return html;
  }

  function renderMarkdown(mdText) {
    currentMarkdownText = mdText;
    let html = (typeof marked !== 'undefined') ? marked.parse(mdText) : mdText;
    html = replaceMathTags(html);
    preview.innerHTML = html;
    get_content = html;

    // Highlight.js
    if (window.hljs) preview.querySelectorAll("pre code").forEach(block => hljs.highlightElement(block));

    // MathJax
    if (window.MathJax && window.MathJax.typesetPromise) {
      MathJax.typesetPromise([preview]).catch(err => console.error("MathJax error:", err));
    }

    // Enable Gemini buttons
    if (summarizeBtn && qaBtn) {
      summarizeBtn.disabled = false;
      qaBtn.disabled = false;
    }
  }

  // --- Load remote Markdown file ---
  fetch(file_link)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load file: ${res.statusText}`);
      return res.text();
    })
    .then(data => {
      file_input = data;
      renderMarkdown(file_input);
    })
    .catch(err => {
      console.error(err);
      preview.innerHTML = `<p style="color:red;">Error loading file: ${err.message}</p>`;
    });

  // --- Local File Upload ---
  if (fileInput) {
    fileInput.addEventListener('change', event => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = e => renderMarkdown(e.target.result);
      reader.readAsText(file);
    });
  }

  // --- Gemini Modal ---
  function openModal(title, content) {
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modalOverlay.classList.add('open');
    modal.focus();

    if (window.MathJax && window.MathJax.typesetPromise) {
      MathJax.typesetPromise([modalBody]).catch(err => console.error("MathJax error:", err));
    }
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
  }

  if (modalOverlay && modalCloseBtn) {
    modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
    modalCloseBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal(); });
  }

  // --- Gemini API ---
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;
  const MAX_RETRIES = 3;

  async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
    let delay = 1000;
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          if (response.status >= 500) throw new Error(`Server error: ${response.status}`);
          else return response;
        }
        return response;
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  async function callGemini(prompt, systemInstruction) {
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] }
    };

    try {
      const response = await fetchWithRetry(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || response.statusText);
      }

      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (err) {
      console.error(err);
      return `<p><strong>Error:</strong> Unable to reach AI service. (${err.message})</p>`;
    }
  }

  // --- Gemini Buttons ---
  if (summarizeBtn) {
    summarizeBtn.addEventListener('click', async () => {
      if (!currentMarkdownText) return;
      openModal("✨ Summarizing...", '<div class="loader"></div>');

      const prompt = `Please provide a concise anda better  resume/Summary of the following document:\n\n---\n\n${currentMarkdownText}`;
      const systemInstruction = "You are an expert AI assistant specialized in document/courses summarization. Respond in English or document language.";
      const resultText = await callGemini(prompt, systemInstruction);

      const formattedResult = (typeof marked !== 'undefined') ? marked.parse(resultText) : `<pre>${resultText}</pre>`;
      openModal("✨ Document Summary", formattedResult);
    });
  }

  if (qaBtn) {
    qaBtn.addEventListener('click', async () => {
      if (!currentMarkdownText) return;
      openModal("✨ Generating Q&A...", '<div class="loader"></div>');

      const prompt = `Based on the following document, generate 5–10 clear and relevant study questions with their answers:\n\n---\n\n${currentMarkdownText}`;
      const systemInstruction = "You are an AI tutor. Create English or  that document language study questions and answers that are clear and concise.";
      const resultText = await callGemini(prompt, systemInstruction);

      const formattedResult = (typeof marked !== 'undefined') ? marked.parse(resultText) : `<pre>${resultText}</pre>`;
      openModal("✨ Study Questions & Answers", formattedResult);
    });
  }

});

// --- Marked.js & Highlight.js configuration ---
if (typeof marked !== 'undefined') {
  marked.setOptions({
    highlight: (code, lang) => {
      const validLang = (window.hljs && hljs.getLanguage(lang)) ? lang : "plaintext";
      return window.hljs ? hljs.highlight(code, { language: validLang }).value : code;
    },
    breaks: true
  });
}
