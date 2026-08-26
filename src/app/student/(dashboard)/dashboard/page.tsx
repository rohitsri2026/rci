import type { Metadata } from "next";
import { getStudentSession } from "@/lib/student-auth";
import { redirect } from "next/navigation";
import DashboardWelcome from "@/components/student/DashboardWelcome";
import DashboardQuickActions from "@/components/student/DashboardQuickActions";
import StudentProfileCard from "@/components/student/StudentProfileCard";
import CurrentCourseCard from "@/components/student/CurrentCourseCard";
import FeeSummaryCard from "@/components/student/FeeSummaryCard";
import ExamSummaryCard from "@/components/student/ExamSummaryCard";
import CertificateSummaryCard from "@/components/student/CertificateSummaryCard";
import StudyMaterialsSummaryCard from "@/components/student/StudyMaterialsSummaryCard";
import AttentionPanel from "@/components/student/AttentionPanel";

export const metadata: Metadata = {
  title: "Student Dashboard | Rohit Computer Institute",
  description: "RCI Student Portal Dashboard & Control Center",
};

export default async function StudentDashboardPage() {
  const { student, user, supabase } = await getStudentSession();

  if (!student || !user) {
    redirect("/student/login");
  }

  // Fetch database records in parallel — strictly scoped to this authenticated student ID
  let feesRes: any = null;
  let certsRes: any = null;
  let examsRes: any = null;
  let queryError = false;

  try {
    const [feesResult, certsResult, examsResult] = await Promise.all([
      supabase
        .from("student_fees_ledger")
        .select("status, total_paid, fee_plans(total_amount), discount_amount")
        .eq("student_id", student.id)
        .maybeSingle(),
      supabase
        .from("certificates")
        .select("*")
        .eq("student_id", student.id)
        .order("issue_date", { ascending: false }),
      supabase
        .from("exam_results")
        .select("*, exams(*)")
        .eq("student_id", student.id)
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

    feesRes = feesResult;
    certsRes = certsResult;
    examsRes = examsResult;
  } catch (err) {
    console.error("Dashboard data fetching error:", err);
    queryError = true;
  }

  const ledger = feesRes?.data ?? null;
  const certificates = certsRes?.data || [];
  const examResults = examsRes?.data || [];

  // Calculate remaining fee if ledger exists
  let remainingFee = 0;
  if (ledger) {
    const planTotal = Number((ledger?.fee_plans as any)?.total_amount ?? 0);
    const discount = Number(ledger?.discount_amount ?? 0);
    const paidAmount = Number(ledger?.total_paid ?? 0);
    const totalCourseFee = Math.max(0, planTotal - discount);
    remainingFee = Math.max(0, totalCourseFee - paidAmount);
  }

  const course = student.courses as any;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* 1. Error Banner (if query exception occurs) */}
      {queryError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs font-semibold">
          Unable to load some dashboard details right now. Please refresh the page to retry.
        </div>
      )}

      {/* 2. Welcome Banner */}
      <DashboardWelcome
        studentName={student.full_name}
        courseName={course?.course_name}
        studentId={student.id}
      />

      {/* 3. Attention / Important Updates Panel */}
      <AttentionPanel
        remainingFee={remainingFee}
        hasCertificates={certificates.length > 0}
      />

      {/* 4. Quick Actions */}
      <DashboardQuickActions />

      {/* 5. Profile & Current Course Grid */}
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 flex">
          <div className="w-full">
            <StudentProfileCard student={student} userEmail={user.email} />
          </div>
        </div>
        <div className="lg:col-span-7 flex">
          <div className="w-full">
            <CurrentCourseCard course={course} enrollmentDate={student.created_at} />
          </div>
        </div>
      </div>

      {/* 6. Fee Summary & Exam Summary Grid */}
      <div className="grid lg:grid-cols-2 gap-6 items-stretch">
        <FeeSummaryCard ledger={ledger} />
        <ExamSummaryCard examResults={examResults} />
      </div>

      {/* 7. Certificates Section */}
      <CertificateSummaryCard certificates={certificates} />

      {/* 8. Study Materials Section */}
      <StudyMaterialsSummaryCard />

    </div>
  );
}
