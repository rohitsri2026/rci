import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminTopBar from "@/components/admin/AdminTopBar";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <AdminSidebar userEmail={user.email ?? ""} />
      <main className="flex-1 p-8 overflow-auto">
        <AdminTopBar />
        {children}
      </main>
    </div>
  );
}
