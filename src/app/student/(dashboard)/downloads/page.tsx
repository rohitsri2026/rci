import { Download, FileText, BookOpen, Code, FolderOpen } from "lucide-react";

const materials = [
  { name: "Course Syllabus PDF", category: "Syllabus", icon: FileText, size: "245 KB", type: "PDF", href: "#" },
  { name: "Python Programming Notes", category: "Study Material", icon: BookOpen, size: "1.2 MB", type: "PDF", href: "#" },
  { name: "HTML & CSS Reference Guide", category: "Study Material", icon: BookOpen, size: "890 KB", type: "PDF", href: "#" },
  { name: "JavaScript Basics", category: "Study Material", icon: Code, size: "560 KB", type: "PDF", href: "#" },
  { name: "Assignment - Module 1", category: "Assignments", icon: FileText, size: "120 KB", type: "DOCX", href: "#" },
  { name: "Assignment - Module 2", category: "Assignments", icon: FileText, size: "95 KB", type: "DOCX", href: "#" },
];

const categories = [...new Set(materials.map((m) => m.category))];

const categoryColors: Record<string, string> = {
  "Syllabus": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Study Material": "bg-blue-50 text-blue-700 border-blue-200",
  "Assignments": "bg-amber-50 text-amber-700 border-amber-200",
};

export default function StudentDownloadsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-display">Downloads</h1>
        <p className="text-slate-500 mt-1 text-sm">Study materials, assignments, and resources provided by your institute.</p>
      </div>

      {categories.map((category) => (
        <div key={category}>
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-indigo-500" />
            {category}
          </h2>
          <div className="grid gap-3">
            {materials.filter((m) => m.category === category).map((item) => (
              <div key={item.name} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${categoryColors[item.category] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}>{item.type}</span>
                    <span className="text-slate-400 text-xs">{item.size}</span>
                  </div>
                </div>
                <a
                  href={item.href}
                  className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 font-semibold px-3 py-2 rounded-xl text-xs transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
