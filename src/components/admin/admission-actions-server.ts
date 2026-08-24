"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { verifyRole } from "@/lib/auth";

export async function updateAdmissionStatus(admissionId: string, status: "Approved" | "Rejected") {
  const supabase = await createClient();

  // Server-side authorization check
  const authCheck = await verifyRole(supabase, ["Admin", "Staff"]);
  if (authCheck.error) {
    return { success: false, error: authCheck.error };
  }

  // Fetch admission details
  const { data: admission, error: fetchError } = await supabase
    .from("admissions")
    .select("*")
    .eq("id", admissionId)
    .single();

  if (fetchError || !admission) {
    return { success: false, error: "Unable to find the admission application. Please refresh and try again." };
  }

  // Idempotency check: If already in requested status, return early without re-processing
  if (admission.status === status) {
    return { success: true, message: `Application is already ${status.toLowerCase()}.` };
  }

  if (status === "Approved") {
    // 1. Update admission status to Approved first
    const { error: updateError } = await supabase
      .from("admissions")
      .update({ status: "Approved" })
      .eq("id", admissionId);

    if (updateError) {
      return { success: false, error: "Unable to approve this application. Please try again." };
    }

    // 2. Normalize contact identifiers for student duplicate lookup
    const cleanEmail = admission.email?.trim().toLowerCase() || null;
    const rawDigits = admission.phone ? admission.phone.replace(/[^0-9]/g, "") : "";
    const cleanPhone = rawDigits.length >= 7 ? rawDigits : null;

    let existingStudentId: string | null = null;

    if (cleanEmail || cleanPhone) {
      // Query students safely without matching empty strings
      let query = supabase.from("students").select("id, email, phone");

      if (cleanEmail && cleanPhone) {
        query = query.or(`email.ilike.${cleanEmail},phone.ilike.%${cleanPhone.slice(-10)}%`);
      } else if (cleanEmail) {
        query = query.ilike("email", cleanEmail);
      } else if (cleanPhone) {
        query = query.ilike("phone", `%${cleanPhone.slice(-10)}%`);
      }

      const { data: matchedStudents } = await query;
      if (matchedStudents && matchedStudents.length > 0) {
        existingStudentId = matchedStudents[0].id;
      }
    }

    // 3. Create student record ONLY if no student match was found
    if (!existingStudentId) {
      let courseId = null;
      if (admission.selected_course) {
        const { data: course } = await supabase
          .from("courses")
          .select("id")
          .eq("course_name", admission.selected_course)
          .maybeSingle();

        if (course) {
          courseId = course.id;
        }
      }

      const { error: insertError } = await supabase.from("students").insert([{
        full_name: admission.student_name,
        email: cleanEmail || admission.email,
        phone: admission.phone,
        course_id: courseId,
      }]);

      if (insertError) {
        console.error("Non-fatal warning: Student record creation failed during approval:", insertError.message);
      }
    }

    // 4. Trigger notifications safely (failures logged silently)
    try {
      const { NotificationService } = await import("@/lib/notifications/service");
      
      if (cleanEmail) {
        await NotificationService.send("Email", {
          to: cleanEmail,
          title: "Admission Approved - Rohit Computer Institute",
          message: `Dear ${admission.student_name},\n\nCongratulations! Your application for the ${admission.selected_course || "chosen"} course has been approved.\n\nWe have created your student registration profile. Our institute coordinator will contact you shortly.\n\nBest regards,\nRohit Computer Institute`,
        });
      }

      if (admission.phone) {
        await NotificationService.send("WhatsApp", {
          to: admission.phone,
          title: "Admission Approved",
          message: `Congratulations ${admission.student_name}! Your admission for the ${admission.selected_course || "chosen"} course at RCI has been approved. Welcome!`,
        });
      }
    } catch (notifErr: any) {
      console.error("Admission approval notification warning:", notifErr.message);
    }
  } else if (status === "Rejected") {
    // Update admission status to Rejected
    const { error: updateError } = await supabase
      .from("admissions")
      .update({ status: "Rejected" })
      .eq("id", admissionId);

    if (updateError) {
      return { success: false, error: "Unable to reject this application. Please try again." };
    }

    // Trigger rejection notification safely
    try {
      const cleanEmail = admission.email?.trim().toLowerCase();
      if (cleanEmail) {
        const { NotificationService } = await import("@/lib/notifications/service");
        await NotificationService.send("Email", {
          to: cleanEmail,
          title: "Admission Application Status - RCI",
          message: `Dear ${admission.student_name},\n\nThank you for your interest in Rohit Computer Institute.\n\nWe regret to inform you that your application for the ${admission.selected_course || "chosen"} course could not be approved at this time.\n\nIf you have any questions, please feel free to reach out to us.\n\nBest regards,\nRohit Computer Institute`,
        });
      }
    } catch (notifErr: any) {
      console.error("Admission rejection notification warning:", notifErr.message);
    }
  }

  revalidatePath("/admin", "layout");
  return { success: true };
}

export async function deleteAdmission(admissionId: string) {
  const supabase = await createClient();

  // Server-side authorization check
  const authCheck = await verifyRole(supabase, ["Admin"]);
  if (authCheck.error) {
    return { success: false, error: authCheck.error };
  }

  const { error } = await supabase.from("admissions").delete().eq("id", admissionId);
  if (error) {
    return { success: false, error: "Unable to delete application. Please try again." };
  }

  revalidatePath("/admin", "layout");
  return { success: true };
}

export async function submitAdmission(form: {
  student_name: string;
  email: string;
  phone: string;
  selected_course: string;
}) {
  const supabase = await createClient();

  const cleanEmail = form.email ? form.email.trim().toLowerCase() : null;
  const cleanPhone = form.phone ? form.phone.trim() : null;

  const { data, error } = await supabase
    .from("admissions")
    .insert([
      {
        student_name: form.student_name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        selected_course: form.selected_course,
        status: "Pending",
      },
    ])
    .select()
    .single();

  if (error) {
    return { success: false, error: "Unable to submit application. Please check your information and try again." };
  }

  // Trigger EV-001: Admission Submitted
  try {
    const { NotificationService } = await import("@/lib/notifications/service");
    
    if (cleanEmail) {
      await NotificationService.send("Email", {
        to: cleanEmail,
        title: "Admission Application Received - RCI",
        message: `Dear ${form.student_name},\n\nThank you for applying to the ${form.selected_course} program at Rohit Computer Institute. Your application is currently under review.\n\nBest regards,\nRohit Computer Institute`,
        metadata: { admission_id: data.id },
      });
    }

    await NotificationService.send("InApp", {
      to: "admin",
      title: "New Admission Application",
      message: `A new application has been submitted by ${form.student_name} for the ${form.selected_course} course.`,
      metadata: { admission_id: data.id },
    });
  } catch (notifErr: any) {
    console.error("Failed to send admission submission notification:", notifErr.message);
  }

  return { success: true };
}
