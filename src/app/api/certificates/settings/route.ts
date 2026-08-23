import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { certificateSettingsSchema } from "@/schemas/certificate";
import { verifyRole } from "@/lib/auth";

const DEFAULT_SETTINGS = {
  id: "default",
  instituteName: "ROHIT COMPUTER INSTITUTE",
  directorName: "Rohit Gupta",
  directorTitle: "Director",
  msmeRegNo: "UDYAM-UP-54-0023456",
  address: "Sanjay Nagar Cantt, Kanpur, UP — 208004",
  website: "rciknp.vercel.app",
  phone: "+91 98765 43210",
  email: "info@rciknp.com",
};

export async function GET() {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from("certificate_settings")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    if (error || !data) {
      // Fallback to default settings
      return NextResponse.json(DEFAULT_SETTINGS);
    }

    // Map DB columns (snake_case) to Frontend model (camelCase)
    return NextResponse.json({
      id: data.id,
      instituteName: data.institute_name,
      directorName: data.director_name,
      directorTitle: data.director_title,
      msmeRegNo: data.msme_reg_no,
      address: data.address,
      website: data.website,
      phone: data.phone,
      email: data.email,
    });
  } catch (err: any) {
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();

  // 1. Verify Role (Admins only can edit settings)
  const authCheck = await verifyRole(supabase, ["Admin"]);
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { user } = authCheck;

  try {
    const body = await request.json();
    
    // 2. Validate using Zod
    const validation = certificateSettingsSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const { instituteName, directorName, directorTitle, msmeRegNo, address, website, phone, email } = validation.data;

    // 3. Upsert settings in database
    const { data, error } = await supabase
      .from("certificate_settings")
      .upsert({
        id: "default",
        institute_name: instituteName,
        director_name: directorName,
        director_title: directorTitle,
        msme_reg_no: msmeRegNo,
        address,
        website,
        phone,
        email,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // 4. Log Audit Event
    await supabase.from("audit_logs").insert([
      {
        action: "SettingsUpdated" as any,
        certificate_number: "SYSTEM",
        user_email: user.email,
        ip_address: request.headers.get("x-forwarded-for") || "127.0.0.1",
        details: `Certificate settings updated: Institute name is set to ${instituteName}`,
      }
    ]);

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
