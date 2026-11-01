import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG } from "@/features/config/config.schema";
import {
  resolveSiteConfig,
  resolveSystemConfig,
} from "@/features/config/config.resolve";

describe("resolveSystemConfig webhook", () => {
  it("keeps a single webhook URL and secret", () => {
    const config = resolveSystemConfig({
      ...DEFAULT_CONFIG,
      notification: {
        webhook: {
          url: "https://example.com/hook",
          secret: "s3cret",
        },
      },
    });

    expect(config.notification?.webhook).toEqual({
      url: "https://example.com/hook",
      secret: "s3cret",
    });
    expect(config.notification).not.toHaveProperty("webhooks");
    expect(config.notification?.admin?.channels).toEqual({ email: true });
  });

  it("prefers a configured webhook URL over leftover legacy endpoints", () => {
    const config = resolveSystemConfig({
      notification: {
        webhook: {
          url: "https://example.com/new",
          secret: "new-secret",
        },
        webhooks: [
          {
            url: "https://example.com/old",
            secret: "old-secret",
          },
        ],
      },
    });

    expect(config.notification?.webhook).toEqual({
      url: "https://example.com/new",
      secret: "new-secret",
    });
  });

  it("takes url and secret from the first legacy endpoint", () => {
    const config = resolveSystemConfig({
      notification: {
        admin: {
          channels: {
            email: false,
            webhook: false,
          },
        },
        webhooks: [
          {
            id: "first",
            name: "First",
            url: "https://example.com/first",
            enabled: false,
            secret: "first-secret",
            events: ["friend_link.submitted"],
          },
          {
            id: "second",
            url: "https://example.com/second",
            secret: "second-secret",
          },
        ],
      },
    });

    expect(config.notification?.webhook).toEqual({
      url: "https://example.com/first",
      secret: "first-secret",
    });
    expect(config.notification).not.toHaveProperty("webhooks");
    expect(config.notification?.admin?.channels).toEqual({ email: false });
  });
});

describe("resolveSiteConfig navLinks", () => {
  it("adopts jin's identity and random background for the old demo defaults", () => {
    const config = resolveSiteConfig({
      site: {
        title: "站点名称",
        author: "作者",
        theme: { fuwari: { homeBg: "/images/home-bg.webp" } },
      },
    });
    expect(config.title).toBe("Jin's Blog");
    expect(config.author).toBe("jin");
    expect(config.theme.fuwari.homeBg).toBe("https://www.loliapi.com/acg/pc/");
  });

  it("keeps explicit personal settings editable", () => {
    const config = resolveSiteConfig({
      site: {
        title: "My journal",
        author: "Jin",
        theme: { fuwari: { homeBg: "https://example.com/background.webp" } },
      },
    });
    expect(config.title).toBe("My journal");
    expect(config.theme.fuwari.homeBg).toBe(
      "https://example.com/background.webp",
    );
  });

  it("defaults to an empty list", () => {
    expect(resolveSiteConfig({}).navLinks).toEqual([]);
  });

  it("keeps valid links and drops the rest", () => {
    const config = resolveSiteConfig({
      site: {
        navLinks: [
          { label: "About", href: "/post/about" },
          { label: "GitHub", href: "github.com/du2333" },
          { label: "Bad", href: "javascript:alert(1)" },
          { label: "", href: "/posts" },
          { label: "Extra", href: "/too-many-1" },
          { label: "Extra", href: "/too-many-2" },
          { label: "Extra", href: "/too-many-3" },
          { label: "Extra", href: "/too-many-4" },
        ],
      },
    });

    expect(config.navLinks).toEqual([
      { label: "About", href: "/post/about" },
      { label: "GitHub", href: "https://github.com/du2333" },
      { label: "Extra", href: "/too-many-1" },
      { label: "Extra", href: "/too-many-2" },
      { label: "Extra", href: "/too-many-3" },
    ]);
  });
});
