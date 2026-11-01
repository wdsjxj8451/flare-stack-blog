import { Link } from "@tanstack/react-router";
import { formatPublicPostDate } from "@/features/posts/utils/format-public-post-date";
import {
  withCategoryFilter,
  withTagFilter,
  withUncategorizedFilter,
} from "@/features/posts/utils/post-public-search";
import type { PostItem } from "@/features/posts/schema/posts.schema";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";

export function PostMeta({
  post,
  className,
}: {
  post: PostItem;
  className?: string;
}) {
  const published = post.publishedAt;
  const updated = post.updatedAt;
  const isUpdated = Boolean(
    published && updated && published.getTime() !== updated.getTime(),
  );
  return (
    <div
      className={cn(
        "post-meta-text flex flex-wrap items-center gap-x-4 gap-y-2 text-sm fuwari-text-50",
        className,
      )}
    >
      <span>
        {m.post_published_label()}{" "}
        <time dateTime={published?.toISOString()}>
          {formatPublicPostDate(published)}
        </time>
      </span>
      {isUpdated && (
        <span>
          {m.post_updated_label()}{" "}
          <time dateTime={updated?.toISOString()}>
            {formatPublicPostDate(updated)}
          </time>
        </span>
      )}
      <Link
        to="/posts"
        search={
          post.category
            ? withCategoryFilter(post.category.name)
            : withUncategorizedFilter()
        }
      >
        {post.category?.name ?? m.post_uncategorized()}
      </Link>
      {post.tags?.length ? (
        post.tags.map((tag) => (
          <Link key={tag.name} to="/posts" search={withTagFilter(tag.name)}>
            #{tag.name}
          </Link>
        ))
      ) : (
        <span>{m.post_no_tags()}</span>
      )}
    </div>
  );
}
