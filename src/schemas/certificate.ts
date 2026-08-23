import { z } from "zod";

export const certificateGenerateSchema = z.object({
  student_id: z.string().uuid("Please select a valid student"),
  course_id: z.string().uuid("Please select a valid course"),
  grade: z.string().min(1, "Grade is required").max(10, "Grade is too long"),
  completion_date: z.string().min(1, "Completion date is required"),
  issue_date: z.string().min(1, "Issue date is required"),
});

export const bulkCertificateGenerateSchema = z.object({
  student_ids: z.array(z.string().uuid("Please select valid students")).min(1, "Select at least one student"),
  course_id: z.string().uuid("Please select a valid course"),
  grade: z.string().min(1, "Grade is required").max(10, "Grade is too long"),
  completion_date: z.string().min(1, "Completion date is required"),
  issue_date: z.string().min(1, "Issue date is required"),
});

export const certificateReissueSchema = z.object({
  reason: z.string().min(5, "Reissue reason must be at least 5 characters"),
  grade: z.string().min(1, "Grade is required").max(10, "Grade is too long"),
  completion_date: z.string().min(1, "Completion date is required"),
});

export const certificateSettingsSchema = z.object({
  instituteName: z.string().min(3, "Institute name must be at least 3 characters"),
  directorName: z.string().min(3, "Director name must be at least 3 characters"),
  directorTitle: z.string().min(2, "Director title must be at least 2 characters"),
  msmeRegNo: z.string().min(3, "MSME registration number is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  website: z.string().url("Please enter a valid website URL"),
  phone: z.string().min(5, "Phone number is required"),
  email: z.string().email("Please enter a valid email address"),
});

export type CertificateGenerateInput = z.infer<typeof certificateGenerateSchema>;
export type BulkCertificateGenerateInput = z.infer<typeof bulkCertificateGenerateSchema>;
export type CertificateReissueInput = z.infer<typeof certificateReissueSchema>;
export type CertificateSettingsInput = z.infer<typeof certificateSettingsSchema>;
