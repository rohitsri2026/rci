import { getStudentSession } from "@/lib/student-auth";
import { redirect } from "next/navigation";
import { User, BookOpen, Phone, Mail, MapPin, Calendar, Hash } from "lucide-react";

export default async function StudentProfilePage() {
  const { student, user } = await getStudentSession();
  if (!student || !user) redirect("/student/login");

  const course = student.courses as any;

  const fields = [
    { label: "Full Name", value: student.full_name, icon: User },
    { label: "Student Email", value: student.email ?? user.email, icon: Mail },
    { label: "Phone", value: student.phone ?? "Not provided", icon: Phone },
    { label: "Address", value: student.address ?? "Not provided", icon: MapPin },
    { label: "Enrolled Course", value: course?.course_name ?? "Not assigned", icon: BookOpen },
    { label: "Course Duration", value: course?.duration ?? "N/A", icon: Calendar },
    { label: "Student ID", value: student.id.toUpperCase(), icon: Hash },
    { label: "Enrollment Date", value: student.created_at ? new Date(student.created_at).toLocaleDateString("en-IN", { dateStyle: "long" }) : "N/A", icon: Calendar },
  ];

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-display">My Profile</h1>
        <p className="text-slate-500 mt-1 text-sm">Your personal academic details and enrollment information.</p>
      </div>

      {/* Avatar + Name */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-3xl p-8 flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-indigo-200 shrink-0">
          {student.full_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">{student.full_name}</h2>
          <p className="text-slate-500 text-sm mt-0.5">{student.email ?? user.email}</p>
          {course && (
            <span className="inline-block mt-2 bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold px-3 py-1 rounded-full">
              {course.course_name}
            </span>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Personal & Enrollment Details</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {fields.map((field) => (
            <div key={field.label} className="flex items-center gap-4 px-6 py-4">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <field.icon className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{field.label}</p>
                <p className="text-slate-900 font-medium text-sm mt-0.5">{field.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Info */}
      {course && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Course Information</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Course Description</p>
              <p className="text-slate-600 text-sm leading-relaxed">{course.description ?? "No description available."}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Duration</p>
                <p className="text-slate-900 font-bold">{course.duration ?? "N/A"}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Course Fee</p>
                <p className="text-slate-900 font-bold">₹{course.fees ?? "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
