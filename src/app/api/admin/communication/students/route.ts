import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyRole } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const authCheck = await verifyRole(supabase, ["Admin", "Staff", "Viewer"]);
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim() || "";
    const studentIdParam = searchParams.get("student_id")?.trim() || "";

    const adminClient = createAdminClient();

    // Fetch students list
    let studentQuery = adminClient
      .from("students")
      .select("id, full_name, email, phone, address, course_id, created_at, courses(id, course_name, duration)")
      .order("created_at", { ascending: false })
      .limit(100);

    if (studentIdParam) {
      studentQuery = studentQuery.eq("id", studentIdParam);
    }

    const { data: students, error: studentErr } = await studentQuery;
    if (studentErr) {
      return NextResponse.json({ error: studentErr.message }, { status: 500 });
    }

    if (!students || students.length === 0) {
      return NextResponse.json({ success: true, students: [] });
    }

    // Filter students by query if provided
    let filteredStudents = students;
    if (query) {
      const q = query.toLowerCase();
      filteredStudents = students.filter((s: any) => {
        const nameMatch = s.full_name?.toLowerCase().includes(q);
        const emailMatch = s.email?.toLowerCase().includes(q);
        const phoneMatch = s.phone?.includes(q);
        const idMatch = s.id?.toLowerCase().includes(q);
        return nameMatch || emailMatch || phoneMatch || idMatch;
      });
    }

    // Fetch admissions, certificates, and fee ledgers to enrich context
    const studentIds = filteredStudents.map((s: any) => s.id);
    const studentPhones = filteredStudents.map((s: any) => s.phone).filter(Boolean);

    // Fetch certificates for these students
    const { data: certificates } = await adminClient
      .from("certificates")
      .select("id, student_id, certificate_number, issue_date, status, grade")
      .in("student_id", studentIds);

    // Fetch fee ledgers for these students
    const { data: feeLedgers } = await adminClient
      .from("fee_ledgers")
      .select("id, student_id, total_paid, status")
      .in("student_id", studentIds);

    // Fetch admissions matching phone numbers or names
    let admissions: any[] = [];
    if (studentPhones.length > 0) {
      const { data: admData } = await adminClient
        .from("admissions")
        .select("id, student_name, phone, selected_course, status, created_at")
        .order("created_at", { ascending: false });
      admissions = admData || [];
    }

    // Combine into rich student context array
    const enriched = filteredStudents.map((student: any) => {
      const sPhoneDigits = student.phone?.replace(/[^0-9]/g, "").slice(-10);

      // Find matching application
      const matchedAdmission = admissions.find((a: any) => {
        const aPhoneDigits = a.phone?.replace(/[^0-9]/g, "").slice(-10);
        return (
          (sPhoneDigits && aPhoneDigits && sPhoneDigits === aPhoneDigits) ||
          a.student_name?.toLowerCase() === student.full_name?.toLowerCase()
        );
      });

      // Find matching certificate (prefer valid)
      const matchedCertificates = (certificates || []).filter((c: any) => c.student_id === student.id);
      const matchedCert = matchedCertificates.find((c: any) => c.status === "Valid") || matchedCertificates[0];

      // Find matching fee ledger
      const matchedLedger = (feeLedgers || []).find((f: any) => f.student_id === student.id);

      return {
        id: student.id,
        full_name: student.full_name,
        email: student.email,
        phone: student.phone,
        address: student.address,
        course_id: student.course_id,
        course_name: student.courses?.course_name || "Unspecified Course",
        course_duration: student.courses?.duration || "Standard Program",
        application: matchedAdmission
          ? {
              id: matchedAdmission.id,
              application_id: matchedAdmission.id.slice(0, 8).toUpperCase(),
              status: matchedAdmission.status,
              selected_course: matchedAdmission.selected_course,
            }
          : null,
        certificate: matchedCert
          ? {
              id: matchedCert.id,
              certificate_number: matchedCert.certificate_number,
              issue_date: matchedCert.issue_date,
              status: matchedCert.status,
              url: `https://rciknp.vercel.app/verify/${matchedCert.certificate_number}`,
            }
          : null,
        fee_ledger: matchedLedger
          ? {
              id: matchedLedger.id,
              total_paid: matchedLedger.total_paid || 0,
              status: matchedLedger.status || "Pending",
            }
          : null,
      };
    });

    return NextResponse.json({ success: true, students: enriched });
  } catch (err: any) {
    console.error("Communication student query error:", err);
    return NextResponse.json({ error: err.message || "Failed to query student data." }, { status: 500 });
  }
}
