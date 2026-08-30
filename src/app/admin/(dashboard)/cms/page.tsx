"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Palette, UserCheck, Home, Images, Megaphone, BookOpen, Sparkles, BarChart2,
  PhoneCall, Share2, Compass, Search, FileImage, ExternalLink, RefreshCw,
  CheckCircle2, AlertCircle, LayoutDashboard
} from "lucide-react";
import { getAllCmsDataClient } from "@/lib/cms-client";
import { CmsFullData } from "@/types/cms";
import {
  BrandingEditor,
  DirectorEditor,
  HomepageHeroEditor,
  HomepageBannersManager,
  AnnouncementEditor,
  AboutContentEditor,
  FeaturesManager,
  StatsManager,
  ContactEditor,
  SocialLinksManager,
  NavigationManager,
  SeoEditor,
} from "@/components/admin/cms/CMSCategoryEditors";

type CmsCategory =
  | "branding"
  | "director"
  | "homepage"
  | "banners"
  | "announcement"
  | "about"
  | "features"
  | "stats"
  | "contact"
  | "social"
  | "navigation"
  | "seo";

const CATEGORIES: { id: CmsCategory; label: string; icon: React.ElementType; description: string }[] = [
  { id: "branding", label: "Branding", icon: Palette, description: "Manage logo, favicon, institute name, tagline & colors" },
  { id: "director", label: "Director & Institute", icon: UserCheck, description: "Manage director message, photo, designation & institute details" },
  { id: "homepage", label: "Homepage Hero", icon: Home, description: "Manage hero heading, badge, description & main CTAs" },
  { id: "banners", label: "Banner Slider", icon: Images, description: "Manage desktop & mobile banner slider images" },
  { id: "announcement", label: "Announcement Bar", icon: Megaphone, description: "Manage top announcement bar message & link" },
  { id: "about", label: "About & Content", icon: BookOpen, description: "Manage About RCI, Mission, and Vision content" },
  { id: "features", label: "Why Choose RCI", icon: Sparkles, description: "Manage feature cards & practical benefits" },
  { id: "stats", label: "Statistics", icon: BarChart2, description: "Manage dynamic counter statistics" },
  { id: "contact", label: "Contact Info", icon: PhoneCall, description: "Manage phone, WhatsApp, email, maps link & hours" },
  { id: "social", label: "Social Media", icon: Share2, description: "Manage Facebook, Instagram, YouTube, Telegram links" },
  { id: "navigation", label: "Navigation Links", icon: Compass, description: "Manage header & footer dynamic menu links" },
  { id: "seo", label: "SEO & Metadata", icon: Search, description: "Manage site title, meta descriptions, keywords & OG tags" },
];

export default function AdminCmsPage() {
  const [activeCategory, setActiveCategory] = useState<CmsCategory>("branding");
  const [cmsData, setCmsData] = useState<CmsFullData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllCmsDataClient();
      setCmsData(data);
    } catch (e) {
      console.error("Failed to load CMS data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calculate actual setup completion score dynamically
  const calculateCompletion = (data: CmsFullData | null) => {
    if (!data) return 0;
    let score = 0;
    let total = 10;

    if (data.siteSettings.logo_url) score += 1;
    if (data.directorProfile.photo_url) score += 1;
    if (data.homepageSettings.hero_title) score += 1;
    if (data.banners.length > 0) score += 1;
    if (data.announcement.message) score += 1;
    if (data.aboutSections.length > 0) score += 1;
    if (data.features.length > 0) score += 1;
    if (data.stats.length > 0) score += 1;
    if (data.contactSettings.phone && data.contactSettings.whatsapp) score += 1;
    if (data.seoSettings.site_title && data.seoSettings.meta_description) score += 1;

    return Math.round((score / total) * 100);
  };

  const completionScore = calculateCompletion(cmsData);

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header & Status Overview Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Background glow overlay */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-extrabold uppercase tracking-wider">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Centralized Website CMS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Website Content Management System
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-2xl leading-relaxed">
              Control every aspect of the public Rohit Computer Institute (RCI) website from branding to homepage banners, contact settings, and search engine metadata.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin/cms/media"
              className="min-h-[44px] px-4 py-2.5 bg-slate-800/90 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold border border-slate-700/80 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <FileImage className="w-4 h-4 text-blue-400" />
              <span>Media Library</span>
            </Link>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Preview Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Dynamic Status Grid & Completion Indicator */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Setup Completion */}
          <div className="sm:col-span-2 bg-slate-850/70 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300">Website Configuration Completion</span>
              <span className="text-blue-400 font-mono font-black">{completionScore}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionScore}%` }}
              />
            </div>
            <p className="text-[10.5px] text-slate-400 font-medium">
              Calculated dynamically from active CMS settings and content modules.
            </p>
          </div>

          {/* Logo Status */}
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cmsData?.siteSettings.logo_url ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"}`}>
              {cmsData?.siteSettings.logo_url ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Logo Status</p>
              <p className="text-xs font-extrabold text-white truncate">
                {cmsData?.siteSettings.logo_url ? "Custom Logo Set" : "Default Logo"}
              </p>
            </div>
          </div>

          {/* Banner Status */}
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cmsData && cmsData.banners.length > 0 ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"}`}>
              <Images className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Homepage Banners</p>
              <p className="text-xs font-extrabold text-white">
                {cmsData ? `${cmsData.banners.length} Active Banners` : "Loading..."}
              </p>
            </div>
          </div>

          {/* SEO Status */}
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cmsData?.seoSettings.meta_description ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"}`}>
              <Search className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">SEO Meta Tags</p>
              <p className="text-xs font-extrabold text-white">
                {cmsData?.seoSettings.meta_description ? "SEO Configured" : "Defaults Active"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main CMS Layout: Sidebar Navigation + Content Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Desktop Sidebar & Mobile Category Selection Tabs */}
        <div className="lg:col-span-3 space-y-2">
          {/* Mobile Category Dropdown / Horizontal Tabs */}
          <div className="lg:hidden bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl p-2 shadow-xs overflow-x-auto flex gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop Category Navigation */}
          <div className="hidden lg:block bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3 shadow-xs space-y-1 sticky top-6">
            <p className="px-3 py-2 text-[10.5px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
              CMS Navigation Categories
            </p>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor Content Area */}
        <div className="lg:col-span-9">
          {loading || !cmsData ? (
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-12 text-center space-y-4 shadow-xs">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-700">Loading CMS Configuration...</p>
            </div>
          ) : (
            <>
              {activeCategory === "branding" && (
                <BrandingEditor initialData={cmsData.siteSettings} onRefresh={loadData} />
              )}
              {activeCategory === "director" && (
                <DirectorEditor initialData={cmsData.directorProfile} onRefresh={loadData} />
              )}
              {activeCategory === "homepage" && (
                <HomepageHeroEditor initialData={cmsData.homepageSettings} onRefresh={loadData} />
              )}
              {activeCategory === "banners" && (
                <HomepageBannersManager initialData={cmsData.banners} onRefresh={loadData} />
              )}
              {activeCategory === "announcement" && (
                <AnnouncementEditor initialData={cmsData.announcement} onRefresh={loadData} />
              )}
              {activeCategory === "about" && (
                <AboutContentEditor initialData={cmsData.aboutSections} onRefresh={loadData} />
              )}
              {activeCategory === "features" && (
                <FeaturesManager initialData={cmsData.features} onRefresh={loadData} />
              )}
              {activeCategory === "stats" && (
                <StatsManager initialData={cmsData.stats} onRefresh={loadData} />
              )}
              {activeCategory === "contact" && (
                <ContactEditor initialData={cmsData.contactSettings} onRefresh={loadData} />
              )}
              {activeCategory === "social" && (
                <SocialLinksManager initialData={cmsData.socialLinks} onRefresh={loadData} />
              )}
              {activeCategory === "navigation" && (
                <NavigationManager initialData={cmsData.navLinks} onRefresh={loadData} />
              )}
              {activeCategory === "seo" && (
                <SeoEditor initialData={cmsData.seoSettings} onRefresh={loadData} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
