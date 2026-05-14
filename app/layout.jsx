import "./globals.css";
import { Inter } from "next/font/google";
import LayoutClient from "./LayoutClient";
import { AuthProvider } from "../contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sridevi Herbal & Co - Purely Natural Care",
  description:
    "Purely Natural Care. Trusted by crores of Indians. Free delivery, Cash on delivery, Lowest prices.",

  // ❌ DO NOT define `keywords` here
  // This allows product pages to set their own keywords
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <CartProvider> */}
        <AuthProvider>
          <CartProvider>
            <LayoutClient>{children}</LayoutClient>
          </CartProvider>
        </AuthProvider>
        {/* </CartProvider> */}
      </body>
    </html>
  );
}
