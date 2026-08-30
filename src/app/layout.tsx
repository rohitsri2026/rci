import type { Metadata } from "next";
import { Inter, Outfit, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { getSeoSettings, getSiteSettings } from "@/lib/cms";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const site = await getSiteSettings();

  const defaultTitle = site.browser_title || `${site.site_name} | ${site.tagline}`;
  const description = seo.meta_description;
  const keywords = seo.keywords
    ? seo.keywords.split(",").map((k) => k.trim())
    : [site.site_name, site.short_name, "Computer Institute", "DCA Course"];
  const ogImage = seo.og_image_url || site.logo_url || "/banner.png";
  const favicon = site.favicon_url || "/favicon.png";
  const siteUrl = seo.canonical_url || "https://rciknp.vercel.app";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: defaultTitle,
      template: `%s | ${site.site_name}`,
    },
    description,
    keywords,
    authors: [{ name: site.site_name }],
    openGraph: {
      title: seo.og_title || defaultTitle,
      description: seo.og_description || description,
      url: siteUrl,
      siteName: site.site_name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${site.site_name} Banner`,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitter_title || defaultTitle,
      description: seo.twitter_description || description,
      images: [seo.twitter_image_url || ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [
        { url: favicon, type: "image/png" },
        { url: "/icon.png", type: "image/png" },
      ],
      shortcut: favicon,
      apple: [
        { url: favicon, type: "image/png" },
        { url: "/apple-icon.png", type: "image/png" },
      ],
    },
  };
}

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
