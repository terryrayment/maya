import type { Metadata } from "next";
import { CartProvider } from "@/context/cart-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { SplashIntro } from "@/components/splash-intro";
import "./globals.css";

export const metadata: Metadata = {
  title: "MAYA — Care and Wellness for Dogs",
  description:
    "Premium dog wellness from Los Angeles and Ciudad de M\u00e9xico. Supplements, care, and apparel. All Furs \u00b7 Todos Pieles.",
  openGraph: {
    title: "MAYA — Care and Wellness for Dogs",
    description:
      "Premium dog wellness from Los Angeles and Ciudad de M\u00e9xico. Supplements, care, and apparel.",
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
      <body>
        <CartProvider>
          <SplashIntro />
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
