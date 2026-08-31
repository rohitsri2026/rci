import { createAdminServerClient } from "@/lib/supabase/server-admin";
import { NextResponse } from "next/server";
import { certificateReissueSchema } from "@/schemas/certificate";
import { verifyRole } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createAdminServerClient();

  try {
    const { data: cert, error } = await supabase
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
      `)
      .eq("id", id)
      .single();

    if (error || !cert) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    return NextResponse.json(cert);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createAdminServerClient();

  // 1. Verify Role (Admin or Staff can modify status/reissue)
  const authCheck = await verifyRole(supabase, ["Admin", "Staff"]);
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { user } = authCheck;

  try {
    const body = await request.json();
    
    // Check if this is a standard status update or a reissue
    if (body.action === "reissue") {
      // Reissue Flow (Admins only)
      if (authCheck.role !== "Admin") {
        return NextResponse.json({ error: "Only administrators can reissue certificates" }, { status: 403 });
      }

      const validation = certificateReissueSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
      }

      const { reason, grade, completion_date } = validation.data;

      // 1. Fetch old certificate details
      const { data: oldCert, error: fetchError } = await supabase
        .from("certificates")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError || !oldCert) {
        return NextResponse.json({ error: "Original certificate not found" }, { status: 404 });
      }

      // 2. Mark old certificate as Expired
      const { error: expireError } = await supabase
        .from("certificates")
        .update({ 
          status: "Expired",
          updated_by: user.id,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (expireError) throw expireError;

      // 3. Generate a NEW certificate linking to the same student/course, with updated details
      const { data: newCert, error: insertError } = await supabase
        .from("certificates")
        .insert([
          {
            student_id: oldCert.student_id,
            course_id: oldCert.course_id,
            grade,
            completion_date,
            issue_date: new Date().toISOString().split("T")[0],
            status: "Valid",
            student_name: oldCert.student_name,
            course_name: oldCert.course_name,
            created_by: user.id,
            updated_by: user.id,
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // 4. Log audit event for Reissue
      await supabase.from("audit_logs").insert([
        {
          action: "Reissued",
          certificate_number: oldCert.certificate_number,
          user_email: user.email,
          ip_address: request.headers.get("x-forwarded-for") || "127.0.0.1",
          details: `Reissued certificate. Old: ${oldCert.certificate_number}, New: ${newCert.certificate_number}. Reason: ${reason}`,
        }
      ]);

      // Trigger EV-007 (New Certificate Generated) & EV-008 (Old Revoked/Expired)
      try {
        const { NotificationService } = await import("@/lib/notifications/service");
        const { data: student } = await supabase
          .from("students")
          .select("full_name, email, phone")
          .eq("id", oldCert.student_id)
          .single();

        if (student) {
          const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://rciknp.vercel.app"}/verify/${newCert.certificate_number}`;

          if (student.email) {
            await NotificationService.send("Email", {
              to: student.email,
              title: "Certificate Reissued - Rohit Computer Institute",
              message: `Dear ${student.full_name},\n\nYour certificate for ${oldCert.course_name} has been reissued.\n\nOld Certificate Number: ${oldCert.certificate_number} (Now Expired)\nNew Certificate Number: ${newCert.certificate_number}\nReason: ${reason}\n\nVerify and download at:\n${verificationUrl}`,
              userId: oldCert.student_id,
            });
          }

          if (student.phone) {
            await NotificationService.send("WhatsApp", {
              to: student.phone,
              title: "Certificate Reissued",
              message: `Hello ${student.full_name}, your certificate for ${oldCert.course_name} has been reissued. Verify at: ${verificationUrl}`,
              userId: oldCert.student_id,
            });
          }
        }
      } catch (notifErr: any) {
        console.error("Certificate reissue notification failed:", notifErr.message);
      }

      return NextResponse.json({ message: "Certificate reissued successfully", newCertificate: newCert });
    } else {
      // Standard status update
      const { status } = body;
      if (!status || !["Valid", "Revoked", "Expired"].includes(status)) {
        return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
      }

      const { data: oldCert } = await supabase.from("certificates").select("certificate_number, student_id, course_name").eq("id", id).single();
      
      const { data: updatedCert, error: updateError } = await supabase
        .from("certificates")
        .update({ 
          status,
          updated_by: user.id,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Log audit
      await supabase.from("audit_logs").insert([
        {
          action: status === "Revoked" ? "Revoked" as any : "Updated" as any,
          certificate_number: oldCert?.certificate_number,
          user_email: user.email,
          ip_address: request.headers.get("x-forwarded-for") || "127.0.0.1",
          details: `Certificate status updated to ${status}`,
        }
      ]);

      // Trigger EV-008 (Certificate Revoked)
      if (status === "Revoked" && oldCert) {
        try {
          const { NotificationService } = await import("@/lib/notifications/service");
          const { data: student } = await supabase
            .from("students")
            .select("full_name, email, phone")
            .eq("id", oldCert.student_id)
            .single();

          if (student) {
            if (student.email) {
              await NotificationService.send("Email", {
                to: student.email,
                title: "URGENT: Certificate Revoked - Rohit Computer Institute",
                message: `Dear ${student.full_name},\n\nPlease be informed that your certificate number ${oldCert.certificate_number} for the ${oldCert.course_name} course has been officially marked as Revoked by the administrator.\n\nThe public verification status will show this certificate as invalid.\n\nBest regards,\nRohit Computer Institute`,
                userId: oldCert.student_id,
              });
            }

            // Also trigger In-App alert
            await NotificationService.send("InApp", {
              to: "admin",
              title: "Certificate Revoked Alert",
              message: `Certificate ${oldCert.certificate_number} belonging to ${student.full_name} has been marked as Revoked.`,
              userId: oldCert.student_id,
            });
          }
        } catch (notifErr: any) {
          console.error("Certificate revocation notification failed:", notifErr.message);
        }
      }

      return NextResponse.json(updatedCert);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createAdminServerClient();

  // 1. Verify Role (Admins only)
  const authCheck = await verifyRole(supabase, ["Admin"]);
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { user } = authCheck;

  try {
    // Fetch certificate before deleting to log its number
    const { data: cert, error: fetchError } = await supabase
      .from("certificates")
      .select("certificate_number, student_name")
      .eq("id", id)
      .single();

    if (fetchError || !cert) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    const { error: deleteError } = await supabase
      .from("certificates")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    // Log deletion in audit logs
    await supabase.from("audit_logs").insert([
      {
        action: "Deleted",
        certificate_number: cert.certificate_number,
        user_email: user.email,
        ip_address: request.headers.get("x-forwarded-for") || "127.0.0.1",
        details: `Deleted certificate number ${cert.certificate_number} belonging to ${cert.student_name}`,
      }
    ]);

    return NextResponse.json({ message: "Certificate deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
