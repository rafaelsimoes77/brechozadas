import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MarketplaceProvider } from "@/context/MarketplaceContext";
import { Navbar } from "@/components/Navbar";
import { BagDrawer, FavoritesDrawer } from "@/components/BagDrawer";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  title: "BRECHOZADAS | O Marketplace da Moda de Quebrada (@acervodoreliquia)",
  description:
    "Compre, venda, faça ofertas e monte sua sacolinha nos melhores brechós urbanos. Curadoria fundadora @acervodoreliquia — Brechó, Acervo & Styling.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BRECHOZADAS",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#121212",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-concrete-100 text-ink pb-16 md:pb-0">
        <MarketplaceProvider>
          <Navbar />
          <BagDrawer />
          <FavoritesDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileBottomNav />
        </MarketplaceProvider>
      </body>
    </html>
  );
}
