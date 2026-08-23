import { UserRole } from "@/types/certificate";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function verifyRole(supabase: any, requiredRoles: UserRole[]) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized", status: 401 };

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "Viewer";
  if (!requiredRoles.includes(role as UserRole)) {
    return { error: "Forbidden", status: 403 };
  }
  
  return { user, role };
}
