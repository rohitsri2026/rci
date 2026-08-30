"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Save, RefreshCw, CheckCircle, AlertTriangle, Plus, Trash2, Edit3, Eye,
  ArrowUp, ArrowDown, ExternalLink, ShieldAlert, Sparkles, Globe, Share2, Search,
  Phone, Mail, MapPin, Clock, Lock, X
} from "lucide-react";
import ImageUploader from "./ImageUploader";
import { useCMSFeedback } from "./CMSFeedbackProvider";
import AnnouncementManager from "./AnnouncementManager";
import {
  updateSiteSettingsAction,
  updateDirectorProfileAction,
  updateHomepageSettingsAction,
  saveBannerAction,
  deleteBannerAction,
  updateAnnouncementSettingsAction,
  updateAboutSectionAction,
  saveFeatureAction,
  deleteFeatureAction,
  saveStatAction,
  deleteStatAction,
  updateContactSettingsAction,
  saveSocialLinkAction,
  deleteSocialLinkAction,
  saveNavigationLinkAction,
  deleteNavigationLinkAction,
  updateSeoSettingsAction,
} from "@/app/admin/(dashboard)/cms/cms-actions";
import {
  SiteSettings,
  DirectorProfile,
  HomepageSettings,
  HomepageBanner,
  AnnouncementSettings,
  AboutSection,
  HomepageFeature,
  HomepageStat,
  ContactSettings,
  SocialLink,
  NavigationLink,
  SeoSettings,
} from "@/types/cms";

interface EditorProps<T> {
  initialData: T;
  onRefresh?: () => void;
}

function FeedbackBanner({
  message,
  onClose,
}: {
  message: { type: "success" | "error"; text: string } | null;
  onClose: () => void;
}) {
  if (!message) return null;

  return (
    <div
      className={`p-4 rounded-2xl text-xs font-extrabold flex items-center justify-between gap-3 shadow-md border transition-all animate-in fade-in slide-in-from-top-2 ${
        message.type === "success"
          ? "bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20"
          : "bg-red-600 text-white border-red-500 shadow-red-500/20"
      }`}
    >
      <div className="flex items-center gap-3">
        {message.type === "success" ? (
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-100" />
        ) : (
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-100" />
        )}
        <span className="text-sm tracking-tight font-semibold">{message.text}</span>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer text-white"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ----------------------------------------------------
// 1. BRANDING EDITOR
// ----------------------------------------------------
export function BrandingEditor({ initialData, onRefresh }: EditorProps<SiteSettings>) {
  const [formData, setFormData] = useState<SiteSettings>(initialData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { showSuccess, showError, showSaving } = useCMSFeedback();

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setMessage(null);
    showSaving("Saving branding settings to remote database...");
    console.log("[CMS] Saving branding settings...", formData);
    try {
      const res = await updateSiteSettingsAction(formData);
      console.log("[CMS] Branding save response:", res);
      if (res.success) {
        if (res.data) setFormData(res.data);
        const msg = res.message || "Branding settings saved successfully.";
        setMessage({ type: "success", text: msg });
        showSuccess(msg, "Branding");
        if (onRefresh) onRefresh();
      } else {
        const err = res.error || "Failed to save branding settings.";
        setMessage({ type: "error", text: err });
        showError(err);
      }
    } catch (err) {
      console.error("[CMS] Save branding exception:", err);
      const errMsg = "An unexpected error occurred while saving branding settings.";
      setMessage({ type: "error", text: errMsg });
      showError(errMsg);
    } finally {
      setSaving(false);
    }
  };

  const resetColors = () => {
    setFormData((prev) => ({
      ...prev,
      primary_color: "#07152F",
      secondary_color: "#155EEF",
      accent_color: "#D4A72C",
    }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <FeedbackBanner message={message} onClose={() => setMessage(null)} />

      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
        <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>🎨 Institute Branding & Visual Identity</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploader
            label="Institute Logo (Header & Footer)"
            category="logo"
            value={formData.logo_url}
            onChange={(url) => setFormData((prev) => ({ ...prev, logo_url: url }))}
            recommendedDimensions="240 x 80 px (PNG / SVG)"
            aspectRatio="wide"
          />

          <ImageUploader
            label="Website Favicon"
            category="favicon"
            value={formData.favicon_url}
            onChange={(url) => setFormData((prev) => ({ ...prev, favicon_url: url }))}
            recommendedDimensions="64 x 64 px (Square PNG / ICO)"
            aspectRatio="square"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Institute Name</label>
            <input
              type="text"
              value={formData.site_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, site_name: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Short Name</label>
            <input
              type="text"
              value={formData.short_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, short_name: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData((prev) => ({ ...prev, tagline: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Default Browser Title</label>
            <input
              type="text"
              value={formData.browser_title}
              onChange={(e) => setFormData((prev) => ({ ...prev, browser_title: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Colors */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold text-slate-900">Brand Color Theme</label>
            <button
              type="button"
              onClick={resetColors}
              className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Reset to RCI Defaults
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="block text-[11px] font-bold text-slate-600 mb-1">Primary (Navy)</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.primary_color}
                  onChange={(e) => setFormData((prev) => ({ ...prev, primary_color: e.target.value }))}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5"
                />
                <input
                  type="text"
                  value={formData.primary_color}
                  onChange={(e) => setFormData((prev) => ({ ...prev, primary_color: e.target.value }))}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs font-bold uppercase"
                />
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-bold text-slate-600 mb-1">Secondary (Royal Blue)</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.secondary_color}
                  onChange={(e) => setFormData((prev) => ({ ...prev, secondary_color: e.target.value }))}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5"
                />
                <input
                  type="text"
                  value={formData.secondary_color}
                  onChange={(e) => setFormData((prev) => ({ ...prev, secondary_color: e.target.value }))}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs font-bold uppercase"
                />
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-bold text-slate-600 mb-1">Accent (Gold)</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.accent_color}
                  onChange={(e) => setFormData((prev) => ({ ...prev, accent_color: e.target.value }))}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5"
                />
                <input
                  type="text"
                  value={formData.accent_color}
                  onChange={(e) => setFormData((prev) => ({ ...prev, accent_color: e.target.value }))}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs font-bold uppercase"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FeedbackBanner message={message} onClose={() => setMessage(null)} />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="min-h-[44px] px-6 py-2.5 bg-[#155EEF] hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-extrabold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? "Saving..." : "Save Branding Changes"}</span>
        </button>
      </div>
    </form>
  );
}

// ----------------------------------------------------
// 2. DIRECTOR & INSTITUTE PROFILE EDITOR
// ----------------------------------------------------
export function DirectorEditor({ initialData, onRefresh }: EditorProps<DirectorProfile>) {
  const [formData, setFormData] = useState<DirectorProfile>(initialData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { showSuccess, showError, showSaving } = useCMSFeedback();

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setMessage(null);
    showSaving("Saving director profile to remote database...");
    console.log("[CMS] Saving director profile...", formData);
    try {
      const res = await updateDirectorProfileAction(formData);
      console.log("[CMS] Director save response:", res);
      if (res.success) {
        if (res.data) setFormData(res.data);
        const msg = res.message || "Director profile saved successfully.";
        setMessage({ type: "success", text: msg });
        showSuccess(msg, "Director Profile");
        if (onRefresh) onRefresh();
      } else {
        const err = res.error || "Failed to save director profile.";
        setMessage({ type: "error", text: err });
        showError(err);
      }
    } catch (err) {
      console.error("[CMS] Save director exception:", err);
      const errMsg = "An unexpected error occurred while saving director profile.";
      setMessage({ type: "error", text: errMsg });
      showError(errMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <FeedbackBanner message={message} onClose={() => setMessage(null)} />

      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
        <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>👤 Director & Institute Leadership Profile</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploader
            label="Director Official Photo"
            category="director"
            value={formData.photo_url}
            onChange={(url) => setFormData((prev) => ({ ...prev, photo_url: url }))}
            recommendedDimensions="600 x 600 px (Square Portrait)"
            aspectRatio="square"
          />

          <ImageUploader
            label="Director Official Signature"
            category="director"
            value={formData.signature_url}
            onChange={(url) => setFormData((prev) => ({ ...prev, signature_url: url }))}
            recommendedDimensions="300 x 100 px (Transparent PNG)"
            aspectRatio="wide"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Director Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData((prev) => ({ ...prev, designation: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Established Year</label>
            <input
              type="text"
              value={formData.established_year}
              onChange={(e) => setFormData((prev) => ({ ...prev, established_year: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Director's Welcome Message</label>
          <textarea
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none leading-relaxed"
            required
          />
        </div>
      </div>

      <FeedbackBanner message={message} onClose={() => setMessage(null)} />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="min-h-[44px] px-6 py-2.5 bg-[#155EEF] hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-extrabold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? "Saving..." : "Save Director Profile"}</span>
        </button>
      </div>
    </form>
  );
}

// ----------------------------------------------------
// 3. HOMEPAGE HERO EDITOR
// ----------------------------------------------------
export function HomepageHeroEditor({ initialData, onRefresh }: EditorProps<HomepageSettings>) {
  const [formData, setFormData] = useState<HomepageSettings>(initialData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { showSuccess, showError, showSaving } = useCMSFeedback();

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setMessage(null);
    showSaving("Saving homepage hero settings...");
    console.log("[CMS] Saving homepage hero...", formData);
    try {
      const res = await updateHomepageSettingsAction(formData);
      console.log("[CMS] Hero save response:", res);
      if (res.success) {
        if (res.data) setFormData(res.data);
        const msg = res.message || "Homepage hero settings saved successfully.";
        setMessage({ type: "success", text: msg });
        showSuccess(msg, "Homepage Hero");
        if (onRefresh) onRefresh();
      } else {
        const err = res.error || "Failed to save homepage hero settings.";
        setMessage({ type: "error", text: err });
        showError(err);
      }
    } catch (err) {
      console.error("[CMS] Save hero exception:", err);
      const errMsg = "An unexpected error occurred while saving homepage hero.";
      setMessage({ type: "error", text: errMsg });
      showError(errMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <FeedbackBanner message={message} onClose={() => setMessage(null)} />

      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
        <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>🏠 Homepage Hero Section Editor</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Hero Badge Text</label>
            <input
              type="text"
              value={formData.hero_badge}
              onChange={(e) => setFormData((prev) => ({ ...prev, hero_badge: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              placeholder="e.g. Trusted Computer Education"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Main Heading</label>
            <input
              type="text"
              value={formData.hero_title}
              onChange={(e) => setFormData((prev) => ({ ...prev, hero_title: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              placeholder="e.g. Build Your Digital Future"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Highlight Text (Gradient)</label>
            <input
              type="text"
              value={formData.hero_highlight}
              onChange={(e) => setFormData((prev) => ({ ...prev, hero_highlight: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              placeholder="e.g. With Practical IT Skills"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Hero Description</label>
          <textarea
            rows={3}
            value={formData.hero_description}
            onChange={(e) => setFormData((prev) => ({ ...prev, hero_description: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploader
            label="Hero Main Feature Image"
            category="homepage"
            value={formData.hero_image_url}
            onChange={(url) => setFormData((prev) => ({ ...prev, hero_image_url: url }))}
            recommendedDimensions="1200 x 800 px"
            aspectRatio="wide"
          />

          <ImageUploader
            label="Hero Background Pattern / Image"
            category="homepage"
            value={formData.hero_bg_url}
            onChange={(url) => setFormData((prev) => ({ ...prev, hero_bg_url: url }))}
            recommendedDimensions="1920 x 1080 px"
            aspectRatio="wide"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800">Primary Call To Action Button</h4>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Button Text</label>
              <input
                type="text"
                value={formData.primary_cta_text}
                onChange={(e) => setFormData((prev) => ({ ...prev, primary_cta_text: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Target URL</label>
              <input
                type="text"
                value={formData.primary_cta_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, primary_cta_url: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800">Secondary Call To Action Button</h4>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Button Text</label>
              <input
                type="text"
                value={formData.secondary_cta_text}
                onChange={(e) => setFormData((prev) => ({ ...prev, secondary_cta_text: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Target URL</label>
              <input
                type="text"
                value={formData.secondary_cta_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, secondary_cta_url: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <FeedbackBanner message={message} onClose={() => setMessage(null)} />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="min-h-[44px] px-6 py-2.5 bg-[#155EEF] hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-extrabold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? "Saving..." : "Save Hero Settings"}</span>
        </button>
      </div>
    </form>
  );
}

// ----------------------------------------------------
// 4. HOMEPAGE BANNERS MANAGER
// ----------------------------------------------------
export function HomepageBannersManager({ initialData, onRefresh }: EditorProps<HomepageBanner[]>) {
  const [banners, setBanners] = useState<HomepageBanner[]>(initialData);
  const [editingBanner, setEditingBanner] = useState<Partial<HomepageBanner> | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { showSuccess, showError, showSaving } = useCMSFeedback();

  useEffect(() => {
    setBanners(initialData);
  }, [initialData]);

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner || saving) return;

    setSaving(true);
    setMessage(null);
    showSaving("Saving homepage banner...");
    console.log("[CMS] Saving banner...", editingBanner);
    try {
      const res = await saveBannerAction(editingBanner);
      console.log("[CMS] Banner save response:", res);
      if (res.success) {
        const msg = res.message || "Homepage banner saved successfully.";
        setMessage({ type: "success", text: msg });
        showSuccess(msg, "Banner Slider");
        setEditingBanner(null);
        if (onRefresh) onRefresh();
      } else {
        const err = res.error || "Failed to save banner.";
        setMessage({ type: "error", text: err });
        showError(err);
      }
    } catch (err) {
      console.error("[CMS] Save banner exception:", err);
      showError("An unexpected error occurred while saving banner.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    showSaving("Deleting banner...");
    try {
      const res = await deleteBannerAction(id);
      if (res.success) {
        showSuccess("Banner deleted successfully.", "Banner Slider");
        if (onRefresh) onRefresh();
      } else {
        showError(res.error || "Failed to delete banner");
      }
    } catch (err) {
      showError("An error occurred while deleting banner.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span>🖼️ Homepage Banner Slider Management</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Add responsive desktop and mobile banners for the homepage hero carousel.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setEditingBanner({
                title: "",
                description: "",
                desktop_image_url: "",
                mobile_image_url: "",
                cta_text: "",
                cta_url: "",
                display_order: banners.length + 1,
                is_active: true,
              })
            }
            className="min-h-[44px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Banner</span>
          </button>
        </div>

        {/* Existing Banners Grid */}
        {banners.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/80">
            <p className="text-xs font-bold text-slate-600">No custom banners created yet.</p>
            <p className="text-[11px] text-slate-400 mt-1">
              The website is currently displaying the default fallback hero banner.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map((b) => (
              <div
                key={b.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3 relative group"
              >
                <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                  <Image
                    src={b.desktop_image_url}
                    alt={b.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-slate-900/80 backdrop-blur-xs px-2 py-1 rounded-lg text-[10px] font-bold text-white">
                    <span className={b.is_active ? "text-emerald-400" : "text-slate-400"}>
                      {b.is_active ? "● Active" : "○ Disabled"}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 truncate">{b.title}</h4>
                  {b.description && (
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{b.description}</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <span>Order: {b.display_order}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingBanner(b)}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 font-bold hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBanner(b.id)}
                      className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 font-bold hover:bg-red-100 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit / Add Modal */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
              {editingBanner.id ? "Edit Banner" : "Add New Banner"}
            </h3>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Banner Title</label>
                <input
                  type="text"
                  value={editingBanner.title || ""}
                  onChange={(e) => setEditingBanner((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={editingBanner.description || ""}
                  onChange={(e) => setEditingBanner((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <ImageUploader
                label="Desktop Image (Required)"
                category="banners"
                value={editingBanner.desktop_image_url}
                onChange={(url) => setEditingBanner((prev) => ({ ...prev, desktop_image_url: url || "" }))}
                recommendedDimensions="1600 x 600 px"
                aspectRatio="wide"
              />

              <ImageUploader
                label="Mobile Image (Optional)"
                category="banners"
                value={editingBanner.mobile_image_url}
                onChange={(url) => setEditingBanner((prev) => ({ ...prev, mobile_image_url: url }))}
                recommendedDimensions="800 x 800 px"
                aspectRatio="square"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={editingBanner.cta_text || ""}
                    onChange={(e) => setEditingBanner((prev) => ({ ...prev, cta_text: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                    placeholder="e.g. Enroll Now"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CTA Target Link</label>
                  <input
                    type="text"
                    value={editingBanner.cta_url || ""}
                    onChange={(e) => setEditingBanner((prev) => ({ ...prev, cta_url: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                    placeholder="e.g. /admission"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingBanner.display_order ?? 1}
                    onChange={(e) => setEditingBanner((prev) => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="banner_active"
                    checked={editingBanner.is_active ?? true}
                    onChange={(e) => setEditingBanner((prev) => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                  <label htmlFor="banner_active" className="text-xs font-bold text-slate-800 cursor-pointer">
                    Enable Banner
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-extrabold hover:bg-blue-700 cursor-pointer flex items-center gap-1.5"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{saving ? "Saving..." : "Save Banner"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 5. ANNOUNCEMENT BAR & NOTICE MANAGER
// ----------------------------------------------------
export function AnnouncementEditor(props: any) {
  const items = Array.isArray(props.initialData)
    ? props.initialData
    : props.initialData?.announcements || [];
  return <AnnouncementManager initialData={items} onRefresh={props.onRefresh} />;
}

// ----------------------------------------------------
// 6. ABOUT & CONTENT EDITOR
// ----------------------------------------------------
export function AboutContentEditor({ initialData, onRefresh }: EditorProps<AboutSection[]>) {
  const [sections, setSections] = useState<AboutSection[]>(initialData);
  const [selectedKey, setSelectedKey] = useState<string>(initialData[0]?.section_key || "about_rci");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { showSuccess, showError, showSaving } = useCMSFeedback();

  useEffect(() => {
    setSections(initialData);
  }, [initialData]);

  const activeSection = sections.find((s) => s.section_key === selectedKey) || sections[0];

  const handleUpdateActive = (field: keyof AboutSection, val: any) => {
    setSections((prev) =>
      prev.map((s) => (s.section_key === selectedKey ? { ...s, [field]: val } : s))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSection || saving) return;
    setSaving(true);
    setMessage(null);
    showSaving("Saving about content section...");
    console.log("[CMS] Saving about section...", activeSection);
    try {
      const res = await updateAboutSectionAction(activeSection);
      console.log("[CMS] About section save response:", res);
      if (res.success) {
        const msg = res.message || "About content saved successfully.";
        setMessage({ type: "success", text: msg });
        showSuccess(msg, "About & Content");
        if (onRefresh) onRefresh();
      } else {
        const err = res.error || "Failed to save section.";
        setMessage({ type: "error", text: err });
        showError(err);
      }
    } catch (err) {
      console.error("[CMS] Save about section exception:", err);
      const errMsg = "An unexpected error occurred while saving section.";
      setMessage({ type: "error", text: errMsg });
      showError(errMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {sections.map((s) => (
          <button
            key={s.section_key}
            type="button"
            onClick={() => {
              setSelectedKey(s.section_key);
              setMessage(null);
            }}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedKey === s.section_key
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {s.heading || s.section_key}
          </button>
        ))}
      </div>

      {activeSection && (
        <form onSubmit={handleSave} className="space-y-6">
          <FeedbackBanner message={message} onClose={() => setMessage(null)} />

          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span>📚 Section Content: {activeSection.heading}</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Heading</label>
              <input
                type="text"
                value={activeSection.heading}
                onChange={(e) => handleUpdateActive("heading", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Short Summary / Subheading</label>
              <input
                type="text"
                value={activeSection.short_description || ""}
                onChange={(e) => handleUpdateActive("short_description", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Section Body / Content</label>
              <textarea
                rows={6}
                value={activeSection.content}
                onChange={(e) => handleUpdateActive("content", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-normal leading-relaxed"
                required
              />
            </div>

            <ImageUploader
              label="Section Illustration / Photo"
              category="homepage"
              value={activeSection.image_url}
              onChange={(url) => handleUpdateActive("image_url", url)}
              recommendedDimensions="800 x 600 px"
              aspectRatio="wide"
            />
          </div>

          <FeedbackBanner message={message} onClose={() => setMessage(null)} />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="min-h-[44px] px-6 py-2.5 bg-[#155EEF] hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-extrabold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? "Saving..." : "Save About Content"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 7. WHY CHOOSE RCI FEATURE CARDS
// ----------------------------------------------------
export function FeaturesManager({ initialData, onRefresh }: EditorProps<HomepageFeature[]>) {
  const [features, setFeatures] = useState<HomepageFeature[]>(initialData);
  const [editingFeature, setEditingFeature] = useState<Partial<HomepageFeature> | null>(null);
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError, showSaving } = useCMSFeedback();

  useEffect(() => {
    setFeatures(initialData);
  }, [initialData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeature || saving) return;
    setSaving(true);
    showSaving("Saving feature card...");
    console.log("[CMS] Saving feature card...", editingFeature);
    try {
      const res = await saveFeatureAction(editingFeature);
      console.log("[CMS] Feature save response:", res);
      if (res.success) {
        showSuccess(res.message || "Feature saved successfully.", "Why Choose RCI");
        setEditingFeature(null);
        if (onRefresh) onRefresh();
      } else {
        showError(res.error || "Failed to save feature.");
      }
    } catch (err) {
      console.error("[CMS] Save feature exception:", err);
      showError("An error occurred while saving feature.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this feature card?")) return;
    showSaving("Deleting feature card...");
    try {
      const res = await deleteFeatureAction(id);
      if (res.success) {
        showSuccess("Feature card deleted successfully.", "Why Choose RCI");
        if (onRefresh) onRefresh();
      } else {
        showError(res.error || "Failed to delete feature card");
      }
    } catch (err) {
      showError("An error occurred while deleting feature card.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span>✨ "Why Choose RCI" Features Manager</span>
          </h3>

          <button
            type="button"
            onClick={() =>
              setEditingFeature({
                title: "",
                description: "",
                icon: "GraduationCap",
                display_order: features.length + 1,
                is_active: true,
              })
            }
            className="min-h-[44px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Feature Card
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.id} className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded-full">
                  Icon: {f.icon}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingFeature(f)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded-lg cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(f.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h4 className="text-xs font-extrabold text-slate-900">{f.title}</h4>
              <p className="text-[11.5px] text-slate-600 leading-snug line-clamp-3">{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      {editingFeature && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
              {editingFeature.id ? "Edit Feature Card" : "Add Feature Card"}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingFeature.title || ""}
                  onChange={(e) => setEditingFeature((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingFeature.description || ""}
                  onChange={(e) => setEditingFeature((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lucide Icon Name</label>
                  <input
                    type="text"
                    value={editingFeature.icon || "GraduationCap"}
                    onChange={(e) => setEditingFeature((prev) => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                    placeholder="e.g. Users, Award, Laptop"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Order</label>
                  <input
                    type="number"
                    value={editingFeature.display_order ?? 1}
                    onChange={(e) => setEditingFeature((prev) => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingFeature(null)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{saving ? "Saving..." : "Save Feature"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 8. STATISTICS MANAGER
// ----------------------------------------------------
export function StatsManager({ initialData, onRefresh }: EditorProps<HomepageStat[]>) {
  const [stats, setStats] = useState<HomepageStat[]>(initialData);
  const [editingStat, setEditingStat] = useState<Partial<HomepageStat> | null>(null);
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError, showSaving } = useCMSFeedback();

  useEffect(() => {
    setStats(initialData);
  }, [initialData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStat || saving) return;
    setSaving(true);
    showSaving("Saving statistic counter...");
    console.log("[CMS] Saving statistic...", editingStat);
    try {
      const res = await saveStatAction(editingStat);
      console.log("[CMS] Stat save response:", res);
      if (res.success) {
        showSuccess(res.message || "Statistics updated successfully.", "Statistics");
        setEditingStat(null);
        if (onRefresh) onRefresh();
      } else {
        showError(res.error || "Failed to save statistic.");
      }
    } catch (err) {
      console.error("[CMS] Save stat exception:", err);
      showError("An error occurred while saving statistic.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete statistic counter?")) return;
    showSaving("Deleting statistic...");
    try {
      const res = await deleteStatAction(id);
      if (res.success) {
        showSuccess("Statistic item deleted successfully.", "Statistics");
        if (onRefresh) onRefresh();
      } else {
        showError(res.error || "Failed to delete statistic");
      }
    } catch (err) {
      showError("An error occurred while deleting statistic.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span>📊 Statistics Counter Cards</span>
          </h3>

          <button
            type="button"
            onClick={() =>
              setEditingStat({
                label: "",
                value: "",
                icon: "Users",
                display_order: stats.length + 1,
                is_active: true,
              })
            }
            className="min-h-[44px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Statistic
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.id} className="bg-slate-900 text-white rounded-2xl p-4 space-y-1 relative">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Icon: {s.icon}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingStat(s)}
                    className="p-1 hover:text-white cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(s.id)}
                    className="p-1 hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-2xl font-black text-blue-400">{s.value}</p>
              <p className="text-xs font-bold text-slate-200">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {editingStat && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
              {editingStat.id ? "Edit Statistic" : "Add Statistic"}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Metric Label</label>
                <input
                  type="text"
                  value={editingStat.label || ""}
                  onChange={(e) => setEditingStat((prev) => ({ ...prev, label: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border text-xs font-semibold"
                  placeholder="e.g. Students Trained"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Metric Value</label>
                <input
                  type="text"
                  value={editingStat.value || ""}
                  onChange={(e) => setEditingStat((prev) => ({ ...prev, value: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border text-xs font-bold"
                  placeholder="e.g. 5000+"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Icon Name</label>
                  <input
                    type="text"
                    value={editingStat.icon || "Users"}
                    onChange={(e) => setEditingStat((prev) => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Order</label>
                  <input
                    type="number"
                    value={editingStat.display_order ?? 1}
                    onChange={(e) => setEditingStat((prev) => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 rounded-xl border text-xs font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStat(null)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{saving ? "Saving..." : "Save Statistic"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 9. CONTACT SETTINGS EDITOR
// ----------------------------------------------------
export function ContactEditor({ initialData, onRefresh }: EditorProps<ContactSettings>) {
  const [formData, setFormData] = useState<ContactSettings>(initialData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { showSuccess, showError, showSaving } = useCMSFeedback();

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setMessage(null);
    showSaving("Saving contact information...");
    console.log("[CMS] Saving contact info...", formData);
    try {
      const res = await updateContactSettingsAction(formData);
      console.log("[CMS] Contact save response:", res);
      if (res.success) {
        if (res.data) setFormData(res.data);
        const msg = res.message || "Contact information saved successfully.";
        setMessage({ type: "success", text: msg });
        showSuccess(msg, "Contact Info");
        if (onRefresh) onRefresh();
      } else {
        const err = res.error || "Failed to save contact information.";
        setMessage({ type: "error", text: err });
        showError(err);
      }
    } catch (err) {
      console.error("[CMS] Save contact exception:", err);
      const errMsg = "An unexpected error occurred while saving contact information.";
      setMessage({ type: "error", text: errMsg });
      showError(errMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <FeedbackBanner message={message} onClose={() => setMessage(null)} />

      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
        <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>📞 Centralized Contact Settings</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (Formatted)</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
              placeholder="+91 73768 93097"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number (Digits only)</label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp: e.target.value.replace(/\D/g, "") }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
              placeholder="917376893097"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
              placeholder="info@rciknp.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Campus Physical Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Google Maps Location Link</label>
            <input
              type="url"
              value={formData.maps_url}
              onChange={(e) => setFormData((prev) => ({ ...prev, maps_url: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Office Hours</label>
            <input
              type="text"
              value={formData.office_hours}
              onChange={(e) => setFormData((prev) => ({ ...prev, office_hours: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
              required
            />
          </div>
        </div>
      </div>

      <FeedbackBanner message={message} onClose={() => setMessage(null)} />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="min-h-[44px] px-6 py-2.5 bg-[#155EEF] hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-extrabold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? "Saving..." : "Save Contact Info"}</span>
        </button>
      </div>
    </form>
  );
}

// ----------------------------------------------------
// 10. SOCIAL MEDIA LINKS MANAGER
// ----------------------------------------------------
export function SocialLinksManager({ initialData, onRefresh }: EditorProps<SocialLink[]>) {
  const [socials, setSocials] = useState<SocialLink[]>(initialData);
  const [editingSocial, setEditingSocial] = useState<Partial<SocialLink> | null>(null);
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError, showSaving } = useCMSFeedback();

  useEffect(() => {
    setSocials(initialData);
  }, [initialData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSocial || saving) return;
    setSaving(true);
    showSaving("Saving social media link...");
    console.log("[CMS] Saving social link...", editingSocial);
    try {
      const res = await saveSocialLinkAction(editingSocial);
      console.log("[CMS] Social save response:", res);
      if (res.success) {
        showSuccess(res.message || "Social links saved successfully.", "Social Media Links");
        setEditingSocial(null);
        if (onRefresh) onRefresh();
      } else {
        showError(res.error || "Failed to save social link.");
      }
    } catch (err) {
      console.error("[CMS] Save social link exception:", err);
      showError("An error occurred while saving social link.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete social media link?")) return;
    showSaving("Deleting social media link...");
    try {
      const res = await deleteSocialLinkAction(id);
      if (res.success) {
        showSuccess("Social link deleted successfully.", "Social Media Links");
        if (onRefresh) onRefresh();
      } else {
        showError(res.error || "Failed to delete social link.");
      }
    } catch (err) {
      showError("An error occurred while deleting social link.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span>🔗 Social Media Links Management</span>
          </h3>

          <button
            type="button"
            onClick={() =>
              setEditingSocial({
                platform: "Instagram",
                url: "https://instagram.com",
                is_active: true,
                display_order: socials.length + 1,
              })
            }
            className="min-h-[44px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Social Link
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {socials.map((s) => (
            <div key={s.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">{s.platform}</span>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-600 font-semibold truncate block max-w-[180px]">
                  {s.url}
                </a>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setEditingSocial(s)}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded-lg cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(s.id)}
                  className="p-1 text-red-600 hover:bg-red-100 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingSocial && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
              {editingSocial.id ? "Edit Social Link" : "Add Social Link"}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Platform Name</label>
                <input
                  type="text"
                  value={editingSocial.platform || ""}
                  onChange={(e) => setEditingSocial((prev) => ({ ...prev, platform: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border text-xs font-semibold"
                  placeholder="e.g. Facebook, Instagram, YouTube, Telegram, LinkedIn, X"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Profile URL</label>
                <input
                  type="url"
                  value={editingSocial.url || ""}
                  onChange={(e) => setEditingSocial((prev) => ({ ...prev, url: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border text-xs font-medium"
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="soc_active"
                  checked={editingSocial.is_active ?? true}
                  onChange={(e) => setEditingSocial((prev) => ({ ...prev, is_active: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
                <label htmlFor="soc_active" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Display Link Publicly
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSocial(null)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{saving ? "Saving..." : "Save Link"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 11. NAVIGATION LINKS MANAGER
// ----------------------------------------------------
export function NavigationManager({ initialData, onRefresh }: EditorProps<NavigationLink[]>) {
  const [links, setLinks] = useState<NavigationLink[]>(initialData);
  const [editingLink, setEditingLink] = useState<Partial<NavigationLink> | null>(null);
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError, showSaving } = useCMSFeedback();

  useEffect(() => {
    setLinks(initialData);
  }, [initialData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink || saving) return;

    if (editingLink.is_system && editingLink.is_active === false) {
      if (!confirm("⚠️ Warning: Disabling critical system routes like Verify Certificate or Login may prevent users from accessing key portal features. Continue?")) {
        return;
      }
    }

    setSaving(true);
    showSaving("Saving navigation link...");
    console.log("[CMS] Saving nav link...", editingLink);
    try {
      const res = await saveNavigationLinkAction(editingLink);
      console.log("[CMS] Nav link save response:", res);
      if (res.success) {
        showSuccess(res.message || "Navigation links saved successfully.", "Navigation Links");
        setEditingLink(null);
        if (onRefresh) onRefresh();
      } else {
        showError(res.error || "Failed to save navigation link.");
      }
    } catch (err) {
      console.error("[CMS] Save nav link exception:", err);
      showError("An error occurred while saving navigation link.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const link = links.find((l) => l.id === id);
    if (link?.is_system) {
      showError(`Protected System Route: "${link.label}" cannot be deleted.`);
      return;
    }
    if (!confirm("Delete navigation link?")) return;
    showSaving("Deleting navigation link...");
    try {
      const res = await deleteNavigationLinkAction(id);
      if (res.success) {
        showSuccess("Navigation link deleted successfully.", "Navigation Links");
        if (onRefresh) onRefresh();
      } else {
        showError(res.error || "Failed to delete navigation link.");
      }
    } catch (err) {
      showError("An error occurred while deleting navigation link.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span>🧭 Website Header & Footer Navigation Links</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage menu items for Header navigation, Footer Quick Links, and Footer Useful Links.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setEditingLink({
                location: "header",
                label: "",
                url: "/",
                open_new_tab: false,
                display_order: links.length + 1,
                is_active: true,
                is_system: false,
              })
            }
            className="min-h-[44px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Link
          </button>
        </div>

        {/* Protection Notice */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong className="font-extrabold">System Route Protection:</strong> Critical system routes (such as <code>/admin/login</code>, <code>/student/login</code>, and <code>/verify</code>) are flagged and protected against accidental deletion.
          </p>
        </div>

        {/* Links List Grouped by Location */}
        {["header", "footer_quick", "footer_useful"].map((loc) => {
          const groupLinks = links.filter((l) => l.location === loc);
          const locTitle =
            loc === "header"
              ? "Header Navigation Menu"
              : loc === "footer_quick"
              ? "Footer Quick Links"
              : "Footer Useful & Portal Links";

          return (
            <div key={loc} className="space-y-3 pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">{locTitle}</h4>
              <div className="divide-y divide-slate-100 bg-slate-50/50 rounded-2xl border border-slate-200 overflow-hidden">
                {groupLinks.map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between bg-white/60 hover:bg-white transition-colors">
                    <div className="flex items-center gap-3">
                      {item.is_system ? (
                        <span title="Protected System Route"><Lock className="w-4 h-4 text-amber-500" /></span>
                      ) : (
                        <Globe className="w-4 h-4 text-slate-400" />
                      )}
                      <div>
                        <span className="text-xs font-bold text-slate-900">{item.label}</span>
                        <span className="text-[11px] text-slate-400 ml-2 font-mono">{item.url}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingLink(item)}
                        className="px-2.5 py-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer"
                      >
                        Edit
                      </button>
                      {!item.is_system && (
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="px-2.5 py-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {editingLink && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
              {editingLink.id ? "Edit Navigation Link" : "Add Navigation Link"}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Menu Location</label>
                <select
                  value={editingLink.location || "header"}
                  onChange={(e) => setEditingLink((prev) => ({ ...prev, location: e.target.value as any }))}
                  className="w-full px-3 py-2 rounded-xl border text-xs font-semibold bg-white"
                >
                  <option value="header">Header Main Menu</option>
                  <option value="footer_quick">Footer Quick Links</option>
                  <option value="footer_useful">Footer Useful Links</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Link Label</label>
                <input
                  type="text"
                  value={editingLink.label || ""}
                  onChange={(e) => setEditingLink((prev) => ({ ...prev, label: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target URL</label>
                <input
                  type="text"
                  value={editingLink.url || ""}
                  onChange={(e) => setEditingLink((prev) => ({ ...prev, url: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border text-xs font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="open_tab"
                    checked={editingLink.open_new_tab ?? false}
                    onChange={(e) => setEditingLink((prev) => ({ ...prev, open_new_tab: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                  <label htmlFor="open_tab" className="text-xs font-bold text-slate-800 cursor-pointer">
                    Open New Tab
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="nav_active"
                    checked={editingLink.is_active ?? true}
                    onChange={(e) => setEditingLink((prev) => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                  <label htmlFor="nav_active" className="text-xs font-bold text-slate-800 cursor-pointer">
                    Enable Link
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingLink(null)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-extrabold cursor-pointer flex items-center gap-1.5"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{saving ? "Saving..." : "Save Link"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 12. SEO SETTINGS EDITOR
// ----------------------------------------------------
export function SeoEditor({ initialData, onRefresh }: EditorProps<SeoSettings>) {
  const [formData, setFormData] = useState<SeoSettings>(initialData);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { showSuccess, showError, showSaving } = useCMSFeedback();

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setMessage(null);
    showSaving("Saving SEO & metadata settings...");
    console.log("[CMS] Saving SEO settings...", formData);
    try {
      const res = await updateSeoSettingsAction(formData);
      console.log("[CMS] SEO save response:", res);
      if (res.success) {
        if (res.data) setFormData(res.data);
        const msg = res.message || "SEO settings saved successfully.";
        setMessage({ type: "success", text: msg });
        showSuccess(msg, "SEO & Metadata");
        if (onRefresh) onRefresh();
      } else {
        const err = res.error || "Failed to save SEO settings.";
        setMessage({ type: "error", text: err });
        showError(err);
      }
    } catch (err) {
      console.error("[CMS] Save SEO exception:", err);
      const errMsg = "An unexpected error occurred while saving SEO settings.";
      setMessage({ type: "error", text: errMsg });
      showError(errMsg);
    } finally {
      setSaving(false);
    }
  };

  const titleLength = formData.site_title.length;
  const descLength = formData.meta_description.length;

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <FeedbackBanner message={message} onClose={() => setMessage(null)} />

      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
        <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>🔍 SEO & Search Engine Optimization Editor</span>
        </h3>

        {/* Live Snippet Preview */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
            Google Search Results Live Preview
          </p>
          <p className="text-xs text-slate-500 truncate">{formData.canonical_url}</p>
          <p className="text-sm font-bold text-blue-700 hover:underline cursor-pointer line-clamp-1">
            {formData.site_title}
          </p>
          <p className="text-xs text-slate-600 line-clamp-2 leading-snug">
            {formData.meta_description}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700">Meta Site Title</label>
            <span className={`text-[11px] font-bold ${titleLength >= 50 && titleLength <= 60 ? "text-emerald-600" : "text-amber-600"}`}>
              {titleLength} / 60 chars (Recommended: 50-60)
            </span>
          </div>
          <input
            type="text"
            value={formData.site_title}
            onChange={(e) => setFormData((prev) => ({ ...prev, site_title: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700">Meta Description</label>
            <span className={`text-[11px] font-bold ${descLength >= 140 && descLength <= 160 ? "text-emerald-600" : "text-amber-600"}`}>
              {descLength} / 160 chars (Recommended: 140-160)
            </span>
          </div>
          <textarea
            rows={3}
            value={formData.meta_description}
            onChange={(e) => setFormData((prev) => ({ ...prev, meta_description: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Keywords (Comma Separated)</label>
          <input
            type="text"
            value={formData.keywords}
            onChange={(e) => setFormData((prev) => ({ ...prev, keywords: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <ImageUploader
            label="Open Graph (OG) Image"
            category="seo"
            value={formData.og_image_url}
            onChange={(url) => setFormData((prev) => ({ ...prev, og_image_url: url }))}
            recommendedDimensions="1200 x 630 px"
            aspectRatio="wide"
          />

          <ImageUploader
            label="Twitter Card Image"
            category="seo"
            value={formData.twitter_image_url}
            onChange={(url) => setFormData((prev) => ({ ...prev, twitter_image_url: url }))}
            recommendedDimensions="1200 x 600 px"
            aspectRatio="wide"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">OG Title</label>
            <input
              type="text"
              value={formData.og_title}
              onChange={(e) => setFormData((prev) => ({ ...prev, og_title: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Canonical URL</label>
            <input
              type="text"
              value={formData.canonical_url}
              onChange={(e) => setFormData((prev) => ({ ...prev, canonical_url: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
            />
          </div>
        </div>
      </div>

      <FeedbackBanner message={message} onClose={() => setMessage(null)} />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="min-h-[44px] px-6 py-2.5 bg-[#155EEF] hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-extrabold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? "Saving..." : "Save SEO Settings"}</span>
        </button>
      </div>
    </form>
  );
}
