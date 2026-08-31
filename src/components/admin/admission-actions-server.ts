"use server";

import { createAdminServerClient } from "@/lib/supabase/server-admin";
import { revalidatePath } from "next/cache";
import { verifyRole } from "@/lib/auth";

export async function updateAdmissionStatus(admissionId: string, status: "Approved" | "Rejected") {
  const supabase = await createAdminServerClient();

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
    // 1. Normalize contact identifiers for student duplicate lookup
    const cleanEmail = admission.email?.trim().toLowerCase() || null;
    const rawDigits = admission.phone ? admission.phone.replace(/[^0-9]/g, "") : "";
    const cleanPhone = rawDigits.length >= 7 ? rawDigits : null;

    let existingStudentId: string | null = null;

    if (cleanEmail || cleanPhone) {
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

    // 2. Create student record FIRST if no student match was found
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
        return {
          success: false,
          error: "Unable to create student record. Admission approval cancelled. Please try again.",
        };
      }
    }

    // 3. Update admission status to Approved ONLY after student creation/verification succeeds
    const { error: updateError } = await supabase
      .from("admissions")
      .update({ status: "Approved" })
      .eq("id", admissionId);

    if (updateError) {
      return {
        success: false,
        error: "Student record created, but admission status update failed. Please click 'Convert to Student' to finalize.",
      };
    }

    // 4. Trigger notifications safely (failures logged silently)
    try {
      const { NotificationService } = await import("@/lib/notifications/service");
      if (cleanEmail) {
        await NotificationService.send("Email", {
          to: cleanEmail,
          title: "RCI Admission Approved!",
          message: `Dear ${admission.student_name},\n\nWe are pleased to inform you that your admission application for ${admission.selected_course || "the selected course"} has been APPROVED by Rohit Computer Institute.\n\nPlease visit the institute desk or log in to complete your enrollment procedures.\n\nBest regards,\nRohit Computer Institute`,
          metadata: { admission_id: admissionId },
        });
      }
    } catch (notifErr: any) {
      console.error("Failed to send approval notification:", notifErr?.message || notifErr);
    }
  } else {
    // Rejection handling
    const { error: updateError } = await supabase
      .from("admissions")
      .update({ status: "Rejected" })
      .eq("id", admissionId);

    if (updateError) {
      return { success: false, error: "Failed to update admission status." };
    }
  }

  revalidatePath("/admin/admissions");
  revalidatePath("/admin");
  return { success: true, message: `Application ${status.toLowerCase()} successfully.` };
}

export async function convertAdmissionToStudent(admissionId: string) {
  const supabase = await createAdminServerClient();

  const authCheck = await verifyRole(supabase, ["Admin", "Staff"]);
  if (authCheck.error) {
    return { success: false, error: authCheck.error };
  }

  const { data: admission, error: fetchError } = await supabase
    .from("admissions")
    .select("*")
    .eq("id", admissionId)
    .single();

  if (fetchError || !admission) {
    return { success: false, error: "Admission application not found." };
  }

  const cleanEmail = admission.email?.trim().toLowerCase() || null;
  const rawDigits = admission.phone ? admission.phone.replace(/[^0-9]/g, "") : "";
  const cleanPhone = rawDigits.length >= 7 ? rawDigits : null;

  if (cleanEmail || cleanPhone) {
    let query = supabase.from("students").select("id");
    if (cleanEmail && cleanPhone) {
      query = query.or(`email.ilike.${cleanEmail},phone.ilike.%${cleanPhone.slice(-10)}%`);
    } else if (cleanEmail) {
      query = query.ilike("email", cleanEmail);
    } else if (cleanPhone) {
      query = query.ilike("phone", `%${cleanPhone.slice(-10)}%`);
    }

    const { data: matched } = await query;
    if (matched && matched.length > 0) {
      return { success: true, message: "Matching student record already exists.", studentId: matched[0].id };
    }
  }

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

  const { data: newStudent, error: insertError } = await supabase
    .from("students")
    .insert([{
      full_name: admission.student_name,
      email: cleanEmail || admission.email,
      phone: admission.phone,
      course_id: courseId,
    }])
    .select()
    .single();

  if (insertError) {
    return { success: false, error: "Unable to create student profile from application." };
  }

  revalidatePath("/admin/students");
  revalidatePath("/admin/admissions");
  return { success: true, studentId: newStudent.id };
}

export async function deleteAdmission(admissionId: string) {
  const supabase = await createAdminServerClient();

  // 1. Enforce strict Admin role check
  const authCheck = await verifyRole(supabase, ["Admin"]);
  if (authCheck.error) {
    return { 
      success: false, 
      error: authCheck.error === "Forbidden" 
        ? "Only Administrators are authorized to delete admission applications." 
        : "Unauthorized session. Please log in again." 
    };
  }

  // 2. Validate admissionId format
  const cleanId = admissionId?.trim();
  if (!cleanId) {
    return { success: false, error: "Invalid application ID." };
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(cleanId)) {
    return { success: false, error: "Invalid application ID format." };
  }

  // 3. Fetch target admission record to verify existence before deletion
  const { data: admission, error: fetchError } = await supabase
    .from("admissions")
    .select("id, student_name")
    .eq("id", cleanId)
    .maybeSingle();

  if (fetchError || !admission) {
    return { success: false, error: "Application not found." };
  }

  // 4. Delete strictly target admission row without affecting linked student/certificate/historical tables
  const { error: deleteError } = await supabase
    .from("admissions")
    .delete()
    .eq("id", cleanId);

  if (deleteError) {
    console.error("[deleteAdmission Error Diagnostics]", {
      code: deleteError.code,
      message: deleteError.message,
      details: deleteError.details,
      hint: deleteError.hint,
    });

    if (deleteError.code === "23503") {
      return {
        success: false,
        error: "This application cannot be deleted because it is linked to another record.",
      };
    }

    return { success: false, error: "Unable to delete this application. Please try again." };
  }

  // 5. Revalidate admissions & admin dashboard caches
  revalidatePath("/admin/admissions");
  revalidatePath("/admin");
  return { success: true, message: "Application deleted successfully." };
}

export async function submitAdmission(form: {
  student_name: string;
  phone: string;
  email?: string;
  selected_course: string;
}) {
  const supabase = await createAdminServerClient();

  const name = form.student_name ? form.student_name.trim() : "";
  if (!name) {
    return { success: false, error: "Full Name is required." };
  }
  if (name.length > 100) {
    return { success: false, error: "Full Name must be 100 characters or less." };
  }

  const rawPhone = form.phone ? form.phone.trim() : "";
  const phoneDigits = rawPhone.replace(/\D/g, "");
  const cleanPhone = (phoneDigits.length === 12 && phoneDigits.startsWith("91"))
    ? phoneDigits.slice(2)
    : phoneDigits;

  if (!cleanPhone || cleanPhone.length !== 10) {
    return { success: false, error: "Please enter a valid 10-digit Indian mobile number." };
  }

  const cleanEmail = form.email && form.email.trim() ? form.email.trim().toLowerCase() : null;
  if (cleanEmail) {
    if (cleanEmail.length > 150) {
      return { success: false, error: "Email address must be 150 characters or less." };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { success: false, error: "Please enter a valid email address." };
    }
  }

  const course = form.selected_course ? form.selected_course.trim() : "";
  if (!course) {
    return { success: false, error: "Please select a course program." };
  }
  if (course.length > 150) {
    return { success: false, error: "Course name must be 150 characters or less." };
  }

  const admissionId = crypto.randomUUID();

  const { error } = await supabase
    .from("admissions")
    .insert([
      {
        id: admissionId,
        student_name: name,
        email: cleanEmail,
        phone: cleanPhone,
        selected_course: course,
        status: "Pending",
      },
    ]);

  if (error) {
    console.error("[submitAdmission Server Error Diagnostics]", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    return {
      success: false,
      error: "Unable to submit application. Please check your information and try again or contact admissions.",
    };
  }

  try {
    const { NotificationService } = await import("@/lib/notifications/service");
    
    if (cleanEmail) {
      await NotificationService.send("Email", {
        to: cleanEmail,
        title: "Admission Application Received - RCI",
        message: `Dear ${name},\n\nThank you for applying to the ${course} program at Rohit Computer Institute. Your application is currently under review.\n\nBest regards,\nRohit Computer Institute`,
        metadata: { admission_id: admissionId },
      });
    }

    await NotificationService.send("InApp", {
      to: "admin",
      title: "New Admission Application",
      message: `A new application has been submitted by ${name} for the ${course} course.`,
      metadata: { admission_id: admissionId },
    });
  } catch (notifErr: any) {
    console.error("Failed to send admission submission notification:", notifErr?.message || notifErr);
  }

  revalidatePath("/admin", "layout");
  return { success: true, admissionId };
}
