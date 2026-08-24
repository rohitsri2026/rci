import { createClient } from "@/lib/supabase/server";
import StudentListClient from "@/components/admin/students/StudentListClient";

export default async function StudentsPage() {
  const supabase = await createClient();

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

  return (
    <StudentListClient 
      initialStudents={studentsResult.data ?? []} 
      courses={coursesResult.data ?? []} 
    />
  );
}
