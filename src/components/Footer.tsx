"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Globe, MessageCircle, ArrowUpRight, ChevronDown, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RCIConfig } from "@/lib/config";

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const whatsappUrl = RCIConfig.getWhatsAppUrl("Hello RCI, I have an inquiry about computer courses.");

  const toggleSection = (section: string) => {
    setOpenSection(prev => (prev === section ? null : section));
  };

  return (
    <footer className="bg-slate-950 text-white pt-12 md:pt-20 pb-8 md:pb-12 border-t border-slate-800 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12 md:mb-16">
          
          {/* Col 1: Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block bg-white p-3 rounded-2xl shadow-sm group">
              <Image src="/logo.png" alt="Rohit Computer Institute Logo" width={180} height={70} className="object-contain h-12 sm:h-14 w-auto" />
            </Link>
            
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">{RCIConfig.instituteName}</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                Empowering students with practical computer education, recognized certifications, modern computer lab practice, and digital career guidance.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp RCI"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>

              <a
                href={RCIConfig.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="RCI Website"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-colors"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="border-t border-slate-800/80 md:border-t-0 pt-4 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection("quickLinks")}
              className="flex items-center justify-between w-full md:cursor-default py-1 text-left"
              aria-expanded={openSection === "quickLinks"}
            >
              <h4 className="text-blue-400 font-extrabold tracking-wider uppercase text-xs">Quick Links</h4>
              <ChevronDown className={`w-4 h-4 text-slate-400 md:hidden transition-transform duration-200 ${openSection === "quickLinks" ? "rotate-180 text-blue-400" : ""}`} />
            </button>
            <ul className={`space-y-3 text-sm text-slate-400 mt-3 md:block ${openSection === "quickLinks" ? "block" : "hidden md:block"}`}>
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Courses Offered", href: "/courses" },
                { label: "Admissions", href: "/admission" },
                { label: "Verify Certificate", href: "/verify" },
                { label: "Admin Login", href: "/admin/login" },
                { label: "Contact Us", href: "/contact" },
              ].map((item, i) => (
                <li key={i}>
                  <Link href={item.href} className="hover:text-blue-400 transition-colors flex items-center gap-1 group py-0.5">
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Student Portal */}
          <div className="border-t border-slate-800/80 md:border-t-0 pt-4 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection("studentPortal")}
              className="flex items-center justify-between w-full md:cursor-default py-1 text-left"
              aria-expanded={openSection === "studentPortal"}
            >
              <h4 className="text-blue-400 font-extrabold tracking-wider uppercase text-xs">Student Portal</h4>
              <ChevronDown className={`w-4 h-4 text-slate-400 md:hidden transition-transform duration-200 ${openSection === "studentPortal" ? "rotate-180 text-blue-400" : ""}`} />
            </button>
            <ul className={`space-y-3 text-sm text-slate-400 mt-3 md:block ${openSection === "studentPortal" ? "block" : "hidden md:block"}`}>
              {[
                { label: "Student Login", href: "/student/login" },
                { label: "Fee Ledger & Receipts", href: "/student/login" },
                { label: "Exam Results & Marks", href: "/student/login" },
                { label: "Download Certificates", href: "/verify" },
                { label: "Study Materials", href: "/student/login" },
              ].map((item, i) => (
                <li key={i}>
                  <Link href={item.href} className="hover:text-blue-400 transition-colors flex items-center gap-1 py-0.5">
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div className="border-t border-slate-800/80 md:border-t-0 pt-4 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection("contactUs")}
              className="flex items-center justify-between w-full md:cursor-default py-1 text-left"
              aria-expanded={openSection === "contactUs"}
            >
              <h4 className="text-blue-400 font-extrabold tracking-wider uppercase text-xs">Contact Us</h4>
              <ChevronDown className={`w-4 h-4 text-slate-400 md:hidden transition-transform duration-200 ${openSection === "contactUs" ? "rotate-180 text-blue-400" : ""}`} />
            </button>
            <ul className={`space-y-3.5 text-sm text-slate-400 mt-3 md:block ${openSection === "contactUs" ? "block" : "hidden md:block"}`}>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  {RCIConfig.address}
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <a href={`tel:${RCIConfig.phoneRaw}`} className="hover:text-white transition-colors font-medium">
                  {RCIConfig.phoneFormatted}
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <a href={`mailto:${RCIConfig.email}`} className="hover:text-white transition-colors break-all sm:break-normal">
                  {RCIConfig.email}
                </a>
              </li>

              <li className="pt-1">
                <a
                  href={RCIConfig.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline font-semibold"
                >
                  Find Us On Google Maps <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-6 md:pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center md:text-left">
          <p className="leading-relaxed">
            &copy; {new Date().getFullYear()} {RCIConfig.instituteName}. All rights reserved. Registered under MSME &amp; ISO Quality Standards.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            <Link href="/admin/login" className="hover:text-slate-300 transition-colors flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Admin Portal</span>
            </Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
