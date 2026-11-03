<script setup lang="ts">
import { computed, markRaw, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import {
  carriedBy,
  CONDITIONS,
  conditionsOf,
  conditionStatus,
  Pedigree,
  type ConditionStatus,
  type Person,
  type Sex,
} from "../../source/pedigree/pedigree";
import { PedigreeScene, type EngineName } from "../../source/pedigree/scene/pedigreescene";
import SidePanel from "./SidePanel.vue";
import { savePedigreePdf } from "../../source/pedigree/export/pedigreepdf";

type Pos = { x: number; y: number };

const pedigree = reactive(new Pedigree()) as Pedigree;
pedigree.loadExample();

const canvas = ref<HTMLCanvasElement | null>(null);
const nameInput = ref<HTMLInputElement | null>(null);
const personPanel = ref<InstanceType<typeof SidePanel> | null>(null);
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

/** The chart's key: only the conditions someone actually has. */
const conditionsInUse = computed(() => pedigree.conditionsInUse());

/** Fill for the small symbols in the sidebar: a pie of the person's conditions and a carrier dot, like the chart. */
function symFill(id: string | Person | undefined): Record<string, string> {
  const person = typeof id === "string" ? pedigree.find(id) : id;
  const cs = conditionsOf(person);
  const carried = carriedBy(person);
  const layers: string[] = [];
  if (carried.length) layers.push(`radial-gradient(circle, ${carried[0].color} 0 2px, #1f2937 2px 2.8px, transparent 3px)`);
  if (cs.length === 1) layers.push(`linear-gradient(${cs[0].color}, ${cs[0].color})`);
  else if (cs.length > 1) {
    const step = 360 / cs.length;
    layers.push(`conic-gradient(${cs.map((c, i) => `${c.color} ${i * step}deg ${(i + 1) * step}deg`).join(", ")})`);
  }
  return layers.length ? { background: layers.join(", ") } : {};
}

const hasCarriers = computed(() => pedigree.hasCarriers());
const STATUSES: Array<{ value: ConditionStatus; label: string }> = [
  { value: "none", label: "Not affected" },
  { value: "carrier", label: "Carrier" },
  { value: "affected", label: "Affected" },
];
const setConditionStatus = (id: string, conditionId: string, status: ConditionStatus) =>
  pedigree.setConditionStatus(id, conditionId, status);

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

const savingPdf = ref(false);
async function savePdf() {
  if (!scene || savingPdf.value) return;
  savingPdf.value = true;
  try {
    notify("Saved " + (await savePedigreePdf(scene, pedigree)));
  } catch (e) {
    notify((e as Error).message);
  } finally {
    savingPdf.value = false;
  }
}

function focusName() {
  personPanel.value?.expand();
  nextTick(() => {
    nameInput.value?.focus();
    nameInput.value?.select();
  });
}

// "Add child" in the sidebar: which partner
const childPartner = ref<string>("new");
watch(selectedId, (id) => {
  if (scene) scene.selectedId = id;
  if (id) personPanel.value?.expand();
  childPartner.value = id ? pedigree.partnersOf(id)[0] ?? "new" : "new";
});
watch(engineName, (name) => {
  if (!scene) return;
  scene.engineName = name;
  scene.rebuild(true);
});

// ---- data (triplets) ------------------------------------------------------

const jsonText = ref("");
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
  // the canvas's drawing size (its backing store can be larger on high-DPI screens)
  const w = Number(c.dataset.logicalWidth || c.width), h = Number(c.dataset.logicalHeight || c.height);
  return { x: ((e.clientX - r.left) * w) / r.width, y: ((e.clientY - r.top) * h) / r.height };
}

function onPointerDown(e: PointerEvent) {
  if (e.button !== 0 || !scene) return;
  closeMenu();
  const p = canvasPos(e);
  selectedId.value = scene.personAt(p.x, p.y);
  if (e.pointerType !== "mouse") startLongPress(e);
}

// Touch screens have no right-click: press and hold opens the same menu.
// (Android also fires contextmenu on a long press; opening it twice is harmless.)
let longPress: { timer: number; x: number; y: number } | null = null;
function startLongPress(e: PointerEvent) {
  cancelLongPress();
  const { clientX, clientY } = e;
  longPress = {
    x: clientX,
    y: clientY,
    timer: window.setTimeout(() => {
      longPress = null;
      onContextMenu({ clientX, clientY, preventDefault() {} } as MouseEvent);
    }, 550),
  };
}
function cancelLongPress() {
  if (longPress) clearTimeout(longPress.timer);
  longPress = null;
}

function onPointerMove(e: PointerEvent) {
  if (longPress && Math.hypot(e.clientX - longPress.x, e.clientY - longPress.y) > 10) cancelLongPress();
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
  // On narrow screens draw on a narrower canvas, so the chart isn't shrunk as much to fit.
  const c = canvas.value!;
  if ((c.parentElement?.clientWidth ?? 1000) < 700) {
    c.width = 560;
    c.height = 500;
  }
  scene = markRaw(new PedigreeScene(c, pedigree, engineName.value));
  scene.selectedId = selectedId.value;
  scene.rebuild(false);
  window.addEventListener("pointerdown", onWindowPointerDown, true);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("resize", closeMenu);
  window.addEventListener("blur", closeMenu);
});
onBeforeUnmount(() => {
  cancelLongPress();
  scene?.stop();
  window.removeEventListener("pointerdown", onWindowPointerDown, true);
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("resize", closeMenu);
  window.removeEventListener("blur", closeMenu);
});
</script>

<template>
  <div class="workspace">
    <section class="stage">
      <div class="chart">
      <canvas
        ref="canvas"
        width="900"
        height="620"
        aria-label="Pedigree chart. Drag people to rearrange; right-click for options."
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="cancelLongPress"
        @pointercancel="cancelLongPress"
        @dblclick="onDoubleClick"
        @contextmenu="onContextMenu"
      />
      <div v-if="conditionsInUse.length" class="key" aria-label="Key">
        <div class="key-title">Key</div>
        <div v-for="c in conditionsInUse" :key="c.id" class="key-row">
          <span class="swatch" :style="{ background: c.color }" aria-hidden="true" />{{ c.name }}
        </div>
        <div v-if="hasCarriers" class="key-row">
          <span class="swatch carrier-swatch" aria-hidden="true" />Carrier (unaffected)
        </div>
      </div>
      </div>
      <p class="hint">
        <span class="mouse">Drag to rearrange · right-click a person or the background for options · double-click empty space to add someone</span>
        <span class="touch">Drag to rearrange · press and hold a person or the background for options</span>
      </p>
    </section>

    <aside class="sidebar">
      <!-- Pedigree-wide actions -->
      <SidePanel id="pedigree.actions" title="Pedigree">
        <label class="field">
          Title
          <input v-model="pedigree.title" type="text" placeholder="e.g. Smith family" maxlength="80" />
        </label>
        <div class="button-row">
          <button class="primary" @click="addPerson()">+ Add person</button>
          <button @click="relayout">Re-layout</button>
          <button @click="loadExample">Example</button>
          <button class="danger-text" @click="clearAll">Clear</button>
        </div>
        <button class="save-pdf" :disabled="savingPdf || !pedigree.people.length" @click="savePdf">
          {{ savingPdf ? "Saving…" : "Save as PDF" }}
        </button>
        <label class="engine">
          Animation engine
          <select v-model="engineName">
            <option value="matter">Matter (physics)</option>
            <option value="spring">Spring</option>
            <option value="mock">Mock (no physics)</option>
          </select>
        </label>
      </SidePanel>

      <!-- Selected person -->
      <SidePanel id="pedigree.person" ref="personPanel" :title="selected ? label(selected.id) : 'Person'">
        <template v-if="selected" #actions>
          <button class="link" @click="selectedId = null">Deselect</button>
        </template>
        <p v-if="!selected || !relations" class="help">Select someone on the chart or in the list below to edit them.</p>
        <template v-else>
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
              <input v-model="selected.deceased" type="checkbox" />
              Deceased
            </label>
            <label class="check">
              <input type="checkbox" :checked="selected.proband" @change="toggleProband(selected.id)" />
              Proband
            </label>
          </div>

          <fieldset class="field conditions">
            <legend>Conditions</legend>
            <div v-for="c in CONDITIONS" :key="c.id" class="condition-row">
              <span class="swatch" :style="{ background: c.color }" aria-hidden="true" />
              <label :for="'status-' + c.id" class="condition-name">{{ c.name }} <span class="inherit">{{ c.inheritance }}</span></label>
              <select
                :id="'status-' + c.id"
                :value="conditionStatus(selected, c.id)"
                :class="'status-' + conditionStatus(selected, c.id)"
                @change="setConditionStatus(selected.id, c.id, ($event.target as HTMLSelectElement).value as ConditionStatus)"
              >
                <option v-for="st in STATUSES" :key="st.value" :value="st.value">{{ st.label }}</option>
              </select>
            </div>
          </fieldset>

          <dl class="relations">
            <template v-for="[title, ids] in ([['Parents', relations.parents], ['Partners', relations.partners], ['Siblings', relations.siblings], ['Children', relations.children]] as const)" :key="title">
              <dt>{{ title }}</dt>
              <dd>
                <button v-for="id in ids" :key="id" class="chip" @click="selectedId = id">
                  <span class="sym" :class="[pedigree.find(id)?.sex, { deceased: pedigree.find(id)?.deceased }]" :style="symFill(id)" aria-hidden="true" />{{ label(id) }}
                </button>
                <span v-if="!ids.length" class="none">none</span>
              </dd>
            </template>
          </dl>

          <div class="actions">
            <h3>Add relatives</h3>
            <div class="button-row">
              <button :disabled="!!relations.parents.length" @click="addParents(selected.id)">Parents</button>
              <button @click="addSibling(selected.id, 'male')">Brother</button>
              <button @click="addSibling(selected.id, 'female')">Sister</button>
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
                <button @click="addChild(selected.id, childPartner === 'new' ? null : childPartner, 'male')">Son</button>
                <button @click="addChild(selected.id, childPartner === 'new' ? null : childPartner, 'female')">Daughter</button>
              </div>
            </div>
            <button
              class="danger"
              :disabled="!!relations.children.length"
              :title="relations.children.length ? 'Remove their children first' : ''"
              @click="removePerson(selected.id)"
            >
              Delete {{ label(selected.id) }}
            </button>
            <p v-if="relations.children.length" class="help">People with children can't be deleted; remove the children first.</p>
          </div>
        </template>
      </SidePanel>

      <!-- Everyone, by generation -->
      <SidePanel id="pedigree.people" title="People" :count="pedigree.people.length">
        <p v-if="!pedigree.people.length" class="help">No one yet. Add a person to start.</p>
        <div v-for="[gen, people] in generationGroups" :key="gen" class="gen">
          <h3>Generation {{ roman(gen + 1) }}</h3>
          <ul>
            <li v-for="p in people" :key="p.id">
              <button :class="{ current: p.id === selectedId }" @click="selectedId = p.id">
                <span class="sym" :class="[p.sex, { deceased: p.deceased }]" :style="symFill(p)" aria-hidden="true" />
                <span class="name">{{ label(p.id) }}</span>
                <span class="meta">{{ p.proband ? "proband · " : "" }}{{ p.deceased ? "d. " : "" }}{{ p.age != null ? p.age + "y" : "" }}</span>
              </button>
            </li>
          </ul>
        </div>
      </SidePanel>

      <!-- The underlying triplets -->
      <SidePanel id="pedigree.trios" title="Triplets" :count="pedigree.trios.length" :default-open="false">
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
      </SidePanel>
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
        <div class="ctx-sub">
          <button role="menuitem" aria-haspopup="true">Conditions <span class="arrow">▸</span></button>
          <div class="ctx-menu" role="menu">
            <template v-for="st in (['affected', 'carrier'] as const)" :key="st">
              <div class="ctx-label">{{ st === "affected" ? "Affected by" : "Carrier of" }}</div>
              <button
                v-for="c in CONDITIONS"
                :key="st + c.id"
                role="menuitemcheckbox"
                :aria-checked="conditionStatus(menuPerson, c.id) === st"
                @click="pick(() => setConditionStatus(menuPerson!.id, c.id, conditionStatus(menuPerson!, c.id) === st ? 'none' : st))"
              >
                <span class="tick">{{ conditionStatus(menuPerson, c.id) === st ? "✓" : "" }}</span>
                <span class="swatch" :class="{ 'carrier-swatch': st === 'carrier' }" :style="st === 'affected' ? { background: c.color } : { '--dot': c.color }" aria-hidden="true" />{{ c.name }}
              </button>
            </template>
          </div>
        </div>
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
        <hr />
        <button role="menuitem" :disabled="!pedigree.people.length" @click="pick(savePdf)">Save as PDF</button>
      </template>
    </div>

    <div v-if="toast" class="toast" role="status">{{ toast }}</div>
  </div>
</template>

<style scoped>
/* the chart and its key (the key sits in the chart's top-right corner) */
.chart { position: relative; flex: none; max-width: 100%; }
.key {
  position: absolute; top: 10px; right: 10px;
  background: rgba(255, 255, 255, 0.92); border: 1px solid var(--border); border-radius: 8px;
  padding: 6px 10px; font-size: 12px; display: flex; flex-direction: column; gap: 3px;
  pointer-events: none;
}
.key-title { font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--muted); }
.key-row { display: flex; align-items: center; gap: 6px; white-space: nowrap; }
.swatch { display: inline-block; width: 11px; height: 11px; border: 1.5px solid #1f2937; flex: none; }

.conditions { display: flex; flex-direction: column; gap: 6px; }
.condition-row { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 8px; font-size: 13px; color: var(--text); }
.condition-name { line-height: 1.25; }
.condition-row select { font-size: 12px; padding: 3px 4px; }
.condition-row select.status-affected { border-color: #1f2937; font-weight: 600; }
.condition-row select.status-carrier { border-style: dashed; border-color: #1f2937; }
/* white square with a centre dot: how carriers look on the chart */
.carrier-swatch { background: radial-gradient(circle, var(--dot, #1f2937) 0 2.2px, transparent 2.8px) #fff; }
.inherit { display: block; font-size: 11px; color: var(--muted); }

.save-pdf { align-self: flex-start; }
.engine { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: #57606a; }

h3 { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--muted); margin: 6px 0 4px; }

.field-row { display: flex; align-items: end; gap: 14px; flex-wrap: wrap; }
.age input { width: 5.5em; }
.check { display: flex; align-items: center; gap: 6px; font-size: 13px; padding-bottom: 7px; cursor: pointer; }

/* pedigree symbols in the UI */
.sym { display: inline-block; width: 10px; height: 10px; border: 1.5px solid #1f2937; background: #fff; flex: none; position: relative; }
.sym.female { border-radius: 50%; }
.sym.unknown { transform: rotate(45deg) scale(0.85); }
.sym.deceased::after {
  content: ""; position: absolute; left: -4px; right: -4px; top: 50%; border-top: 1.5px solid #1f2937; transform: rotate(-45deg);
}

.relations { display: grid; grid-template-columns: auto 1fr; gap: 6px 10px; margin: 0; font-size: 12px; }
.relations dt { color: var(--muted); padding-top: 3px; }
.relations dd { margin: 0; display: flex; flex-wrap: wrap; gap: 4px; }
.workspace .chip { display: inline-flex; align-items: center; gap: 5px; padding: 2px 8px; border-radius: 999px; background: #fff; font-size: 12px; }
.none { color: #9ca3af; font-size: 12px; padding-top: 3px; }

.actions { display: flex; flex-direction: column; gap: 8px; border-top: 1px solid #eaeef2; padding-top: 4px; }
.actions h3 { margin-bottom: 0; }
.child-row { display: flex; flex-direction: column; gap: 6px; }
.child-row label { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #57606a; }
.child-row select { flex: 1; min-width: 0; }

.gen ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1px; }
.workspace .gen li button {
  width: 100%; display: flex; align-items: center; gap: 8px; text-align: left;
  border: 0; background: none; padding: 5px 6px; border-radius: 6px;
}
.workspace .gen li button:hover { background: var(--hover); }
.workspace .gen li button.current { background: var(--accent-soft); }
.gen .name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.gen .meta { color: var(--muted); font-size: 12px; }

.trios { margin: 0; padding-left: 20px; font-size: 12px; display: flex; flex-direction: column; gap: 2px; }
textarea { width: 100%; box-sizing: border-box; font: 12px ui-monospace, monospace !important; }

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
