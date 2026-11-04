import { WorldEngine } from "../../connectiongraph/engine/worldengine";
import { WorldEngineParams } from "../../connectiongraph/engine/worldengineparams";
import { MatterEngine } from "../../connectiongraph/engine/matterengine/matterengine";
import { MockEngine } from "../../connectiongraph/engine/mockengine/mockengine";
import { SpringEngine } from "../../connectiongraph/engine/springengine/springengine";
import { WorldOfWorldObjects } from "../../connectiongraph/world/worldofworldobjects";
import { CanvasHolderHTML } from "../../connectiongraph/display/canvas/canvasholderhtml";
import { WorldId } from "../../connectiongraph/world/worldid";
import { WorldPosition } from "../../connectiongraph/world/worldposition";
import { LineProblem, PedigreeLayoutOptions } from "./pedigreelayout";
import { EngineShape } from "../../connectiongraph/engine/shapes/engineshape";
import { Pedigree } from "../pedigree";
import { labelWidth, NullDrawable, PersonDisplay } from "./persondisplay";
import { PedigreeLayout } from "./pedigreelayout";
import { orderRows } from "./roworder";

export type EngineName = "matter" | "spring" | "mock";

type Point = { x: number, y: number };

/** World x the layout centres the pedigree on, and its first row's y. */
const WORLD_WIDTH = 900, ROW_TOP = 60, ROW_SPACING = 130;
export const MIN_ZOOM = 0.15, MAX_ZOOM = 4;
/** Fitting never zooms in further than this, so a small family isn't drawn huge. */
const MAX_FIT_ZOOM = 1.5;

/**
 * Shows a Pedigree on a canvas, one engine shape per person, laid out by
 * PedigreeLayout. The engine can't remove shapes, so structural edits call
 * rebuild(), which starts a fresh world but keeps everyone where they were;
 * newcomers appear next to their relatives and animate into place.
 *
 * The canvas is a window onto the world with its own pan and zoom. While
 * `fitting` is on, the view follows the pedigree, keeping it centred and
 * all on screen (zoomed out if it has to be).
 *
 * Pointer input is the page's job; it calls hold()/dragTo()/release() to move
 * people (several at once, for a selection), and sets `lasso` to show one.
 */
export class PedigreeScene {
    public readonly size = 36;
    /** Everyone highlighted as selected. */
    public selection = new Set<string>();
    /** A lasso being drawn, in world coordinates. */
    public lasso: Point[] | null = null;
    /** Keep the whole pedigree centred and on screen. Manual zooming or panning turns this off. */
    public fitting = true;
    /** Called when the zoom level or `fitting` changes. */
    public onViewChange?: (zoom: number, fitting: boolean) => void;
    /** Called when the number of misleading lines changes (see PedigreeLayout.problems). */
    public onProblemsChange?: (count: number) => void;

    private engine?: WorldEngine;
    private canvasHolder?: CanvasHolderHTML;
    private layout?: PedigreeLayout;
    private shapes = new Map<string, EngineShape>();
    private generations = new Map<string, number>();
    private layoutOptions?: PedigreeLayoutOptions;
    private frame: number | null = null;
    private view = { scale: 1, x: 0, y: 0 };
    private snapNextFit = true;
    private held: { offsets: Map<string, Point> } | null = null;
    private problems: LineProblem[] = [];
    private reportedProblems = -1;
    private stillFrames = 0;
    private frameCount = 0;

    constructor(private canvas: HTMLCanvasElement, private pedigree: Pedigree, public engineName: EngineName = "matter") {
    }

    /**
     * (Re)create the world from the pedigree.
     * @param keepPositions keep existing people where they are (false = lay out from scratch)
     * @param placeAt starting positions for specific (usually new) people
     */
    public rebuild(keepPositions = true, placeAt: Map<string, Point> = new Map()): void {
        const previous = keepPositions ? this.positions() : new Map<string, Point>();
        this.stop();
        if (!keepPositions) this.snapNextFit = true;

        const params: WorldEngineParams = { mouseDrawableShape: new NullDrawable(), updateFunction: () => { }, updateInterval: 33 };
        const engine: WorldEngine = this.engineName === "spring" ? new SpringEngine(params)
            : this.engineName === "mock" ? new MockEngine(params) : new MatterEngine(params);
        const world = new WorldOfWorldObjects(engine);
        const canvasHolder = new CanvasHolderHTML(this.canvas, world, { hiDpi: true, mouse: false });
        this.engine = engine;
        this.canvasHolder = canvasHolder;
        this.applyView();

        const generations = this.pedigree.generations();
        const rowY = (g: number) => ROW_TOP + g * ROW_SPACING;

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
                ids.forEach((id, i) => placed.set(id, { x: WORLD_WIDTH / 2 + (i - (ids.length - 1) / 2) * step, y: rowY(g) }));
            }
        }

        this.generations = generations;
        this.layoutOptions = { width: WORLD_WIDTH, size: this.size, rowTop: ROW_TOP, rowSpacing: ROW_SPACING };
        const layout = new PedigreeLayout(this.pedigree, this.shapes, generations, rowOrder, this.layoutOptions);
        this.layout = layout;

        for (const person of this.pedigree.people) {
            const id = person.id;
            const at = placed.get(id)!;
            const shape = engine.createRectangle(
                new WorldId(id),
                new PersonDisplay(() => this.pedigree.find(id), () => this.selection.has(id), this.size),
                this.size, this.size,
                new WorldPosition(at.x, at.y),
                { frictionAir: 0.3 });
            shape.stopRotation();
            this.shapes.set(id, shape);
            world.addWorldObject(shape);
        }

        engine.areaRuleObjectArray.push(layout);
        world.backgroundDrawers.push(ctx => layout.drawBackground(ctx, this.bounds().left));
        engine.startEngine();
        this.problems = [];
        this.stillFrames = 0;

        const draw = () => {
            this.tick(layout);
            world.drawWorld(canvasHolder);
            this.drawOverlay(canvasHolder.getContext());
            this.frame = requestAnimationFrame(draw);
        };
        this.frame = requestAnimationFrame(draw);
    }

    /** Per-frame upkeep: follow the pedigree with the view, and look for misleading lines. */
    private tick(layout: PedigreeLayout): void {
        this.frameCount++;
        if (this.fitting && !this.held && this.shapes.size) this.easeToFit();

        // Check the lines live while people are being dragged (so you see a
        // problem before you let go) and once everything has settled; not
        // while people are gliding into place, when lines cross for a moment.
        const still = layout.motion < 0.2;
        this.stillFrames = still ? this.stillFrames + 1 : 0;
        if (this.held) {
            if (this.frameCount % 5 === 0) this.problems = layout.problems();
        } else if (this.stillFrames === 20) {
            this.problems = layout.problems();
            const count = this.problems.length;
            if (count !== this.reportedProblems) {
                this.reportedProblems = count;
                this.onProblemsChange?.(count);
            }
        } else if (!still && this.problems.length) {
            this.problems = [];
        }
    }

    private drawOverlay(ctx: CanvasRenderingContext2D): void {
        const s = this.view.scale;
        if (this.problems.length) {
            ctx.save();
            ctx.strokeStyle = "rgba(220, 38, 38, 0.9)";
            ctx.fillStyle = "rgba(220, 38, 38, 0.12)";
            ctx.lineWidth = 2.5 / s;
            for (const p of this.problems) {
                ctx.beginPath();
                if (p.kind === "overlap") {
                    ctx.lineWidth = 6 / s;
                    ctx.strokeStyle = "rgba(220, 38, 38, 0.45)";
                    ctx.moveTo(p.x1, p.y1);
                    ctx.lineTo(p.x2, p.y2);
                    ctx.stroke();
                    ctx.lineWidth = 2.5 / s;
                    ctx.strokeStyle = "rgba(220, 38, 38, 0.9)";
                } else {
                    ctx.arc(p.x, p.y, p.kind === "through" ? this.size * 0.8 : 8, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                }
            }
            ctx.restore();
        }
        if (this.lasso && this.lasso.length > 1) {
            ctx.save();
            ctx.beginPath();
            this.lasso.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
            ctx.closePath();
            ctx.fillStyle = "rgba(37, 99, 235, 0.08)";
            ctx.fill();
            ctx.setLineDash([5 / s, 4 / s]);
            ctx.lineWidth = 1.5 / s;
            ctx.strokeStyle = "#2563eb";
            ctx.stroke();
            ctx.restore();
        }
    }

    public stop(): void {
        if (this.frame !== null) cancelAnimationFrame(this.frame);
        this.frame = null;
        this.engine?.stopEngine();
        this.canvasHolder?.dispose();
        this.engine = undefined;
        this.canvasHolder = undefined;
        this.shapes = new Map();
        this.held = null;
    }

    // ---- view -----------------------------------------------------------

    /** Canvas size in CSS pixels. */
    public get width(): number { return Number(this.canvas.dataset.logicalWidth || this.canvas.width); }
    public get height(): number { return Number(this.canvas.dataset.logicalHeight || this.canvas.height); }
    public get zoom(): number { return this.view.scale; }

    /** Make the canvas this size (CSS pixels), e.g. when its container changes size. */
    public resize(width: number, height: number): void {
        if (this.canvasHolder) this.canvasHolder.resize(width, height);
        else {
            this.canvas.dataset.logicalWidth = String(Math.round(width));
            this.canvas.dataset.logicalHeight = String(Math.round(height));
        }
        if (this.fitting) this.snapNextFit = true;
    }

    private applyView(): void {
        this.canvasHolder?.setView(this.view.scale, this.view.x, this.view.y);
    }

    private setView(scale: number, x: number, y: number): void {
        const zoomChanged = Math.round(scale * 100) !== Math.round(this.view.scale * 100);
        this.view = { scale, x, y };
        this.applyView();
        if (zoomChanged) this.onViewChange?.(scale, this.fitting);
    }

    public setFitting(on: boolean): void {
        if (this.fitting === on) return;
        this.fitting = on;
        this.onViewChange?.(this.view.scale, on);
    }

    /** Zoom to `scale`, keeping the world point under canvas pixel (cx, cy) where it is (default: the middle). */
    public zoomTo(scale: number, cx = this.width / 2, cy = this.height / 2): void {
        this.setFitting(false);
        scale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale));
        const wx = (cx - this.view.x) / this.view.scale, wy = (cy - this.view.y) / this.view.scale;
        this.setView(scale, cx - wx * scale, cy - wy * scale);
    }

    /** Move the view by this many canvas pixels. */
    public panBy(dx: number, dy: number): void {
        this.setFitting(false);
        this.setView(this.view.scale, this.view.x + dx, this.view.y + dy);
    }

    /** Start fitting the pedigree to the canvas (and keep doing so); `snap` jumps there instead of gliding. */
    public fit(snap = false): void {
        if (snap) this.snapNextFit = true;
        this.setFitting(true);
    }

    /** The view that shows the whole pedigree, centred. */
    private fitTarget(): { scale: number, x: number, y: number } {
        const b = this.bounds();
        const pad = 24;
        const bw = Math.max(1, b.right - b.left), bh = Math.max(1, b.bottom - b.top);
        const scale = Math.max(MIN_ZOOM, Math.min(MAX_FIT_ZOOM, (this.width - 2 * pad) / bw, (this.height - 2 * pad) / bh));
        return {
            scale,
            x: this.width / 2 - ((b.left + b.right) / 2) * scale,
            y: this.height / 2 - ((b.top + b.bottom) / 2) * scale,
        };
    }

    private easeToFit(): void {
        const t = this.fitTarget(), v = this.view;
        if (this.snapNextFit) {
            this.snapNextFit = false;
            this.setView(t.scale, t.x, t.y);
            return;
        }
        const k = 0.15;
        const close = Math.abs(t.scale - v.scale) < 0.001 && Math.abs(t.x - v.x) < 0.3 && Math.abs(t.y - v.y) < 0.3;
        if (close) { if (t.scale !== v.scale || t.x !== v.x || t.y !== v.y) this.setView(t.scale, t.x, t.y); return; }
        this.setView(v.scale + (t.scale - v.scale) * k, v.x + (t.x - v.x) * k, v.y + (t.y - v.y) * k);
    }

    /** The area the pedigree covers in world coordinates: symbols, labels, proband arrows and generation numerals. */
    public bounds(): { left: number, right: number, top: number, bottom: number } {
        const h = this.size / 2;
        let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
        for (const [id, shape] of this.shapes) {
            const p = shape.getWorldPosition();
            const halfWidth = Math.max(h + 4, labelWidth(this.pedigree.find(id)) / 2);
            left = Math.min(left, p.x - halfWidth - 26);
            right = Math.max(right, p.x + halfWidth);
            top = Math.min(top, p.y - h - 6);
            bottom = Math.max(bottom, p.y + h + 40);
        }
        if (left === Infinity) return { left: 0, right: WORLD_WIDTH, top: 0, bottom: ROW_TOP * 2 };
        return { left: left - 40, right, top, bottom };
    }

    /** World position of a screen (client) position. */
    public toWorld(clientX: number, clientY: number): Point {
        const r = this.canvas.getBoundingClientRect();
        const cx = (clientX - r.left) * this.width / (r.width || this.width);
        const cy = (clientY - r.top) * this.height / (r.height || this.height);
        return { x: (cx - this.view.x) / this.view.scale, y: (cy - this.view.y) / this.view.scale };
    }

    /** Canvas pixel position of a screen (client) position. */
    public toCanvas(clientX: number, clientY: number): Point {
        const r = this.canvas.getBoundingClientRect();
        return { x: (clientX - r.left) * this.width / (r.width || this.width), y: (clientY - r.top) * this.height / (r.height || this.height) };
    }

    // ---- moving people ----------------------------------------------------

    /** Pick these people up at world point `at`; the layout leaves them alone until release(). */
    public hold(ids: Iterable<string>, at: Point): void {
        const offsets = new Map<string, Point>();
        for (const id of ids) {
            const shape = this.shapes.get(id);
            if (!shape) continue;
            const p = shape.getWorldPosition();
            offsets.set(id, { x: p.x - at.x, y: p.y - at.y });
            shape.setSelected(true);
            shape.setAnimated(false);
        }
        this.held = { offsets };
    }

    public dragTo(at: Point): void {
        if (!this.held) return;
        for (const [id, off] of this.held.offsets)
            this.shapes.get(id)?.translate(new WorldPosition(at.x + off.x, at.y + off.y));
    }

    public release(): void {
        if (!this.held) return;
        for (const id of this.held.offsets.keys()) {
            const shape = this.shapes.get(id);
            shape?.setSelected(false);
            shape?.setAnimated(true);
        }
        this.held = null;
        this.stillFrames = 0;
    }

    public get holding(): boolean { return !!this.held; }

    /** Everyone whose symbol is inside the polygon (world coordinates). */
    public peopleInside(polygon: Point[]): string[] {
        const inside = (x: number, y: number) => {
            let ok = false;
            for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                const a = polygon[i], b = polygon[j];
                if ((a.y > y) !== (b.y > y) && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) ok = !ok;
            }
            return ok;
        };
        return [...this.shapes].filter(([, s]) => { const p = s.getWorldPosition(); return inside(p.x, p.y); }).map(([id]) => id);
    }

    /**
     * Re-order the rows to untangle crossing lines, starting from the
     * current arrangement; people glide to their new places.
     */
    public tidy(): void {
        if (!this.layout) return;
        const xs = new Map([...this.positions()].map(([id, p]) => [id, p.x]));
        this.layout.rowOrder = orderRows(this.pedigree, this.generations, xs);
        this.stillFrames = 0;
        this.reportedProblems = -1;
    }

    /**
     * Draw the pedigree onto a fresh canvas, cropped to the people (plus
     * generation numerals), at `scale`x resolution and with no selection
     * highlight. Returns null when there's no one to draw.
     *
     * The layout is first run to completion off-screen, starting from where
     * everyone is now and with no canvas walls, so the picture is the settled
     * chart even if it's still animating or is wider than the screen.
     */
    public snapshot(scale = 3): { canvas: HTMLCanvasElement; width: number; height: number } | null {
        if (!this.layout || !this.layoutOptions || this.shapes.size === 0) return null;
        const h = this.size / 2;

        const points = new Map<string, EngineShape>();
        for (const [id, shape] of this.shapes) {
            const p = shape.getWorldPosition();
            points.set(id, new FreePoint(p.x, p.y) as unknown as EngineShape);
        }
        const rowOrder = new Map([...this.layout.rowOrder].map(([g, ids]) => [g, [...ids]]));
        // start each row spread out in its order (around where it is now), so the
        // layout only has to fine-tune rather than untangle a crowded canvas
        for (const ids of rowOrder.values()) {
            const present = ids.filter(id => points.has(id));
            if (!present.length) continue;
            const centre = present.reduce((t, id) => t + points.get(id)!.getWorldPosition().x, 0) / present.length;
            const step = this.size + 60;
            present.forEach((id, i) => {
                const p = points.get(id)!.getWorldPosition();
                points.get(id)!.translate(new WorldPosition(centre + (i - (present.length - 1) / 2) * step, p.y));
            });
        }
        const layout = new PedigreeLayout(this.pedigree, points, this.generations, rowOrder, this.layoutOptions);
        for (let i = 0; i < 600; i++) layout.processAllRules();
        const displays = [...points].map(([id, point]) => {
            const d = new PersonDisplay(() => this.pedigree.find(id), () => false, this.size);
            d.init(point, {});
            return d;
        });

        let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
        for (const [id, point] of points) {
            const p = point.getWorldPosition();
            const halfWidth = Math.max(h + 4, labelWidth(this.pedigree.find(id)) / 2);
            left = Math.min(left, p.x - halfWidth - 26);   // room for a proband arrow
            right = Math.max(right, p.x + halfWidth);
            top = Math.min(top, p.y - h - 6);
            bottom = Math.max(bottom, p.y + h + 40);       // name and age underneath
        }
        const numeralWidth = 34, pad = 12;
        left -= numeralWidth + pad;
        right += pad;
        top -= pad;
        bottom += pad;
        const width = Math.ceil(right - left), height = Math.ceil(bottom - top);

        const canvas = document.createElement("canvas");
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.scale(scale, scale);
        ctx.translate(-left, -top);

        layout.drawBackground(ctx, left + pad);
        for (const display of displays) display.draw(ctx);
        return { canvas, width, height };
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

    private spawnNear(id: string, placed: Map<string, Point>, rowY: number): Point {
        const ped = this.pedigree;
        const trio = ped.parentsOf(id);
        const relatives = [
            ...(trio ? [trio.motherId, trio.fatherId] : []),
            ...ped.partnersOf(id),
            ...ped.childrenOf(id),
            ...ped.siblingsOf(id),
        ].map(r => placed.get(r)).filter((p): p is { x: number, y: number } => !!p);
        const jitter = (Math.random() - 0.5) * 40;
        const x = relatives.length ? relatives.reduce((t, p) => t + p.x, 0) / relatives.length : WORLD_WIDTH / 2;
        return { x: x + jitter, y: rowY };
    }
}

/** Just enough of an engine shape for the layout and person drawing to move and read. */
class FreePoint {
    private position: WorldPosition;
    constructor(x: number, y: number) { this.position = new WorldPosition(x, y); }
    public getWorldPosition(): WorldPosition { return this.position; }
    public translate(p: WorldPosition): void { this.position = new WorldPosition(p.x, p.y); }
    public isSelected(): boolean { return false; }
}
