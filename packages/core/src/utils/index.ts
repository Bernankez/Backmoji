export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    console.error(`[backmoji] ${message}`);
    throw new Error(message);
  }
}
