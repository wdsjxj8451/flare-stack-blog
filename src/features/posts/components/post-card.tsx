import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import {
  getPublicImageSrc,
  getPublicImageSrcSet,
  PUBLIC_IMAGE_WIDTH,
} from "@/features/media/utils/media.utils";
import {
  withCategoryFilter,
  withTagFilter,
} from "@/features/posts/utils/post-public-search";
import type { PostItem } from "@/features/posts/schema/posts.schema";
import { formatPublicPostDate } from "@/features/posts/utils/format-public-post-date";
import { m } from "@/paraglide/messages";

export function PostCard({
  post,
  pinned,
  popular,
}: {
  post: PostItem;
  pinned?: boolean;
  popular?: boolean;
}) {
  return (
    <article className="public-post-card fuwari-card-base">
      {post.cover && (
        <Link
          to="/post/$slug"
          params={{ slug: post.slug }}
          className="post-card-cover"
          aria-label={post.title}
        >
          <img
            src={getPublicImageSrc(post.cover.url, PUBLIC_IMAGE_WIDTH.cover)}
            srcSet={getPublicImageSrcSet(post.cover.url, [
              PUBLIC_IMAGE_WIDTH.cover,
              PUBLIC_IMAGE_WIDTH.cover * 2,
            ])}
            sizes="(min-width: 768px) 520px, 100vw"
            alt=""
            width={post.cover.width ?? undefined}
            height={post.cover.height ?? undefined}
            loading="lazy"
            decoding="async"
          />
        </Link>
      )}
      <div className="post-card-dateline">
        <time dateTime={post.publishedAt?.toISOString()}>
          {formatPublicPostDate(post.publishedAt)}
        </time>
        {(pinned || popular) && (
          <span className="post-card-status">
            {pinned ? m.home_pinned_posts() : m.home_popular_posts()}
          </span>
        )}
        {post.category && (
          <Link to="/posts" search={withCategoryFilter(post.category.name)}>
            {post.category.name}
          </Link>
        )}
      </div>
      <h3>
        <Link to="/post/$slug" params={{ slug: post.slug }}>
          {post.title}
        </Link>
      </h3>
      {post.summary && <p className="post-card-summary">{post.summary}</p>}
      {(post.tags ?? []).length > 0 && (
        <ul className="post-card-tags" aria-label={m.tags_title()}>
          {post.tags?.map((tag) => (
            <li key={tag.name}>
              <Link to="/posts" search={withTagFilter(tag.name)}>
                #{tag.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="post-card-footer">
        <span>
          {m.read_time({ count: post.readTimeInMinutes })}
          {post.viewCount !== undefined && (
            <> · {m.post_views_count({ count: post.viewCount })}</>
          )}
        </span>
        <Link
          to="/post/$slug"
          params={{ slug: post.slug }}
          aria-label={`${m.home_read_post()} · ${post.title}`}
        >
          {m.home_read_post()}
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
