# connectiongraph

TypeScript module for animated graphs of connected nodes, with pluggable
physics engines (`matter`, `spring`, `mock`) and a Vue 3 demo front end.

## Requirements

Node 20+ (`nvm use` picks up `.nvmrc`).

## Run

```sh
npm install
npm run dev        # http://localhost:5173
```

The app has two demos, as tabs at the top:

**Pedigree** (the default page, `#pedigree`) is described below.

**Graph tests** (`#tests`) – the library's own scenes: shapes joined by
connectors, animated by a physics engine. Pick a scene and an engine in the sidebar; drag
shapes with the mouse.

The pedigree editor is built on the library:

- Right-click a person for sex / deceased / proband, add parents, siblings,
  sons or daughters (with an existing or new partner), or delete.
- Right-click (or double-click) empty space to add an unconnected person.
- The sidebar edits the selected person (name, sex, age, deceased, proband),
  lists everyone by generation, and shows the underlying triplets with
  JSON export/import.
- Drag people to rearrange them; **Re-layout** tidies everything up.
- **Save as PDF** (sidebar, or right-click the background) downloads the
  chart with a title, summary and symbol legend, plus a table of everyone.

### Pedigree data model

A pedigree is `people` plus `trios` (triplets): each trio is
`{ childId, motherId, fatherId }`. Couples, sibships and generations are
all derived from the trios (`source/pedigree/pedigree.ts`).

## Other scripts

```sh
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
npm run typecheck
```

## Layout

- `source/connectiongraph/` – the engine/world/display library (framework-free TypeScript)
- `source/pedigree/` – the pedigree model and its scene (layout, row ordering, drawing)
- `source/connectiongraph/world/tests/` – the demo scenes listed in the UI
- `src/` – the Vue 3 demo app
