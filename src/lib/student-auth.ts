import { createClient } from "@/lib/supabase/server";

/**
 * Gets the current student's linked record from the students table.
 * Enforces strict ownership & data isolation: only returns data for the authenticated user's own student record.
 */
export async function getStudentSession() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { student: null, user: null, supabase, mustChangePassword: false };
  }

  const selectQuery = `
    *,
    courses:course_id (
      id,
      course_name,
      duration,
      fees,
      description,
      curriculum
    )
  `;

  let student: any = null;

  // 1. Try matching by student_id stored in auth user_metadata
  if (user.user_metadata?.student_id) {
    const { data } = await supabase
      .from("students")
      .select(selectQuery)
      .eq("id", user.user_metadata.student_id)
      .maybeSingle();
    student = data;
  }

  // 2. Try matching by email
  if (!student && user.email) {
    const { data } = await supabase
      .from("students")
      .select(selectQuery)
      .eq("email", user.email)
      .maybeSingle();
    student = data;
  }

  // 3. Try matching by phone
  if (!student && (user.phone || user.user_metadata?.phone)) {
    const cleanPhone = (user.phone || user.user_metadata?.phone || "").replace(/\D/g, "");
    if (cleanPhone) {
      const { data } = await supabase
        .from("students")
        .select(selectQuery)
        .or(`phone.eq.${cleanPhone},phone.ilike.%${cleanPhone}%`)
        .maybeSingle();
      student = data;
    }
  }

  if (!student) {
    return { student: null, user, supabase, mustChangePassword: false };
  }

  // Check if password change is required (initial phone password in use)
  const passwordChanged = user.user_metadata?.password_changed === true;
  const mustChangePassword = !passwordChanged;

  return { student, user, supabase, mustChangePassword };
}
