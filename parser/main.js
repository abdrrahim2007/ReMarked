const preview = document.getElementById("preview");
let file_input = null;
let get_content = null;

let currentMarkdownText = "";

const file_link = "https://raw.githubusercontent.com/abdrrahim2007/abdrrahim2007/refs/heads/main/README.md"; 

document.addEventListener('DOMContentLoaded', () => {

  // Sidebar stuff (unchanged)
  const toggleBtn = document.getElementById('menu-toggle-btn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const allNavSections = document.querySelectorAll('.sidebar-nav .nav-section');

  function toggleSidebar() {
    const isOpen = sidebar.classList.toggle('open');
    overlay.classList.toggle('open', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen);
  }

  if (toggleBtn && sidebar && overlay) {
    toggleBtn.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);
  }

  allNavSections.forEach(section => {
    section.addEventListener('toggle', (event) => {
      if (event.target.open) {
        allNavSections.forEach(otherSection => {
          if (otherSection !== event.target && otherSection.open) {
            otherSection.open = false;
          }
        });
      }
    });
  });

  // Active link highlighting
  function updateActiveLink() {
    const currentHash = window.location.hash;
    document.querySelectorAll('.nav-links a').forEach(a => {
      if (a.getAttribute('href') === currentHash) a.classList.add('active');
      else a.classList.remove('active');
    });
  }

  window.addEventListener('hashchange', updateActiveLink);
  updateActiveLink();


  fetch(file_link)
    .then(res => {
      if (!res.ok) throw new Error("Failed to load file: " + res.statusText);
      return res.text();
    })
    .then(data => {
      file_input = data;
      render();
    })
    .catch(err => {
      console.error(err);
      preview.innerHTML = `<p style="color:red;">Error loading file: ${err.message}</p>`;
    });
});


marked.setOptions({
  highlight: function (code, lang) {
    const validLang = hljs.getLanguage(lang) ? lang : "plaintext";
    return hljs.highlight(code, { language: validLang }).value;
  },
  breaks: true
});

function replace_tag(html) {
  html = html.replace(/<mathblock>([\s\S]*?)<\/mathblock>/g, (_, content) => `\\[${content}\\]`);
  html = html.replace(/<math>([\s\S]*?)<\/math>/g, (_, content) => `\\(${content}\\)`);
  return html;
}

function render() {
  let html = marked.parse(file_input);
  html = replace_tag(html);
  preview.innerHTML = html;
  get_content = html;

  preview.querySelectorAll("pre code").forEach(block => hljs.highlightElement(block));
  MathJax.typesetPromise();
}
