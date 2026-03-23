import type { Metadata } from "next";
import { Inter, Playfair_Display, Pacifico } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "xLPA — Master Technical Interviews",
  description:
    "An interactive platform for mastering Machine Coding, DSA, and System Design. Prepare for your next engineering interview with hands-on coding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} ${playfair.variable} ${pacifico.variable} h-full antialiased font-sans`}
      >
        <body 
          className="min-h-full flex flex-col bg-black text-gray-200"
          suppressHydrationWarning
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
