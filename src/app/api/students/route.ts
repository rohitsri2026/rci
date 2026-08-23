import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { verifyRole } from "@/lib/auth";

export async function GET() {
  const supabase = await createClient();
  
  const authCheck = await verifyRole(supabase, ["Admin", "Staff", "Viewer"]);
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { data, error } = await supabase
    .from("students")
    .select("*, courses(course_name)")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const authCheck = await verifyRole(supabase, ["Admin", "Staff"]);
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const body = await request.json();
    const { data, error } = await supabase.from("students").insert([body]).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
