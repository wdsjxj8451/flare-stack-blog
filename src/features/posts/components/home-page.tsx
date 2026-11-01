import { Link, useRouteContext } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { BackgroundImage } from "@/components/layout/random-background";
import { SiteAvatar } from "@/components/layout/site-avatar";
import { SiteSocialLinks } from "@/components/layout/site-social-links";
import { SiteWordmark } from "@/components/layout/site-wordmark";
import { EmptyState } from "@/components/ui/empty-state";
import type { PostItem } from "@/features/posts/schema/posts.schema";
import { m } from "@/paraglide/messages";
import { HomePagination } from "./home-pagination";
import { PostCard } from "./post-card";

export const POPULAR_POSTS_LIMIT = 3;
interface HomePageProps {
  title: string;
  description: string;
  posts: Array<PostItem>;
  popularPosts?: Array<PostItem>;
  page: number;
  totalPages: number;
}

export function HomePage({
  title,
  description,
  posts,
  popularPosts,
  page,
  totalPages,
}: HomePageProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const popularSlugs = new Set((popularPosts ?? []).map((post) => post.slug));
  return (
    <div className="journal-home">
      <section className="home-cover" aria-label={m.home_cover_label()}>
        <BackgroundImage priority />
        <div className="home-cover-shade" />
        <div className="home-cover-caption">
          <span className="home-cover-index" aria-hidden="true">
            J / 01
          </span>
          <span>{m.home_cover_caption()}</span>
          <a
            href="#home-writing-title"
            className="home-cover-scroll"
            aria-label={m.home_latest_posts()}
          >
            <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>
      </section>
      <section className="home-introduction">
        <div className="home-introduction-main">
          <span className="journal-eyebrow">{m.home_journal_eyebrow()}</span>
          <h1>
            <SiteWordmark title={title} />
          </h1>
          <p className="home-description">{description}</p>
          <div className="home-introduction-actions">
            <Link to="/posts" className="journal-primary-link">
              {m.posts_title()}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <Link to="/tags" className="journal-text-link">
              {m.tags_title()}
            </Link>
            <SiteSocialLinks />
          </div>
        </div>
        <aside className="home-author-note fuwari-card-base">
          <span className="journal-eyebrow">{m.home_about_label()}</span>
          <p>{m.home_about_note()}</p>
          <div className="home-author-signature">
            <SiteAvatar />
            <div>
              <span>{siteConfig.author}</span>
              <small>{m.home_author_label()}</small>
            </div>
            <span className="home-signature-flourish" aria-hidden="true">
              j.
            </span>
          </div>
        </aside>
      </section>
      <div className="journal-divider" aria-hidden="true">
        <span />
        <i />
        <i />
        <i />
        <span />
      </div>
      <section
        className="home-writing-section"
        aria-labelledby="home-writing-title"
      >
        <header className="home-section-heading">
          <div>
            <span className="journal-eyebrow">{m.home_writing_eyebrow()}</span>
            <h2 id="home-writing-title">{m.home_latest_posts()}</h2>
          </div>
          <Link to="/posts" className="journal-text-link">
            {m.home_view_all()}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </header>
        {posts.length ? (
          <div className="home-post-grid">
            {posts.map((post) => (
              <PostCard
                key={post.slug}
                post={post}
                pinned={Boolean(post.pinnedAt)}
                popular={!post.pinnedAt && popularSlugs.has(post.slug)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            className="fuwari-card-base home-empty-state"
            description={m.posts_no_posts()}
          />
        )}
        {totalPages > 1 && (
          <HomePagination page={page} totalPages={totalPages} />
        )}
      </section>
    </div>
  );
}
