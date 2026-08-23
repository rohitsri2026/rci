export type CertificateStatus = "Valid" | "Revoked" | "Expired";

export type UserRole = "Admin" | "Staff" | "Viewer";

export interface StudentInfo {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  course_id: string | null;
  created_at: string;
}

export interface CourseInfo {
  id: string;
  course_name: string;
  description: string | null;
  duration: string | null;
  fees: number | null;
  created_at: string;
}

export interface Certificate {
  id: string;
  student_id: string;
  course_id: string;
  certificate_number: string;
  completion_date: string;
  issue_date: string;
  grade: string;
  verification_token: string;
  status: CertificateStatus;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  certificate_pdf_url: string | null;
  
  student_name?: string | null;
  course_name?: string | null;
  issued_by?: string | null;
  
  // Joined relation fields
  students?: StudentInfo;
  courses?: CourseInfo;
}

export interface AuditLog {
  id: string;
  action: "Generated" | "Downloaded" | "Printed" | "Reissued" | "Deleted" | "Verified";
  certificate_number: string;
  user_email: string;
  ip_address: string;
  details?: string;
  created_at: string;
}

export interface CertificateSettings {
  instituteName: string;
  directorName: string;
  directorTitle: string;
  msmeRegNo: string;
  address: string;
  website: string;
  phone: string;
  email: string;
}
