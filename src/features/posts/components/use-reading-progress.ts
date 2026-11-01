import { useEffect, useState } from "react";
import { readingProgress } from "../utils/reading-progress";

export function useReadingProgress(readingKey?: string) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress(0);
    if (!readingKey) return;
    let frame = 0;
    let content: Element | null = null;
    const update = () => {
      frame = 0;
      const next = document.querySelector("[data-reading-content]");
      if (next !== content) {
        resize.disconnect();
        content = next;
        if (content) resize.observe(content);
      }
      if (!content) return;
      const rect = content.getBoundingClientRect();
      setProgress(readingProgress(rect.top, rect.height, window.innerHeight));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(schedule);
    const mutations = new MutationObserver(schedule);
    const main = document.querySelector("main");
    if (main) mutations.observe(main, { childList: true, subtree: true });
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      resize.disconnect();
      mutations.disconnect();
    };
  }, [readingKey]);
  return progress;
}
