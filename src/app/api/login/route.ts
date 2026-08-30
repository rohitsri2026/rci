import { createAdminServerClient } from "@/lib/supabase/server-admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createAdminServerClient();
  const { email, password } = await request.json();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return NextResponse.json({ error: error.message }, { status: 401 });
  return NextResponse.json({ user: data.user });
}
