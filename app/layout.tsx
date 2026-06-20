import type { Metadata } from "next";
import "./globals.css";
import "./styles/theme.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/admin.css";
import "./styles/soil.css";

export const metadata: Metadata = {
  title: "SAF Explorer | Catálogo de espécies",
  description: "Catálogo de espécies com navegação para clientes e área administrativa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
