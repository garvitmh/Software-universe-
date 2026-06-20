import OnThisPage from "@/components/OnThisPage";
export default function CodexLayout({ children }) {
  return (
    <div className="codex-shell" style={{ maxWidth: "none", margin: 0 }}>
      <div className="codex-content" style={{ padding: "20px 40px" }}>{children}</div>
      <OnThisPage />
    </div>
  );
}
