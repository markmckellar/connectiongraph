<script setup lang="ts">
import { ref } from "vue";
import PedigreeEditor from "./components/PedigreeEditor.vue";
import EngineTests from "./components/EngineTests.vue";

const tab = ref<"pedigree" | "tests">("pedigree");
</script>

<template>
  <div class="app">
    <header class="topbar">
      <h1>Connection Graph</h1>
      <nav role="tablist">
        <button role="tab" :aria-selected="tab === 'pedigree'" :class="{ active: tab === 'pedigree' }" @click="tab = 'pedigree'">Pedigree editor</button>
        <button role="tab" :aria-selected="tab === 'tests'" :class="{ active: tab === 'tests' }" @click="tab = 'tests'">Engine tests</button>
      </nav>
    </header>
    <PedigreeEditor v-if="tab === 'pedigree'" />
    <EngineTests v-else />
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
