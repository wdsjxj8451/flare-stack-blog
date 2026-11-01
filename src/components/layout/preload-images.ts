import type { SiteConfig } from "@/features/config/site-config.schema";
import { getHomeBackgroundImage } from "./background";

export function getHomeBackgroundPreloadImages(
  siteConfig: SiteConfig,
): Array<string> {
  return siteConfig.theme.fuwari.homeBg
    ? [getHomeBackgroundImage(siteConfig.theme.fuwari.homeBg)]
    : [];
}
