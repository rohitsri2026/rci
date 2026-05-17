"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateAdmissionStatus(admissionId: string, status: "Approved" | "Rejected") {
  const supabase = await createClient();

  if (status === "Approved") {
    // Fetch admission details
    const { data: admission, error: fetchError } = await supabase
      .from("admissions")
      .select("*")
      .eq("id", admissionId)
      .single();

    if (fetchError || !admission) {
      return { success: false, error: "Failed to fetch admission details." };
    }

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
  }

  // Update admission status
  const { error: updateError } = await supabase
    .from("admissions")
    .update({ status })
    .eq("id", admissionId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  revalidatePath("/admin/admissions");
  revalidatePath("/admin/students");
  return { success: true };
}
