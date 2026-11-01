/** Start when the post reaches the header; finish when its end enters view. */
export function readingProgress(
  top: number,
  height: number,
  viewport: number,
  offset = 80,
) {
  if (height <= 0 || viewport <= 0) return 0;
  const distance = height - viewport + offset;
  if (distance <= 0) return top <= offset ? 100 : 0;
  return Math.round(Math.min(1, Math.max(0, (offset - top) / distance)) * 100);
}
