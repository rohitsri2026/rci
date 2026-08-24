"use client";

import { useState, useMemo } from "react";
import PublicCourseCard, { PublicCourseData, getCategoryForCourse } from "./PublicCourseCard";
import { Search, BookOpen, Layers } from "lucide-react";

interface CoursesCatalogClientProps {
  initialCourses: PublicCourseData[];
}

const CATEGORIES = ["All", "Computer", "Accounting", "Programming", "Typing"];

export default function CoursesCatalogClient({ initialCourses }: CoursesCatalogClientProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = useMemo(() => {
    return initialCourses.filter((course) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        course.course_name.toLowerCase().includes(q) ||
        (course.description && course.description.toLowerCase().includes(q));

      const category = getCategoryForCourse(course.course_name, course.category);
      const matchesCategory = activeCategory === "All" || category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [initialCourses, activeCategory, searchQuery]);

  return (
    <div>
      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all min-h-[40px] ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                  : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar & Counter */}
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all min-h-[40px]"
            />
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-3.5 py-2 rounded-xl shrink-0">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            {filteredCourses.length} {filteredCourses.length === 1 ? "Program" : "Programs"}
          </span>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {filteredCourses.map((course, index) => (
            <PublicCourseCard 
              key={course.id} 
              course={course} 
              priority={index < 3} 
            />
          ))}
        </div>
      ) : (
        /* Empty Filter Results */
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center max-w-md mx-auto space-y-3 mb-12 shadow-xs">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-extrabold text-slate-900">No matching courses found.</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Try adjusting your search query or selecting another category filter.
          </p>
          <button
            onClick={() => {
              setActiveCategory("All");
              setSearchQuery("");
            }}
            className="mt-2 text-xs font-extrabold text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl transition-colors inline-block"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
