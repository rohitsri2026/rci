import { createClient } from "@/lib/supabase/server";
import { createAdminClient, hasAdminKey } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { verifyRole } from "@/lib/auth";
import { ALLOWED_PHOTO_TYPES, MAX_PHOTO_SIZE_BYTES } from "@/lib/image-utils";

/**
 * Helper to select the appropriate Supabase client for database & storage operations.
 * Uses service-role client if service key exists, or the authenticated server client
 * carrying the logged-in Admin's session cookies.
 */
function getClient(serverSupabase: any) {
  if (hasAdminKey()) {
    return createAdminClient();
  }
  return serverSupabase;
}

/**
 * Extracts storage relative path from a Supabase storage public URL.
 * Example: .../storage/v1/object/public/student-photos/STU123/1690000000-abc.webp
 * Returns: STU123/1690000000-abc.webp
 */
function extractStoragePath(publicUrl: string): string | null {
  try {
    const bucketMarker = "/student-photos/";
    const index = publicUrl.indexOf(bucketMarker);
    if (index !== -1) {
      return publicUrl.substring(index + bucketMarker.length);
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const authCheck = await verifyRole(supabase, ["Admin", "Staff"]);

  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const { id } = await params;
    if (!id || id.trim() === "") {
      return NextResponse.json({ error: "Student ID is required." }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    // Validate type and size server-side
    const fileType = file.type.toLowerCase();
    if (!ALLOWED_PHOTO_TYPES.includes(fileType)) {
      return NextResponse.json(
        { error: "Please upload a JPG, PNG, or WEBP image." },
        { status: 400 }
      );
    }

    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Image size must be less than 5 MB." },
        { status: 400 }
      );
    }

    const client = getClient(supabase);

    // 1. Perform student lookup with maybeSingle()
    let existingStudent: { id: string; full_name?: string; photo_url?: string | null } | null = null;

    const { data: fetchResult, error: studentFetchErr } = await client
      .from("students")
      .select("id, full_name, photo_url")
      .eq("id", id)
      .maybeSingle();

    existingStudent = fetchResult;

    // Handle missing column schema error (Postgres error 42703)
    if (studentFetchErr && (studentFetchErr.code === "42703" || studentFetchErr.message?.includes("photo_url"))) {
      console.error("[student-photo] 'photo_url' column missing in database schema", {
        studentId: id,
        code: studentFetchErr.code,
        message: studentFetchErr.message,
      });

      // Fallback check to verify student existence
      const { data: fallbackStudent } = await client
        .from("students")
        .select("id, full_name")
        .eq("id", id)
        .maybeSingle();

      if (fallbackStudent) {
        return NextResponse.json(
          {
            error:
              "Database migration required: 'photo_url' column is missing in the students table. Please execute migration_student_photos.sql in Supabase SQL Editor.",
          },
          { status: 500 }
        );
      }
    }

    if (studentFetchErr) {
      console.error("[student-photo] Student lookup failed", {
        studentId: id,
        code: studentFetchErr.code,
        message: studentFetchErr.message,
        details: studentFetchErr.details,
        hint: studentFetchErr.hint,
      });
      return NextResponse.json(
        { error: `Unable to access student record: ${studentFetchErr.message}` },
        { status: 500 }
      );
    }

    if (!existingStudent) {
      console.warn("[student-photo] Student record not found (404)", { studentId: id });
      return NextResponse.json(
        { error: "Student record not found." },
        { status: 404 }
      );
    }

    // Construct unique cache-busting storage path
    const fileExt = fileType.split("/")[1] || "webp";
    const uniqueFileName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${fileExt}`;
    const storagePath = `${id}/${uniqueFileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Upload new image to Supabase Storage bucket 'student-photos'
    const { error: uploadError } = await client.storage
      .from("student-photos")
      .upload(storagePath, buffer, {
        contentType: fileType,
        upsert: true,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("[student-photo] Storage upload failed", {
        studentId: id,
        storagePath,
        error: uploadError.message,
      });
      return NextResponse.json(
        { error: `Unable to upload student photo: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // 3. Get public URL for the newly stored object
    const { data: publicUrlData } = client.storage
      .from("student-photos")
      .getPublicUrl(storagePath);

    const newPhotoUrl = publicUrlData.publicUrl;

    // 4. Update students table record with new photo_url
    const { error: updateError } = await client
      .from("students")
      .update({ photo_url: newPhotoUrl })
      .eq("id", id);

    if (updateError) {
      console.error("[student-photo] Database update failed after storage upload", {
        studentId: id,
        error: updateError.message,
      });
      // Rollback newly uploaded storage object to prevent orphan file
      await client.storage.from("student-photos").remove([storagePath]).catch((err: any) => {
        console.error("[student-photo] Storage rollback failed", err);
      });
      return NextResponse.json(
        { error: `Unable to save student photo: ${updateError.message}` },
        { status: 500 }
      );
    }

    // 5. ONLY AFTER successful DB update, remove the previous photo object if present
    if (existingStudent.photo_url) {
      const oldStoragePath = extractStoragePath(existingStudent.photo_url);
      if (oldStoragePath && oldStoragePath !== storagePath) {
        client.storage.from("student-photos").remove([oldStoragePath]).catch((err: any) => {
          console.error("[student-photo] Previous photo storage removal warning", err);
        });
      }
    }

    return NextResponse.json({
      success: true,
      photo_url: newPhotoUrl,
      message: "Student photo updated successfully.",
    });
  } catch (err: any) {
    console.error("[student-photo] Unexpected error during photo upload", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred during photo upload." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const authCheck = await verifyRole(supabase, ["Admin", "Staff"]);

  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const { id } = await params;
    if (!id || id.trim() === "") {
      return NextResponse.json({ error: "Student ID is required." }, { status: 400 });
    }

    const client = getClient(supabase);

    // Perform student lookup using maybeSingle()
    const { data: existingStudent, error: studentFetchErr } = await client
      .from("students")
      .select("id, full_name, photo_url")
      .eq("id", id)
      .maybeSingle();

    if (studentFetchErr && (studentFetchErr.code === "42703" || studentFetchErr.message?.includes("photo_url"))) {
      return NextResponse.json(
        {
          error:
            "Database migration required: 'photo_url' column is missing in the students table. Please execute migration_student_photos.sql in Supabase SQL Editor.",
        },
        { status: 500 }
      );
    }

    if (studentFetchErr) {
      console.error("[student-photo] Database error during student lookup (DELETE)", {
        studentId: id,
        code: studentFetchErr.code,
        message: studentFetchErr.message,
        details: studentFetchErr.details,
        hint: studentFetchErr.hint,
      });
      return NextResponse.json(
        { error: `Unable to access student record: ${studentFetchErr.message}` },
        { status: 500 }
      );
    }

    if (!existingStudent) {
      console.warn("[student-photo] Student record not found (DELETE)", { studentId: id });
      return NextResponse.json(
        { error: "Student record not found." },
        { status: 404 }
      );
    }

    const oldPhotoUrl = existingStudent.photo_url;

    // Reset photo_url in students table
    const { error: updateError } = await client
      .from("students")
      .update({ photo_url: null })
      .eq("id", id);

    if (updateError) {
      console.error("[student-photo] Database update failed (DELETE)", {
        studentId: id,
        error: updateError.message,
      });
      return NextResponse.json(
        { error: `Unable to save student record: ${updateError.message}` },
        { status: 500 }
      );
    }

    // Delete photo file from storage bucket if present
    if (oldPhotoUrl) {
      const oldStoragePath = extractStoragePath(oldPhotoUrl);
      if (oldStoragePath) {
        client.storage.from("student-photos").remove([oldStoragePath]).catch((err: any) => {
          console.error("[student-photo] Storage removal warning during photo delete", err);
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Student photo removed successfully.",
    });
  } catch (err: any) {
    console.error("[student-photo] Unexpected error during photo delete", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred while deleting student photo." },
      { status: 500 }
    );
  }
}
