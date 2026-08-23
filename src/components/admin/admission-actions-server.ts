"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateAdmissionStatus(admissionId: string, status: "Approved" | "Rejected") {
  const supabase = await createClient();

  // Fetch admission details
  const { data: admission, error: fetchError } = await supabase
    .from("admissions")
    .select("*")
    .eq("id", admissionId)
    .single();

  if (fetchError || !admission) {
    return { success: false, error: "Failed to fetch admission details." };
  }

  if (status === "Approved") {
    // Try to find the course ID based on course_name
    let courseId = null;
    if (admission.selected_course) {
      const { data: course } = await supabase
        .from("courses")
        .select("id")
        .eq("course_name", admission.selected_course)
        .single();
      
      if (course) {
        courseId = course.id;
      }
    }

    // Insert into students table
    const { error: insertError } = await supabase.from("students").insert([{
      full_name: admission.student_name,
      email: admission.email,
      phone: admission.phone,
      course_id: courseId,
    }]);

    if (insertError) {
      return { success: false, error: "Failed to create student record: " + insertError.message };
    }

    // Trigger EV-002 (Admission Approved) and EV-004 (Student welcome)
    try {
      const { NotificationService } = await import("@/lib/notifications/service");
      await NotificationService.send("Email", {
        to: admission.email,
        title: "Admission Approved - Rohit Computer Institute",
        message: `Dear ${admission.student_name},\n\nCongratulations! Your application for the ${admission.selected_course} course has been approved.\n\nWe have successfully created your student registration profile. Our coordinator will contact you shortly.\n\nBest regards,\nRohit Computer Institute`,
      });

      await NotificationService.send("WhatsApp", {
        to: admission.phone,
        title: "Admission Approved",
        message: `Congratulations ${admission.student_name}! Your admission for the ${admission.selected_course} course at RCI has been approved. Welcome!`,
      });
    } catch (notifErr: any) {
      console.error("Admission approved notifications failed:", notifErr.message);
    }
  } else if (status === "Rejected") {
    // Trigger EV-003 (Admission Rejected)
    try {
      const { NotificationService } = await import("@/lib/notifications/service");
      await NotificationService.send("Email", {
        to: admission.email,
        title: "Admission Application Status - RCI",
        message: `Dear ${admission.student_name},\n\nThank you for your interest in Rohit Computer Institute.\n\nWe regret to inform you that your application for the ${admission.selected_course} course could not be approved at this time.\n\nIf you have any questions, please feel free to reach out to us.\n\nBest regards,\nRohit Computer Institute`,
      });
    } catch (notifErr: any) {
      console.error("Admission rejection notification failed:", notifErr.message);
    }
  }

  // Update admission status
  const { error: updateError } = await supabase
    .from("admissions")
    .update({ status })
    .eq("id", admissionId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  revalidatePath("/admin", "layout");
  return { success: true };
}

export async function submitAdmission(form: {
  student_name: string;
  email: string;
  phone: string;
  selected_course: string;
  qualification: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("admissions")
    .insert([{ ...form, status: "Pending" }])
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  // Trigger EV-001: Admission Submitted
  try {
    const { NotificationService } = await import("@/lib/notifications/service");
    
    // 1. Send Email to candidate
    await NotificationService.send("Email", {
      to: form.email,
      title: "Admission Application Received - RCI",
      message: `Dear ${form.student_name},\n\nThank you for applying to the ${form.selected_course} program at Rohit Computer Institute. Your application is under review.\n\nBest regards,\nRohit Computer Institute`,
      metadata: { admission_id: data.id },
    });

    // 2. Send In-App notification log
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
