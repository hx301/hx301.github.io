/* LaTeX source is authored in \( ... \) / \[ ... \].
   KaTeX renders selectable HTML and accessible MathML, never formula images. */
(() => {
  'use strict';
  const options = {
    delimiters: [
      {left: '\\[', right: '\\]', display: true},
      {left: '\\(', right: '\\)', display: false}
    ],
    output: 'htmlAndMathml',
    throwOnError: true,
    trust: false,
    strict: 'ignore',
    ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option', 'svg'],
    ignoredClasses: ['katex', 'no-math'],
    errorCallback(message, error) { console.error('LaTeX:', message, error); }
  };
  const pending = new Set();
  let frame = 0;
  const observer = new MutationObserver(records => {
    for (const record of records) {
      const element = record.target.nodeType === 1 ? record.target : record.target.parentElement;
      if (!element || element.closest('.katex, script, style, canvas, svg, input, textarea')) continue;
      if (element.textContent.includes('\\(') || element.textContent.includes('\\[')) pending.add(element);
    }
    if (pending.size && !frame) frame = requestAnimationFrame(flush);
  });
  function observe() {
    observer.observe(document.body, {childList: true, characterData: true, subtree: true});
  }
  function render(root) {
    if (!window.renderMathInElement || !root) return;
    observer.disconnect();
    try { renderMathInElement(root, options); }
    finally { observe(); }
  }
  function flush() {
    frame = 0;
    const roots = [...pending].filter(el => el.isConnected);
    pending.clear();
    for (const el of roots) {
      if (!roots.some(other => other !== el && other.contains(el))) render(el);
    }
  }
  // Explicit hook for interactive results; the observer also catches routed notes.
  window.renderCourseMath = render;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => render(document.body), {once: true});
  } else render(document.body);
})();
