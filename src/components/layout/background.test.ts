import { describe, expect, it } from "vitest";
import { blogConfig } from "@/blog.config";
import {
  BACKGROUND_FALLBACK,
  getHomeBackgroundImage,
  getRandomBackgroundRequest,
} from "./background";
import { getHomeBackgroundPreloadImages } from "./preload-images";

describe("random anime background", () => {
  it("asks the provider to pick an image without specifying an ID", () => {
    const url = new URL(getRandomBackgroundRequest());
    expect(url.origin + url.pathname).toBe("https://www.loliapi.com/acg/pc/");
    expect(url.searchParams.get("type")).toBe("url");
    expect(url.searchParams.has("id")).toBe(false);
  });

  it("uses a fresh request on reload or retry instead of a cached selection", () => {
    expect(getRandomBackgroundRequest()).not.toBe(getRandomBackgroundRequest());
  });

  it("preloads the local placeholder without making a second random API call", () => {
    expect(getHomeBackgroundImage(blogConfig.theme.fuwari.homeBg)).toBe(
      BACKGROUND_FALLBACK,
    );
    expect(getHomeBackgroundPreloadImages(blogConfig)).toEqual([
      BACKGROUND_FALLBACK,
    ]);
  });

  it("preserves custom background URLs", () => {
    const source = "https://example.com/my-background.webp";
    expect(getHomeBackgroundImage(source)).toBe(source);
    expect(getHomeBackgroundImage("")).toBe(BACKGROUND_FALLBACK);
  });
});
