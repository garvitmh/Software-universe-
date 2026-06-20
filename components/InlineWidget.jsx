// A framed "play with this" card for embedding interactive widgets directly in
// the Codex prose (Explorable Explanations / Distill style). Server component;
// wraps client-component widgets.
export default function InlineWidget({ title, hint, children }) {
  return (
    <div className="inline-widget">
      <div className="inline-widget-head">
        <span className="inline-widget-tag">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3l14 9-14 9V3z" /></svg>
          Interactive
        </span>
        {title && <span className="inline-widget-title">{title}</span>}
      </div>
      {children}
      {hint && <p className="inline-widget-hint">{hint}</p>}
    </div>
  );
}
