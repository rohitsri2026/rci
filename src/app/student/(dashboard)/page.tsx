import { getStudentSession } from "@/lib/student-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  CreditCard,
  Award,
  Bell,
  ChevronRight,
  GraduationCap,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  FileText,
  User,
  Phone,
  Mail,
  ShieldCheck,
  BookMarked,
  Download,
  ExternalLink,
  Clock,
  QrCode
} from "lucide-react";

export default async function StudentDashboardPage() {
  const { student, user, supabase, mustChangePassword } = await getStudentSession();

  if (!student || !user) {
    redirect("/student/login");
  }

  if (mustChangePassword) {
    redirect("/student/change-password?firstLogin=true");
  }

  // Fetch real database records in parallel — scoped to this student ID
  const [feesRes, certsRes, notifRes, examsRes] = await Promise.all([
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
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("exam_results")
      .select("*, exams(*)")
      .eq("student_id", student.id)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const ledger = feesRes.data as any;
  const certificates = certsRes.data || [];
  const notifications = notifRes.data || [];
  const examResults = examsRes.data || [];

  // Fee calculation
  const planTotal = Number((ledger?.fee_plans as any)?.total_amount ?? 0);
  const discount = Number(ledger?.discount_amount ?? 0);
  const paidAmount = Number(ledger?.total_paid ?? 0);
  const totalCourseFee = Math.max(0, planTotal - discount);
  const remainingFee = Math.max(0, totalCourseFee - paidAmount);

  let feeStatus = ledger?.status || (remainingFee === 0 && totalCourseFee > 0 ? "Paid" : remainingFee > 0 && paidAmount > 0 ? "Partially Paid" : "Pending");

  const course = student.courses as any;
  const studentFormattedId = `RCI-STU-${student.id.slice(0, 6).toUpperCase()}`;

  // Current Date formatting
  const todayDateStr = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* 1. WELCOME HERO BANNER */}
      <div className="bg-gradient-to-br from-[#07152F] via-[#0B224D] to-[#155EEF] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold mb-3 text-blue-200">
              <Calendar className="w-3.5 h-3.5" />
              <span>{todayDateStr}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
              Welcome back, {student.full_name}! 👋
            </h1>
            <p className="text-blue-100/90 text-xs sm:text-sm mt-1.5 font-medium max-w-xl">
              Track your learning progress, fee ledgers, exam results, and verifiable certificates from one place.
            </p>
          </div>

          <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center sm:text-right">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200 block">
              Official Student ID
            </span>
            <span className="text-base sm:text-lg font-mono font-extrabold text-white mt-0.5 block">
              {studentFormattedId}
            </span>
          </div>
        </div>
      </div>

      {/* 2. PROFILE SUMMARY CARD & QUICK STATS GRID */}
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Profile Summary Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#155EEF] text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                {student.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-950 text-base sm:text-lg leading-tight font-display">
                  {student.full_name}
                </h3>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 mt-1 inline-block">
                  {studentFormattedId}
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              ACTIVE
            </span>
          </div>

          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-extrabold uppercase text-[10.5px] tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Current Course
              </span>
              <span className="font-extrabold text-slate-900 truncate max-w-[180px]">
                {course?.course_name || "General Computer Program"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-extrabold uppercase text-[10.5px] tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone
              </span>
              <span className="font-bold text-slate-800">{student.phone || "Not provided"}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-extrabold uppercase text-[10.5px] tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Email
              </span>
              <span className="font-bold text-slate-800 truncate max-w-[180px]">{student.email || user.email}</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400 font-extrabold uppercase text-[10.5px] tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Enrollment Date
              </span>
              <span className="font-bold text-slate-700">
                {student.created_at ? new Date(student.created_at).toLocaleDateString("en-IN") : "—"}
              </span>
            </div>
          </div>

          <Link
            href="/student/profile"
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>View Full Profile</span>
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-4">
          
          {/* Card 1: Current Course */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold mb-3">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Current Course
              </span>
              <h4 className="text-base sm:text-lg font-extrabold text-slate-950 mt-0.5 truncate font-display">
                {course?.course_name || "Registered Program"}
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Duration: {course?.duration || "Standard"}
              </p>
            </div>
            <Link href="/student/courses" className="text-xs font-extrabold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-3">
              Course Details <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Exam Results */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Exam Results
              </span>
              <h4 className="text-xl sm:text-2xl font-extrabold text-slate-950 mt-0.5 font-display">
                {examResults.length > 0
                  ? `${examResults[0].marks_obtained}/${examResults[0].max_marks || 100}`
                  : "No Exams"}
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                {examResults.length > 0
                  ? `Latest: ${examResults[0].exams?.title || "Exam"}`
                  : "No exam records yet"}
              </p>
            </div>
            <Link href="/student/exams" className="text-xs font-extrabold text-purple-600 hover:text-purple-800 flex items-center gap-1 mt-3">
              View All Results <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Fee Due */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold mb-3 ${
              remainingFee > 0 ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
            }`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Fee Due
              </span>
              <h4 className={`text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5 font-display ${
                remainingFee > 0 ? "text-rose-700" : "text-emerald-700"
              }`}>
                ₹{remainingFee.toLocaleString("en-IN")}
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Paid: ₹{paidAmount.toLocaleString("en-IN")}
              </p>
            </div>
            <Link href="/student/fees" className="text-xs font-extrabold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-3">
              View Fee Ledger <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4: Certificates */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold mb-3">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Certificates
              </span>
              <h4 className="text-2xl font-extrabold text-slate-950 mt-0.5 font-display">
                {certificates.length}
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Issued credentials
              </p>
            </div>
            <Link href="/student/certificates" className="text-xs font-extrabold text-amber-600 hover:text-amber-800 flex items-center gap-1 mt-3">
              My Certificates <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>

      {/* 3. MY CURRENT COURSE CARD */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-950 tracking-tight font-display">My Current Course</h2>
              <p className="text-xs text-slate-500 font-medium">Detailed course information and enrollment status</p>
            </div>
          </div>
          <Link
            href="/student/courses"
            className="text-xs font-extrabold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
          >
            View Course <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {course ? (
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Course Name</span>
              <span className="font-extrabold text-slate-950 text-sm block">{course.course_name}</span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Duration</span>
              <span className="font-bold text-slate-800 block">{course.duration || "Standard Program"}</span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Course Fee</span>
              <span className="font-bold text-slate-800 block">₹{course.fees || "N/A"}</span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Enrollment Date</span>
              <span className="font-bold text-slate-800 block">{student.created_at ? new Date(student.created_at).toLocaleDateString("en-IN") : "Active"}</span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-6 text-center text-slate-500 text-xs font-semibold">
            No active course assigned. Please contact the administrator.
          </div>
        )}
      </div>

      {/* 4. FEE LEDGER SUMMARY & EXAMS GRID */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Fee Ledger Summary */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-950 tracking-tight font-display">Fee Ledger Summary</h3>
                <p className="text-xs text-slate-500 font-medium">Payment status and remaining balance</p>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase border ${
              feeStatus === "Paid" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
            }`}>
              {feeStatus}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-center">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Total Fee</span>
              <span className="text-sm font-extrabold text-slate-900 mt-1 block">₹{totalCourseFee.toLocaleString("en-IN")}</span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 block">Paid</span>
              <span className="text-sm font-extrabold text-emerald-700 mt-1 block">₹{paidAmount.toLocaleString("en-IN")}</span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 block">Remaining</span>
              <span className="text-sm font-extrabold text-rose-700 mt-1 block">₹{remainingFee.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/student/fees"
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>View Fee Details</span>
            </Link>
          </div>
        </div>

        {/* Recent Exam Results */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-950 tracking-tight font-display">Recent Exam Results</h3>
                <p className="text-xs text-slate-500 font-medium">Academic performance and marks</p>
              </div>
            </div>

            <Link href="/student/exams" className="text-xs font-extrabold text-purple-600 hover:text-purple-800 flex items-center gap-1">
              All Results <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {examResults.length > 0 ? (
            <div className="space-y-2">
              {examResults.map((res: any) => (
                <div key={res.id} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 block">{res.exams?.title || "Exam"}</span>
                    <span className="text-slate-500 font-medium block mt-0.5">{res.exams?.subject || "Computer Application"}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-purple-700 block">{res.marks_obtained} / {res.max_marks || 100}</span>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">PASSED</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl p-6 text-center text-slate-500 text-xs font-semibold">
              No exam results available yet.
            </div>
          )}

          <Link
            href="/student/exams"
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View All Results</span>
          </Link>
        </div>

      </div>

      {/* 5. MY CERTIFICATES SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-950 tracking-tight font-display">My Certificates</h2>
              <p className="text-xs text-slate-500 font-medium">Official institute certificates issued to your account</p>
            </div>
          </div>

          <Link href="/student/certificates" className="text-xs font-extrabold text-amber-600 hover:text-amber-800 flex items-center gap-1">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {certificates.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {certificates.map((cert: any) => (
              <div key={cert.id} className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {cert.certificate_number}
                    </span>
                    <h4 className="font-extrabold text-slate-950 text-sm mt-2">{cert.course_name}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                    cert.status === "Valid" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}>
                    {cert.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Grade: <strong className="text-slate-900">{cert.grade || "A+"}</strong></span>
                  <a
                    href={`/verify/${cert.certificate_number}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-extrabold text-purple-700 hover:underline"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Verify Online</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-8 text-center text-slate-500 space-y-2">
            <Award className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-extrabold text-slate-700">Your certificate will appear here after successful course completion.</p>
          </div>
        )}
      </div>

      {/* 6. STUDY MATERIALS SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
              <BookMarked className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-950 tracking-tight font-display">Study Materials</h2>
              <p className="text-xs text-slate-500 font-medium">Course notes, practice files, and reference PDFs</p>
            </div>
          </div>

          <Link href="/student/materials" className="text-xs font-extrabold text-purple-600 hover:text-purple-800 flex items-center gap-1">
            Browse All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-slate-50 rounded-xl p-8 text-center text-slate-500 space-y-2">
          <BookMarked className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-xs font-extrabold text-slate-700">Study materials will appear here soon.</p>
          <p className="text-[11px] text-slate-400">Class notes and reference modules assigned to your course will be uploaded shortly.</p>
        </div>
      </div>

    </div>
  );
}
