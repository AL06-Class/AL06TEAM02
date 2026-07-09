import { existsSync } from "node:fs";
import path from "node:path";
import { PLACEHOLDER_IMAGES, type PlaceholderImageKind } from "./image-placeholders";

export { PLACEHOLDER_IMAGES, type PlaceholderImageKind };

export function toPresetImagePath(value?: string) {
  if (!value) return PLACEHOLDER_IMAGES.default;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/")) return value;
  return `/images/presets/${value}.webp`;
}

export function publicImageExists(imagePath: string) {
  const normalized = imagePath.replace(/^\//, "").split("/").join(path.sep);
  return existsSync(path.join(process.cwd(), "public", normalized.replace(/^public[\\/]/, "")));
}

export function resolveImagePath(imagePath?: string, fallback: PlaceholderImageKind = "default") {
  if (imagePath && (imagePath.startsWith("http://") || imagePath.startsWith("https://"))) return imagePath;
  const normalized = toPresetImagePath(imagePath);
  return publicImageExists(normalized) ? normalized : PLACEHOLDER_IMAGES[fallback];
}
