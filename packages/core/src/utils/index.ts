import { log } from "@bernankez/utils";

export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    log.error(`[backmoji] ${message}`);
    throw new Error(message);
  }
}
