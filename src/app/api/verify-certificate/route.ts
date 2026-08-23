import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { certificate_id } = await request.json();

  if (!certificate_id) {
    return NextResponse.json({ error: "Certificate ID is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("certificates")
    .select("certificate_number, student_name, course_name, issue_date, status, grade")
    .eq("certificate_number", certificate_id.trim().toUpperCase())
    .single();

  if (error || !data) {
    return NextResponse.json({ valid: false, error: "Certificate not found" }, { status: 404 });
  }

  return NextResponse.json({ valid: true, certificate: data });
}
