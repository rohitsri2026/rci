"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ShieldOff, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function CertificateActions({
  certId,
  currentStatus,
  certificateCode,
}: {
  certId: string;
  currentStatus: string;
  certificateCode: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleRevoke = async () => {
    if (!confirm("Revoke this certificate? The public verify page will show it as Revoked.")) return;
    setLoading("revoke");
    const supabase = createClient();
    await supabase.from("certificates").update({ status: "Revoked" }).eq("id", certId);
    router.refresh();
    setLoading(null);
  };

  const handleDelete = async () => {
    if (!confirm("Permanently delete this certificate? This cannot be undone.")) return;
    setLoading("delete");
    const supabase = createClient();
    await supabase.from("certificates").delete().eq("id", certId);
    router.refresh();
    setLoading(null);
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/verify/${certificateCode}`}
        target="_blank"
        className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-xs font-medium hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors"
      >
        <ExternalLink className="w-3.5 h-3.5" /> View
      </Link>
      {currentStatus === "Valid" && (
        <button
          onClick={handleRevoke}
          disabled={loading !== null}
          className="flex items-center gap-1 text-orange-500 hover:text-orange-700 text-xs font-medium hover:bg-orange-50 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"
        >
          <ShieldOff className="w-3.5 h-3.5" />
          {loading === "revoke" ? "..." : "Revoke"}
        </button>
      )}
      <button
        onClick={handleDelete}
        disabled={loading !== null}
        className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-medium hover:bg-red-50 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"
      >
        <Trash2 className="w-3.5 h-3.5" />
        {loading === "delete" ? "..." : "Delete"}
      </button>
    </div>
  );
}
