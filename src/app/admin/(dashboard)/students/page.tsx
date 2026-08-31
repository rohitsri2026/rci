import { createAdminServerClient } from "@/lib/supabase/server-admin";
import StudentListClient from "@/components/admin/students/StudentListClient";

export default async function StudentsPage() {
  const supabase = await createAdminServerClient();

  const [studentsResult, coursesResult] = await Promise.all([
    supabase
      .from("students")
      .select("*, courses(course_name)")
      .order("created_at", { ascending: false }),
    supabase
      .from("courses")
      .select("id, course_name")
      .order("course_name", { ascending: true }),
  ]);

  if (studentsResult.error) {
    console.error("Admin StudentsPage fetch error:", studentsResult.error);
  }
  if (coursesResult.error) {
    console.error("Admin StudentsPage courses error:", coursesResult.error);
  }

  return (
    <StudentListClient 
      initialStudents={studentsResult.data ?? []} 
      courses={coursesResult.data ?? []} 
    />
  );
}
