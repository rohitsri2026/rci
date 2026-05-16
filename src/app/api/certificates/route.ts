import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();

  if (!body.certificate_id) {
    const year = new Date().getFullYear();
    const num = String(Math.floor(100 + Math.random() * 900)).padStart(3, "0");
    body.certificate_id = `RCI-${year}-${num}`;
  }

  const { data, error } = await supabase.from("certificates").insert([body]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
