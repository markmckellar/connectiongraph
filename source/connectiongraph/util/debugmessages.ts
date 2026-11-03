/**
 * Tiny pub/sub channel for engine debug text.
 *
 * The engine used to write straight into #messages1..3 DOM elements; now it
 * publishes here and whatever UI is hosting it (the Vue app) can subscribe.
 */
export type DebugListener = (slot: number, text: string) => void;

const listeners = new Set<DebugListener>();

export const DebugMessages = {
  set(slot: number, text: string): void {
    for (const l of listeners) l(slot, text);
  },
  subscribe(listener: DebugListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
