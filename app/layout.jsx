import "./globals.css";
import SiteNav from "@/components/SiteNav";
import CodexSidebar from "@/components/CodexSidebar";
import { TECH_CONTENT } from "@/lib/tech-content";

export const metadata = {
  title: "Software Universe — Burger Farm, understood",
  description:
    "An interactive engineering university built on your real Burger Farm codebase. From zero to architect — what we built, why, what breaks, and how it scales.",
};

export default function RootLayout({ children }) {
  const readyTech = Object.keys(TECH_CONTENT);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme) {
                    document.documentElement.setAttribute('data-theme', theme);
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <SiteNav />
        <div style={{ display: "flex", alignItems: "flex-start", width: "100%", maxWidth: "100vw" }}>
          {/* Global Sidebar anchored perfectly to the left */}
          <CodexSidebar readyTech={readyTech} />

          {/* Main content area */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", minHeight: "calc(100vh - 62px)" }}>
            <div style={{ flex: 1 }}>
              {children}
            </div>
            
            <footer style={{ borderTop: "1px solid var(--hairline)", marginTop: 60 }}>
              <div
                style={{
                  padding: "24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                  color: "var(--faint)",
                  fontSize: 13,
                }}
              >
                <span>Software Universe · built on your real Burger Farm codebase</span>
                <span>Phase 1 · the campus is just the beginning</span>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
