import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import StudentForm from "@/components/admin/students/StudentForm";

export default function NewStudentPage() {
  return (
    <div className="max-w-4xl space-y-6">
      {/* Top Utility Header */}
      <div>
        <Link 
          href="/admin/students" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-600 hover:text-blue-600 transition-colors mb-3 px-2 py-1 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" />
          <span>Back to Students</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight font-display">
              Add New Student
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Register a new student record in the institute database.
            </p>
          </div>
        </div>
      </div>

      {/* Shared Student Form Component */}
      <StudentForm mode="create" />
    </div>
  );
}
