import { Link } from "@tanstack/react-router";
import type { PostItem } from "@/features/posts/schema/posts.schema";
import { formatPublicPostDate } from "@/features/posts/utils/format-public-post-date";

export function ArchivePost({ post }: { post: PostItem }) {
  const date = post.publishedAt ? new Date(post.publishedAt) : null;
  return (
    <Link
      to="/post/$slug"
      params={{ slug: post.slug }}
      className="group grid min-h-14 grid-cols-[3.5rem_minmax(0,1fr)] items-start gap-x-4 rounded-lg px-2 py-3 transition-colors hover:bg-(--fuwari-btn-plain-bg-hover) focus-visible:outline-2 focus-visible:outline-offset-2 sm:grid-cols-[4rem_minmax(0,1fr)]"
    >
      <time
        dateTime={date?.toISOString()}
        className="fuwari-text-50 pt-0.5 text-xs leading-6 tabular-nums"
      >
        {formatPublicPostDate(date, { monthDay: true })}
      </time>
      <div className="min-w-0">
        <h3 className="fuwari-text-90 text-base font-medium leading-7 wrap-anywhere group-hover:text-(--fuwari-primary)">
          {post.title}
        </h3>
        {(post.tags ?? []).length > 0 && (
          <p className="fuwari-text-50 mt-1 text-xs leading-5 wrap-anywhere">
            {post.tags?.map((tag) => `#${tag.name}`).join("  ")}
          </p>
        )}
      </div>
    </Link>
  );
}
