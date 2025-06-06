import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ConvexClerkProvider from "@/providers/ConvexClerkProvider";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Splitwise",
  description: "The smartest way to split expenses with friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <html lang="en">
        <head>
          <link rel="shortcut icon" href="favicon.svg" type="image/x-icon" />
        </head>

        <body className={`${inter.className} antialiased`}>
          <Header />
          {children}
        </body>
      </html>
    </ConvexClerkProvider>
  );
}
