<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, shallowRef, watch } from "vue";
import { TestAll } from "../../source/connectiongraph/world/tests/testall";
import type { World } from "../../source/connectiongraph/world/world";
import { DebugMessages } from "../../source/connectiongraph/util/debugmessages";
import SidePanel from "./SidePanel.vue";

// The engine mutates lots of internal state every tick; keep it out of Vue's
// deep reactivity with shallowRef so Vue doesn't proxy the whole object graph.
const runner = shallowRef(new TestAll());

const ENGINES = [
  { value: "matter", label: "Matter", help: "Real 2D physics: momentum, collisions and walls." },
  { value: "spring", label: "Spring", help: "Simple springs between connected shapes, no collisions." },
  { value: "mock", label: "Mock", help: "No physics: shapes only move when rules or the mouse move them." },
];

// ped/ped2 were early pedigree prototypes; the Pedigree tab replaces them
// (their code is still there).
const PEDIGREE_PROTOTYPES = ["ped", "ped2"];
const scenes = runner.value.registeredTests.filter((t) => !PEDIGREE_PROTOTYPES.includes(t.name));

const engine = ref("matter");
const scene = ref(scenes[0].name);
const tickMs = ref(33);
const running = ref(false);
const current = computed(() => scenes.find((s) => s.name === scene.value)!);
const engineHelp = computed(() => ENGINES.find((e) => e.value === engine.value)?.help);

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
  const tick = Math.min(1000, Math.max(5, Number(tickMs.value) || 33));
  runner.value.runTest(engine.value, scene.value, canvas.value, onUpdate, tick);
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
watch([engine, scene], () => run());
onBeforeUnmount(() => {
  unsubscribe?.();
  runner.value.stop();
});
</script>

<template>
  <div class="workspace">
    <section class="stage">
      <canvas ref="canvas" width="800" height="600" :aria-label="current.title + ' scene. Drag shapes with the mouse.'" />
      <p class="hint">Drag any shape with the mouse · pick a different scene or engine on the right</p>
    </section>

    <aside class="sidebar">
      <SidePanel id="tests.scene" title="Scene" :count="scenes.length">
        <ul class="scene-list" role="listbox" aria-label="Scenes">
          <li v-for="s in scenes" :key="s.name">
            <button role="option" :aria-selected="s.name === scene" :class="{ current: s.name === scene }" @click="scene = s.name">
              {{ s.title }}
            </button>
          </li>
        </ul>
      </SidePanel>

      <SidePanel id="tests.about" :title="'About: ' + current.title">
        <p class="about">{{ current.description }}</p>
      </SidePanel>

      <SidePanel id="tests.engine" title="Engine">
        <div class="segmented" role="radiogroup" aria-label="Engine">
          <label v-for="e in ENGINES" :key="e.value" :class="{ on: engine === e.value }">
            <input v-model="engine" type="radio" name="engine" :value="e.value" />{{ e.label }}
          </label>
        </div>
        <p class="help">{{ engineHelp }}</p>
        <div class="run-row">
          <label class="field tick">
            Tick (ms)
            <input v-model.number="tickMs" type="number" min="5" max="1000" @keydown.enter="run" />
          </label>
          <div class="button-row">
            <button class="primary" @click="run">{{ running ? "Restart" : "Run" }}</button>
            <button :disabled="!running" @click="stop">Stop</button>
          </div>
        </div>
      </SidePanel>

      <SidePanel id="tests.status" title="Status" :default-open="false">
        <dl class="status">
          <dt>Mouse</dt>
          <dd>{{ mouse.x }}, {{ mouse.y }}</dd>
          <dt>State</dt>
          <dd>{{ running ? "running" : "stopped" }}</dd>
          <template v-for="(m, i) in messages" :key="i">
            <template v-if="m">
              <dt>Engine {{ i }}</dt>
              <dd class="mono">{{ m }}</dd>
            </template>
          </template>
        </dl>
      </SidePanel>
    </aside>
  </div>
</template>

<style scoped>
.scene-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.scene-list button {
  width: 100%; text-align: left; border: 0; background: none; padding: 7px 10px; border-radius: 6px;
}
.scene-list button:hover { background: var(--hover); }
.scene-list button.current { background: var(--accent-soft); color: #1d4ed8; font-weight: 600; }
.about { margin: 0; font-size: 13px; line-height: 1.5; }
.run-row { display: flex; align-items: end; gap: 12px; flex-wrap: wrap; }
.tick input { width: 6em; }
.status { display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; margin: 0; font-size: 12px; }
.status dt { color: var(--muted); }
.status dd { margin: 0; }
.mono { font-family: ui-monospace, monospace; word-break: break-all; }
</style>
