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
import { MAX_ZOOM, MIN_ZOOM, PedigreeScene, type EngineName } from "../../source/pedigree/scene/pedigreescene";
import SidePanel from "./SidePanel.vue";
import { savePedigreePdf } from "../../source/pedigree/export/pedigreepdf";
import { readPedigreeFile, savePedigreeFile } from "../../source/pedigree/export/pedigreefile";

type Pos = { x: number; y: number };

const pedigree = reactive(new Pedigree()) as Pedigree;
pedigree.loadExample();

const canvas = ref<HTMLCanvasElement | null>(null);
const nameInput = ref<HTMLInputElement | null>(null);
const personPanel = ref<InstanceType<typeof SidePanel> | null>(null);
const actionsPanel = ref<InstanceType<typeof SidePanel> | null>(null);
const peoplePanel = ref<InstanceType<typeof SidePanel> | null>(null);
const triosPanel = ref<InstanceType<typeof SidePanel> | null>(null);
const stageEl = ref<HTMLElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
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

/** Only the relation rows that have someone in them. */
const relationRows = computed(() => {
  const r = relations.value;
  if (!r) return [];
  const rows: Array<[string, string[]]> = [["Parents", r.parents], ["Partners", r.partners], ["Siblings", r.siblings], ["Children", r.children]];
  return rows.filter(([, ids]) => ids.length);
});

/** "Autosomal recessive" -> "AR", "X-linked recessive" -> "XLR". */
const inheritanceShort = (s: string) => s.split(/[\s-]+/).map((w) => w[0].toUpperCase()).join("");

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

// ---- sidebar focus --------------------------------------------------------
// While you're looking at someone, their panel gets the sidebar to itself (the
// others fold down to their headers); opening another panel folds the person away.

function focusPerson() {
  personPanel.value?.expand();
  for (const panel of [actionsPanel, peoplePanel, triosPanel]) panel.value?.collapse();
}
const onOtherPanelOpened = () => personPanel.value?.collapse();

function focusName() {
  focusPerson();
  nextTick(() => {
    nameInput.value?.focus();
    nameInput.value?.select();
  });
}

// "Add child" in the sidebar: which partner
const childPartner = ref<string>("new");
watch(selectedId, (id) => {
  if (!id) selectedIds.value = [];
  else if (!selectedIds.value.includes(id)) selectedIds.value = [id];
  if (id) focusPerson();
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
    loadPedigree(JSON.parse(jsonText.value));
    notify(`Loaded ${pedigree.people.length} people and ${pedigree.trios.length} triplets`);
  } catch (e) {
    notify("Couldn't load that JSON: " + (e as Error).message);
  }
}

/** Replace the pedigree with parsed JSON (a saved file or a bare export). Throws if it isn't one. */
function loadPedigree(json: unknown) {
  const { data, positions } = readPedigreeFile(json);
  pedigree.load(data);
  selectedId.value = pedigree.people.find((p) => p.proband)?.id ?? null;
  if (!scene) return;
  // put everyone back where they were, if the file says
  if (pedigree.people.length && pedigree.people.every((p) => positions.has(p.id))) scene.rebuild(true, positions);
  else scene.rebuild(false);
  scene.fit(true);
}

// ---- files ----------------------------------------------------------------

function saveFile() {
  try {
    notify("Saved " + savePedigreeFile(pedigree.toJSON(), scene?.positions() ?? new Map()));
  } catch (e) {
    notify("Couldn't save: " + (e as Error).message);
  }
}
const openFile = () => fileInput.value?.click();

async function loadFile(file: File | undefined) {
  if (!file) return;
  try {
    loadPedigree(JSON.parse(await file.text()));
    notify(`Opened ${file.name}: ${pedigree.people.length} people`);
  } catch (e) {
    notify(`Couldn't open ${file.name}: ${(e as Error).message}`);
  }
}
function onFileChosen(e: Event) {
  const input = e.target as HTMLInputElement;
  loadFile(input.files?.[0]);
  input.value = ""; // so choosing the same file again still loads it
}

// drop a saved .json onto the chart to open it
const dropping = ref(false);
function onDragOver(e: DragEvent) {
  if (!e.dataTransfer?.types.includes("Files")) return;
  e.preventDefault();
  dropping.value = true;
}
function onDrop(e: DragEvent) {
  dropping.value = false;
  if (!e.dataTransfer?.files.length) return;
  e.preventDefault();
  loadFile(e.dataTransfer.files[0]);
}

// ---- view: zoom, pan, fit --------------------------------------------------

const zoom = ref(1);
/** The view is following the pedigree, keeping it centred and on screen. */
const fitting = ref(true);
const narrowLayout = () => window.matchMedia("(max-width: 1000px)").matches;

function zoomBy(factor: number, clientX?: number, clientY?: number) {
  if (!scene) return;
  const at = clientX !== undefined && clientY !== undefined ? scene.toCanvas(clientX, clientY) : undefined;
  scene.zoomTo(scene.zoom * factor, at?.x, at?.y);
}
const actualSize = () => scene?.zoomTo(1);
const fitToDisplay = () => scene?.fit();

/** Ctrl/⌘ + wheel (and trackpad pinch, which browsers send as that) zooms about the pointer; a plain wheel or two-finger scroll pans. */
function onWheel(e: WheelEvent) {
  if (!scene) return;
  const unit = e.deltaMode === 1 ? 16 : 1;
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault();
    zoomBy(Math.exp(-e.deltaY * unit * 0.002), e.clientX, e.clientY);
  } else if (!narrowLayout()) {
    // (on a phone-width layout the page itself scrolls, so leave plain scrolling to it)
    e.preventDefault();
    scene.panBy(-e.deltaX * unit, -e.deltaY * unit);
  }
}

// ---- line problems --------------------------------------------------------

/** How many misleading lines (crossings, overlaps, lines through people) the settled chart has. */
const lineProblems = ref(0);
let tidying = false;
function tidy() {
  if (!scene) return;
  const before = lineProblems.value;
  tidying = true;
  scene.tidy();
  // the result is known once people have glided into place
  window.setTimeout(() => {
    if (tidying && lineProblems.value >= before && before > 0)
      notify("That's as tidy as it gets: some families (cousins marrying, say) can't be drawn without a crossing. Try dragging a group by hand.");
    tidying = false;
  }, 2500);
}

// ---- selection --------------------------------------------------------------
// selectedId is the person shown in the sidebar; selectedIds is everyone
// highlighted (several, after shift-click, a lasso or "select branch"), who
// move together when you drag one of them.

const selectedIds = ref<string[]>(selectedId.value ? [selectedId.value] : []);
function setSelection(ids: string[], primary?: string | null) {
  ids = [...new Set(ids)];
  selectedIds.value = ids;
  selectedId.value = primary !== undefined ? primary
    : selectedId.value && ids.includes(selectedId.value) ? selectedId.value : ids[ids.length - 1] ?? null;
}
watch(selectedIds, (ids) => { if (scene) scene.selection = new Set(ids); });
const othersSelected = computed(() => selectedIds.value.length - (selectedId.value ? 1 : 0));

/** Someone, their partners, and everyone descended from them (with their partners): a branch of the tree to move as one. */
function branchOf(id: string): string[] {
  const out = new Set([id, ...pedigree.partnersOf(id)]);
  const stack = [id];
  while (stack.length) {
    for (const child of pedigree.childrenOf(stack.pop()!)) {
      if (out.has(child)) continue;
      out.add(child);
      for (const p of pedigree.partnersOf(child)) out.add(p);
      stack.push(child);
    }
  }
  return [...out];
}
function selectBranch(id: string) {
  const ids = branchOf(id);
  setSelection(ids, id);
  notify(`Selected ${ids.length} ${ids.length === 1 ? "person" : "people"}: drag any of them to move the group`);
}

// ---- canvas interaction ---------------------------------------------------
//  - press a person and drag: move them (or the whole selection, if they're in it)
//  - shift/ctrl/⌘-click a person: add them to the selection or take them out
//  - drag on empty space (mouse): lasso people; shift adds to the selection
//  - drag on empty space (touch), or with the middle button: pan; pinch: zoom
//  - right-click / press and hold: menu; double-click empty space: add someone

type Gesture =
  | { kind: "person"; id: string; start: Pos; startWorld: Pos; dragging: boolean; collapseOnClick: boolean }
  | { kind: "lasso"; start: Pos; points: Pos[]; additive: boolean }
  | { kind: "pan"; last: Pos }
  | { kind: "pinch"; dist: number; mid: Pos };
let gesture: Gesture | null = null;
const touches = new Map<number, Pos>();
const client = (e: PointerEvent): Pos => ({ x: e.clientX, y: e.clientY });

function pinchState(): { dist: number; mid: Pos } {
  const [a, b] = [...touches.values()];
  return { dist: Math.hypot(a.x - b.x, a.y - b.y) || 1, mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } };
}

function endGesture(cancelled: boolean) {
  if (!gesture || !scene) { gesture = null; return; }
  if (gesture.kind === "person" && gesture.dragging) scene.release();
  if (gesture.kind === "lasso") scene.lasso = null;
  if (cancelled) gesture = null;
}

function onPointerDown(e: PointerEvent) {
  if (!scene || !canvas.value) return;
  if (e.pointerType === "touch") {
    touches.set(e.pointerId, client(e));
    if (touches.size === 2) {
      // a second finger: whatever the first was doing becomes a pinch
      cancelLongPress();
      endGesture(true);
      gesture = { kind: "pinch", ...pinchState() };
      return;
    }
    if (touches.size > 2) return;
  }
  if (e.button === 1) {
    e.preventDefault();
    gesture = { kind: "pan", last: client(e) };
    canvas.value.setPointerCapture(e.pointerId);
    return;
  }
  if (e.button !== 0) return;
  closeMenu();
  canvas.value.setPointerCapture(e.pointerId);
  const world = scene.toWorld(e.clientX, e.clientY);
  const id = scene.personAt(world.x, world.y);
  const additive = e.shiftKey || e.ctrlKey || e.metaKey;

  if (id) {
    let collapseOnClick = false;
    if (additive) {
      if (selectedIds.value.includes(id)) {
        setSelection(selectedIds.value.filter((x) => x !== id));
        return; // taken out of the selection: nothing to drag
      }
      setSelection([...selectedIds.value, id], id);
    } else if (selectedIds.value.includes(id)) {
      // pressing someone in a group keeps the group (to drag it); a plain click narrows it to them
      collapseOnClick = selectedIds.value.length > 1;
      selectedId.value = id;
    } else {
      setSelection([id], id);
    }
    gesture = { kind: "person", id, start: client(e), startWorld: world, dragging: false, collapseOnClick };
  } else if (e.pointerType === "touch" && !additive) {
    gesture = { kind: "pan", last: client(e) };
  } else {
    gesture = { kind: "lasso", start: client(e), points: [world], additive };
  }
  if (e.pointerType !== "mouse") startLongPress(e);
}

function onPointerMove(e: PointerEvent) {
  if (!scene || !canvas.value) return;
  if (e.pointerType === "touch" && touches.has(e.pointerId)) touches.set(e.pointerId, client(e));
  if (longPress && Math.hypot(e.clientX - longPress.x, e.clientY - longPress.y) > 10) cancelLongPress();

  if (!gesture) {
    const p = scene.toWorld(e.clientX, e.clientY);
    canvas.value.style.cursor = scene.personAt(p.x, p.y) ? "grab" : "default";
    return;
  }
  if (gesture.kind === "pinch") {
    if (touches.size < 2) return;
    const now = pinchState();
    const at = scene.toCanvas(now.mid.x, now.mid.y);
    scene.zoomTo(scene.zoom * (now.dist / gesture.dist), at.x, at.y);
    scene.panBy(now.mid.x - gesture.mid.x, now.mid.y - gesture.mid.y);
    gesture.dist = now.dist;
    gesture.mid = now.mid;
  } else if (gesture.kind === "pan") {
    scene.panBy(e.clientX - gesture.last.x, e.clientY - gesture.last.y);
    gesture.last = client(e);
    canvas.value.style.cursor = "grabbing";
  } else if (gesture.kind === "person") {
    if (!gesture.dragging && Math.hypot(e.clientX - gesture.start.x, e.clientY - gesture.start.y) > 4) {
      gesture.dragging = true;
      scene.hold(selectedIds.value.includes(gesture.id) ? selectedIds.value : [gesture.id], gesture.startWorld);
      canvas.value.style.cursor = "grabbing";
    }
    if (gesture.dragging) scene.dragTo(scene.toWorld(e.clientX, e.clientY));
  } else if (gesture.kind === "lasso") {
    const last = gesture.points[gesture.points.length - 1];
    const p = scene.toWorld(e.clientX, e.clientY);
    if (Math.hypot(p.x - last.x, p.y - last.y) * scene.zoom > 3) {
      gesture.points.push(p);
      scene.lasso = gesture.points;
    }
  }
}

function onPointerUp(e: PointerEvent) {
  touches.delete(e.pointerId);
  cancelLongPress();
  if (!gesture || !scene) return;
  if (gesture.kind === "pinch") {
    if (touches.size < 2) gesture = null;
    return;
  }
  const g = gesture;
  endGesture(false);
  gesture = null;
  if (canvas.value) canvas.value.style.cursor = "default";
  if (g.kind === "person" && !g.dragging && g.collapseOnClick) setSelection([g.id], g.id);
  if (g.kind === "lasso") {
    const moved = Math.hypot(e.clientX - g.start.x, e.clientY - g.start.y) > 6;
    if (moved && g.points.length > 2) {
      const inside = scene.peopleInside(g.points);
      setSelection(g.additive ? [...selectedIds.value, ...inside] : inside);
      if (inside.length > 1) notify(`Selected ${inside.length} people: drag any of them to move the group`);
    } else if (!g.additive) {
      setSelection([], null); // a click on empty space deselects
    }
  }
}

function onPointerCancel(e: PointerEvent) {
  touches.delete(e.pointerId);
  cancelLongPress();
  endGesture(true);
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
      endGesture(true);
      onContextMenu({ clientX, clientY, preventDefault() {} } as MouseEvent);
    }, 550),
  };
}
function cancelLongPress() {
  if (longPress) clearTimeout(longPress.timer);
  longPress = null;
}

function onDoubleClick(e: MouseEvent) {
  if (!scene) return;
  const p = scene.toWorld(e.clientX, e.clientY);
  const id = scene.personAt(p.x, p.y);
  if (id) {
    setSelection([id], id);
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
  const at = scene.toWorld(e.clientX, e.clientY);
  const personId = scene.personAt(at.x, at.y);
  if (personId && !selectedIds.value.includes(personId)) setSelection([personId], personId);
  else if (personId) selectedId.value = personId;
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
  if (e.key === "Escape") {
    if (menu.value) closeMenu();
    else if (selectedIds.value.length > 1) setSelection(selectedId.value ? [selectedId.value] : []);
  }
  const t = e.target as HTMLElement | null;
  if (e.ctrlKey || e.metaKey || e.altKey || t?.closest("input, textarea, select, [contenteditable]")) return;
  if (e.key === "+" || e.key === "=") zoomBy(1.25);
  else if (e.key === "-" || e.key === "_") zoomBy(0.8);
  else if (e.key === "0") fitToDisplay();
}

// ---- lifecycle ------------------------------------------------------------

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  const area = stageEl.value!;
  scene = markRaw(new PedigreeScene(canvas.value!, pedigree, engineName.value));
  scene.resize(area.clientWidth, area.clientHeight);
  scene.selection = new Set(selectedIds.value);
  scene.onViewChange = (z, fit) => {
    zoom.value = z;
    fitting.value = fit;
  };
  scene.onProblemsChange = (n) => (lineProblems.value = n);
  scene.rebuild(false);
  resizeObserver = new ResizeObserver(() => scene?.resize(area.clientWidth, area.clientHeight));
  resizeObserver.observe(area);
  if (selectedId.value) focusPerson();
  window.addEventListener("pointerdown", onWindowPointerDown, true);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("resize", closeMenu);
  window.addEventListener("blur", closeMenu);
});
onBeforeUnmount(() => {
  cancelLongPress();
  resizeObserver?.disconnect();
  scene?.stop();
  window.removeEventListener("pointerdown", onWindowPointerDown, true);
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("resize", closeMenu);
  window.removeEventListener("blur", closeMenu);
});
</script>

<template>
  <div class="workspace">
    <section class="stage-wrap" :class="{ dropping }" @dragover="onDragOver" @dragleave="dropping = false" @drop="onDrop">
      <div ref="stageEl" class="canvas-area">
        <canvas
          ref="canvas"
          width="900"
          height="620"
          aria-label="Pedigree chart. Drag people to rearrange; drag on empty space to select a group; right-click for options."
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerCancel"
          @dblclick="onDoubleClick"
          @contextmenu="onContextMenu"
          @wheel="onWheel"
        />
      </div>
      <p class="hint">
        <span class="mouse">Drag people to move them · drag on empty space to lasso a group, shift-click to add · right-click for options · scroll to pan, Ctrl+scroll to zoom</span>
        <span class="touch">Drag people to move them · drag to pan, pinch to zoom · press and hold for options</span>
      </p>

      <div class="status">
        <div v-if="lineProblems" class="badge warn" role="status">
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M8 1.8 15 14H1z" /><path d="M8 6v4M8 11.6v.4" /></svg>
          {{ lineProblems }} misleading {{ lineProblems === 1 ? "line" : "lines" }}
          <button @click="tidy">Tidy up</button>
        </div>
        <div v-if="othersSelected > 0" class="badge" role="status">
          {{ selectedIds.length }} selected · drag one to move them all
          <button class="link" @click="setSelection(selectedId ? [selectedId] : [])">Clear</button>
        </div>
      </div>

      <div v-if="conditionsInUse.length" class="key" aria-label="Key">
        <div class="key-title">Key</div>
        <div v-for="c in conditionsInUse" :key="c.id" class="key-row">
          <span class="swatch" :style="{ background: c.color }" aria-hidden="true" />{{ c.name }}
        </div>
        <div v-if="hasCarriers" class="key-row">
          <span class="swatch carrier-swatch" aria-hidden="true" />Carrier (unaffected)
        </div>
      </div>

      <div class="zoom" role="toolbar" aria-label="Zoom">
        <button title="Zoom in (+)" aria-label="Zoom in" :disabled="zoom >= MAX_ZOOM" @click="zoomBy(1.25)">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 3v10M3 8h10" /></svg>
        </button>
        <button class="zoom-level" title="Actual size (100%)" aria-label="Zoom level; click for actual size" @click="actualSize">{{ Math.round(zoom * 100) }}%</button>
        <button title="Zoom out (−)" aria-label="Zoom out" :disabled="zoom <= MIN_ZOOM" @click="zoomBy(0.8)">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h10" /></svg>
        </button>
        <button :class="{ on: fitting }" title="Fit to display (0)" aria-label="Fit to display" :aria-pressed="fitting" @click="fitToDisplay">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" /></svg>
        </button>
      </div>
      <div v-if="dropping" class="drop-hint" aria-hidden="true">Drop a pedigree .json file to open it</div>
    </section>

    <aside class="sidebar">
      <!-- Pedigree-wide actions -->
      <SidePanel id="pedigree.actions" ref="actionsPanel" title="Pedigree" @opened="onOtherPanelOpened">
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
        <div class="button-row">
          <button title="Open a pedigree saved as a .json file (or drop one on the chart)" @click="openFile">Open file…</button>
          <button :disabled="!pedigree.people.length" title="Save the pedigree as a .json file you can open again later" @click="saveFile">Save file</button>
          <button :disabled="savingPdf || !pedigree.people.length" @click="savePdf">
            {{ savingPdf ? "Saving…" : "Save as PDF" }}
          </button>
        </div>
        <input ref="fileInput" type="file" accept=".json,application/json" hidden @change="onFileChosen" />
        <label class="engine">
          Animation engine
          <select v-model="engineName">
            <option value="matter">Matter (physics)</option>
            <option value="spring">Spring</option>
            <option value="mock">Mock (no physics)</option>
          </select>
        </label>
      </SidePanel>

      <!-- Selected person: kept compact so it fits without scrolling -->
      <SidePanel id="pedigree.person" ref="personPanel" :title="selected ? label(selected.id) : 'Person'">
        <template v-if="selected && relations" #actions>
          <button
            class="link danger-text"
            :disabled="!!relations.children.length"
            :title="relations.children.length ? 'People with children can\'t be deleted; remove the children first' : 'Delete ' + label(selected.id)"
            @click="removePerson(selected.id)"
          >
            Delete
          </button>
          <button class="link" @click="selectedId = null">Deselect</button>
        </template>
        <p v-if="!selected || !relations" class="help">Select someone on the chart or in the People list to edit them.</p>
        <template v-else>
          <div class="id-row">
            <input ref="nameInput" v-model.trim="selected.name" class="name" type="text" placeholder="Name" aria-label="Name" maxlength="40" />
            <label class="age">
              Age
              <input type="number" min="0" max="130" :value="selected.age ?? ''" placeholder="—" @input="setAge(selected, ($event.target as HTMLInputElement).value)" />
            </label>
          </div>

          <div class="toggle-row">
            <div class="segmented sex" role="radiogroup" aria-label="Sex">
              <label v-for="s in SEXES" :key="s.value" :class="{ on: selected.sex === s.value }" :title="s.label">
                <input type="radio" name="sex" :value="s.value" :aria-label="s.label" :checked="selected.sex === s.value" @change="setSex(selected.id, s.value)" />
                <span class="sym" :class="s.value" aria-hidden="true" />
              </label>
            </div>
            <label class="pill" :class="{ on: selected.deceased }">
              <input v-model="selected.deceased" type="checkbox" />
              Deceased
            </label>
            <label class="pill" :class="{ on: selected.proband }">
              <input type="checkbox" :checked="selected.proband" @change="toggleProband(selected.id)" />
              Proband
            </label>
          </div>

          <div class="conditions" role="group" aria-label="Conditions">
            <div v-for="c in CONDITIONS" :key="c.id" class="condition-row">
              <span class="swatch" :style="{ background: c.color }" aria-hidden="true" />
              <label :for="'status-' + c.id" class="condition-name" :title="c.name + ' (' + c.inheritance + ')'">
                {{ c.name }} <abbr class="inherit" :title="c.inheritance">{{ inheritanceShort(c.inheritance) }}</abbr>
              </label>
              <select
                :id="'status-' + c.id"
                :value="conditionStatus(selected, c.id)"
                :class="'status-' + conditionStatus(selected, c.id)"
                @change="setConditionStatus(selected.id, c.id, ($event.target as HTMLSelectElement).value as ConditionStatus)"
              >
                <option v-for="st in STATUSES" :key="st.value" :value="st.value">{{ st.label }}</option>
              </select>
            </div>
          </div>

          <dl v-if="relationRows.length" class="relations">
            <template v-for="[title, ids] in relationRows" :key="title">
              <dt>{{ title }}</dt>
              <dd>
                <button v-for="id in ids" :key="id" class="chip" @click="selectedId = id">
                  <span class="sym" :class="[pedigree.find(id)?.sex, { deceased: pedigree.find(id)?.deceased }]" :style="symFill(id)" aria-hidden="true" />{{ label(id) }}
                </button>
              </dd>
            </template>
          </dl>
          <p v-else class="help">No relatives yet.</p>

          <div class="add-row">
            <span class="add-label">Add</span>
            <button :disabled="!!relations.parents.length" @click="addParents(selected.id)">Parents</button>
            <button @click="addSibling(selected.id, 'male')">Brother</button>
            <button @click="addSibling(selected.id, 'female')">Sister</button>
          </div>
          <div class="add-row child">
            <button @click="addChild(selected.id, childPartner === 'new' ? null : childPartner, 'male')">Son</button>
            <button @click="addChild(selected.id, childPartner === 'new' ? null : childPartner, 'female')">Daughter</button>
            <label v-if="relations.partners.length" class="child-with">
              with
              <select v-model="childPartner">
                <option v-for="id in relations.partners" :key="id" :value="id">{{ label(id) }}</option>
                <option value="new">a new partner</option>
              </select>
            </label>
          </div>
        </template>
      </SidePanel>

      <!-- Everyone, by generation -->
      <SidePanel id="pedigree.people" ref="peoplePanel" title="People" @opened="onOtherPanelOpened" :count="pedigree.people.length">
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
      <SidePanel id="pedigree.trios" ref="triosPanel" title="Triplets" @opened="onOtherPanelOpened" :count="pedigree.trios.length" :default-open="false">
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
        <button role="menuitem" @click="pick(() => selectBranch(menuPerson!.id))">Select branch <span class="ctx-note">to move it</span></button>
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
        <button role="menuitem" @click="pick(tidy)">Tidy up lines</button>
        <button role="menuitem" @click="pick(relayout)">Re-layout</button>
        <button role="menuitem" @click="pick(fitToDisplay)">Fit to display</button>
        <button role="menuitem" @click="pick(loadExample)">Load example</button>
        <hr />
        <button role="menuitem" :disabled="!pedigree.people.length" @click="pick(savePdf)">Save as PDF</button>
      </template>
    </div>

    <div v-if="toast" class="toast" role="status">{{ toast }}</div>
  </div>
</template>

<style scoped>
/* the canvas fills the chart area; the scene pans and zooms inside it */
.stage-wrap { position: relative; }
.canvas-area {
  flex: 1; min-height: 0; position: relative; overflow: hidden; margin: 14px 14px 0;
  background: var(--surface); border: 1px solid var(--border); border-radius: 10px;
  box-shadow: 0 1px 2px rgba(31, 35, 40, 0.06);
}
.canvas-area canvas {
  position: absolute; inset: 0; display: block; touch-action: none; user-select: none; -webkit-touch-callout: none;
}
.stage-wrap .hint { margin: 6px 14px 8px; }

/* status badges float over the top-left of the chart */
.status { position: absolute; top: 24px; left: 24px; z-index: 5; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; pointer-events: none; }
.badge {
  pointer-events: auto; display: flex; align-items: center; gap: 8px; font-size: 12px;
  background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 4px 6px 4px 10px;
  box-shadow: 0 2px 8px rgba(31, 35, 40, 0.1);
}
.badge.warn { border-color: #fca5a5; background: #fef2f2; color: #991b1b; }
.badge.warn svg { fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linejoin: round; stroke-linecap: round; }
.workspace .badge button { padding: 2px 8px; font-size: 12px; }
.workspace .badge.warn button { background: #fff; border-color: #fca5a5; color: #991b1b; }
.ctx-note { color: #9ca3af; font-size: 11px; margin-left: 6px; }

/* zoom controls float over the bottom-right of the chart */
.zoom {
  position: absolute; right: 24px; bottom: 48px; z-index: 5;
  display: flex; flex-direction: column; align-items: stretch;
  background: var(--surface); border: 1px solid var(--border); border-radius: 10px;
  box-shadow: 0 4px 14px rgba(31, 35, 40, 0.12); overflow: hidden;
}
.workspace .zoom button {
  border: 0; border-radius: 0; background: none; padding: 0; width: 44px; height: 36px;
  display: grid; place-items: center; color: var(--text);
}
.workspace .zoom button + button { border-top: 1px solid var(--border); }
.workspace .zoom button:hover:not(:disabled) { background: var(--hover); }
.workspace .zoom button.on { color: var(--accent); }
.workspace .zoom .zoom-level { font-size: 11px; height: 28px; color: var(--muted); font-variant-numeric: tabular-nums; }
.zoom svg { fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.drop-hint {
  position: absolute; inset: 12px; display: grid; place-items: center; pointer-events: none;
  border: 2px dashed var(--accent); border-radius: 12px; background: rgba(238, 242, 255, 0.85);
  color: #1d4ed8; font-weight: 600; z-index: 6;
}
/* the key stays in the chart area's corner however the chart is zoomed or scrolled */
.key {
  position: absolute; top: 24px; right: 24px; z-index: 4;
  background: rgba(255, 255, 255, 0.92); border: 1px solid var(--border); border-radius: 8px;
  padding: 6px 10px; font-size: 12px; display: flex; flex-direction: column; gap: 3px;
  pointer-events: none;
}
.key-title { font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--muted); }
.key-row { display: flex; align-items: center; gap: 6px; white-space: nowrap; }
.swatch { display: inline-block; width: 11px; height: 11px; border: 1.5px solid #1f2937; flex: none; }

.conditions { display: flex; flex-direction: column; gap: 3px; }
.condition-row { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 8px; font-size: 13px; color: var(--text); }
.condition-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.workspace .condition-row select { font-size: 12px; padding: 2px 4px; }
.condition-row select.status-affected { border-color: #1f2937; font-weight: 600; }
.condition-row select.status-carrier { border-style: dashed; border-color: #1f2937; }
/* white square with a centre dot: how carriers look on the chart */
.carrier-swatch { background: radial-gradient(circle, var(--dot, #1f2937) 0 2.2px, transparent 2.8px) #fff; }
.inherit { font-size: 10px; color: var(--muted); text-decoration: none; letter-spacing: 0.03em; }

.engine { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: #57606a; }

h3 { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--muted); margin: 6px 0 4px; }

/* person panel: name and age on one line, sex and flags on the next */
.id-row { display: flex; gap: 8px; align-items: center; }
.workspace .id-row .name { flex: 1; min-width: 0; font-size: 14px; font-weight: 600; }
.id-row .age { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--muted); }
.workspace .id-row .age input { width: 4em; }
.toggle-row { display: flex; gap: 6px; align-items: stretch; flex-wrap: wrap; }
.segmented.sex label { flex: none; width: 32px; padding: 5px 0; }
.pill {
  display: flex; align-items: center; gap: 5px; font-size: 12px; cursor: pointer;
  border: 1px solid var(--border); border-radius: 6px; padding: 3px 9px 3px 7px; background: #fff;
}
.pill.on { background: var(--accent-soft); border-color: #c7d2fe; color: #1d4ed8; font-weight: 600; }
.pill input { margin: 0; }

/* pedigree symbols in the UI */
.sym { display: inline-block; width: 10px; height: 10px; border: 1.5px solid #1f2937; background: #fff; flex: none; position: relative; }
.sym.female { border-radius: 50%; }
.sym.unknown { transform: rotate(45deg) scale(0.85); }
.sym.deceased::after {
  content: ""; position: absolute; left: -4px; right: -4px; top: 50%; border-top: 1.5px solid #1f2937; transform: rotate(-45deg);
}

.relations { display: grid; grid-template-columns: auto 1fr; gap: 4px 10px; margin: 0; font-size: 12px; }
.relations dt { color: var(--muted); padding-top: 3px; }
.relations dd { margin: 0; display: flex; flex-wrap: wrap; gap: 4px; }
.workspace .chip { display: inline-flex; align-items: center; gap: 5px; padding: 2px 8px; border-radius: 999px; background: #fff; font-size: 12px; }

.add-row { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; border-top: 1px solid #eaeef2; padding-top: 8px; }
.add-label { font-size: 12px; color: var(--muted); width: 26px; }
.workspace .add-row button { padding: 3px 8px; font-size: 12px; }
.add-row.child { border-top: 0; padding-top: 0; margin-top: -6px; padding-left: 30px; }
.child-with { flex: 1; min-width: 0; display: flex; align-items: center; gap: 6px; font-size: 12px; color: #57606a; }
.child-with select { flex: 1; min-width: 0; }

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

/* phone-width (stacked) layout: key and zoom controls sit below the chart instead of over it */
@media (max-width: 1000px) {
  .stage-wrap { height: 70vh; min-height: 360px; }
  .key { position: static; flex-direction: row; flex-wrap: wrap; gap: 4px 12px; margin: 0 16px 8px; align-items: center; }
  .zoom { position: static; flex-direction: row; align-self: flex-end; margin: 0 16px 12px; }
  .workspace .zoom button + button { border-top: 0; border-left: 1px solid var(--border); }
  .workspace .zoom .zoom-level { height: 36px; width: 52px; }
}
</style>
