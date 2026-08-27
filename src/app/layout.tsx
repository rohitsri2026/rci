import type { Metadata } from "next";
import { Inter, Outfit, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rciknp.vercel.app"),
  title: "Rohit Computer Institute (RCI) | Practical IT & Computer Education",
  description: "Rohit Computer Institute (RCI) provides practical computer training, DCA diploma, Tally Prime accounting, Web Development, Python, and QR-verifiable certificates.",
  keywords: [
    "Rohit Computer Institute",
    "RCI Kanpur",
    "Computer Institute Kanpur",
    "DCA Course",
    "Tally Prime GST Course",
    "Web Development Training",
    "Python Programming",
    "Certificate Verification RCI",
    "Computer Lab Kanpur"
  ],
  authors: [{ name: "Rohit Computer Institute" }],
  openGraph: {
    title: "Rohit Computer Institute (RCI) | Practical IT & Computer Education",
    description: "Build career-oriented computer skills with expert faculty, modern labs, and verifiable certificates.",
    url: "https://rciknp.vercel.app",
    siteName: "Rohit Computer Institute",
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 600,
        alt: "Rohit Computer Institute Campus & Training Banner",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohit Computer Institute (RCI) | Practical IT Education",
    description: "Build skills and build your career with RCI computer courses and verifiable certifications.",
    images: ["/banner.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: [
      { url: "/apple-icon.png", type: "image/png" },
      { url: "/apple-touch-icon.png", type: "image/png" },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Rohit Computer Institute",
  "alternateName": "RCI Kanpur",
  "url": "https://rciknp.vercel.app",
  "logo": "https://rciknp.vercel.app/logo.png",
  "image": "https://rciknp.vercel.app/banner.png",
  "description": "Rohit Computer Institute delivers practical computer education, DCA diploma, Tally accounting, web development, and QR-verifiable certification.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Sanjay Nagar Cantt",
    "addressLocality": "Kanpur",
    "addressRegion": "Uttar Pradesh",
    "postalCode": "208004",
    "addressCountry": "IN"
  },
  "telephone": "+91-7376893097",
  "priceRange": "₹1499 - ₹9999",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Computer & IT Training Courses",
    "itemListElement": [
      {
        "@type": "Course",
        "name": "Diploma in Computer Application (DCA)",
        "description": "Comprehensive 1-year diploma covering MS Office, Windows OS, DTP, and core computing."
      },
      {
        "@type": "Course",
        "name": "Tally Prime & GST Accounting",
        "description": "3-month financial accounting and GST invoicing certification."
      },
      {
        "@type": "Course",
        "name": "Advanced Web Development",
        "description": "6-month web development program covering HTML, CSS, JS, React, and databases."
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, outfit.variable, "font-sans", geist.variable)}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30">
        {children}
      </body>
    </html>
  );
}
