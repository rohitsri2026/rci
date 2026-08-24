import Image from "next/image";
import Link from "next/link";
import { Clock, BadgeIndianRupee, Award, ArrowRight, MessageCircle, BookOpen } from "lucide-react";
import { RCIConfig } from "@/lib/config";

export type PublicCourseData = {
  id: string;
  course_name: string;
  slug?: string | null;
  duration?: string | null;
  fees?: number | null;
  discount?: number | null;
  description?: string | null;
  thumbnail_url?: string | null;
  category?: string | null;
};

export interface PublicCourseCardProps {
  course: PublicCourseData;
  priority?: boolean;
}

export function getImageForCourse(name: string, thumbnail_url?: string | null): string {
  if (thumbnail_url && thumbnail_url.trim().length > 0) {
    return thumbnail_url.trim();
  }
  const lower = name.toLowerCase();
  if (lower.includes("dca") || lower.includes("diploma")) return "/courses/dca.jpg";
  if (lower.includes("tally") || lower.includes("gst") || lower.includes("account")) return "/courses/tally.jpg";
  if (lower.includes("web") || lower.includes("react") || lower.includes("frontend")) return "/courses/web-dev.jpg";
  if (lower.includes("python") || lower.includes("code") || lower.includes("java")) return "/courses/python.jpg";
  if (lower.includes("typing") || lower.includes("hindi") || lower.includes("english")) return "/courses/typing.jpg";
  if (lower.includes("graphic") || lower.includes("dtp") || lower.includes("design")) return "/courses/graphic.jpg";
  return "/courses/dca.jpg";
}

export function getCategoryForCourse(name: string, category?: string | null): string {
  if (category && category.trim().length > 0) {
    return category.trim();
  }
  const lower = name.toLowerCase();
  if (lower.includes("tally") || lower.includes("account") || lower.includes("gst")) return "Accounting";
  if (lower.includes("web") || lower.includes("python") || lower.includes("programming") || lower.includes("code")) return "Programming";
  if (lower.includes("typing")) return "Typing";
  return "Computer";
}

export function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function PublicCourseCard({ course, priority = false }: PublicCourseCardProps) {
  const slug = course.slug?.trim() || toSlug(course.course_name);
  const category = getCategoryForCourse(course.course_name, course.category);
  const imageUrl = getImageForCourse(course.course_name, course.thumbnail_url);
  const duration = course.duration?.trim() || "Flexible";
  
  const rawFee = Number(course.fees) || 0;
  const discountAmount = Number(course.discount) || 0;
  const hasDiscount = discountAmount > 0 && discountAmount < rawFee;
  const finalFee = hasDiscount ? rawFee - discountAmount : rawFee;
  const originalFee = rawFee;

  const description = course.description?.trim() || "Comprehensive practical training course at Rohit Computer Institute.";

  const whatsappUrl = RCIConfig.getWhatsAppUrl(
    `Hello RCI, I want information about the ${course.course_name} course.`
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-300/90 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Course Thumbnail Visual */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
          <Image
            src={imageUrl}
            alt={course.course_name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <span className="bg-white/95 backdrop-blur-md text-blue-700 text-xs font-black px-3 py-1 rounded-full shadow-2xs border border-blue-100/50">
              {category}
            </span>
          </div>

          {/* ISO Certification Badge */}
          <div className="absolute bottom-3 right-4 flex items-center gap-1.5 text-white text-xs font-bold bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-lg z-10 border border-white/10">
            <Award className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span>ISO Certified</span>
          </div>
        </div>

        {/* Course Body Content */}
        <div className="p-6">
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {course.course_name}
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm mb-5 leading-relaxed line-clamp-2 min-h-[2.5rem]">
            {description}
          </p>

          {/* Duration & Fee Bar */}
          <div className="flex items-center justify-between py-3 border-y border-slate-100 text-xs font-bold mb-1">
            <span className="flex items-center gap-1.5 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200/60">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{duration}</span>
            </span>

            <div className="flex items-center gap-1.5">
              {hasDiscount && (
                <span className="text-[11px] text-slate-400 line-through font-extrabold">
                  ₹{originalFee.toLocaleString("en-IN")}
                </span>
              )}
              <span className="flex items-center gap-0.5 text-slate-900 text-base sm:text-lg font-black bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-200/60">
                <BadgeIndianRupee className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{finalFee > 0 ? `₹${finalFee.toLocaleString("en-IN")}` : "Inquire"}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6 pt-0 space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/courses/${slug}`}
            className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold transition-colors min-h-[44px]"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>View Details</span>
          </Link>

          <Link
            href={`/admission?course=${encodeURIComponent(slug)}`}
            className="flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-colors shadow-sm shadow-blue-600/20 min-h-[44px]"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 rounded-xl text-xs font-extrabold transition-colors min-h-[44px]"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>WhatsApp Inquiry</span>
        </a>
      </div>
    </div>
  );
}
