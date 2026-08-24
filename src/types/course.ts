export interface Course {
  id: string;
  course_name: string;
  slug?: string | null;
  description?: string | null;
  duration?: string | null;
  fees?: number | null;
  discount?: number | null;
  thumbnail_url?: string | null;
  gallery_urls?: string[] | null;
  curriculum?: any;
  requirements?: string[] | null;
  eligibility?: string | null;
  faqs?: any;
  seo_metadata?: any;
  status: "Active" | "Inactive" | string;
  created_at?: string;
  updated_at?: string;
  
  // Aggregate stats
  student_count?: number;
  admission_count?: number;
  certificate_count?: number;
}
