import "./globals.css";
import SiteNav from "@/components/SiteNav";

export const metadata = {
  title: "Software Universe — Burger Farm, understood",
  description:
    "An interactive engineering university built on your real Burger Farm codebase. From zero to architect — what we built, why, what breaks, and how it scales.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteNav />
        {children}
        <footer style={{ borderTop: "1px solid var(--hairline)", marginTop: 80 }}>
          <div
            className="wrap"
            style={{
              padding: "28px 24px",
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
      </body>
    </html>
  );
}
