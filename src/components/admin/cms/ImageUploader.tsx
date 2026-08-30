"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, RefreshCw, CheckCircle2, AlertCircle, FileImage } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { recordMediaUploadAction } from "@/app/admin/(dashboard)/cms/cms-actions";

interface ImageUploaderProps {
  category: "logo" | "favicon" | "director" | "homepage" | "banners" | "seo" | "media";
  value?: string | null;
  onChange: (url: string | null) => void;
  recommendedDimensions?: string;
  maxSizeMb?: number;
  aspectRatio?: "square" | "wide" | "any";
  label?: string;
}

export default function ImageUploader({
  category,
  value,
  onChange,
  recommendedDimensions,
  maxSizeMb = 5,
  aspectRatio = "any",
  label = "Upload Image",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);

    // Validate size (maxSizeMb)
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`File size exceeds maximum limit of ${maxSizeMb} MB.`);
      return;
    }

    // Validate MIME type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/x-icon"];
    if (!validTypes.includes(file.type)) {
      setError("Only JPG, PNG, WEBP, or SVG files are allowed.");
      return;
    }

    try {
      setUploading(true);
      const supabase = createClient();

      const ext = file.name.split(".").pop() || "jpg";
      const cleanFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
      const filePath = `${category}/${cleanFileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("website-assets")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from("website-assets")
        .getPublicUrl(uploadData.path);

      const publicUrl = publicUrlData.publicUrl;

      // Record in cms_media tracking table
      await recordMediaUploadAction({
        filename: file.name,
        file_path: filePath,
        public_url: publicUrl,
        mime_type: file.type,
        size_bytes: file.size,
        category: category,
      });

      onChange(publicUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image";
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-bold text-slate-700">{label}</label>}

      {/* Current Preview or Upload Area */}
      {value ? (
        <div className="relative group rounded-2xl border border-slate-200 bg-slate-900/5 p-3 flex flex-col sm:flex-row items-center gap-4 transition-all">
          {/* Image Thumbnail */}
          <div
            className={`relative rounded-xl overflow-hidden bg-slate-950/80 flex items-center justify-center shrink-0 border border-slate-200 ${
              aspectRatio === "square" ? "w-20 h-20" : "w-32 h-20"
            }`}
          >
            <Image
              src={value}
              alt="Asset Preview"
              fill
              className="object-contain p-1"
              unoptimized
            />
          </div>

          {/* Details & Actions */}
          <div className="flex-1 min-w-0 w-full">
            <p className="text-xs font-bold text-slate-900 truncate">{value.split("/").pop() || "Uploaded Image"}</p>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">{value}</p>
            {recommendedDimensions && (
              <p className="text-[10px] text-blue-600 font-semibold mt-1">Recommended: {recommendedDimensions}</p>
            )}

            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="min-h-[44px] sm:min-h-0 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${uploading ? "animate-spin" : ""}`} />
                <span>Replace</span>
              </button>

              <button
                type="button"
                onClick={() => onChange(null)}
                disabled={uploading}
                className="min-h-[44px] sm:min-h-0 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[140px] ${
            dragActive
              ? "border-blue-500 bg-blue-50/50"
              : "border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-white"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="w-7 h-7 text-blue-600 animate-spin" />
              <p className="text-xs font-bold text-slate-700">Uploading to website-assets...</p>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Click or drag & drop image file to upload
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                JPG, PNG, WEBP (Max {maxSizeMb} MB)
              </p>
              {recommendedDimensions && (
                <p className="text-[10.5px] font-semibold text-blue-600 mt-1">
                  Target dimensions: {recommendedDimensions}
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/x-icon"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
      />

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 text-red-700 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
