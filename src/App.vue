<script setup lang="ts">
import { defineAsyncComponent, onBeforeUnmount, ref } from "vue";
import PedigreeEditor from "./components/PedigreeEditor.vue";

// The engine test scenes are kept but not shown in the UI.
// Open the app with #engine-tests in the URL to get to them.
const EngineTests = defineAsyncComponent(() => import("./components/EngineTests.vue"));
const showTests = ref(location.hash === "#engine-tests");
const onHashChange = () => (showTests.value = location.hash === "#engine-tests");
window.addEventListener("hashchange", onHashChange);
onBeforeUnmount(() => window.removeEventListener("hashchange", onHashChange));
</script>

<template>
  <div class="app">
    <header class="topbar">
      <h1>{{ showTests ? "Engine tests" : "Pedigree editor" }}</h1>
    </header>
    <EngineTests v-if="showTests" />
    <PedigreeEditor v-else />
  </div>
</template>

<style scoped>
.topbar { display: flex; align-items: center; gap: 24px; padding: 10px 16px; background: #fff; border-bottom: 1px solid #d0d7de; }
h1 { font-size: 1.1rem; margin: 0; }
</style>
