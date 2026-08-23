import { createClient } from "@/lib/supabase/server";
import HistoryTable from "@/components/certificates/HistoryTable";
import Link from "next/link";
import { Plus } from "lucide-react";
import React from "react";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch user role
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  const userRole = profile?.role ?? "Viewer";

  // Fetch all courses for filters
  const { data: courses } = await supabase
    .from("courses")
    .select("id, course_name, duration, description, fees, created_at")
    .order("course_name");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Certificate Registry</h1>
          <p className="text-slate-500 mt-1">Manage and audit all student certificates issued by the institute.</p>
        </div>
        {userRole !== "Viewer" && (
          <Link href="/admin/certificates/generate" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-750 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md shadow-blue-500/10">
            <Plus className="w-4 h-4" /> Issue Certificate
          </Link>
        )}
      </div>

      <HistoryTable 
        initialCourses={courses || []} 
        userRole={userRole} 
      />
    </div>
  );
}
