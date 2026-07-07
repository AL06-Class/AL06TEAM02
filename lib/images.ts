import { existsSync } from "node:fs";
import path from "node:path";

export const PLACEHOLDER_IMAGES = {
  default: "/images/presets/placeholders/shootmon-placeholder-camera-01.svg",
  profile: "/images/presets/placeholders/shootmon-placeholder-profile-01.svg",
  logo: "/images/presets/placeholders/shootmon-placeholder-logo-01.svg",
  store: "/images/presets/placeholders/shootmon-placeholder-store-01.svg",
  banner: "/images/presets/placeholders/shootmon-placeholder-banner-01.svg",
  review: "/images/presets/placeholders/shootmon-placeholder-review-01.svg",
  private: "/images/presets/placeholders/shootmon-placeholder-private-01.svg",
} as const;

export type PlaceholderImageKind = keyof typeof PLACEHOLDER_IMAGES;

export function toPresetImagePath(value?: string) {
  if (!value) return PLACEHOLDER_IMAGES.default;
  if (value.startsWith("/")) return value;
  return `/images/presets/${value}.webp`;
}

export function publicImageExists(imagePath: string) {
  const normalized = imagePath.replace(/^\//, "").split("/").join(path.sep);
  return existsSync(path.join(process.cwd(), "public", normalized.replace(/^public[\\/]/, "")));
}

export function resolveImagePath(imagePath?: string, fallback: PlaceholderImageKind = "default") {
  const normalized = toPresetImagePath(imagePath);
  return publicImageExists(normalized) ? normalized : PLACEHOLDER_IMAGES[fallback];
}
