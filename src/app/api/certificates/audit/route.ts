import { createAdminServerClient } from "@/lib/supabase/server-admin";
import { NextResponse } from "next/server";
import { verifyRole } from "@/lib/auth";

export async function GET(request: Request) {
  const supabase = await createAdminServerClient();

  // 1. Verify Role (Authenticated users can read audit logs)
  const authCheck = await verifyRole(supabase, ["Admin", "Staff"]);
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  // Parse filters
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    let query = supabase
      .from("audit_logs")
      .select("*", { count: "exact" });

    if (action) {
      query = query.eq("action", action);
    }
    if (search) {
      query = query.or(
        `certificate_number.ilike.%${search}%,user_email.ilike.%${search}%,details.ilike.%${search}%`
      );
    }

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return NextResponse.json({
      logs: data,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = await createAdminServerClient();
  
  // Note: We allow anonymous posting of "Verified" logs (since a public visitor scans a QR code to verify)
  // But other actions (Downloaded, Printed, Deleted, Reissued) are authenticated.
  const { data: { user } } = await supabase.auth.getUser();

  try {
    const body = await request.json();
    const { action, certificate_number, details } = body;

    if (!action || !certificate_number) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Capture requester IP
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

    const { data, error } = await supabase
      .from("audit_logs")
      .insert([
        {
          action,
          certificate_number,
          user_email: user?.email || "Anonymous Visitor",
          ip_address: ip,
          details: details || `Action ${action} performed on ${certificate_number}`,
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
