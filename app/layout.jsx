import "./globals.css";
import SiteNav from "@/components/SiteNav";
import InlineRAGDrawer from "@/components/InlineRAGDrawer";

export const metadata = {
  title: "Software Universe — Software, finally understood.",
  description:
    "A visual, AI-guided field guide to software engineering — read it, watch it run, and break it on purpose. From your first line of code to planet-scale.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400;1,6..72,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400&family=IBM+Plex+Mono:wght@400;500;600&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
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
        <div style={{ minHeight: "calc(100vh - 62px)" }}>{children}</div>

        <footer style={{ borderTop: "1px solid var(--hairline)", marginTop: 64 }}>
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "22px 32px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-3)" }}>
              Software Universe · Vol. I
            </span>
            <nav style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              {[
                ["Curriculum", "/learn"],
                ["Paths", "/paths"],
                ["Roles", "/roles"],
                ["Codex", "/codex"],
                ["DSA Lab", "/dsa"],
                ["Simulator", "/simulator"],
                ["Playground", "/playground"],
                ["Case study", "/case-study"],
                ["Glossary", "/glossary"],
                ["The Plan", "/plan"],
              ].map(([label, href]) => (
                <a key={href} href={href} style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  {label}
                </a>
              ))}
            </nav>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--ink-3)" }}>
              est. 2026
            </span>
          </div>
        </footer>

        <InlineRAGDrawer />
      </body>
    </html>
  );
}
