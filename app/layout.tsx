import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Load custom fonts with fallback options for better rendering
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap", // Ensures quick display while the font loads
  fallback: ["Arial", "sans-serif"], // Fallback fonts for better UX in case custom fonts fail to load
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  fallback: ["Courier New", "monospace"],
});

// Define page metadata with more professional structure
export const metadata: Metadata = {
  title: "Next.js Professional App",
  description: "A professional web application built with Next.js",
  icons: {
    icon: "/favicon.ico", // Add favicon for a more polished feel
  },
  openGraph: {
    title: "Next.js Professional App",
    description: "A high-performance web application built with Next.js",
    url: "https://yourdomain.com",
    type: "website",
  },
};

// RootLayout component with structured and accessible HTML layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}
