"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileImage, Upload, Copy, Check, Trash2, ArrowLeft, RefreshCw,
  ExternalLink, FileText, AlertTriangle, Search
} from "lucide-react";
import ImageUploader from "@/components/admin/cms/ImageUploader";
import { fetchCmsMediaAction, deleteCmsAssetAction } from "@/app/admin/(dashboard)/cms/cms-actions";
import { CmsMediaItem } from "@/types/cms";

export default function AdminCmsMediaPage() {
  const [mediaItems, setMediaItems] = useState<CmsMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const loadMedia = async () => {
    setLoading(true);
    const items = await fetchCmsMediaAction();
    setMediaItems(items);
    setLoading(false);
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (item: CmsMediaItem) => {
    if (!confirm(`Are you sure you want to delete "${item.filename}"?`)) return;

    const res = await deleteCmsAssetAction(item.id, item.file_path);
    if (res.success) {
      loadMedia();
    } else {
      alert(res.error || "Failed to delete media item.");
    }
  };

  const filteredItems = mediaItems.filter((item) =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/cms"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Back to CMS Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <FileImage className="w-6 h-6 text-blue-600" />
              <span>CMS Media Library</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Centralized storage manager for website images, logos, banners & assets.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          className="min-h-[44px] px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Media Asset</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media files by name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <p className="text-xs font-bold text-slate-500">
          Total Media Assets: <span className="text-slate-900">{mediaItems.length} Files</span>
        </p>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">Loading media library assets...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
          <FileImage className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No media assets found</p>
          <p className="text-xs text-slate-500">Upload images using the button above or inside CMS editors.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs space-y-3 relative group flex flex-col justify-between"
            >
              {/* Thumbnail */}
              <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-950/90 border border-slate-200 flex items-center justify-center">
                <Image
                  src={item.public_url}
                  alt={item.filename}
                  fill
                  className="object-contain p-1"
                  unoptimized
                />
                <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-slate-700">
                  {item.category}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-900 truncate" title={item.filename}>
                  {item.filename}
                </p>
                <div className="flex items-center justify-between text-[10.5px] text-slate-500">
                  <span>{formatSize(item.size_bytes)}</span>
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(item.id, item.public_url)}
                  className="min-h-[38px] flex-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <a
                  href={item.public_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                  title="Open image"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                  title="Delete media"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
              Upload Asset to website-assets Bucket
            </h3>

            <ImageUploader
              label="Select Media Image File"
              category="media"
              onChange={(url) => {
                if (url) {
                  setShowUploadModal(false);
                  loadMedia();
                }
              }}
              recommendedDimensions="Max 5 MB (JPG, PNG, WEBP)"
              maxSizeMb={5}
            />

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
