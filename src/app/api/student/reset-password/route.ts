import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyRole } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  // 1. Authorization check — Admins and Staff only
  const authCheck = await verifyRole(supabase, ["Admin", "Staff"]);
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const { studentId } = await request.json();

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required." }, { status: 400 });
    }

    // 2. Fetch student details
    const { data: student, error: fetchErr } = await supabase
      .from("students")
      .select("id, full_name, email, phone")
      .eq("id", studentId)
      .single();

    if (fetchErr || !student) {
      return NextResponse.json({ error: "Student record not found." }, { status: 404 });
    }

    const cleanPhone = (student.phone || "").replace(/\D/g, "");
    if (!cleanPhone) {
      return NextResponse.json(
        { error: "Student has no registered phone number to reset password." },
        { status: 400 }
      );
    }

    // 3. Find and reset student Auth user password
    const adminClient = createAdminClient();
    const targetEmail = student.email || `${cleanPhone}@student.rciknp.com`;

    // Search for existing auth user by email
    const { data: userList } = await adminClient.auth.admin.listUsers();
    const existingUser = userList?.users.find(
      (u) => u.email === targetEmail || u.user_metadata?.student_id === studentId
    );

    if (existingUser) {
      const { error: updateErr } = await adminClient.auth.admin.updateUserById(existingUser.id, {
        password: cleanPhone,
        user_metadata: {
          ...existingUser.user_metadata,
          password_changed: false,
        },
      });

      if (updateErr) throw updateErr;
    } else {
      // Create user if not created yet
      await adminClient.auth.admin.createUser({
        email: targetEmail,
        password: cleanPhone,
        email_confirm: true,
        user_metadata: {
          role: "Student",
          student_id: studentId,
          phone: cleanPhone,
          password_changed: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Password for ${student.full_name} has been reset to registered phone number (${cleanPhone}).`,
    });
  } catch (err: any) {
    console.error("Admin student password reset error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to reset student password." },
      { status: 500 }
    );
  }
}
