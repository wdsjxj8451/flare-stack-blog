import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { useReadingProgress } from "@/features/posts/components/use-reading-progress";
import {
  FLOATING_ACTION_BUTTON_CLASS,
  useFloatingActionsSlotRef,
} from "./floating-actions";

export function BackToTop({ readingKey }: { readingKey?: string }) {
  const progress = useReadingProgress(readingKey);
  const setSlot = useFloatingActionsSlotRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Same logic as original Fuwari: show after banner height
      // The current Fuwari banner logic sets banner to ~35vh or 65vh, let's use 35vh as base threshold
      const bannerHeight = window.innerHeight * 0.35;
      setIsVisible(window.scrollY > bannerHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={cn(
        "fuwari-floating-actions z-40 transition-all duration-300",
        isVisible || readingKey
          ? "opacity-100 scale-100"
          : "opacity-0 scale-90 pointer-events-none",
      )}
    >
      {/* Page actions, such as the post TOC, stack above. */}
      <div ref={setSlot} className="contents" />
      <button
        onClick={scrollToTop}
        aria-label={m.post_back_to_top()}
        title={
          readingKey
            ? m.post_reading_progress({ percent: progress })
            : m.post_back_to_top()
        }
        className={cn(
          FLOATING_ACTION_BUTTON_CLASS,
          readingKey && "reading-back-to-top",
        )}
      >
        {readingKey && (
          <svg
            className="reading-progress-ring"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <circle cx="24" cy="24" r="21" className="reading-progress-track" />
            <circle
              cx="24"
              cy="24"
              r="21"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={100 - progress}
            />
          </svg>
        )}
        <ArrowUp
          className={
            readingKey ? "reading-progress-arrow" : "w-6 h-6 lg:w-7 lg:h-7"
          }
          strokeWidth={2}
        />
        {readingKey && (
          <span
            className="reading-progress-value"
            role="progressbar"
            aria-label={m.post_reading_progress_label()}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            {progress}%
          </span>
        )}
      </button>
    </div>
  );
}
