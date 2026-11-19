import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/services/auth/auth-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "EduWorld — Education Without Borders",
    template: "%s | EduWorld",
  },
  description:
    "EduWorld is an international learning platform making quality education accessible to every learner, everywhere. Courses, lessons, quizzes and an AI tutor in one place.",
  manifest: "/manifest.webmanifest",
  applicationName: "EduWorld",
  appleWebApp: {
    capable: true,
    title: "EduWorld",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "EduWorld — Education Without Borders",
    description:
      "Quality education accessible to every learner, everywhere. Courses, lessons, quizzes and an AI tutor.",
    type: "website",
    locale: "en_US",
    siteName: "EduWorld",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0e1830",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-white font-sans text-ink antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
