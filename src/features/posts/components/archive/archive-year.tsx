import { m } from "@/paraglide/messages";

export function ArchiveYear({ year, count }: { year: number; count: number }) {
  return (
    <div className="flex items-baseline gap-3">
      <h2
        id={`archive-${year}`}
        className="fuwari-text-90 text-xl font-semibold tracking-tight"
      >
        {year}
      </h2>
      <span className="fuwari-text-50 text-xs tabular-nums">
        {m.posts_count({ count })}
      </span>
    </div>
  );
}
