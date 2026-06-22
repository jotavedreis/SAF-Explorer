import type { Metadata } from "next";
import "./globals.css";
import "./styles/theme.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/admin.css";
import "./styles/soil.css";
import { ThemeProvider } from "./theme-context";

const themeInitScript = `
(() => {
  try {
    const storedTheme = window.localStorage.getItem("saf-theme");
    const theme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : "light";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.dataset.theme = "light";
    document.documentElement.style.colorScheme = "light";
  }
})();
`;

export const metadata: Metadata = {
  title: "SAF Explorer | Catálogo de espécies",
  description: "Catálogo de espécies com navegação para clientes e área administrativa.",
  icons: {
    icon: [
      { url: "/images/favicon_io/favicon.ico" },
      { sizes: "16x16", type: "image/png", url: "/images/favicon_io/favicon-16x16.png" },
      { sizes: "32x32", type: "image/png", url: "/images/favicon_io/favicon-32x32.png" },
    ],
    apple: [{ sizes: "180x180", url: "/images/favicon_io/apple-touch-icon.png" }],
  },
  manifest: "/images/favicon_io/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
