import { expect, it } from "vitest";
import { readingProgress } from "./reading-progress";

it("measures only the post, finishing when its end enters the viewport", () => {
  expect(readingProgress(200, 2000, 800)).toBe(0);
  expect(readingProgress(80, 2000, 800)).toBe(0);
  expect(readingProgress(-560, 2000, 800)).toBe(50);
  expect(readingProgress(-1200, 2000, 800)).toBe(100);
  expect(readingProgress(-1800, 2000, 800)).toBe(100);
});

it("handles short posts and content not yet measured", () => {
  expect(readingProgress(100, 200, 800)).toBe(0);
  expect(readingProgress(80, 200, 800)).toBe(100);
  expect(readingProgress(0, 0, 800)).toBe(0);
});
