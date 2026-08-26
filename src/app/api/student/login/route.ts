import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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

    const rawInput = loginId.trim();
    const cleanPhone = rawInput.replace(/\D/g, "");
    const isEmailInput = rawInput.includes("@");

    const supabase = await createClient();

    // 1. Search for student record in official institute database
    let student: any = null;

    if (isEmailInput) {
      const { data } = await supabase
        .from("students")
        .select("id, full_name, email, phone")
        .ilike("email", rawInput)
        .maybeSingle();
      student = data;
    }

    if (!student && cleanPhone) {
      // Match by phone number
      const { data } = await supabase
        .from("students")
        .select("id, full_name, email, phone")
        .or(`phone.eq.${cleanPhone},phone.ilike.%${cleanPhone}%`)
        .maybeSingle();
      student = data;
    }

    if (!student) {
      return NextResponse.json(
        { error: "No registered student record found with this phone number or login ID. Please contact RCI administration." },
        { status: 401 }
      );
    }

    // Determine candidate emails for Supabase Auth account
    const studentPhoneClean = (student.phone || cleanPhone || "").replace(/\D/g, "");
    const authEmails: string[] = [];
    if (student.email) authEmails.push(student.email.trim());
    if (studentPhoneClean) authEmails.push(`${studentPhoneClean}@student.rciknp.com`);
    authEmails.push(`student.${student.id.slice(0, 8)}@student.rciknp.com`);

    let authenticatedUser: any = null;
    let authErrorMsg = "";

    // 2. Try logging in with candidate emails
    for (const emailOption of authEmails) {
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

    // 3. Auto-provision Auth User if initial login & auth account does not exist yet
    if (!authenticatedUser && (password === studentPhoneClean || password === cleanPhone)) {
      const primaryAuthEmail = student.email || `${studentPhoneClean}@student.rciknp.com`;
      const adminClient = createAdminClient();

      try {
        const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
          email: primaryAuthEmail,
          password: password,
          email_confirm: true,
          user_metadata: {
            role: "Student",
            student_id: student.id,
            phone: studentPhoneClean,
            password_changed: false,
          },
        });

        if (!createError && newUser.user) {
          // Attempt sign in with newly created credentials
          const { data: retryAuth, error: retryError } = await supabase.auth.signInWithPassword({
            email: primaryAuthEmail,
            password,
          });

          if (!retryError && retryAuth.user) {
            authenticatedUser = retryAuth.user;
          }
        }
      } catch (provisionErr) {
        console.error("Auto-provisioning student auth failed:", provisionErr);
      }
    }

    if (!authenticatedUser) {
      return NextResponse.json(
        { error: authErrorMsg || "Invalid credentials. Please verify your phone number and password." },
        { status: 401 }
      );
    }

    // Check if initial phone-number password is in use
    const isPhonePassword = password === studentPhoneClean || password === cleanPhone;
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
