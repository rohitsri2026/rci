/**
 * Client-side image validation and optimization utilities for Student Photos.
 */

export const ALLOWED_PHOTO_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface ImageValidationError {
  valid: boolean;
  error?: string;
}

/**
 * Validates image format and size according to system requirements.
 */
export function validateStudentPhoto(file: File): ImageValidationError {
  if (!file) {
    return { valid: false, error: "No file selected." };
  }

  const normalizedType = file.type.toLowerCase();
  if (!ALLOWED_PHOTO_TYPES.includes(normalizedType)) {
    return {
      valid: false,
      error: "Please upload a JPG, PNG, or WEBP image.",
    };
  }

  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    return {
      valid: false,
      error: "Image size must be less than 5 MB.",
    };
  }

  return { valid: true };
}

/**
 * Center-crops, resizes to a max dimension (default 1000x1000), and compresses
 * the image on a client-side HTML Canvas to optimize file size while maintaining excellent visual quality.
 */
export async function optimizeStudentPhoto(
  file: File,
  targetSquareSize = 600
): Promise<{ blob: Blob; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      // Determine square center-crop bounds
      const minDimension = Math.min(img.width, img.height);
      const cropX = (img.width - minDimension) / 2;
      const cropY = (img.height - minDimension) / 2;

      // Final output dimension (don't scale up if original min dimension is smaller than targetSquareSize)
      const outputSize = Math.min(minDimension, targetSquareSize);

      const canvas = document.createElement("canvas");
      canvas.width = outputSize;
      canvas.height = outputSize;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get 2D canvas context."));
        return;
      }

      // Smooth image rendering setup
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Draw center-cropped portion onto square canvas
      ctx.drawImage(
        img,
        cropX,
        cropY,
        minDimension,
        minDimension,
        0,
        0,
        outputSize,
        outputSize
      );

      // Prefer WebP output format if supported by browser, fallback to JPEG
      const mimeType = "image/webp";
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({ blob, mimeType });
          } else {
            // Fallback to JPEG if WEBP canvas export fails
            canvas.toBlob(
              (jpegBlob) => {
                if (jpegBlob) {
                  resolve({ blob: jpegBlob, mimeType: "image/jpeg" });
                } else {
                  reject(new Error("Image compression failed."));
                }
              },
              "image/jpeg",
              0.85
            );
          }
        },
        mimeType,
        0.85
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image file."));
    };

    img.src = objectUrl;
  });
}
