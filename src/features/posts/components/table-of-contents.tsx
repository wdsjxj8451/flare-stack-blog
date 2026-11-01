import { useEffect, useRef, useState } from "react";
import { useJumpToHeading } from "./content/use-jump-to-heading";
import type { TableOfContentsItem } from "@/features/posts/utils/toc";
import { m } from "@/paraglide/messages";

export default function TableOfContents({
  headers,
}: {
  headers: Array<TableOfContentsItem>;
}) {
  const [active, setActive] = useState(headers[0]?.id ?? "");
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const jump = useJumpToHeading();
  const minLevel = Math.min(...headers.map((heading) => heading.level), 4);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = headers[0]?.id ?? "";
      for (const header of headers) {
        const element = document.getElementById(header.id);
        if (element && element.getBoundingClientRect().top <= 120)
          current = header.id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const content = document.querySelector("[data-reading-content]");
    const observer = new ResizeObserver(schedule);
    if (content) observer.observe(content);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, [headers]);

  useEffect(() => {
    const nav = navRef.current;
    const link = nav?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!nav || !link) return;
    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    if (linkRect.top < navRect.top || linkRect.bottom > navRect.bottom) {
      nav.scrollTo({
        top: nav.scrollTop + linkRect.top - navRect.top - navRect.height / 2,
        behavior: "instant",
      });
    }
  }, [active]);

  if (headers.length === 0) return null;
  const links = headers.map((heading) => (
    <a
      key={heading.id}
      href={`#${heading.id}`}
      aria-current={active === heading.id ? "location" : undefined}
      style={{
        paddingInlineStart: `${12 + (heading.level - minLevel) * 14}px`,
      }}
      onClick={(event) => {
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        event.preventDefault();
        if (detailsRef.current) detailsRef.current.open = false;
        void jump(heading.id);
      }}
    >
      {heading.text}
    </a>
  ));

  return (
    <aside className="post-toc">
      <div className="post-toc-desktop">
        <h2>{m.post_toc()}</h2>
        <nav ref={navRef} aria-label={m.post_toc()}>
          {links}
        </nav>
      </div>
      <details ref={detailsRef} className="post-toc-mobile">
        <summary>{m.post_toc()}</summary>
        <nav aria-label={m.post_toc()}>{links}</nav>
      </details>
    </aside>
  );
}
