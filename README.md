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

Pick an engine and a test, then hit **Run**. Drag nodes on the canvas with the mouse.

## Other scripts

```sh
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
npm run typecheck
```

## Layout

- `source/connectiongraph/` – the engine/world/display library (framework-free TypeScript)
- `source/pedigree/` – pedigree graph built on top of it
- `source/connectiongraph/world/tests/` – the demo scenes listed in the UI
- `src/` – the Vue 3 demo app
