import { createStudentServerClient } from "@/lib/supabase/server-student";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizePhone } from "@/lib/utils";

/**
 * Gets the current student's linked record from the students table.
 * Enforces strict ownership & data isolation: only returns data for the authenticated user's own student record.
 */
export async function getStudentSession() {
  const supabase = await createStudentServerClient();
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

  // 3. Try matching by normalized phone
  const userPhone = user.phone || user.user_metadata?.phone;
  const userNormalizedPhone = normalizePhone(userPhone);

  if (!student && userNormalizedPhone) {
    const adminClient = createAdminClient();
    const { data: allStudents } = await adminClient.from("students").select(selectQuery);
    student = allStudents?.find(
      (s) => s.phone && normalizePhone(s.phone) === userNormalizedPhone
    );
  }

  if (!student) {
    return { student: null, user, supabase, mustChangePassword: false };
  }

  // Check if password change is required (initial phone password in use)
  const passwordChanged = user.user_metadata?.password_changed === true;
  const mustChangePassword = !passwordChanged;

  return { student, user, supabase, mustChangePassword };
}
