"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, XCircle } from "lucide-react";

export default function AdmissionActions({ admissionId }: { admissionId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  const updateStatus = async (status: "Approved" | "Rejected") => {
    setLoading(status === "Approved" ? "approve" : "reject");
    
    const { updateAdmissionStatus } = await import("./admission-actions-server");
    const result = await updateAdmissionStatus(admissionId, status);
    
    if (!result.success) {
      alert("Error: " + result.error);
    }
    
    setLoading(null);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => updateStatus("Approved")}
        disabled={loading !== null}
        className="flex items-center gap-1 text-green-600 hover:text-green-800 text-xs font-medium hover:bg-green-50 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"
      >
        <CheckCircle className="w-3.5 h-3.5" />
        {loading === "approve" ? "..." : "Approve"}
      </button>
      <button
        onClick={() => updateStatus("Rejected")}
        disabled={loading !== null}
        className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-medium hover:bg-red-50 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"
      >
        <XCircle className="w-3.5 h-3.5" />
        {loading === "reject" ? "..." : "Reject"}
      </button>
    </div>
  );
}
