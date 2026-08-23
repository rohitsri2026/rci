"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, Loader2, Award, Info, Lock } from "lucide-react";
import { z } from "zod";
import { certificateSettingsSchema } from "@/schemas/certificate";

export default function CertificateSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [userRole, setUserRole] = useState("Viewer");

  const [form, setForm] = useState({
    instituteName: "",
    directorName: "",
    directorTitle: "",
    msmeRegNo: "",
    address: "",
    website: "",
    phone: "",
    email: "",
  });

  // Fetch settings & current role
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch role
        const roleRes = await fetch("/api/certificates");
        // We can check the current user's profile role from a custom route,
        // or simple fetch settings first (the settings POST checks admin role)
        
        // Fetch settings
        const settingsRes = await fetch("/api/certificates/settings");
        const settingsData = await settingsRes.json();
        
        if (settingsRes.ok) {
          setForm({
            instituteName: settingsData.instituteName || "",
            directorName: settingsData.directorName || "",
            directorTitle: settingsData.directorTitle || "",
            msmeRegNo: settingsData.msmeRegNo || "",
            address: settingsData.address || "",
            website: settingsData.website || "",
            phone: settingsData.phone || "",
            email: settingsData.email || "",
          });
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    // Validate using Zod
    const validation = certificateSettingsSchema.safeParse(form);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/certificates/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { label: "Institute Name", key: "instituteName" as const, type: "text", placeholder: "e.g. ROHIT COMPUTER INSTITUTE", colSpan: "md:col-span-2" },
    { label: "Director / Authorized Signatory Name", key: "directorName" as const, type: "text", placeholder: "e.g. Rohit Gupta" },
    { label: "Signatory Title", key: "directorTitle" as const, type: "text", placeholder: "e.g. Director" },
    { label: "MSME Registration ID / No", key: "msmeRegNo" as const, type: "text", placeholder: "e.g. UDYAM-UP-54-0023456" },
    { label: "Website URL", key: "website" as const, type: "url", placeholder: "e.g. https://rciknp.vercel.app" },
    { label: "Contact Phone Number", key: "phone" as const, type: "tel", placeholder: "e.g. +91 98765 43210" },
    { label: "Institutional Email", key: "email" as const, type: "email", placeholder: "e.g. info@rciknp.com" },
    { label: "Institute Address (Printed on Certificate)", key: "address" as const, type: "text", placeholder: "e.g. Sanjay Nagar Cantt, Kanpur, UP — 208004", colSpan: "md:col-span-2" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="text-slate-450 text-xs font-semibold">Loading settings panel...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-display flex items-center gap-2">
          <Settings className="w-7 h-7 text-slate-700" />
          <span>Certificate Settings</span>
        </h1>
        <p className="text-slate-500 mt-1">Configure default print metadata, director signatures, and MSME/Government IDs.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Form header */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span>Metadata Configurations</span>
          </h3>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave}>
          <div className="p-6 space-y-5 text-xs">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl font-semibold">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-xl font-semibold">
                Settings saved successfully! System variables have been updated.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((f) => (
                <div key={f.key} className={f.colSpan || ""}>
                  <label className="block text-slate-700 font-bold mb-2">{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    required
                    className="w-full border border-slate-250 bg-slate-50 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold placeholder:font-medium"
                  />
                </div>
              ))}
            </div>

            <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 flex gap-3 text-xs leading-normal text-slate-500">
              <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <p>
                Updating this form changes the default variables displayed on the live template builder and public verification flows immediately. Non-administrative users can view settings but cannot overwrite them.
              </p>
            </div>
          </div>

          <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-705 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-2 text-sm"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
