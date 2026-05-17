"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteCourse(courseId: string) {
  const supabase = await createClient();

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
      error: "There are students currently enrolled in this course. Please remove or reassign them before deleting the course." 
    };
  }

  // 2. Proceed with deletion if no students are enrolled
  const { error } = await supabase.from("courses").delete().eq("id", courseId);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  revalidatePath("/admin/courses");
  return { success: true };
}
