import { useRouteContext } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function SiteAvatar({
  src,
  className,
}: {
  src?: string | null;
  className?: string;
}) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const configured = siteConfig.theme.fuwari.avatar;
  const source =
    src ||
    siteConfig.ownerAvatar ||
    (configured !== "/images/avatar.png" ? configured : null);
  const [failed, setFailed] = useState<string | null>(null);
  return (
    <span className={cn("site-avatar", className)} aria-hidden="true">
      <span>j</span>
      {source && failed !== source && (
        <img
          src={source}
          alt=""
          width="48"
          height="48"
          referrerPolicy="no-referrer"
          onError={() => setFailed(source)}
        />
      )}
    </span>
  );
}
