import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();
  // Auto-generate certificate_id if not provided
  if (!body.certificate_id) {
    body.certificate_id = `RCI-${Math.floor(10000 + Math.random() * 90000)}`;
  }
  const { data, error } = await supabase.from("certificates").insert([body]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
