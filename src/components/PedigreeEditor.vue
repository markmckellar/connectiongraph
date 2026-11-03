<script setup lang="ts">
import { computed, markRaw, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { Pedigree, type Person, type Sex } from "../../source/pedigree/pedigree";
import { PedigreeScene, type EngineName } from "../../source/pedigree/scene/pedigreescene";

type Pos = { x: number; y: number };

const pedigree = reactive(new Pedigree()) as Pedigree;
pedigree.loadExample();

const canvas = ref<HTMLCanvasElement | null>(null);
const nameInput = ref<HTMLInputElement | null>(null);
const menuEl = ref<HTMLElement | null>(null);
let scene: PedigreeScene | null = null;

const engineName = ref<EngineName>("matter");
const selectedId = ref<string | null>(pedigree.people.find((p) => p.proband)?.id ?? null);
const selected = computed(() => pedigree.find(selectedId.value));

const SEXES: Array<{ value: Sex; label: string }> = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "unknown", label: "Unknown" },
];

// ---- feedback -------------------------------------------------------------

const toast = ref<string | null>(null);
let toastTimer: number | undefined;
function notify(text: string) {
  toast.value = text;
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => (toast.value = null), 3500);
}

// ---- derived views ----------------------------------------------------------

const label = (id: string) => pedigree.label(id);

const generationGroups = computed(() => {
  const gens = pedigree.generations();
  const groups = new Map<number, Person[]>();
  for (const p of pedigree.people) {
    const g = gens.get(p.id) ?? 0;
    groups.set(g, [...(groups.get(g) ?? []), p]);
  }
  return [...groups.entries()].sort((a, b) => a[0] - b[0]);
});

const relations = computed(() => {
  const id = selectedId.value;
  if (!id || !pedigree.find(id)) return null;
  const trio = pedigree.parentsOf(id);
  return {
    parents: trio ? [trio.motherId, trio.fatherId] : [],
    partners: pedigree.partnersOf(id),
    children: pedigree.childrenOf(id),
    siblings: pedigree.siblingsOf(id),
  };
});

function roman(n: number) {
  const t: Array<[number, string]> = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let s = "";
  for (const [v, r] of t) while (n >= v) { s += r; n -= v; }
  return s;
}

// ---- edits ----------------------------------------------------------------

/** Run a structural edit, then rebuild the scene (keeping everyone where they are). */
function edit(fn: () => Person | void, placeAt?: (p: Person) => Pos) {
  try {
    const result = fn();
    scene?.rebuild(true, result && placeAt ? new Map([[result.id, placeAt(result)]]) : undefined);
    if (result) selectedId.value = result.id;
  } catch (e) {
    notify((e as Error).message);
  }
}

const addPerson = (at?: Pos) => {
  edit(() => pedigree.addPerson(), at ? () => at : undefined);
  focusName();
};
const addParents = (id: string) => edit(() => { pedigree.addParents(id); });
const addSibling = (id: string, sex: Sex) => edit(() => pedigree.addSibling(id, sex));
const addChild = (id: string, partnerId: string | null, sex: Sex) => edit(() => pedigree.addChild(id, partnerId, sex));
const removePerson = (id: string) =>
  edit(() => {
    pedigree.remove(id);
    if (selectedId.value === id) selectedId.value = null;
  });

const setSex = (id: string, sex: Sex) => pedigree.setSex(id, sex);
const toggleDeceased = (id: string) => (pedigree.get(id).deceased = !pedigree.get(id).deceased);
const toggleProband = (id: string) => pedigree.setProband(pedigree.get(id).proband ? null : id);

function setAge(person: Person, value: string) {
  const n = parseInt(value, 10);
  person.age = value === "" || Number.isNaN(n) ? null : Math.max(0, Math.min(130, n));
}

function loadExample() {
  pedigree.loadExample();
  selectedId.value = pedigree.people.find((p) => p.proband)?.id ?? null;
  scene?.rebuild(false);
}
function clearAll() {
  if (pedigree.people.length && !confirm("Remove everyone from the pedigree?")) return;
  pedigree.clear();
  selectedId.value = null;
  scene?.rebuild(false);
}
const relayout = () => scene?.rebuild(false);

function focusName() {
  nextTick(() => {
    nameInput.value?.focus();
    nameInput.value?.select();
  });
}

// "Add child" in the sidebar: which partner
const childPartner = ref<string>("new");
watch(selectedId, (id) => {
  if (scene) scene.selectedId = id;
  childPartner.value = id ? pedigree.partnersOf(id)[0] ?? "new" : "new";
});
watch(engineName, (name) => {
  if (!scene) return;
  scene.engineName = name;
  scene.rebuild(true);
});

// ---- data (triplets) ------------------------------------------------------

const jsonText = ref("");
const showData = ref(false);
function exportJson() {
  jsonText.value = JSON.stringify(pedigree.toJSON(), null, 2);
  navigator.clipboard?.writeText(jsonText.value).then(
    () => notify("Copied pedigree JSON to the clipboard"),
    () => {},
  );
}
function importJson() {
  try {
    pedigree.load(JSON.parse(jsonText.value));
    selectedId.value = null;
    scene?.rebuild(false);
    notify(`Loaded ${pedigree.people.length} people and ${pedigree.trios.length} triplets`);
  } catch (e) {
    notify("Couldn't load that JSON: " + (e as Error).message);
  }
}

// ---- canvas interaction ---------------------------------------------------

function canvasPos(e: MouseEvent): Pos {
  const c = canvas.value!;
  const r = c.getBoundingClientRect();
  return { x: ((e.clientX - r.left) * c.width) / r.width, y: ((e.clientY - r.top) * c.height) / r.height };
}

function onPointerDown(e: PointerEvent) {
  if (e.button !== 0 || !scene) return;
  closeMenu();
  const p = canvasPos(e);
  selectedId.value = scene.personAt(p.x, p.y);
}

function onPointerMove(e: PointerEvent) {
  if (!scene || !canvas.value) return;
  const p = canvasPos(e);
  canvas.value.style.cursor = scene.personAt(p.x, p.y) ? "grab" : "default";
}

function onDoubleClick(e: MouseEvent) {
  if (!scene) return;
  const p = canvasPos(e);
  const id = scene.personAt(p.x, p.y);
  if (id) {
    selectedId.value = id;
    focusName();
  } else addPerson(p);
}

// ---- context menu -------------------------------------------------------

interface MenuState { x: number; y: number; personId: string | null; at: Pos; flip: boolean }
const menu = ref<MenuState | null>(null);
const menuPerson = computed(() => pedigree.find(menu.value?.personId));

function onContextMenu(e: MouseEvent) {
  e.preventDefault();
  if (!scene) return;
  const at = canvasPos(e);
  const personId = scene.personAt(at.x, at.y);
  if (personId) selectedId.value = personId;
  menu.value = { x: e.clientX, y: e.clientY, personId, at, flip: e.clientX > window.innerWidth - 420 };
  nextTick(() => {
    const el = menuEl.value;
    if (!el || !menu.value) return;
    const r = el.getBoundingClientRect();
    if (r.right > window.innerWidth - 8) menu.value.x = Math.max(8, window.innerWidth - r.width - 8);
    if (r.bottom > window.innerHeight - 8) menu.value.y = Math.max(8, window.innerHeight - r.height - 8);
    el.querySelector<HTMLElement>("[role=menuitem]:not(:disabled)")?.focus();
  });
}

function closeMenu() {
  menu.value = null;
}

/** Run a menu action, then close the menu (actions read the menu's person, so close after). */
function pick(fn: () => void) {
  fn();
  closeMenu();
}

function onWindowPointerDown(e: PointerEvent) {
  if (menu.value && menuEl.value && !menuEl.value.contains(e.target as Node)) closeMenu();
}
function onKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape") closeMenu();
}

// ---- lifecycle ------------------------------------------------------------

onMounted(() => {
  scene = markRaw(new PedigreeScene(canvas.value!, pedigree, engineName.value));
  scene.selectedId = selectedId.value;
  scene.rebuild(false);
  window.addEventListener("pointerdown", onWindowPointerDown, true);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("resize", closeMenu);
  window.addEventListener("blur", closeMenu);
});
onBeforeUnmount(() => {
  scene?.stop();
  window.removeEventListener("pointerdown", onWindowPointerDown, true);
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("resize", closeMenu);
  window.removeEventListener("blur", closeMenu);
});
</script>

<template>
  <div class="editor">
    <section class="stage">
      <canvas
        ref="canvas"
        width="900"
        height="620"
        aria-label="Pedigree chart. Drag people to rearrange; right-click for options."
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @dblclick="onDoubleClick"
        @contextmenu="onContextMenu"
      />
      <p class="hint">Drag to rearrange · right-click a person or the background for options · double-click empty space to add someone</p>
    </section>

    <aside class="sidebar">
      <!-- Pedigree-wide actions -->
      <section class="card">
        <div class="card-head">
          <h2>Pedigree</h2>
          <label class="engine">
            Engine
            <select v-model="engineName">
              <option value="matter">matter</option>
              <option value="spring">spring</option>
              <option value="mock">mock</option>
            </select>
          </label>
        </div>
        <div class="button-row">
          <button class="primary" @click="addPerson()">+ Add person</button>
          <button @click="relayout">Re-layout</button>
          <button @click="loadExample">Example</button>
          <button class="danger-text" @click="clearAll">Clear</button>
        </div>
      </section>

      <!-- Selected person -->
      <section v-if="selected && relations" class="card person-card">
        <div class="card-head">
          <h2>Person</h2>
          <button class="link" @click="selectedId = null">Close</button>
        </div>

        <label class="field">
          Name
          <input ref="nameInput" v-model.trim="selected.name" type="text" placeholder="Name" maxlength="40" />
        </label>

        <fieldset class="field">
          <legend>Sex</legend>
          <div class="segmented">
            <label v-for="s in SEXES" :key="s.value" :class="{ on: selected.sex === s.value }">
              <input type="radio" name="sex" :value="s.value" :checked="selected.sex === s.value" @change="setSex(selected.id, s.value)" />
              <span class="sym" :class="s.value" aria-hidden="true" />{{ s.label }}
            </label>
          </div>
        </fieldset>

        <div class="field-row">
          <label class="field age">
            Age
            <input type="number" min="0" max="130" :value="selected.age ?? ''" placeholder="—" @input="setAge(selected, ($event.target as HTMLInputElement).value)" />
          </label>
          <label class="check">
            <input type="checkbox" v-model="selected.deceased" />
            Deceased
          </label>
          <label class="check">
            <input type="checkbox" :checked="selected.proband" @change="toggleProband(selected.id)" />
            Proband
          </label>
        </div>

        <dl class="relations">
          <template v-for="[title, ids] in ([['Parents', relations.parents], ['Partners', relations.partners], ['Siblings', relations.siblings], ['Children', relations.children]] as const)" :key="title">
            <dt>{{ title }}</dt>
            <dd>
              <button v-for="id in ids" :key="id" class="chip" @click="selectedId = id">
                <span class="sym" :class="[pedigree.find(id)?.sex, { deceased: pedigree.find(id)?.deceased }]" aria-hidden="true" />{{ label(id) }}
              </button>
              <span v-if="!ids.length" class="none">none</span>
            </dd>
          </template>
        </dl>

        <div class="actions">
          <button :disabled="!!relations.parents.length" @click="addParents(selected.id)">Add parents</button>
          <div class="button-row">
            <button @click="addSibling(selected.id, 'male')">+ Brother</button>
            <button @click="addSibling(selected.id, 'female')">+ Sister</button>
          </div>
          <div class="child-row">
            <label>
              Child with
              <select v-model="childPartner">
                <option v-for="id in relations.partners" :key="id" :value="id">{{ label(id) }}</option>
                <option value="new">a new partner</option>
              </select>
            </label>
            <div class="button-row">
              <button @click="addChild(selected.id, childPartner === 'new' ? null : childPartner, 'male')">+ Son</button>
              <button @click="addChild(selected.id, childPartner === 'new' ? null : childPartner, 'female')">+ Daughter</button>
            </div>
          </div>
          <button
            class="danger"
            :disabled="!!relations.children.length"
            :title="relations.children.length ? 'Remove their children first' : ''"
            @click="removePerson(selected.id)"
          >
            Delete person
          </button>
        </div>
      </section>

      <!-- Everyone, by generation -->
      <section class="card">
        <div class="card-head">
          <h2>People <span class="count">{{ pedigree.people.length }}</span></h2>
        </div>
        <p v-if="!pedigree.people.length" class="none">No one yet. Add a person to start.</p>
        <div v-for="[gen, people] in generationGroups" :key="gen" class="gen">
          <h3>Generation {{ roman(gen + 1) }}</h3>
          <ul>
            <li v-for="p in people" :key="p.id">
              <button :class="{ current: p.id === selectedId }" @click="selectedId = p.id">
                <span class="sym" :class="[p.sex, { deceased: p.deceased }]" aria-hidden="true" />
                <span class="name">{{ label(p.id) }}</span>
                <span class="meta">{{ p.proband ? "proband · " : "" }}{{ p.deceased ? "d. " : "" }}{{ p.age != null ? p.age + "y" : "" }}</span>
              </button>
            </li>
          </ul>
        </div>
      </section>

      <!-- The underlying triplets -->
      <section class="card">
        <button class="card-head toggle" :aria-expanded="showData" @click="showData = !showData">
          <h2>Triplets <span class="count">{{ pedigree.trios.length }}</span></h2>
          <span aria-hidden="true">{{ showData ? "▾" : "▸" }}</span>
        </button>
        <template v-if="showData">
          <p class="help">Each triplet is one child with their mother and father. Couples and sibships are worked out from these.</p>
          <ol class="trios">
            <li v-for="t in pedigree.trios" :key="t.childId">
              <b>{{ label(t.childId) }}</b> ← {{ label(t.motherId) }} + {{ label(t.fatherId) }}
            </li>
          </ol>
          <textarea v-model="jsonText" rows="6" spellcheck="false" placeholder="Export to see the JSON, or paste some here and Import." />
          <div class="button-row">
            <button @click="exportJson">Export</button>
            <button :disabled="!jsonText.trim()" @click="importJson">Import</button>
          </div>
        </template>
      </section>
    </aside>

    <!-- Right-click menu -->
    <div
      v-if="menu"
      ref="menuEl"
      class="ctx"
      :class="{ flip: menu.flip }"
      :style="{ left: menu.x + 'px', top: menu.y + 'px' }"
      role="menu"
      @contextmenu.prevent
    >
      <template v-if="menuPerson">
        <div class="ctx-title">{{ label(menuPerson.id) }}</div>
        <button role="menuitem" @click="pick(focusName)">Edit details…</button>
        <div class="ctx-sub">
          <button role="menuitem" aria-haspopup="true">Sex <span class="arrow">▸</span></button>
          <div class="ctx-menu" role="menu">
            <button v-for="s in SEXES" :key="s.value" role="menuitemradio" :aria-checked="menuPerson.sex === s.value" @click="pick(() => setSex(menuPerson!.id, s.value))">
              <span class="tick">{{ menuPerson.sex === s.value ? "✓" : "" }}</span>{{ s.label }}
            </button>
          </div>
        </div>
        <button role="menuitemcheckbox" :aria-checked="menuPerson.deceased" @click="pick(() => toggleDeceased(menuPerson!.id))">
          <span class="tick">{{ menuPerson.deceased ? "✓" : "" }}</span>Deceased
        </button>
        <button role="menuitemcheckbox" :aria-checked="menuPerson.proband" @click="pick(() => toggleProband(menuPerson!.id))">
          <span class="tick">{{ menuPerson.proband ? "✓" : "" }}</span>Proband
        </button>
        <hr />
        <button role="menuitem" :disabled="!!pedigree.parentsOf(menuPerson.id)" @click="pick(() => addParents(menuPerson!.id))">Add parents</button>
        <button role="menuitem" @click="pick(() => addSibling(menuPerson!.id, 'male'))">Add brother</button>
        <button role="menuitem" @click="pick(() => addSibling(menuPerson!.id, 'female'))">Add sister</button>
        <div v-for="[sex, title] in ([['male', 'Add son'], ['female', 'Add daughter']] as const)" :key="sex" class="ctx-sub">
          <button role="menuitem" aria-haspopup="true">{{ title }} <span class="arrow">▸</span></button>
          <div class="ctx-menu" role="menu">
            <div class="ctx-label">with</div>
            <button v-for="pid in pedigree.partnersOf(menuPerson.id)" :key="pid" role="menuitem" @click="pick(() => addChild(menuPerson!.id, pid, sex))">
              {{ label(pid) }}
            </button>
            <button role="menuitem" @click="pick(() => addChild(menuPerson!.id, null, sex))">a new partner</button>
          </div>
        </div>
        <hr />
        <button
          role="menuitem"
          class="danger-text"
          :disabled="!!pedigree.childrenOf(menuPerson.id).length"
          :title="pedigree.childrenOf(menuPerson.id).length ? 'Remove their children first' : ''"
          @click="pick(() => removePerson(menuPerson!.id))"
        >
          Delete
        </button>
      </template>
      <template v-else>
        <button role="menuitem" @click="pick(() => addPerson(menu!.at))">Add person here</button>
        <button role="menuitem" @click="pick(relayout)">Re-layout</button>
        <button role="menuitem" @click="pick(loadExample)">Load example</button>
      </template>
    </div>

    <div v-if="toast" class="toast" role="status">{{ toast }}</div>
  </div>
</template>

<style scoped>
.editor {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 16px;
  padding: 16px;
  align-items: start;
}
@media (max-width: 1100px) {
  .editor { grid-template-columns: minmax(0, 1fr); }
}

.stage { overflow-x: auto; }
canvas {
  display: block;
  background: #fff;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  touch-action: none;
  max-width: none;
}
.hint { color: #6b7280; font-size: 12px; margin: 6px 2px 0; }

.sidebar { display: flex; flex-direction: column; gap: 12px; }
.card {
  background: #fff;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.card-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.card-head.toggle { background: none; border: 0; padding: 0; font: inherit; cursor: pointer; color: inherit; text-align: left; }
h2 { font-size: 0.95rem; margin: 0; }
h3 { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.04em; color: #6b7280; margin: 6px 0 4px; }
.count { font-weight: 500; color: #6b7280; font-size: 0.8rem; margin-left: 4px; }

button, select, input, textarea { font: inherit; font-size: 13px; }
button {
  border: 1px solid #d0d7de;
  background: #f6f8fa;
  border-radius: 6px;
  padding: 5px 10px;
  cursor: pointer;
  color: #1f2328;
}
button:hover:not(:disabled) { background: #eef1f4; }
button:disabled { opacity: 0.45; cursor: not-allowed; }
button.primary { background: #2563eb; border-color: #2563eb; color: #fff; }
button.primary:hover { background: #1d4ed8; }
button.danger { color: #b91c1c; border-color: #fca5a5; background: #fff; }
button.danger:hover:not(:disabled) { background: #fef2f2; }
.danger-text { color: #b91c1c; }
button.link { border: 0; background: none; color: #2563eb; padding: 0; }
button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible { outline: 2px solid #2563eb; outline-offset: 1px; }

.button-row { display: flex; flex-wrap: wrap; gap: 6px; }
.engine { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #6b7280; }
.engine select { padding: 2px 4px; }

.field { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: #57606a; border: 0; padding: 0; margin: 0; }
.field legend { padding: 0; margin-bottom: 4px; }
.field input[type="text"], .field input[type="number"] {
  border: 1px solid #d0d7de; border-radius: 6px; padding: 6px 8px; color: #1f2328;
}
.field-row { display: flex; align-items: end; gap: 14px; flex-wrap: wrap; }
.age input { width: 5.5em; }
.check { display: flex; align-items: center; gap: 6px; font-size: 13px; padding-bottom: 7px; cursor: pointer; }

.segmented { display: flex; border: 1px solid #d0d7de; border-radius: 6px; overflow: hidden; }
.segmented label {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 6px 4px; font-size: 13px; color: #1f2328; cursor: pointer; background: #fff;
}
.segmented label + label { border-left: 1px solid #d0d7de; }
.segmented label.on { background: #eef2ff; color: #1d4ed8; font-weight: 600; }
.segmented input { position: absolute; opacity: 0; pointer-events: none; }
.segmented label:focus-within { outline: 2px solid #2563eb; outline-offset: -2px; }

/* pedigree symbols in the UI */
.sym { display: inline-block; width: 10px; height: 10px; border: 1.5px solid #1f2937; background: #fff; flex: none; position: relative; }
.sym.female { border-radius: 50%; }
.sym.unknown { transform: rotate(45deg) scale(0.85); }
.sym.deceased::after {
  content: ""; position: absolute; left: -4px; right: -4px; top: 50%; border-top: 1.5px solid #1f2937; transform: rotate(-45deg);
}

.relations { display: grid; grid-template-columns: auto 1fr; gap: 6px 10px; margin: 0; font-size: 12px; }
.relations dt { color: #6b7280; padding-top: 3px; }
.relations dd { margin: 0; display: flex; flex-wrap: wrap; gap: 4px; }
.chip { display: inline-flex; align-items: center; gap: 5px; padding: 2px 8px; border-radius: 999px; background: #fff; font-size: 12px; }
.none { color: #9ca3af; font-size: 12px; margin: 0; padding-top: 3px; }

.actions { display: flex; flex-direction: column; gap: 8px; border-top: 1px solid #eaeef2; padding-top: 10px; }
.child-row { display: flex; flex-direction: column; gap: 6px; }
.child-row label { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #57606a; }
.child-row select { flex: 1; min-width: 0; }

.gen ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1px; }
.gen li button {
  width: 100%; display: flex; align-items: center; gap: 8px; text-align: left;
  border: 0; background: none; padding: 5px 6px; border-radius: 6px;
}
.gen li button:hover { background: #f3f4f6; }
.gen li button.current { background: #eef2ff; }
.gen .name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.gen .meta { color: #6b7280; font-size: 12px; }

.help { font-size: 12px; color: #6b7280; margin: 0; }
.trios { margin: 0; padding-left: 20px; font-size: 12px; display: flex; flex-direction: column; gap: 2px; }
textarea {
  width: 100%; box-sizing: border-box; font: 12px ui-monospace, monospace;
  border: 1px solid #d0d7de; border-radius: 6px; padding: 6px;
}

/* context menu */
.ctx, .ctx-menu {
  position: fixed;
  z-index: 50;
  min-width: 190px;
  background: #fff;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(31, 35, 40, 0.15);
  padding: 4px;
  display: flex;
  flex-direction: column;
}
.ctx button {
  border: 0; background: none; text-align: left; border-radius: 5px; padding: 6px 10px;
  display: flex; align-items: center; gap: 4px; width: 100%;
}
.ctx button:hover:not(:disabled), .ctx button:focus-visible { background: #eef2ff; outline: none; }
.ctx hr { border: 0; border-top: 1px solid #eaeef2; margin: 4px 2px; }
.ctx-title { font-size: 12px; font-weight: 600; color: #6b7280; padding: 4px 10px 6px; }
.ctx-label { font-size: 11px; color: #9ca3af; padding: 2px 10px; }
.tick { display: inline-block; width: 16px; color: #2563eb; }
.arrow { margin-left: auto; color: #9ca3af; }
.ctx-sub { position: relative; }
.ctx-sub > .ctx-menu { position: absolute; left: 100%; top: -4px; display: none; }
.ctx.flip .ctx-sub > .ctx-menu { left: auto; right: 100%; }
.ctx-sub:hover > .ctx-menu, .ctx-sub:focus-within > .ctx-menu { display: flex; }

.toast {
  position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
  background: #1f2937; color: #fff; padding: 8px 14px; border-radius: 8px; font-size: 13px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2); z-index: 60;
}
</style>
