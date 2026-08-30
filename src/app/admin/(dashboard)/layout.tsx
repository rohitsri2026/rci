import { createAdminServerClient } from "@/lib/supabase/server-admin";
import { redirect } from "next/navigation";
import AdminLayoutWrapper from "@/components/admin/AdminLayoutWrapper";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createAdminServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <AdminLayoutWrapper userEmail={user.email ?? ""}>
      {children}
    </AdminLayoutWrapper>
  );
}
