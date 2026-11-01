import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import {
  getPublicImageSrc,
  PUBLIC_IMAGE_WIDTH,
} from "@/features/media/utils/media.utils";
import { findCachedPublicPost } from "@/features/posts/utils/cached-public-post";
import { Skeleton } from "@/components/ui/skeleton";
import { m } from "@/paraglide/messages";
import { PostMeta } from "./post-meta";

export function PostPageSkeleton() {
  const { slug } = useParams({ strict: false });
  const queryClient = useQueryClient();
  const cached =
    typeof slug === "string"
      ? findCachedPublicPost(queryClient, slug)
      : undefined;
  return (
    <div className="post-reading-layout" aria-busy="true">
      <div className="post-reading-flow">
        <div className="post-reading-article">
          <div className="mb-3 flex flex-wrap gap-5 text-sm fuwari-text-50">
            {cached ? (
              <>
                <span>
                  {m.post_word_count({ count: cached.readTimeInMinutes * 300 })}
                </span>
                <span>{m.read_time({ count: cached.readTimeInMinutes })}</span>
              </>
            ) : (
              <Skeleton className="h-4 w-40" />
            )}
          </div>
          {cached ? (
            <h1 className="mb-5 text-3xl font-bold fuwari-text-90 md:text-4xl">
              {cached.title}
            </h1>
          ) : (
            <Skeleton className="mb-5 h-10 w-4/5" />
          )}
          {cached ? (
            <PostMeta post={cached} className="mb-8" />
          ) : (
            <Skeleton className="mb-8 h-4 w-3/5" />
          )}
          {cached?.cover && (
            <div className="mb-8 overflow-hidden rounded-xl">
              <img
                src={getPublicImageSrc(
                  cached.cover.url,
                  PUBLIC_IMAGE_WIDTH.cover,
                )}
                alt={cached.title}
                width={cached.cover.width ?? undefined}
                height={cached.cover.height ?? undefined}
                className="h-auto w-full"
              />
            </div>
          )}
          {cached?.summary && (
            <p className="post-reading-summary">{cached.summary}</p>
          )}
          <div className="space-y-8">
            {[0, 1, 2].map((section) => (
              <div key={section} className="space-y-4">
                <Skeleton className="mb-6 h-6 w-2/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ))}
          </div>
        </div>
        <div className="post-reading-comments">
          <Skeleton className="mb-5 h-5 w-24" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
