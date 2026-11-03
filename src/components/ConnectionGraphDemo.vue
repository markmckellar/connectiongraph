<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, shallowRef, watch } from "vue";
import { TestAll } from "../../source/connectiongraph/world/tests/testall";
import type { World } from "../../source/connectiongraph/world/world";
import { DebugMessages } from "../../source/connectiongraph/util/debugmessages";

// The engine mutates lots of internal state every tick; keep it out of Vue's
// deep reactivity with shallowRef so Vue doesn't proxy the whole object graph.
const runner = shallowRef(new TestAll());

const engineNames = TestAll.engineNames;
// The ped/ped2 scenes were early pedigree prototypes; the pedigree editor
// replaces them, so they're left out of this list (the code is still there).
const PEDIGREE_PROTOTYPES = ["ped", "ped2"];
const testNames = runner.value.registeredTests.map((t) => t.name).filter((n) => !PEDIGREE_PROTOTYPES.includes(n));

const engine = ref<string>(engineNames[0]);
const test = ref<string>(testNames[0]);
const refreshMs = ref(33);
const running = ref(false);

const canvas = ref<HTMLCanvasElement | null>(null);
const mouse = reactive({ x: 0, y: 0 });
const messages = reactive<Record<number, string>>({ 1: "", 2: "", 3: "" });

function onUpdate(world: World) {
  const p = world.worldEngine.getMouseAnchor().getWorldPosition();
  mouse.x = Math.round(p.x);
  mouse.y = Math.round(p.y);
}

function run() {
  if (!canvas.value) return;
  runner.value.runTest(engine.value, test.value, canvas.value, onUpdate, Number(refreshMs.value) || 33);
  running.value = true;
}

function stop() {
  runner.value.stop();
  running.value = false;
}

let unsubscribe: (() => void) | undefined;
onMounted(() => {
  unsubscribe = DebugMessages.subscribe((slot, text) => (messages[slot] = text));
  run();
});
// switching engine or scene restarts it straight away
watch([engine, test], () => run());
onBeforeUnmount(() => {
  unsubscribe?.();
  runner.value.stop();
});
</script>

<template>
  <main>
    <header>
      
      <form class="controls" @submit.prevent="run">
        <label>
          Engine
          <select v-model="engine">
            <option v-for="e in engineNames" :key="e" :value="e">{{ e }}</option>
          </select>
        </label>
        <label>
          Test
          <select v-model="test">
            <option v-for="t in testNames" :key="t" :value="t">{{ t }}</option>
          </select>
        </label>
        <label>
          Engine tick (ms)
          <input v-model.number="refreshMs" type="number" min="1" max="5000" />
        </label>
        <button type="submit">{{ running ? "Restart" : "Run" }}</button>
        <button type="button" :disabled="!running" @click="stop">Stop</button>
      </form>
    </header>

    <div class="stage">
      <canvas ref="canvas" width="800" height="600" />
      <div class="status">
        <span>mouse: x={{ mouse.x }} y={{ mouse.y }}</span>
        <span v-for="(m, i) in messages" :key="i" class="msg">{{ m }}</span>
      </div>
    </div>
  </main>
</template>

<style scoped>
main { max-width: 840px; margin: 0 auto; padding: 16px; }
h1 { font-size: 1.25rem; margin: 0 0 12px; }
.controls { display: flex; flex-wrap: wrap; gap: 12px; align-items: end; margin-bottom: 12px; }
label { display: flex; flex-direction: column; font-size: 0.8rem; gap: 4px; }
select, input, button { font: inherit; padding: 4px 8px; }
input { width: 6em; }
button { cursor: pointer; }
canvas { border: 1px solid #8c959f; background: #fff; display: block; touch-action: none; }
.status { display: flex; flex-direction: column; gap: 2px; font: 12px ui-monospace, monospace; margin-top: 8px; color: #57606a; }
.msg { white-space: pre-wrap; word-break: break-all; }
</style>
