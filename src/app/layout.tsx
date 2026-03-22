import type { Metadata } from "next";
import { CartProvider } from "@/context/cart-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { SplashIntro } from "@/components/splash-intro";
import { CameraRoll } from "@/components/camera-roll";
import "./globals.css";

export const metadata: Metadata = {
  title: "MAYA — Care and Wellness for Dogs",
  description:
    "Premium dog wellness from Los Angeles and Ciudad de México. Supplements, care, and apparel. All Furs · Todos Pieles.",
  openGraph: {
    title: "MAYA — Care and Wellness for Dogs",
    description:
      "Premium dog wellness from Los Angeles and Ciudad de México. Supplements, care, and apparel.",
    siteName: "MAYA",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <SplashIntro />
          <Header />
          <main className="flex-1">{children}</main>
          <CameraRoll />
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
