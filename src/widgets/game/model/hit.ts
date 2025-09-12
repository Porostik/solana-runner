const overlap = (a: DOMRect, b: DOMRect) =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

const insetRect = (r: DOMRect, inset: number) =>
  new DOMRect(
    r.left + inset,
    r.top + inset,
    r.width - inset * 2,
    r.height - inset * 2
  );

export function hitObject(
  playerEl: HTMLElement,
  obstacleEl: HTMLElement,
  opts?: { inset?: number }
): boolean {
  const inset = opts?.inset ?? 22;

  if (parseFloat(getComputedStyle(obstacleEl).opacity) === 0) return false;

  const p = insetRect(playerEl.getBoundingClientRect(), inset);
  const o = obstacleEl.getBoundingClientRect();

  return overlap(p as unknown as DOMRect, o);
}
