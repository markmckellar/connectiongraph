<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import GraphTests from "./components/GraphTests.vue";
import PedigreeEditor from "./components/PedigreeEditor.vue";

type Page = "pedigree" | "tests";
// "#graph" was the old name for the tests tab; keep those links working
const pageFromHash = (): Page => (location.hash === "#tests" || location.hash === "#graph" ? "tests" : "pedigree");
const page = ref<Page>(pageFromHash());

function go(p: Page) {
  page.value = p;
  history.replaceState(null, "", "#" + p);
}
const onHashChange = () => (page.value = pageFromHash());
window.addEventListener("hashchange", onHashChange);
onBeforeUnmount(() => window.removeEventListener("hashchange", onHashChange));
</script>

<template>
  <div class="app">
    <header class="topbar">
      <nav role="tablist" aria-label="Demos">
        <button role="tab" :aria-selected="page === 'pedigree'" :class="{ active: page === 'pedigree' }" @click="go('pedigree')">Pedigree</button>
        <button role="tab" :aria-selected="page === 'tests'" :class="{ active: page === 'tests' }" @click="go('tests')">Graph tests</button>
      </nav>
    </header>
    <main class="page">
      <GraphTests v-if="page === 'tests'" />
      <PedigreeEditor v-else />
    </main>
  </div>
</template>

<style scoped>
.app { height: 100%; display: flex; flex-direction: column; }
.topbar { flex: none; display: flex; align-items: center; padding: 6px 12px; background: var(--surface); border-bottom: 1px solid var(--border); }
nav { display: flex; gap: 4px; }
nav button { font: inherit; font-size: 14px; border: 0; background: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; color: #57606a; }
nav button:hover { background: var(--hover); }
nav button.active { background: var(--accent-soft); color: #1d4ed8; font-weight: 600; }
nav button:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
.page { flex: 1; min-height: 0; }
</style>
