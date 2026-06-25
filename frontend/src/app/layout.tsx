import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plataforma de Tráfego Digital para Saúde",
  description: "Gere tráfego qualificado, landing pages e capte leads éticos para cuidadores e psicólogos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased selection:bg-clinical-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
