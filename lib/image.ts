// Client-side image handling. Photos are read entirely in the browser, downscaled,
// and re-encoded as JPEG data URLs so they embed cleanly (and small) in the PDF.
// Nothing is ever uploaded.

const MAX_DIMENSION = 1400; // longest edge, in px — plenty for a claim photo
const JPEG_QUALITY = 0.72;

/**
 * Read a File, downscale it so its longest edge is <= MAX_DIMENSION, and return
 * a compressed JPEG data URL. Rejects non-image files.
 */
export async function fileToCompressedDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error(`"${file.name}" is not an image.`);
  }

  const bitmap = await loadBitmap(file);
  const { width, height } = fitWithin(bitmap.width, bitmap.height, MAX_DIMENSION);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get a canvas context for image resizing.");

  // White backfill so any transparent PNGs don't turn black in the JPEG.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);

  if ("close" in bitmap && typeof bitmap.close === "function") {
    bitmap.close();
  }

  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

async function loadBitmap(
  file: File
): Promise<ImageBitmap | HTMLImageElement> {
  // Prefer createImageBitmap (fast, off-main-thread decode) when available.
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      // fall through to the <img> path
    }
  }

  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not read image "${file.name}".`));
    };
    img.src = url;
  });
}

function fitWithin(
  w: number,
  h: number,
  max: number
): { width: number; height: number } {
  if (w <= max && h <= max) return { width: w, height: h };
  const scale = max / Math.max(w, h);
  return {
    width: Math.round(w * scale),
    height: Math.round(h * scale),
  };
}
