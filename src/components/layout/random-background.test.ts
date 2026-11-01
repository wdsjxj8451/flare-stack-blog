// @vitest-environment jsdom
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { createElement, StrictMode } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { BACKGROUND_FALLBACK } from "./background";
import { BackgroundImage, RandomBackgroundProvider } from "./random-background";

const API = "https://www.loliapi.com/acg/pc/";
const IMAGE = "https://images.example.com/anime.webp";
const fetchMock = vi.fn<typeof fetch>();
let pendingImages: HTMLImageElement[];

beforeEach(() => {
  pendingImages = [];
  fetchMock.mockReset();
  fetchMock.mockImplementation(async () => new Response(IMAGE));
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal(
    "Image",
    vi.fn(function () {
      const image = document.createElement("img");
      pendingImages.push(image);
      return image;
    }),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

function background(source = API) {
  return createElement(RandomBackgroundProvider, {
    source,
    children: [
      createElement(BackgroundImage, { key: "ambient", priority: true }),
      createElement(BackgroundImage, { key: "cover", priority: true }),
    ],
  });
}

async function flush() {
  await act(async () => {});
}

it("shares one validated random image between both surfaces and across rerenders", async () => {
  const { container, rerender } = render(
    createElement(StrictMode, null, background()),
  );
  expect(container.querySelector("img")?.getAttribute("src")).toBe(
    BACKGROUND_FALLBACK,
  );
  await flush();
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(pendingImages).toHaveLength(1);
  await act(async () => {
    fireEvent.load(pendingImages[0]);
  });
  expect(
    [...container.querySelectorAll("img")].map((image) =>
      image.getAttribute("src"),
    ),
  ).toEqual([IMAGE, IMAGE]);
  rerender(createElement(StrictMode, null, background()));
  await flush();
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock.mock.calls[0][1]?.cache).toBe("no-store");
});

it("tries three fresh random requests for broken CDN images, then uses the local image", async () => {
  const { container } = render(background());
  for (let attempt = 0; attempt < 3; attempt++) {
    await flush();
    await act(async () => {
      fireEvent.error(pendingImages[attempt]);
    });
  }
  await flush();
  expect(fetchMock).toHaveBeenCalledTimes(3);
  expect(new Set(fetchMock.mock.calls.map(([url]) => url)).size).toBe(3);
  expect(container.querySelector("img")?.getAttribute("src")).toBe(
    BACKGROUND_FALLBACK,
  );
});

it("gets a new selection on a new page mount", async () => {
  const first = render(background());
  await flush();
  const previousRequest = fetchMock.mock.calls[0][0];
  first.unmount();
  render(background());
  await flush();
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock.mock.calls[1][0]).not.toBe(previousRequest);
});

it("bounds each attempt to eight seconds, including an API that stalls", async () => {
  vi.useFakeTimers();
  fetchMock.mockImplementation(
    (_, options) =>
      new Promise((_, reject) => {
        options?.signal?.addEventListener("abort", () =>
          reject(new Error("aborted")),
        );
      }),
  );
  const { container } = render(background());
  for (let attempt = 0; attempt < 3; attempt++) {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(8_000);
    });
  }
  expect(fetchMock).toHaveBeenCalledTimes(3);
  expect(vi.getTimerCount()).toBe(0);
  expect(container.querySelector("img")?.getAttribute("src")).toBe(
    BACKGROUND_FALLBACK,
  );
});

it("also retries if the resolved image stalls after a successful API response", async () => {
  vi.useFakeTimers();
  render(background());
  await flush();
  await act(async () => {
    await vi.advanceTimersByTimeAsync(8_000);
  });
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(pendingImages).toHaveLength(2);
});

it("rejects error responses and malformed image addresses before rendering them", async () => {
  fetchMock
    .mockResolvedValueOnce(new Response("unavailable", { status: 503 }))
    .mockResolvedValueOnce(new Response("not an image URL"))
    .mockResolvedValueOnce(new Response("javascript:alert(1)"));
  const { container } = render(background());
  await flush();
  expect(fetchMock).toHaveBeenCalledTimes(3);
  expect(pendingImages).toHaveLength(0);
  expect(container.querySelector("img")?.getAttribute("src")).toBe(
    BACKGROUND_FALLBACK,
  );
});

it("preserves a custom image and shares its fallback when loading fails", async () => {
  const { container } = render(background(IMAGE));
  await flush();
  expect(fetchMock).not.toHaveBeenCalled();
  expect(container.querySelector("img")?.getAttribute("src")).toBe(IMAGE);
  await act(async () => {
    fireEvent.error(pendingImages[0]);
  });
  await flush();
  expect(
    [...container.querySelectorAll("img")].map((image) =>
      image.getAttribute("src"),
    ),
  ).toEqual([BACKGROUND_FALLBACK, BACKGROUND_FALLBACK]);
});

it("falls back for both surfaces if a displayed image later fails", async () => {
  const { container } = render(background());
  await flush();
  await act(async () => {
    fireEvent.load(pendingImages[0]);
  });
  fireEvent.error(container.querySelector("img")!);
  expect(
    [...container.querySelectorAll("img")].map((image) =>
      image.getAttribute("src"),
    ),
  ).toEqual([BACKGROUND_FALLBACK, BACKGROUND_FALLBACK]);
});

it("cancels an old selection on source change or unmount and prevents stale updates", async () => {
  vi.useFakeTimers();
  const { container, rerender, unmount } = render(background());
  await flush();
  const previousImage = pendingImages[0];
  const previousSignal = fetchMock.mock.calls[0][1]?.signal;
  rerender(background(IMAGE));
  await flush();
  expect(previousSignal?.aborted).toBe(true);
  expect(previousImage.onload).toBeNull();
  await act(async () => {
    fireEvent.load(previousImage);
  });
  expect(container.querySelector("img")?.getAttribute("src")).toBe(IMAGE);
  unmount();
  await flush();
  expect(vi.getTimerCount()).toBe(0);
  expect(fetchMock).toHaveBeenCalledTimes(1);
});
