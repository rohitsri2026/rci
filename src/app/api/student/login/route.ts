import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizePhone } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { loginId, password } = body;

    if (!loginId || !password) {
      return NextResponse.json(
        { error: "Please provide both your registered Phone Number/Login ID and password." },
        { status: 400 }
      );
    }

    const rawInput = String(loginId).trim();
    const normalizedInputPhone = normalizePhone(rawInput);
    const normalizedInputPassword = normalizePhone(password);
    const isEmailInput = rawInput.includes("@");

    const adminClient = createAdminClient();
    const supabase = await createClient();

    // 1. Service-role lookup to bypass unauthenticated RLS restrictions
    const { data: allStudents, error: studentQueryErr } = await adminClient
      .from("students")
      .select("id, full_name, email, phone, status");

    if (studentQueryErr) {
      console.error("Database student query error:", studentQueryErr);
      return NextResponse.json(
        { error: "An unexpected database lookup error occurred." },
        { status: 500 }
      );
    }

    let student: any = null;

    if (isEmailInput) {
      student = allStudents?.find(
        (s) => s.email && s.email.trim().toLowerCase() === rawInput.toLowerCase()
      );
    }

    if (!student && normalizedInputPhone) {
      student = allStudents?.find(
        (s) => s.phone && normalizePhone(s.phone) === normalizedInputPhone
      );
    }

    // Truly no student record exists
    if (!student) {
      return NextResponse.json(
        { error: "No registered student record found with this phone number or login ID. Please contact RCI administration." },
        { status: 401 }
      );
    }

    const studentPhoneNormalized = normalizePhone(student.phone) || normalizedInputPhone;

    // Deterministic Auth candidate emails
    const primaryAuthEmail = student.email
      ? student.email.trim().toLowerCase()
      : `${studentPhoneNormalized}@student.rciknp.com`;

    const candidateAuthEmails: string[] = [
      primaryAuthEmail,
      `${studentPhoneNormalized}@student.rciknp.com`,
      `student.${student.id.slice(0, 8)}@student.rciknp.com`,
    ];

    let authenticatedUser: any = null;
    let authErrorMsg = "";

    // 2. Attempt login with candidate Auth emails
    for (const emailOption of Array.from(new Set(candidateAuthEmails))) {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: emailOption,
        password,
      });

      if (!signInError && authData.user) {
        authenticatedUser = authData.user;
        break;
      } else if (signInError) {
        authErrorMsg = signInError.message;
      }
    }

    // 3. If login failed, check if Auth user already exists or needs first-time provisioning
    if (!authenticatedUser) {
      const { data: userList } = await adminClient.auth.admin.listUsers();
      const existingUser = userList?.users.find(
        (u) =>
          u.email?.toLowerCase() === primaryAuthEmail.toLowerCase() ||
          u.user_metadata?.student_id === student.id ||
          (u.user_metadata?.phone && normalizePhone(u.user_metadata.phone) === studentPhoneNormalized)
      );

      // Is the password entered matching the student's initial phone number?
      const isInitialPhonePassword =
        password.trim() === studentPhoneNormalized ||
        normalizedInputPassword === studentPhoneNormalized;

      if (!existingUser && isInitialPhonePassword) {
        // Auto-provision Auth account for first-time login
        try {
          const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
            email: primaryAuthEmail,
            password: password,
            email_confirm: true,
            user_metadata: {
              role: "Student",
              student_id: student.id,
              phone: studentPhoneNormalized,
              password_changed: false,
            },
          });

          if (!createError && newUser.user) {
            // Attempt sign-in with newly provisioned user
            const { data: retryAuth, error: retryError } = await supabase.auth.signInWithPassword({
              email: primaryAuthEmail,
              password,
            });

            if (!retryError && retryAuth.user) {
              authenticatedUser = retryAuth.user;
            }
          } else if (createError) {
            console.error("Provisioning user creation error:", createError.message);
          }
        } catch (provisionErr) {
          console.error("Auto-provisioning student auth error:", provisionErr);
        }
      } else if (existingUser) {
        // Auth user exists, but password was incorrect
        return NextResponse.json(
          { error: "Incorrect password. Please enter your valid password or use your 10-digit registered phone number if logging in for the first time." },
          { status: 401 }
        );
      }
    }

    if (!authenticatedUser) {
      return NextResponse.json(
        { error: authErrorMsg || "Invalid password. Your initial password is your 10-digit registered phone number." },
        { status: 401 }
      );
    }

    // Check if initial phone password is in use or password_changed flag is false
    const isPhonePassword =
      password.trim() === studentPhoneNormalized ||
      normalizedInputPassword === studentPhoneNormalized;
    const passwordChanged = authenticatedUser.user_metadata?.password_changed === true;
    const mustChangePassword = isPhonePassword || !passwordChanged;

    return NextResponse.json({
      success: true,
      mustChangePassword,
      redirect: mustChangePassword ? "/student/change-password?firstLogin=true" : "/student/dashboard",
    });
  } catch (err: any) {
    console.error("Student login endpoint error:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected login error occurred." },
      { status: 500 }
    );
  }
}
