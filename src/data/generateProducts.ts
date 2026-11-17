import type { Product } from "../cart/cartContext";

// Change this (or pass ?count=N in the URL) to scale the dataset.
export const DEFAULT_RECORD_COUNT = 1_000_000;

const ADJECTIVES = ["Classic", "Iced", "Spicy", "Sweet", "Organic", "Smoked"];

export function generateProducts(base: Product[], count: number): Product[] {
  const result: Product[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const seed = base[i % base.length];
    const cycle = Math.floor(i / base.length);
    result[i] = {
      productId: i + 1,
      productName: `${ADJECTIVES[cycle % ADJECTIVES.length]} ${seed.productName} #${i + 1}`,
      price: Math.round((seed.price + (cycle % 50) * 0.1) * 100) / 100,
    };
  }
  return result;
}

export function getRecordCount(): number {
  const raw = new URLSearchParams(window.location.search).get("count");
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : DEFAULT_RECORD_COUNT;
}
