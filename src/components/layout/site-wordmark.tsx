import { cn } from "@/lib/utils";

export function SiteWordmark({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  const isJin = title === "Jin's Blog" || title === "jin的博客";
  return (
    <span
      className={cn(
        "site-wordmark",
        !isJin && "site-wordmark-custom",
        className,
      )}
    >
      {isJin ? <span className="wordmark-latin">Jin's Blog</span> : title}
    </span>
  );
}
