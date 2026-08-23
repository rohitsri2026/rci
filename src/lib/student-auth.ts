import { createClient } from "@/lib/supabase/server";

/**
 * Gets the current student's linked record from the students table.
 * Prevents IDOR: only returns data for the authenticated user's own student record.
 */
export async function getStudentSession() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return { student: null, user: null, supabase };
  }

  // Look up the student record by email (linked during admission approval)
  const { data: student, error } = await supabase
    .from("students")
    .select(`
      *,
      courses:course_id (
        id,
        course_name,
        duration,
        fees,
        description,
        curriculum
      )
    `)
    .eq("email", user.email!)
    .single();

  if (error || !student) {
    return { student: null, user, supabase };
  }

  return { student, user, supabase };
}
