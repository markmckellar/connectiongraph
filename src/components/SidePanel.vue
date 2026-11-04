<script setup lang="ts">
import { ref, watch } from "vue";

/** A collapsible sidebar section that remembers whether it was left open. */
const props = withDefaults(
  defineProps<{ id: string; title: string; count?: number | null; defaultOpen?: boolean }>(),
  { count: null, defaultOpen: true },
);

const storageKey = "connectiongraph.panel." + props.id;
function initial(): boolean {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved === null ? props.defaultOpen : saved === "1";
  } catch {
    return props.defaultOpen;
  }
}
const open = ref(initial());
watch(open, (v) => {
  try {
    localStorage.setItem(storageKey, v ? "1" : "0");
  } catch {
    /* storage unavailable: just don't remember */
  }
});

/** "opened" fires when the user opens the panel by its header (not when it's opened from code). */
const emit = defineEmits<{ opened: [] }>();
function toggle() {
  open.value = !open.value;
  if (open.value) emit("opened");
}

defineExpose({ expand: () => (open.value = true), collapse: () => (open.value = false) });
</script>

<template>
  <section class="panel" :class="{ open }">
    <header class="panel-head">
      <button class="panel-toggle" :aria-expanded="open" :aria-controls="'panel-' + id" @click="toggle">
        <svg class="chev" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="panel-title">{{ title }}</span>
        <span v-if="count !== null" class="panel-count">{{ count }}</span>
      </button>
      <div v-if="$slots.actions" class="panel-actions"><slot name="actions" /></div>
    </header>
    <div v-show="open" :id="'panel-' + id" class="panel-body"><slot /></div>
  </section>
</template>

<style scoped>
.panel { border-bottom: 1px solid var(--border); }
.panel-head { display: flex; align-items: center; gap: 8px; padding: 0 12px 0 4px; min-height: 42px; }
.panel-toggle {
  flex: 1; display: flex; align-items: center; gap: 6px; min-width: 0;
  border: 0; background: none; padding: 10px 6px; font: inherit; color: var(--text); cursor: pointer; text-align: left;
  border-radius: 6px;
}
.panel-toggle:hover { background: var(--hover); }
.panel-toggle:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
.chev { color: var(--muted); transition: transform 0.15s ease; flex: none; }
.open .chev { transform: rotate(90deg); }
.panel-title { font-weight: 600; font-size: 0.9rem; }
.panel-count { color: var(--muted); font-size: 0.8rem; }
.panel-actions { display: flex; align-items: center; gap: 6px; }
.panel-body { padding: 2px 16px 16px; display: flex; flex-direction: column; gap: 10px; }
@media (prefers-reduced-motion: reduce) { .chev { transition: none; } }
</style>
