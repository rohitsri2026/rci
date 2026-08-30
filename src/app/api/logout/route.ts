import { createStudentServerClient } from "@/lib/supabase/server-student";
import { createAdminServerClient } from "@/lib/supabase/server-admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const scope = url.searchParams.get("scope");

    if (scope === "admin") {
      const adminSupabase = await createAdminServerClient();
      await adminSupabase.auth.signOut();
    } else if (scope === "student") {
      const studentSupabase = await createStudentServerClient();
      await studentSupabase.auth.signOut();
    } else {
      // Clear both if no scope is explicitly specified
      const studentSupabase = await createStudentServerClient();
      await studentSupabase.auth.signOut();
      const adminSupabase = await createAdminServerClient();
      await adminSupabase.auth.signOut();
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
