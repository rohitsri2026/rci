"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { verifyRole } from "@/lib/auth";

export interface CoursePayload {
  course_name: string;
  slug?: string | null;
  duration?: string | null;
  fees: number;
  discount?: number;
  thumbnail_url?: string | null;
  eligibility?: string | null;
  description?: string | null;
  requirements?: string[] | null;
  faqs?: any;
  curriculum?: any;
  seo_metadata?: any;
  status?: "Active" | "Inactive";
}

function isStatusColumnMissingError(error: any): boolean {
  if (!error) return false;
  const msg = (error.message || "").toLowerCase();
  return (
    msg.includes("'status' column") || 
    msg.includes("column \"status\"") || 
    msg.includes("status of 'courses'") ||
    msg.includes("schema cache") && msg.includes("status")
  );
}

export async function createCourse(payload: CoursePayload) {
  const supabase = await createClient();

  const authCheck = await verifyRole(supabase, ["Admin", "Staff"]);
  if (authCheck.error) {
    return { success: false, error: authCheck.error };
  }

  // Validation
  const course_name = payload.course_name?.trim();
  if (!course_name) {
    return { success: false, error: "Course name is required." };
  }

  if (payload.fees < 0 || isNaN(payload.fees)) {
    return { success: false, error: "Fee must be a valid non-negative number." };
  }

  const cleanPayload: Record<string, any> = {
    course_name,
    slug: payload.slug?.trim() || undefined,
    duration: payload.duration?.trim() || null,
    fees: Number(payload.fees) || 0,
    discount: Number(payload.discount) || 0,
    thumbnail_url: payload.thumbnail_url?.trim() || null,
    eligibility: payload.eligibility?.trim() || null,
    description: payload.description?.trim() || null,
    requirements: payload.requirements?.length ? payload.requirements : null,
    faqs: payload.faqs?.length ? payload.faqs : null,
    curriculum: payload.curriculum?.length ? payload.curriculum : null,
    seo_metadata: payload.seo_metadata || null,
    status: payload.status || "Active",
  };

  let { data, error } = await supabase
    .from("courses")
    .insert([cleanPayload])
    .select()
    .single();

  if (error && isStatusColumnMissingError(error)) {
    console.warn("[createCourse Diagnostic] Remote Supabase schema cache missing 'status' column. Retrying insert without 'status' field...");
    const { status, ...fallbackPayload } = cleanPayload;
    const retry = await supabase.from("courses").insert([fallbackPayload]).select().single();
    if (!retry.error) {
      revalidatePath("/admin/courses");
      revalidatePath("/admission");
      return { success: true, data: retry.data };
    }
    error = retry.error;
  }

  if (error) {
    console.error("[createCourse Error Diagnostics]", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    if (error.code === "23505") {
      return { success: false, error: "A course with this name or slug already exists." };
    }
    return { success: false, error: "Unable to create course. Please check inputs and try again." };
  }

  revalidatePath("/admin/courses");
  revalidatePath("/admission");
  return { success: true, data };
}

export async function updateCourse(courseId: string, payload: Partial<CoursePayload>) {
  const supabase = await createClient();

  const authCheck = await verifyRole(supabase, ["Admin", "Staff"]);
  if (authCheck.error) {
    return { success: false, error: authCheck.error };
  }

  if (payload.course_name !== undefined) {
    const course_name = payload.course_name?.trim();
    if (!course_name) {
      return { success: false, error: "Course name cannot be empty." };
    }
    payload.course_name = course_name;
  }

  if (payload.fees !== undefined && (payload.fees < 0 || isNaN(payload.fees))) {
    return { success: false, error: "Fee must be a valid non-negative number." };
  }

  const cleanPayload: Record<string, any> = {};
  if (payload.course_name !== undefined) cleanPayload.course_name = payload.course_name;
  if (payload.slug !== undefined) cleanPayload.slug = payload.slug?.trim() || null;
  if (payload.duration !== undefined) cleanPayload.duration = payload.duration?.trim() || null;
  if (payload.fees !== undefined) cleanPayload.fees = Number(payload.fees) || 0;
  if (payload.discount !== undefined) cleanPayload.discount = Number(payload.discount) || 0;
  if (payload.thumbnail_url !== undefined) cleanPayload.thumbnail_url = payload.thumbnail_url?.trim() || null;
  if (payload.eligibility !== undefined) cleanPayload.eligibility = payload.eligibility?.trim() || null;
  if (payload.description !== undefined) cleanPayload.description = payload.description?.trim() || null;
  if (payload.requirements !== undefined) cleanPayload.requirements = payload.requirements;
  if (payload.faqs !== undefined) cleanPayload.faqs = payload.faqs;
  if (payload.curriculum !== undefined) cleanPayload.curriculum = payload.curriculum;
  if (payload.seo_metadata !== undefined) cleanPayload.seo_metadata = payload.seo_metadata;
  if (payload.status !== undefined) cleanPayload.status = payload.status;

  let { error } = await supabase
    .from("courses")
    .update(cleanPayload)
    .eq("id", courseId);

  if (error && isStatusColumnMissingError(error)) {
    console.warn("[updateCourse Diagnostic] Remote Supabase schema cache missing 'status' column. Retrying update without 'status' field...");
    const { status, ...fallbackPayload } = cleanPayload;
    if (Object.keys(fallbackPayload).length > 0) {
      const retry = await supabase.from("courses").update(fallbackPayload).eq("id", courseId);
      if (!retry.error) {
        revalidatePath("/admin/courses");
        revalidatePath(`/admin/courses/${courseId}/edit`);
        revalidatePath("/admission");
        return { success: true };
      }
      error = retry.error;
    } else {
      revalidatePath("/admin/courses");
      return { success: true };
    }
  }

  if (error) {
    console.error("[updateCourse Error Diagnostics]", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    if (error.code === "23505") {
      return { success: false, error: "A course with this name or slug already exists." };
    }
    return { success: false, error: "Unable to save course changes. Please try again." };
  }

  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${courseId}/edit`);
  revalidatePath("/admission");
  return { success: true };
}

export async function toggleCourseStatus(courseId: string, currentStatus: string) {
  const supabase = await createClient();

  const authCheck = await verifyRole(supabase, ["Admin", "Staff"]);
  if (authCheck.error) {
    return { success: false, error: authCheck.error };
  }

  const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";

  const { error } = await supabase
    .from("courses")
    .update({ status: nextStatus })
    .eq("id", courseId);

  if (error) {
    console.error("[toggleCourseStatus Error Diagnostics]", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    if (isStatusColumnMissingError(error)) {
      return { 
        success: false, 
        error: "Database schema is pending 'status' column migration. Please run migration.sql in your Supabase SQL Editor." 
      };
    }
    return { success: false, error: "Failed to update course status." };
  }

  revalidatePath("/admin/courses");
  revalidatePath("/admission");
  return { success: true, newStatus: nextStatus };
}

export async function deleteCourse(courseId: string) {
  const supabase = await createClient();

  const authCheck = await verifyRole(supabase, ["Admin", "Staff"]);
  if (authCheck.error) {
    return { success: false, error: authCheck.error };
  }

  // Fetch target course details first
  const { data: course, error: courseFetchError } = await supabase
    .from("courses")
    .select("id, course_name")
    .eq("id", courseId)
    .single();

  if (courseFetchError || !course) {
    return { success: false, error: "Course record not found." };
  }

  // 1. Check if any students are enrolled in this course
  const { data: students, error: studentError } = await supabase
    .from("students")
    .select("id")
    .eq("course_id", courseId)
    .limit(1);

  if (studentError) {
    return { success: false, error: "Failed to verify enrolled students." };
  }

  if (students && students.length > 0) {
    return {
      success: false,
      isReferenced: true,
      error: "Cannot delete this course because existing student records are associated with it. Please deactivate the course instead to preserve historical data.",
    };
  }

  // 2. Check if any admissions reference this course name
  const { data: admissions, error: admissionError } = await supabase
    .from("admissions")
    .select("id")
    .eq("selected_course", course.course_name)
    .limit(1);

  if (!admissionError && admissions && admissions.length > 0) {
    return {
      success: false,
      isReferenced: true,
      error: "Cannot delete this course because existing admission applications reference it. Please deactivate the course instead to preserve historical records.",
    };
  }

  // 3. Check if any certificates are issued for this course
  const { data: certificates, error: certError } = await supabase
    .from("certificates")
    .select("id")
    .eq("course_id", courseId)
    .limit(1);

  if (!certError && certificates && certificates.length > 0) {
    return {
      success: false,
      isReferenced: true,
      error: "Cannot delete this course because historical certificates have been issued for it. Please deactivate the course instead.",
    };
  }

  // 4. Proceed with deletion if no dependencies exist
  const { error } = await supabase.from("courses").delete().eq("id", courseId);

  if (error) {
    console.error("[deleteCourse Error Diagnostics]", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    return { success: false, error: "Unable to delete course. Please try again." };
  }

  revalidatePath("/admin/courses");
  revalidatePath("/admission");
  return { success: true };
}
