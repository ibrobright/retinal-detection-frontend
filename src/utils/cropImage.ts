/**
 * Utility to produce a cropped image File from crop coordinates.
 * Works with `react-easy-crop`'s `onCropComplete` output.
 */

export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Creates an HTMLImageElement from a source URL.
 */
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
}

/**
 * Uses a canvas to crop the image at the given pixel coordinates,
 * then returns a new File object with the cropped result.
 *
 * @param imageSrc  - The source URL (object URL or data URL) of the image
 * @param pixelCrop - The crop area in pixels { x, y, width, height }
 * @param fileName  - The desired file name for the output
 * @param mimeType  - The MIME type for the output blob (default: image/jpeg)
 * @returns A cropped File ready for upload
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: PixelCrop,
  fileName: string,
  mimeType: string = 'image/jpeg',
): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas 2D context');
  }

  // Set canvas size to the crop area
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped portion of the image onto the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  // Convert canvas to blob, then to File
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas toBlob returned null'));
          return;
        }
        const file = new File([blob], fileName, { type: mimeType });
        resolve(file);
      },
      mimeType,
      0.95, // quality
    );
  });
}
