import CodexSidebar from "@/components/CodexSidebar";
import OnThisPage from "@/components/OnThisPage";
import { TECH_CONTENT } from "@/lib/tech-content";

export default function CodexLayout({ children }) {
  // Readiness of tech pages = "has content". Computed on the server,
  // passed to the client sidebar so links only appear when the page exists.
  const readyTech = Object.keys(TECH_CONTENT);

  return (
    <div className="codex-shell">
      <CodexSidebar readyTech={readyTech} />
      <div className="codex-content">{children}</div>
      <OnThisPage />
    </div>
  );
}
