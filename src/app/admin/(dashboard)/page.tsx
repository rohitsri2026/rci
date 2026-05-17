import { createClient } from "@/lib/supabase/server";
import { Users, Award, FileText, BookOpen } from "lucide-react";

async function getStats(supabase: Awaited<ReturnType<typeof createClient>>) {
  const [students, certificates, admissions, courses] = await Promise.all([
    supabase.from("students").select("id", { count: "exact", head: true }),
    supabase.from("certificates").select("id", { count: "exact", head: true }),
    supabase.from("admissions").select("id", { count: "exact", head: true }).eq("status", "Pending"),
    supabase.from("courses").select("id", { count: "exact", head: true }),
  ]);
  return {
    students: students.count ?? 0,
    certificates: certificates.count ?? 0,
    admissions: admissions.count ?? 0,
    courses: courses.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const stats = await getStats(supabase);

  const cards = [
    { label: "Total Students", value: stats.students, icon: Users, color: "blue" },
    { label: "Certificates Issued", value: stats.certificates, icon: Award, color: "green" },
    { label: "Pending Admissions", value: stats.admissions, icon: FileText, color: "orange" },
    { label: "Active Courses", value: stats.courses, icon: BookOpen, color: "purple" },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 font-display">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back! Here is an overview of your institute.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorMap[card.color]}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <p className="text-4xl font-bold text-slate-900 mb-1">{card.value}</p>
            <p className="text-slate-500 text-sm">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Add Student", href: "/admin/students/new", icon: Users, color: "bg-blue-50 text-blue-600 border-blue-100" },
            { label: "Issue Certificate", href: "/admin/certificates/new", icon: Award, color: "bg-green-50 text-green-600 border-green-100" },
            { label: "View Admissions", href: "/admin/admissions", icon: FileText, color: "bg-orange-50 text-orange-600 border-orange-100" },
            { label: "Manage Courses", href: "/admin/courses", icon: BookOpen, color: "bg-purple-50 text-purple-600 border-purple-100" },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className={`flex flex-col items-center gap-3 p-5 rounded-xl border text-center font-medium text-sm hover:shadow-md transition-all ${action.color}`}
            >
              <action.icon className="w-6 h-6" />
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
