<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import ConnectionGraphDemo from "./components/ConnectionGraphDemo.vue";
import PedigreeEditor from "./components/PedigreeEditor.vue";

type Page = "graph" | "pedigree";
const pageFromHash = (): Page => (location.hash === "#pedigree" ? "pedigree" : "graph");
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
      <h1>Connection Graph</h1>
      <nav role="tablist" aria-label="Demos">
        <button role="tab" :aria-selected="page === 'graph'" :class="{ active: page === 'graph' }" @click="go('graph')">Connection graph</button>
        <button role="tab" :aria-selected="page === 'pedigree'" :class="{ active: page === 'pedigree' }" @click="go('pedigree')">Pedigree</button>
      </nav>
    </header>
    <ConnectionGraphDemo v-if="page === 'graph'" />
    <PedigreeEditor v-else />
  </div>
</template>

<style scoped>
.topbar { display: flex; align-items: center; gap: 24px; padding: 10px 16px; background: #fff; border-bottom: 1px solid #d0d7de; }
h1 { font-size: 1.1rem; margin: 0; }
nav { display: flex; gap: 4px; }
nav button { font: inherit; border: 0; background: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; color: #57606a; }
nav button:hover { background: #f3f4f6; }
nav button.active { background: #eef2ff; color: #1d4ed8; font-weight: 600; }
</style>
