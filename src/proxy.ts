import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // ----------------------------------------------------
  // 1. ADMIN AUTHENTICATION SESSION ISOLATION
  // ----------------------------------------------------
  if (pathname.startsWith("/admin")) {
    const adminSupabase = createServerClient(url, key, {
      cookieOptions: {
        name: "rci-admin-auth",
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user: adminUser },
    } = await adminSupabase.auth.getUser();

    // Protect /admin routes except /admin/login
    if (!pathname.startsWith("/admin/login") && !adminUser) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Redirect away from admin login if already logged in as Admin
    if (pathname === "/admin/login" && adminUser) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return supabaseResponse;
  }

  // ----------------------------------------------------
  // 2. STUDENT AUTHENTICATION SESSION ISOLATION
  // ----------------------------------------------------
  if (pathname.startsWith("/student")) {
    const studentSupabase = createServerClient(url, key, {
      cookieOptions: {
        name: "rci-student-auth",
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user: studentUser },
    } = await studentSupabase.auth.getUser();

    // Protect /student routes except /student/login
    if (!pathname.startsWith("/student/login") && !studentUser) {
      return NextResponse.redirect(new URL("/student/login", request.url));
    }

    // Redirect away from student login if already logged in as Student
    if (pathname === "/student/login" && studentUser) {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }

    return supabaseResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*"],
};
