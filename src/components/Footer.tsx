"use client";

import { useState, useEffect } from "react";
import { 
  Mail, Phone, MapPin, Globe, MessageCircle, ArrowUpRight, 
  ChevronDown, ShieldCheck, Clock 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { RCIConfig } from "@/lib/config";
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_CONTACT_SETTINGS,
  DEFAULT_SOCIAL_LINKS,
  DEFAULT_NAV_LINKS,
} from "@/lib/cms-defaults";

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SITE_SETTINGS);
  const [contactSettings, setContactSettings] = useState(DEFAULT_CONTACT_SETTINGS);
  const [socialLinks, setSocialLinks] = useState(DEFAULT_SOCIAL_LINKS);
  const [quickLinks, setQuickLinks] = useState<any[]>([]);
  const [usefulLinks, setUsefulLinks] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createClient();

    // Fetch site_settings
    supabase
      .from("site_settings")
      .select("*")
      .eq("id", "default")
      .single()
      .then(({ data }) => {
        if (data) setSiteSettings((prev) => ({ ...prev, ...data }));
      });

    // Fetch contact_settings
    supabase
      .from("contact_settings")
      .select("*")
      .eq("id", "default")
      .single()
      .then(({ data }) => {
        if (data) setContactSettings((prev) => ({ ...prev, ...data }));
      });

    // Fetch social_links
    supabase
      .from("social_links")
      .select("*")
      .eq("is_active", true)
      .order("display_order")
      .then(({ data }) => {
        if (data && data.length > 0) setSocialLinks(data);
      });

    // Fetch navigation_links
    supabase
      .from("navigation_links")
      .select("*")
      .eq("is_active", true)
      .order("display_order")
      .then(({ data }) => {
        if (data && data.length > 0) {
          setQuickLinks(data.filter((l: any) => l.location === "footer_quick"));
          setUsefulLinks(data.filter((l: any) => l.location === "footer_useful"));
        } else {
          setQuickLinks(DEFAULT_NAV_LINKS.filter((l) => l.location === "footer_quick"));
          setUsefulLinks(DEFAULT_NAV_LINKS.filter((l) => l.location === "footer_useful"));
        }
      });
  }, []);

  const cleanWhatsapp = contactSettings.whatsapp ? contactSettings.whatsapp.replace(/\D/g, "") : "";
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent("Hello RCI, I have an inquiry about computer courses.")}`;

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <footer className="bg-[#07152F] text-white pt-12 md:pt-18 pb-8 md:pb-12 border-t border-slate-800 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12 md:mb-16">
          
          {/* Col 1: Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block bg-white p-2.5 rounded-2xl shadow-sm group">
              <Image
                src={siteSettings.logo_url || "/logo.png"}
                alt={siteSettings.site_name}
                width={160}
                height={60}
                className="object-contain h-10 sm:h-12 w-auto"
                unoptimized
              />
            </Link>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">{siteSettings.site_name}</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm font-normal">
                Empowering students with practical computer education, recognized certifications, modern computer lab practice, and digital career guidance.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {cleanWhatsapp && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp RCI"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition-colors"
                  title="Chat on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}

              {socialLinks.map((soc) => (
                <a
                  key={soc.id}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={soc.platform}
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:bg-[#155EEF] hover:text-white hover:border-blue-500 transition-colors"
                  title={soc.platform}
                >
                  <Globe className="w-4 h-4" />
                </a>
              ))}
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
              <h4 className="text-[#D4A72C] font-extrabold tracking-wider uppercase text-xs">Quick Links</h4>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 md:hidden transition-transform duration-200 ${
                  openSection === "quickLinks" ? "rotate-180 text-blue-400" : ""
                }`}
              />
            </button>
            <ul
              className={`space-y-2.5 text-xs sm:text-sm text-slate-400 mt-3 md:block ${
                openSection === "quickLinks" ? "block" : "hidden md:block"
              }`}
            >
              {(quickLinks.length > 0 ? quickLinks : DEFAULT_NAV_LINKS.filter((l) => l.location === "footer_quick")).map(
                (item, i) => (
                  <li key={i}>
                    <Link
                      href={item.url}
                      target={item.open_new_tab ? "_blank" : undefined}
                      className="hover:text-blue-400 transition-colors flex items-center gap-1 group py-0.5"
                    >
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Col 3: Portal & Services */}
          <div className="border-t border-slate-800/80 md:border-t-0 pt-4 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection("usefulLinks")}
              className="flex items-center justify-between w-full md:cursor-default py-1 text-left"
              aria-expanded={openSection === "usefulLinks"}
            >
              <h4 className="text-[#D4A72C] font-extrabold tracking-wider uppercase text-xs">Portal &amp; Services</h4>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 md:hidden transition-transform duration-200 ${
                  openSection === "usefulLinks" ? "rotate-180 text-blue-400" : ""
                }`}
              />
            </button>
            <ul
              className={`space-y-2.5 text-xs sm:text-sm text-slate-400 mt-3 md:block ${
                openSection === "usefulLinks" ? "block" : "hidden md:block"
              }`}
            >
              {(usefulLinks.length > 0 ? usefulLinks : DEFAULT_NAV_LINKS.filter((l) => l.location === "footer_useful")).map(
                (item, i) => (
                  <li key={i}>
                    <Link
                      href={item.url}
                      target={item.open_new_tab ? "_blank" : undefined}
                      className="hover:text-blue-400 transition-colors flex items-center gap-1 py-0.5"
                    >
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Col 4: Contact Info & Office Hours */}
          <div className="border-t border-slate-800/80 md:border-t-0 pt-4 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection("contactUs")}
              className="flex items-center justify-between w-full md:cursor-default py-1 text-left"
              aria-expanded={openSection === "contactUs"}
            >
              <h4 className="text-[#D4A72C] font-extrabold tracking-wider uppercase text-xs">Contact Us</h4>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 md:hidden transition-transform duration-200 ${
                  openSection === "contactUs" ? "rotate-180 text-blue-400" : ""
                }`}
              />
            </button>
            <ul
              className={`space-y-3 text-xs sm:text-sm text-slate-400 mt-3 md:block ${
                openSection === "contactUs" ? "block" : "hidden md:block"
              }`}
            >
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{contactSettings.address}</span>
              </li>

              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${contactSettings.phone.replace(/\s+/g, "")}`} className="hover:text-white transition-colors font-medium">
                  {contactSettings.phone}
                </a>
              </li>

              {cleanWhatsapp && (
                <li className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-medium">
                    {contactSettings.whatsapp}
                  </a>
                </li>
              )}

              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${contactSettings.email}`} className="hover:text-white transition-colors break-all sm:break-normal">
                  {contactSettings.email}
                </a>
              </li>

              {contactSettings.office_hours && (
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{contactSettings.office_hours}</span>
                </li>
              )}

              {contactSettings.maps_url && (
                <li className="pt-1">
                  <a
                    href={contactSettings.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline font-semibold"
                  >
                    Find Us On Google Maps <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 pt-6 md:pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center md:text-left">
          <p className="leading-relaxed">
            &copy; {new Date().getFullYear()} {siteSettings.site_name}. All rights reserved. Registered under MSME &amp; ISO Quality Standards.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            <Link href="/admin/login" className="hover:text-slate-300 transition-colors flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Admin Portal</span>
            </Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
