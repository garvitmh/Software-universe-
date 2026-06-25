import CodexSidebar from "@/components/CodexSidebar";
import OnThisPage from "@/components/OnThisPage";
import { TECH_CONTENT } from "@/lib/tech-content";

export default function CodexLayout({ children }) {
  const readyTech = Object.keys(TECH_CONTENT);
  return (
    <div className="codex-shell">
      <CodexSidebar readyTech={readyTech} />
      <div className="codex-content" style={{ padding: "20px 40px" }}>
        {children}
      </div>
      <OnThisPage />
    </div>
  );
}
