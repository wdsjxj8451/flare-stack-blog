import type { PostItem } from "@/features/posts/schema/posts.schema";
import { ArchivePost } from "./archive-post";
import { ArchiveYear } from "./archive-year";

interface ArchivePanelProps {
  posts: Array<PostItem>;
}

export function ArchivePanel({ posts }: ArchivePanelProps) {
  const groupedPosts = posts.reduce(
    (acc, post) => {
      if (!post.publishedAt) {
        return acc;
      }

      const year = new Date(post.publishedAt).getUTCFullYear();
      acc[year] ??= [];
      acc[year].push(post);
      return acc;
    },
    {} as Record<number, Array<PostItem>>,
  );

  const years = Object.keys(groupedPosts)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="fuwari-card-base border border-(--fuwari-meta-divider) px-6 py-2 sm:px-8">
      {years.map((year) => (
        <section
          key={year}
          aria-labelledby={`archive-${year}`}
          className="py-5 not-last:border-b not-last:border-(--fuwari-meta-divider)"
        >
          <ArchiveYear year={year} count={groupedPosts[year].length} />
          <ul className="mt-3">
            {groupedPosts[year].map((post) => (
              <li key={post.id}>
                <ArchivePost post={post} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
