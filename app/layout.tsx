import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/services/auth/auth-context";
import { PwaRegister } from "@/components/pwa/PwaRegister";
import { AnimationGuard } from "@/components/ui/AnimationGuard";

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
    default: "EduWorld, Education Without Borders",
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
    title: "EduWorld, Education Without Borders",
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

const themeInitScript = `(function(){try{var t=localStorage.getItem('ew-theme');if(t!=='light'&&t!=='dark'){t='light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <AuthProvider>{children}</AuthProvider>
        <PwaRegister />
        <AnimationGuard />
      </body>
    </html>
  );
}
