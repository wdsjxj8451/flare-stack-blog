import { Link } from "@tanstack/react-router";
import { Hash } from "lucide-react";
import { ListingHeading } from "@/components/layout/listing-heading";
import { EmptyState } from "@/components/ui/empty-state";
import { withTagFilter } from "@/features/posts/utils/post-public-search";
import type { TagWithCount } from "@/features/tags/tags.schema";
import { m } from "@/paraglide/messages";

export function TagsPage({ tags }: { tags: Array<TagWithCount> }) {
  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <ListingHeading
        title={m.tags_title()}
        description={m.tags_description()}
      />
      <section
        className="fuwari-card-base border border-(--fuwari-meta-divider) p-6 sm:p-8"
        aria-label={m.tags_title()}
      >
        {tags.length === 0 ? (
          <EmptyState icon={Hash} description={m.tags_empty()} />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {tags.map((tag) => (
              <li key={tag.id} className="min-w-0">
                <Link
                  to="/posts"
                  search={withTagFilter(tag.name)}
                  className="public-tag-link group flex h-full min-h-16 items-center gap-3 rounded-xl border border-(--fuwari-meta-divider) px-4 py-3 transition-colors hover:bg-(--fuwari-btn-regular-bg) focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <Hash
                    size={18}
                    aria-hidden="true"
                    className="shrink-0 text-(--fuwari-primary)"
                  />
                  <span className="fuwari-text-90 min-w-0 flex-1 text-sm font-medium wrap-anywhere group-hover:text-(--fuwari-primary)">
                    {tag.name}
                  </span>
                  <span className="fuwari-text-50 shrink-0 text-xs tabular-nums">
                    {m.posts_count({ count: tag.postCount })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
