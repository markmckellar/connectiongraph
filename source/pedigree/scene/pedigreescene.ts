import { WorldEngine } from "../../connectiongraph/engine/worldengine";
import { WorldEngineParams } from "../../connectiongraph/engine/worldengineparams";
import { MatterEngine } from "../../connectiongraph/engine/matterengine/matterengine";
import { MockEngine } from "../../connectiongraph/engine/mockengine/mockengine";
import { SpringEngine } from "../../connectiongraph/engine/springengine/springengine";
import { WorldOfWorldObjects } from "../../connectiongraph/world/worldofworldobjects";
import { CanvasHolderHTML } from "../../connectiongraph/display/canvas/canvasholderhtml";
import { WorldId } from "../../connectiongraph/world/worldid";
import { WorldPosition } from "../../connectiongraph/world/worldposition";
import { EngineShape } from "../../connectiongraph/engine/shapes/engineshape";
import { Pedigree } from "../pedigree";
import { NullDrawable, PersonDisplay } from "./persondisplay";
import { PedigreeLayout } from "./pedigreelayout";
import { orderRows } from "./roworder";

export type EngineName = "matter" | "spring" | "mock";

/**
 * Shows a Pedigree on a canvas, one engine shape per person, laid out by
 * PedigreeLayout. The engine can't remove shapes, so structural edits call
 * rebuild(), which starts a fresh world but keeps everyone where they were;
 * newcomers appear next to their relatives and animate into place.
 */
export class PedigreeScene {
    public readonly size = 36;
    public selectedId: string | null = null;

    private engine?: WorldEngine;
    private canvasHolder?: CanvasHolderHTML;
    private layout?: PedigreeLayout;
    private shapes = new Map<string, EngineShape>();
    private frame: number | null = null;

    constructor(private canvas: HTMLCanvasElement, private pedigree: Pedigree, public engineName: EngineName = "matter") {
    }

    /**
     * (Re)create the world from the pedigree.
     * @param keepPositions keep existing people where they are (false = lay out from scratch)
     * @param placeAt starting positions for specific (usually new) people
     */
    public rebuild(keepPositions = true, placeAt: Map<string, { x: number, y: number }> = new Map()): void {
        const previous = keepPositions ? this.positions() : new Map<string, { x: number, y: number }>();
        this.stop();

        const params: WorldEngineParams = { mouseDrawableShape: new NullDrawable(), updateFunction: () => { }, updateInterval: 33 };
        const engine: WorldEngine = this.engineName === "spring" ? new SpringEngine(params)
            : this.engineName === "mock" ? new MockEngine(params) : new MatterEngine(params);
        const world = new WorldOfWorldObjects(engine);
        const canvasHolder = new CanvasHolderHTML(this.canvas, world);
        this.engine = engine;
        this.canvasHolder = canvasHolder;

        const generations = this.pedigree.generations();
        const rowY = (g: number) => 60 + g * 130;

        // where everyone starts: kept people stay put, newcomers appear by their relatives
        const placed = new Map(previous);
        for (const [id, p] of placeAt) placed.set(id, p);
        let rowOrder: Map<number, string[]>;
        if (keepPositions) {
            const known = [...this.pedigree.people].sort((a, b) => Number(placed.has(b.id)) - Number(placed.has(a.id)));
            for (const p of known)
                if (!placed.has(p.id)) placed.set(p.id, this.spawnNear(p.id, placed, rowY(generations.get(p.id) ?? 0)));
            rowOrder = orderRows(this.pedigree, generations, new Map([...placed].map(([id, p]) => [id, p.x])));
        }
        else {
            rowOrder = orderRows(this.pedigree, generations);
            for (const [g, ids] of rowOrder) {
                const step = this.size + 60;
                ids.forEach((id, i) => placed.set(id, { x: this.canvas.width / 2 + (i - (ids.length - 1) / 2) * step, y: rowY(g) }));
            }
        }

        const layout = new PedigreeLayout(this.pedigree, this.shapes, generations, rowOrder, {
            width: this.canvas.width, size: this.size, rowTop: 60, rowSpacing: 130,
        });
        this.layout = layout;

        for (const person of this.pedigree.people) {
            const id = person.id;
            const at = placed.get(id)!;
            const shape = engine.createRectangle(
                new WorldId(id),
                new PersonDisplay(() => this.pedigree.find(id), () => this.selectedId === id, this.size),
                this.size, this.size,
                new WorldPosition(at.x, at.y),
                { frictionAir: 0.3 });
            shape.stopRotation();
            this.shapes.set(id, shape);
            world.addWorldObject(shape);
        }

        engine.areaRuleObjectArray.push(layout);
        world.backgroundDrawers.push(ctx => layout.drawBackground(ctx));
        engine.createBounds(this.canvas.width, this.canvas.height, { restitution: 0.2 });
        engine.startEngine();

        const draw = () => {
            world.drawWorld(canvasHolder);
            this.frame = requestAnimationFrame(draw);
        };
        this.frame = requestAnimationFrame(draw);
    }

    public stop(): void {
        if (this.frame !== null) cancelAnimationFrame(this.frame);
        this.frame = null;
        this.engine?.stopEngine();
        this.canvasHolder?.dispose();
        this.engine = undefined;
        this.canvasHolder = undefined;
        this.shapes = new Map();
    }

    public positions(): Map<string, { x: number, y: number }> {
        const out = new Map<string, { x: number, y: number }>();
        for (const [id, shape] of this.shapes) {
            const p = shape.getWorldPosition();
            out.set(id, { x: p.x, y: p.y });
        }
        return out;
    }

    /** Which person (if any) is at this canvas position. Generous hit area, for touch and labels. */
    public personAt(x: number, y: number): string | null {
        let best: string | null = null, bestDist = this.size * 0.8;
        for (const [id, shape] of this.shapes) {
            const p = shape.getWorldPosition();
            const d = Math.hypot(p.x - x, p.y - y);
            if (d < bestDist) { best = id; bestDist = d; }
        }
        return best;
    }

    private spawnNear(id: string, placed: Map<string, { x: number, y: number }>, rowY: number): { x: number, y: number } {
        const ped = this.pedigree;
        const trio = ped.parentsOf(id);
        const relatives = [
            ...(trio ? [trio.motherId, trio.fatherId] : []),
            ...ped.partnersOf(id),
            ...ped.childrenOf(id),
            ...ped.siblingsOf(id),
        ].map(r => placed.get(r)).filter((p): p is { x: number, y: number } => !!p);
        const jitter = (Math.random() - 0.5) * 40;
        const x = relatives.length ? relatives.reduce((t, p) => t + p.x, 0) / relatives.length : this.canvas.width / 2;
        return { x: x + jitter, y: rowY };
    }
}
