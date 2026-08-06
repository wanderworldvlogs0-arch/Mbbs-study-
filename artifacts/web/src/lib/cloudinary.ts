// ============================================================
// Fill these in after creating a free Cloudinary account.
// See README.md > "Setting up file uploads (Cloudinary)" for
// the exact steps.
// ============================================================
export const CLOUDINARY_CLOUD_NAME = "pxzrsreo";
export const CLOUDINARY_UPLOAD_PRESET = "medmaster_upload";

/**
 * Uploads a file straight from the browser to Cloudinary (no backend
 * involved) using an unsigned upload preset, and returns the public URL.
 * Works for videos, PDFs, and images.
 */
export function uploadToCloudinary(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (
      CLOUDINARY_CLOUD_NAME.startsWith("PASTE_") ||
      CLOUDINARY_UPLOAD_PRESET.startsWith("PASTE_")
    ) {
      reject(
        new Error(
          "Cloudinary is not configured yet. Open src/lib/cloudinary.ts and fill in your cloud name and upload preset (see README).",
        ),
      );
      return;
    }

    // "auto" lets Cloudinary detect video vs. raw (PDF) vs. image.
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
          resolve(data.secure_url as string);
        } else {
          reject(new Error(data.error?.message || "Upload failed"));
        }
      } catch {
        reject(new Error("Upload failed: could not read response"));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed: network error"));
    xhr.send(formData);
  });
}
