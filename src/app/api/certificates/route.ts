import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { certificateGenerateSchema } from "@/schemas/certificate";
import { verifyRole } from "@/lib/auth";

export async function GET(request: Request) {
  const supabase = await createClient();
  
  // Parse URL search parameters
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const courseId = searchParams.get("course_id") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const sortBy = searchParams.get("sortBy") || "created_at";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    let query = supabase
      .from("certificates")
      .select(`
        *,
        students:student_id (
          id,
          full_name,
          email,
          phone,
          address
        ),
        courses:course_id (
          id,
          course_name,
          duration,
          fees
        )
      `, { count: "exact" });

    // Apply filters
    if (status) {
      query = query.eq("status", status);
    }
    if (courseId) {
      query = query.eq("course_id", courseId);
    }
    if (search) {
      // Postgres search query combining multiple ilike conditions
      query = query.or(
        `certificate_number.ilike.%${search}%,student_name.ilike.%${search}%,course_name.ilike.%${search}%`
      );
    }

    // Apply sorting and pagination
    query = query
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(from, to);

    const { data, count, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      certificates: data,
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
  const supabase = await createClient();
  
  // 1. Verify Role (Staff or Admin can generate)
  const authCheck = await verifyRole(supabase, ["Admin", "Staff"]);
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { user } = authCheck;

  try {
    const body = await request.json();
    
    // 2. Validate payload using Zod
    const validation = certificateGenerateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const { student_id, course_id, grade, completion_date, issue_date } = validation.data;

    // 3. Prevent duplicate certificate generation for the same student + course
    const { data: existingCert } = await supabase
      .from("certificates")
      .select("id, certificate_number")
      .eq("student_id", student_id)
      .eq("course_id", course_id)
      .eq("status", "Valid")
      .maybeSingle();

    if (existingCert) {
      return NextResponse.json({ 
        error: `A valid certificate already exists for this student and course (${existingCert.certificate_number})` 
      }, { status: 409 });
    }

    // 4. Fetch details to cache in the certificate record
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("full_name, email, phone")
      .eq("id", student_id)
      .single();

    if (studentError || !student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("course_name")
      .eq("id", course_id)
      .single();

    if (courseError || !course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // 5. Insert certificate (Trigger will auto-generate certificate_number and verification_token)
    const { data: newCert, error: insertError } = await supabase
      .from("certificates")
      .insert([
        {
          student_id,
          course_id,
          grade,
          completion_date,
          issue_date,
          status: "Valid",
          student_name: student.full_name, // Cached for backward compatibility
          course_name: course.course_name,   // Cached for backward compatibility
          created_by: user.id,
          updated_by: user.id,
        }
      ])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Trigger EV-007: Certificate Generated
    try {
      const { NotificationService } = await import("@/lib/notifications/service");
      const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://rciknp.vercel.app"}/verify/${newCert.certificate_number}`;

      if (student.email) {
        await NotificationService.send("Email", {
          to: student.email,
          title: "Certificate Issued - Rohit Computer Institute",
          message: `Dear ${student.full_name},\n\nCongratulations! Your certificate for the ${course.course_name} program has been issued successfully.\n\nCertificate Number: ${newCert.certificate_number}\nGrade: ${newCert.grade}\n\nYou can verify and download your certificate online at:\n${verificationUrl}\n\nBest regards,\nRohit Computer Institute`,
          userId: student_id,
        });
      }

      if (student.phone) {
        await NotificationService.send("WhatsApp", {
          to: student.phone,
          title: "Certificate Issued",
          message: `Hello ${student.full_name}, your certificate for ${course.course_name} has been issued! Verify here: ${verificationUrl}`,
          userId: student_id,
        });
      }
    } catch (notifErr: any) {
      console.error("Certificate issuance notification failed:", notifErr.message);
    }

    // 6. Write Audit Log
    await supabase.from("audit_logs").insert([
      {
        action: "Generated",
        certificate_number: newCert.certificate_number,
        user_email: user.email,
        ip_address: request.headers.get("x-forwarded-for") || "127.0.0.1",
        details: `Certificate generated for student ${student.full_name} for course ${course.course_name}`,
      }
    ]);

    return NextResponse.json(newCert, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
