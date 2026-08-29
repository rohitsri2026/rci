import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { verifyRole } from "@/lib/auth";
import { ALLOWED_PHOTO_TYPES, MAX_PHOTO_SIZE_BYTES } from "@/lib/image-utils";

/**
 * Extracts storage relative path from a Supabase storage public URL.
 * Example URL: .../storage/v1/object/public/student-photos/STU123/1690000000-abc.webp
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
    if (!id) {
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

    const adminClient = createAdminClient();

    // Check existing student record
    const { data: existingStudent, error: studentFetchErr } = await adminClient
      .from("students")
      .select("id, photo_url")
      .eq("id", id)
      .single();

    if (studentFetchErr || !existingStudent) {
      return NextResponse.json({ error: "Student record not found." }, { status: 404 });
    }

    // Construct unique cache-busting storage path
    const fileExt = fileType.split("/")[1] || "webp";
    const uniqueFileName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${fileExt}`;
    const storagePath = `${id}/${uniqueFileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage bucket 'student-photos'
    const { error: uploadError } = await adminClient.storage
      .from("student-photos")
      .upload(storagePath, buffer, {
        contentType: fileType,
        upsert: true,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: `Storage upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get public URL for the newly stored object
    const { data: publicUrlData } = adminClient.storage
      .from("student-photos")
      .getPublicUrl(storagePath);

    const newPhotoUrl = publicUrlData.publicUrl;

    // Update students table record
    const { error: updateError } = await adminClient
      .from("students")
      .update({ photo_url: newPhotoUrl })
      .eq("id", id);

    if (updateError) {
      // Rollback newly uploaded storage object
      await adminClient.storage.from("student-photos").remove([storagePath]);
      console.error("Database update error:", updateError);
      return NextResponse.json(
        { error: `Database update failed: ${updateError.message}` },
        { status: 500 }
      );
    }

    // Safely cleanup old photo file if one existed previously
    if (existingStudent.photo_url) {
      const oldStoragePath = extractStoragePath(existingStudent.photo_url);
      if (oldStoragePath && oldStoragePath !== storagePath) {
        adminClient.storage.from("student-photos").remove([oldStoragePath]).catch(() => {
          // Non-blocking cleanup log
        });
      }
    }

    return NextResponse.json({
      success: true,
      photo_url: newPhotoUrl,
      message: "Student photo updated successfully.",
    });
  } catch (err: any) {
    console.error("Upload photo API error:", err);
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
    if (!id) {
      return NextResponse.json({ error: "Student ID is required." }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Fetch existing student record
    const { data: existingStudent, error: studentFetchErr } = await adminClient
      .from("students")
      .select("id, photo_url")
      .eq("id", id)
      .single();

    if (studentFetchErr || !existingStudent) {
      return NextResponse.json({ error: "Student record not found." }, { status: 404 });
    }

    const oldPhotoUrl = existingStudent.photo_url;

    // Reset photo_url in students table
    const { error: updateError } = await adminClient
      .from("students")
      .update({ photo_url: null })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json(
        { error: `Database update failed: ${updateError.message}` },
        { status: 500 }
      );
    }

    // Delete photo file from storage bucket if present
    if (oldPhotoUrl) {
      const oldStoragePath = extractStoragePath(oldPhotoUrl);
      if (oldStoragePath) {
        await adminClient.storage.from("student-photos").remove([oldStoragePath]);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Student photo removed successfully.",
    });
  } catch (err: any) {
    console.error("Delete photo API error:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred while deleting student photo." },
      { status: 500 }
    );
  }
}
