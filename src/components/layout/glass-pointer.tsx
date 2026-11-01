import { useEffect, useRef } from "react";

const SURFACE = ".fuwari-card-base, .public-navigation-panel";
const INTERACTIVE = 'a, button, [role="button"], summary';
const TEXT =
  'p, h1, h2, h3, h4, h5, h6, blockquote, pre, code, label, dt, dd, input, textarea, [contenteditable="true"], [data-cursor="text"]';
const NATIVE =
  'select, input[type="range"], input[type="color"], [disabled], [aria-disabled="true"], [data-cursor="native"]';

/** Progressive enhancement: native pointers remain until a mouse actually moves. */
export function GlassPointer() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const root = cursor?.closest<HTMLElement>(".public-site");
    if (!cursor || !root) return;

    const media = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)",
    );
    let surface: HTMLElement | null = null;
    let frame = 0;
    let x = 0;
    let y = 0;
    let hasPosition = false;

    const clearSurface = () => {
      if (!surface) return;
      delete surface.dataset.glassActive;
      surface.style.removeProperty("--glass-x");
      surface.style.removeProperty("--glass-y");
      surface = null;
    };
    const hide = () => {
      hasPosition = false;
      window.cancelAnimationFrame(frame);
      frame = 0;
      delete root.dataset.cursorActive;
      delete cursor.dataset.visible;
      delete cursor.dataset.pressed;
      clearSurface();
    };
    const paint = () => {
      frame = 0;
      if (!hasPosition || !media.matches) return;
      // Re-read on scroll too: the surface underneath a stationary mouse changes.
      const target = document.elementFromPoint(x, y);
      if (!target || !root.contains(target)) {
        hide();
        return;
      }
      const nextSurface = target.closest<HTMLElement>(SURFACE);
      if (surface !== nextSurface) {
        clearSurface();
        surface = nextSurface;
      }
      if (surface) {
        const bounds = surface.getBoundingClientRect();
        surface.style.setProperty("--glass-x", `${x - bounds.left}px`);
        surface.style.setProperty("--glass-y", `${y - bounds.top}px`);
        surface.dataset.glassActive = "true";
      }
      if (target.closest(NATIVE)) {
        delete root.dataset.cursorActive;
        delete cursor.dataset.visible;
        return;
      }
      const interactive = target.closest(INTERACTIVE);
      const text = !interactive && target.closest(TEXT);
      cursor.dataset.mode = text ? "text" : interactive ? "link" : "dot";
      cursor.style.setProperty("--pointer-x", `${x}px`);
      cursor.style.setProperty("--pointer-y", `${y}px`);
      cursor.dataset.visible = "true";
      root.dataset.cursorActive = "true";
    };
    const schedule = () => {
      if (hasPosition && !frame) frame = window.requestAnimationFrame(paint);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !media.matches) {
        hide();
        return;
      }
      x = event.clientX;
      y = event.clientY;
      hasPosition = true;
      schedule();
    };
    const leave = (event: PointerEvent) => {
      if (!event.relatedTarget) hide();
    };
    const press = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && cursor.dataset.visible) {
        x = event.clientX;
        y = event.clientY;
        window.cancelAnimationFrame(frame);
        paint();
        cursor.dataset.pressed = "true";
      } else {
        hide();
      }
    };
    const release = () => delete cursor.dataset.pressed;
    const key = (event: KeyboardEvent) => {
      if (event.key === "Tab") hide();
    };
    const visibility = () => {
      if (document.hidden) hide();
    };

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave, { passive: true });
    document.addEventListener("pointerdown", press, { passive: true });
    document.addEventListener("pointerup", release, { passive: true });
    document.addEventListener("pointercancel", hide, { passive: true });
    document.addEventListener("scroll", schedule, {
      passive: true,
      capture: true,
    });
    document.addEventListener("keydown", key);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", hide);
    window.addEventListener("resize", hide);
    media.addEventListener("change", hide);
    return () => {
      hide();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("pointerdown", press);
      document.removeEventListener("pointerup", release);
      document.removeEventListener("pointercancel", hide);
      document.removeEventListener("scroll", schedule, true);
      document.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", hide);
      window.removeEventListener("resize", hide);
      media.removeEventListener("change", hide);
    };
  }, []);

  return (
    <div ref={cursorRef} className="public-pointer" aria-hidden="true">
      <span className="public-pointer-shape" />
    </div>
  );
}
