import { createAdminServerClient } from "@/lib/supabase/server-admin";
import CourseListClient from "@/components/admin/courses/CourseListClient";
import { Course } from "@/types/course";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const supabase = await createAdminServerClient();

  // 1. Fetch courses
  const { data: coursesData } = await supabase
    .from("courses")
    .select("*")
    .order("course_name", { ascending: true });

  const rawCourses = (coursesData || []) as Course[];

  // 2. Fetch stats: student counts, admissions counts, certificate counts
  const [studentsRes, admissionsRes, certificatesRes] = await Promise.all([
    supabase.from("students").select("course_id"),
    supabase.from("admissions").select("selected_course"),
    supabase.from("certificates").select("course_id"),
  ]);

  const studentCountMap: Record<string, number> = {};
  if (studentsRes.data) {
    studentsRes.data.forEach((s) => {
      if (s.course_id) {
        studentCountMap[s.course_id] = (studentCountMap[s.course_id] || 0) + 1;
      }
    });
  }

  const admissionCountMap: Record<string, number> = {};
  if (admissionsRes.data) {
    admissionsRes.data.forEach((a) => {
      if (a.selected_course) {
        admissionCountMap[a.selected_course] = (admissionCountMap[a.selected_course] || 0) + 1;
      }
    });
  }

  const certCountMap: Record<string, number> = {};
  if (certificatesRes.data) {
    certificatesRes.data.forEach((c) => {
      if (c.course_id) {
        certCountMap[c.course_id] = (certCountMap[c.course_id] || 0) + 1;
      }
    });
  }

  const courses: Course[] = rawCourses.map((c) => ({
    ...c,
    student_count: studentCountMap[c.id] || 0,
    admission_count: admissionCountMap[c.course_name] || 0,
    certificate_count: certCountMap[c.id] || 0,
  }));

  return <CourseListClient initialCourses={courses} />;
}
