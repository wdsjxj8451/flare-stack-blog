import { useRouteContext } from "@tanstack/react-router";
import {
  resolveSocialHref,
  SOCIAL_PLATFORMS,
} from "@/features/config/utils/social-platforms";

export function SiteSocialLinks() {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  return (
    <div className="site-social-links">
      {siteConfig.social
        .filter(
          (link) =>
            link.url &&
            ![
              "https://github.com/example",
              "mailto:example@email.com",
              "example@email.com",
            ].includes(link.url),
        )
        .map((link, index) => {
          const preset =
            link.platform !== "custom" ? SOCIAL_PLATFORMS[link.platform] : null;
          const Icon = preset?.icon;
          const label = preset?.label ?? link.label ?? link.platform;
          return (
            <a
              key={`${link.platform}-${index}`}
              href={resolveSocialHref(link.platform, link.url)}
              aria-label={label}
              title={label}
              target={link.platform === "email" ? undefined : "_blank"}
              rel="me noreferrer"
            >
              {Icon ? (
                <Icon size={17} strokeWidth={1.5} />
              ) : link.icon ? (
                <img src={link.icon} alt="" width="17" height="17" />
              ) : (
                <span>{label}</span>
              )}
            </a>
          );
        })}
    </div>
  );
}
