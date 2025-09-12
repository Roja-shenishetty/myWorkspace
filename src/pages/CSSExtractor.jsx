import React, { useRef, useState } from "react";

export default function App() {
  const [html, setHtml] = useState(`<div class="card">
  <h2 class="title">Hello</h2>
  <p class="lead">This is a demo.</p>
  <button class="btn primary">Click</button>
</div>`);

  const [css, setCss] = useState(`.card { padding: 1rem; border: 1px solid #ddd; border-radius: 12px; background-color: #fafafa; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.card .title { font-weight: bold; font-size: 1.5rem; color: #333; }
.card .lead { color: #666; margin-bottom: 1rem; }
.btn { padding: .5rem 1rem; border-radius: 4px; border: none; cursor: pointer; }
.btn.primary { background: blue; color: white; }
.btn.secondary { background: #ddd; color: #333; }`);

  const [excludeCss, setExcludeCss] = useState("/* Paste Tailwind or other CSS to exclude */");
  const [scopeSelector, setScopeSelector] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState(null);
  const downloadRef = useRef(null);

  const getExcludedClasses = (cssText) => {
    const style = document.createElement("style");
    style.textContent = cssText;
    document.head.appendChild(style);
    const excluded = new Set();
    try {
      const sheet = style.sheet;
      Array.from(sheet.cssRules).forEach(rule => {
        if (rule.selectorText) {
          rule.selectorText.split(',').forEach(sel => {
            (sel.match(/\.([A-Za-z0-9_\\:\/\-]+)/g) || []).forEach(cls => excluded.add(cls.replace(/^\./, '')));
          });
        }
      });
    } catch {}
    style.remove();
    return excluded;
  };

  const extract = () => {
    setError(null);
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`<div id=__root>${html}</div>`, "text/html");
      const root = doc.getElementById("__root");
      const scopes = scopeSelector.trim() ? Array.from(root.querySelectorAll(scopeSelector)) : [root];

      const excludedClasses = getExcludedClasses(excludeCss);

      const styleEl = document.createElement("style");
      styleEl.textContent = css;
      document.head.appendChild(styleEl);
      const sheet = styleEl.sheet;
      if (!sheet) throw new Error("Failed to parse CSS sheet");

      const keepBlocks = [];
      const selectorMatches = (selectorText) => {
        try {
          for (const scope of scopes) {
            if (scope.matches && scope.matches(selectorText)) return true;
            if (scope.querySelector(selectorText)) return true;
          }
        } catch {}
        return false;
      };
      const isExcluded = (selector) => {
        const classes = selector.match(/\.([A-Za-z0-9_\\:\/\-]+)/g) || [];
        return classes.some(cls => excludedClasses.has(cls.replace(/^\./, '')));
      };

      Array.from(sheet.cssRules).forEach(rule => {
        if (rule.selectorText) {
          const selectors = rule.selectorText.split(',').map(s => s.trim()).filter(s => selectorMatches(s) && !isExcluded(s));
          if (selectors.length) {
            keepBlocks.push(`${selectors.join(', ')} {\n${rule.style.cssText}\n}`);
          }
        }
      });

      styleEl.remove();
      setResult(keepBlocks.join("\n\n") || "/* No matching rules found. */");
    } catch (e) {
      setError(e.message);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result || "");
  };

  const downloadCss = () => {
    const blob = new Blob([result], { type: "text/css;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    if (!downloadRef.current) return;
    downloadRef.current.href = url;
    downloadRef.current.download = "extracted.css";
    downloadRef.current.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: 16 }}>CSS Extractor with Exclude Pane</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label>HTML Component</label>
          <textarea value={html} onChange={(e) => setHtml(e.target.value)} style={{ width: '100%', height: 200, fontFamily: 'monospace' }} />
        </div>
        <div>
          <label>CSS Stylesheet</label>
          <textarea value={css} onChange={(e) => setCss(e.target.value)} style={{ width: '100%', height: 200, fontFamily: 'monospace' }} />
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <label>Exclude CSS (classes in here will be skipped)</label>
        <textarea value={excludeCss} onChange={(e) => setExcludeCss(e.target.value)} style={{ width: '100%', height: 150, fontFamily: 'monospace' }} />
      </div>
      <div style={{ marginTop: 16 }}>
        <label>Optional scope selector</label>
        <input value={scopeSelector} onChange={(e) => setScopeSelector(e.target.value)} style={{ width: '100%', fontFamily: 'monospace' }} />
      </div>
      <button onClick={extract} style={{ marginTop: 16, padding: '8px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4 }}>Extract CSS</button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      <div style={{ marginTop: 16 }}>
        <button onClick={copyToClipboard} style={{ marginRight: 8 }}>Copy</button>
        <button onClick={downloadCss}>Download</button>
        <a ref={downloadRef} style={{ display: 'none' }}>download</a>
      </div>
      <textarea value={result} readOnly style={{ width: '100%', height: 300, marginTop: 16, fontFamily: 'monospace' }} />
    </div>
  );
}
