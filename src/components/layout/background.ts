import {
  getPublicImageSrc,
  PUBLIC_IMAGE_WIDTH,
} from "@/features/media/utils/media.utils";

export const BACKGROUND_FALLBACK = "/images/home-bg.webp";
export const BACKGROUND_MAX_ATTEMPTS = 3;
const LOLI_PC_ENDPOINT = "https://www.loliapi.com/acg/pc/";

export function isRandomBackground(source: string): boolean {
  return source.replace(/\/$/, "") === LOLI_PC_ENDPOINT.replace(/\/$/, "");
}

/** Let the API choose from its current image pool, never guess an image ID. */
export function getRandomBackgroundRequest(): string {
  const url = new URL(LOLI_PC_ENDPOINT);
  url.searchParams.set("type", "url");
  url.searchParams.set("_", crypto.randomUUID());
  return url.href;
}

/** SSR and hydration use a stable local image while the random one loads. */
export function getHomeBackgroundImage(source: string): string {
  if (!source || isRandomBackground(source)) return BACKGROUND_FALLBACK;
  return getPublicImageSrc(source, PUBLIC_IMAGE_WIDTH.banner);
}
