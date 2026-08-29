import { getStudentSession } from "@/lib/student-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, BookOpen, Phone, Mail, MapPin, Calendar, Hash, ShieldCheck, KeyRound } from "lucide-react";
import StudentAvatar from "@/components/student/StudentAvatar";

export default async function StudentProfilePage() {
  const { student, user } = await getStudentSession();
  if (!student || !user) redirect("/student/login");

  const course = student.courses as any;
  const studentFormattedId = `RCI-STU-${student.id.slice(0, 6).toUpperCase()}`;

  const fields = [
    { label: "Full Name", value: student.full_name, icon: User },
    { label: "Student Email", value: student.email ?? user.email, icon: Mail },
    { label: "Registered Phone", value: student.phone ?? "Not provided", icon: Phone },
    { label: "Address", value: student.address ?? "Not provided", icon: MapPin },
    { label: "Enrolled Course", value: course?.course_name ?? "Not assigned", icon: BookOpen },
    { label: "Course Duration", value: course?.duration ?? "Standard Program", icon: Calendar },
    { label: "Student ID", value: studentFormattedId, icon: Hash },
    { label: "Enrollment Date", value: student.created_at ? new Date(student.created_at).toLocaleDateString("en-IN", { dateStyle: "long" }) : "Active", icon: Calendar },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#07152F] font-display">My Profile</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Your official personal academic details and enrollment record.</p>
        </div>

        <Link
          href="/student/change-password"
          className="inline-flex items-center gap-2 bg-[#155EEF] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-md shadow-blue-500/15"
        >
          <KeyRound className="w-4 h-4" />
          <span>Change Password</span>
        </Link>
      </div>

      {/* Avatar Banner */}
      <div className="bg-gradient-to-r from-[#07152F] via-[#0B224D] to-[#155EEF] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-5">
          <StudentAvatar
            photoUrl={student.photo_url}
            studentName={student.full_name}
            size="2xl"
            border={true}
            className="ring-4 ring-white/20 shadow-xl shrink-0"
          />
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-display">{student.full_name}</h2>
            <p className="text-blue-100/80 text-xs sm:text-sm mt-0.5">{student.email ?? user.email}</p>
            {course && (
              <span className="inline-block mt-2 bg-white/10 border border-white/20 text-blue-200 text-xs font-bold px-3 py-0.5 rounded-full">
                {course.course_name}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-2 text-right">
          <span className="text-[10px] font-extrabold text-blue-200 uppercase tracking-wider block">ID Number</span>
          <span className="font-mono font-extrabold text-white text-sm sm:text-base">{studentFormattedId}</span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-950 text-base font-display">Personal & Academic Details</h3>
          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Official Record
          </span>
        </div>
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 divide-slate-100">
          {fields.map((field) => (
            <div key={field.label} className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 last:border-b-0">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <field.icon className="w-4.5 h-4.5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10.5px] font-extrabold text-slate-400 uppercase tracking-wider">{field.label}</p>
                <p className="text-slate-950 font-bold text-sm mt-0.5 truncate">{field.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
