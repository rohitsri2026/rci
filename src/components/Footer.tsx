import { Mail, Phone, MapPin, Globe, MessageCircle, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RCIConfig } from "@/lib/config";

export default function Footer() {
  const whatsappUrl = RCIConfig.getWhatsAppUrl("Hello RCI, I have an inquiry about computer courses.");

  return (
    <footer className="bg-slate-950 text-white pt-20 pb-12 border-t border-slate-800 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-16">
          
          {/* Col 1: Brand & About */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block bg-white p-3 rounded-2xl mb-6 shadow-sm group">
              <Image src="/logo.png" alt="Rohit Computer Institute Logo" width={180} height={70} className="object-contain h-14 w-auto" />
            </Link>
            
            <h3 className="text-xl font-bold text-white mb-2">{RCIConfig.instituteName}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              Empowering students with practical computer education, recognized certifications, modern computer lab practice, and digital career guidance.
            </p>

            <div className="flex items-center gap-3">
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
          <div>
            <h4 className="text-white font-bold mb-5 text-base tracking-wide uppercase text-xs text-blue-400">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Courses Offered", href: "/courses" },
                { label: "Admissions", href: "/admission" },
                { label: "Verify Certificate", href: "/verify" },
                { label: "Contact Us", href: "/contact" },
              ].map((item, i) => (
                <li key={i}>
                  <Link href={item.href} className="hover:text-blue-400 transition-colors flex items-center gap-1 group">
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Student Portal */}
          <div>
            <h4 className="text-white font-bold mb-5 text-base tracking-wide uppercase text-xs text-blue-400">Student Portal</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              {[
                { label: "Student Login", href: "/student/login" },
                { label: "Fee Ledger & Receipts", href: "/student/login" },
                { label: "Exam Results & Marks", href: "/student/login" },
                { label: "Download Certificates", href: "/verify" },
                { label: "Study Materials", href: "/student/login" },
              ].map((item, i) => (
                <li key={i}>
                  <Link href={item.href} className="hover:text-blue-400 transition-colors flex items-center gap-1">
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-5 text-base tracking-wide uppercase text-xs text-blue-400">Contact Us</h4>
            <ul className="space-y-4 text-sm text-slate-400">
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
                <a href={`mailto:${RCIConfig.email}`} className="hover:text-white transition-colors">
                  {RCIConfig.email}
                </a>
              </li>

              <li className="pt-2">
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
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} {RCIConfig.instituteName}. All rights reserved. Registered under MSME & ISO Quality Standards.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
