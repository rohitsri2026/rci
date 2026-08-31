import { createAdminServerClient } from "@/lib/supabase/server-admin";
import { NextResponse } from "next/server";
import { bulkCertificateGenerateSchema } from "@/schemas/certificate";
import { verifyRole } from "@/lib/auth";

export async function POST(request: Request) {
  const supabase = await createAdminServerClient();
  
  // 1. Verify role (Staff or Admin can generate)
  const authCheck = await verifyRole(supabase, ["Admin", "Staff"]);
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { user } = authCheck;

  try {
    const body = await request.json();

    // 2. Validate payload using Zod
    const validation = bulkCertificateGenerateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const { student_ids, course_id, grade, completion_date, issue_date } = validation.data;

    // 3. Fetch course details
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("course_name")
      .eq("id", course_id)
      .single();

    if (courseError || !course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // 4. Fetch all selected students
    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("id, full_name, email, phone")
      .in("id", student_ids);

    if (studentsError || !students || students.length === 0) {
      return NextResponse.json({ error: "No valid students found" }, { status: 404 });
    }

    const results = [];
    const auditLogs = [];

    // 5. Generate certificates sequentially
    for (const student of students) {
      // Check if certificate already exists
      const { data: existingCert } = await supabase
        .from("certificates")
        .select("certificate_number")
        .eq("student_id", student.id)
        .eq("course_id", course_id)
        .eq("status", "Valid")
        .maybeSingle();

      if (existingCert) {
        results.push({
          student_id: student.id,
          student_name: student.full_name,
          status: "skipped",
          reason: `Valid certificate already exists (${existingCert.certificate_number})`,
        });
        continue;
      }

      // Insert certificate
      const { data: newCert, error: insertError } = await supabase
        .from("certificates")
        .insert([
          {
            student_id: student.id,
            course_id,
            grade,
            completion_date,
            issue_date,
            status: "Valid",
            student_name: student.full_name,
            course_name: course.course_name,
            created_by: user.id,
            updated_by: user.id,
          }
        ])
        .select()
        .single();

      if (insertError) {
        results.push({
          student_id: student.id,
          student_name: student.full_name,
          status: "error",
          reason: insertError.message,
        });
      } else {
        results.push({
          student_id: student.id,
          student_name: student.full_name,
          status: "success",
          certificate: newCert,
        });

        // Trigger EV-007: Certificate Generated
        try {
          const { NotificationService } = await import("@/lib/notifications/service");
          const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://rciknp.vercel.app"}/verify/${newCert.certificate_number}`;

          if (student.email) {
            await NotificationService.send("Email", {
              to: student.email,
              title: "Certificate Issued - Rohit Computer Institute",
              message: `Dear ${student.full_name},\n\nCongratulations! Your certificate for the ${course.course_name} program has been issued successfully.\n\nCertificate Number: ${newCert.certificate_number}\nGrade: ${newCert.grade}\n\nYou can verify and download your certificate online at:\n${verificationUrl}\n\nBest regards,\nRohit Computer Institute`,
              userId: student.id,
            });
          }

          if (student.phone) {
            await NotificationService.send("WhatsApp", {
              to: student.phone,
              title: "Certificate Issued",
              message: `Hello ${student.full_name}, your certificate for ${course.course_name} has been issued! Verify here: ${verificationUrl}`,
              userId: student.id,
            });
          }
        } catch (notifErr: any) {
          console.error(`Bulk certificate notification failed for student ${student.full_name}:`, notifErr.message);
        }

        // Add to audit log queue
        auditLogs.push({
          action: "Generated",
          certificate_number: newCert.certificate_number,
          user_email: user.email,
          ip_address: request.headers.get("x-forwarded-for") || "127.0.0.1",
          details: `Bulk generated certificate for ${student.full_name} for course ${course.course_name}`,
        });
      }
    }

    // 6. Bulk insert audit logs for the generated certificates
    if (auditLogs.length > 0) {
      await supabase.from("audit_logs").insert(auditLogs);
    }

    const generatedCount = results.filter(r => r.status === "success").length;
    
    return NextResponse.json({
      message: `Bulk generation complete. Generated ${generatedCount} certificates.`,
      results,
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
