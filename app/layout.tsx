import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "xStocks Price Screener",
  description: "Real-time price comparison and arbitrage detection for tokenized stocks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
