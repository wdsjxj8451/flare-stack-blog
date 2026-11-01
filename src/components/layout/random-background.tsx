import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  BACKGROUND_FALLBACK,
  BACKGROUND_MAX_ATTEMPTS,
  getHomeBackgroundImage,
  getRandomBackgroundRequest,
  isRandomBackground,
} from "./background";

const BackgroundContext = createContext({
  url: BACKGROUND_FALLBACK,
  onError: () => {},
});

/** Check the actual image too: a valid API response may point to a broken CDN. */
function preloadImage(url: string, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Image loading aborted", "AbortError"));
      return;
    }
    const image = new Image();
    const cleanup = () => {
      image.onload = null;
      image.onerror = null;
      signal.removeEventListener("abort", abort);
    };
    const abort = () => {
      cleanup();
      image.removeAttribute("src");
      reject(new DOMException("Image loading aborted", "AbortError"));
    };
    signal.addEventListener("abort", abort, { once: true });
    image.onload = () => {
      cleanup();
      resolve();
    };
    image.onerror = () => {
      cleanup();
      reject(new Error("Background image could not be loaded"));
    };
    image.referrerPolicy = "no-referrer";
    image.src = url;
  });
}

/** One request sequence per public layout, shared by the cover and acrylic. */
export function RandomBackgroundProvider({
  source,
  children,
}: {
  source: string;
  children: ReactNode;
}) {
  const [loaded, setLoaded] = useState<{ source: string; url: string }>();
  const url =
    loaded?.source === source ? loaded.url : getHomeBackgroundImage(source);
  const onError = useCallback(() => {
    setLoaded({ source, url: BACKGROUND_FALLBACK });
  }, [source]);

  useEffect(() => {
    const lifecycle = new AbortController();
    const random = isRandomBackground(source);
    const attempts = random ? BACKGROUND_MAX_ATTEMPTS : 1;

    void (async () => {
      // Strict Mode may immediately clean up its first effect in development.
      await Promise.resolve();
      if (lifecycle.signal.aborted) return;
      for (let attempt = 0; attempt < attempts; attempt++) {
        const controller = new AbortController();
        const abort = () => controller.abort();
        lifecycle.signal.addEventListener("abort", abort, { once: true });
        // Bound the entire attempt, including the API and the actual image.
        const timeout = window.setTimeout(abort, 8_000);
        try {
          let candidate = getHomeBackgroundImage(source);
          if (random) {
            const response = await fetch(getRandomBackgroundRequest(), {
              cache: "no-store",
              signal: controller.signal,
            });
            if (!response.ok) throw new Error("Background API request failed");
            const address = new URL((await response.text()).trim());
            if (address.protocol !== "https:")
              throw new Error("Background API returned an invalid image URL");
            candidate = address.href;
          }
          await preloadImage(candidate, controller.signal);
          if (!lifecycle.signal.aborted) setLoaded({ source, url: candidate });
          return;
        } catch {
          if (lifecycle.signal.aborted) return;
        } finally {
          window.clearTimeout(timeout);
          lifecycle.signal.removeEventListener("abort", abort);
        }
      }
      if (!lifecycle.signal.aborted)
        setLoaded({ source, url: BACKGROUND_FALLBACK });
    })();

    return () => lifecycle.abort();
  }, [source]);

  return (
    <BackgroundContext.Provider value={{ url, onError }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function BackgroundImage({ priority }: { priority: boolean }) {
  const { url, onError } = useContext(BackgroundContext);
  return (
    <img
      key={url}
      src={url}
      alt=""
      aria-hidden="true"
      referrerPolicy="no-referrer"
      fetchPriority={priority ? "high" : "auto"}
      onError={onError}
      className="fuwari-banner-image h-full w-full object-cover object-center"
    />
  );
}
