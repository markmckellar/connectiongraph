import { TickRule } from "../../connectiongraph/engine/tickrule";
import { EngineShape } from "../../connectiongraph/engine/shapes/engineshape";
import { WorldPosition } from "../../connectiongraph/world/worldposition";
import { Couple, Pedigree } from "../pedigree";
import { labelWidth, PEDIGREE_COLORS } from "./persondisplay";

/** One straight piece of a relationship line. */
export interface LineSegment {
    x1: number; y1: number; x2: number; y2: number;
    /** Index of the couple this line belongs to: lines of the same family may meet. */
    family: number;
    /** People this line is meant to touch (it may run into their symbols). */
    ends: string[];
}

/** Something wrong with how the lines are drawn, to point out on the chart. */
export type LineProblem =
    | { kind: "cross"; x: number; y: number }
    | { kind: "overlap"; x1: number; y1: number; x2: number; y2: number }
    | { kind: "through"; x: number; y: number; personId: string };

export interface PedigreeLayoutOptions {
    width: number;
    size: number;
    rowTop: number;
    rowSpacing: number;
}

/**
 * Runs every engine tick and nudges people toward a pedigree layout:
 *  - each generation sits on its own row
 *  - partners sit side by side
 *  - siblings pack together, centred under their parents
 *  - each row keeps its left-to-right order (from orderRows), with room
 *    for name labels; people glide past each other to reach that order
 *  - the whole pedigree drifts toward the middle of the canvas
 * People being dragged are left alone, and their row's order follows where
 * you drop them, so you can rearrange by hand.
 */
export class PedigreeLayout implements TickRule {
    public static strength = 0.2;
    private couples: Couple[];
    /** The largest distance anyone was moved on the last tick: near zero once the layout has settled. */
    public motion = Infinity;
    /** Which way people being dragged are heading (-1 left, 1 right, 0 not yet known), and where they were. */
    private dragDir = 0;
    private lastHeldX: number | null = null;

    constructor(
        private pedigree: Pedigree,
        private shapes: Map<string, EngineShape>,
        private generations: Map<string, number>,
        public rowOrder: Map<number, string[]>,
        private opts: PedigreeLayoutOptions) {
        this.couples = pedigree.couples();
    }

    public rowY(generation: number): number {
        return this.opts.rowTop + generation * this.opts.rowSpacing;
    }

    /** Centre-to-centre distance that keeps two people (and their labels) apart. */
    private separation(a: string, b: string): number {
        const w = (id: string) => Math.max(this.opts.size, labelWidth(this.pedigree.find(id)));
        return (w(a) + w(b)) / 2 + 26;
    }

    public processAllRules(): void {
        const k = PedigreeLayout.strength;
        const pos = new Map<string, { x: number, y: number }>();
        for (const [id, shape] of this.shapes) {
            const p = shape.getWorldPosition();
            pos.set(id, { x: p.x, y: p.y });
        }
        if (pos.size === 0) return;
        const moves = new Map<string, { x: number, y: number }>([...pos.keys()].map(id => [id, { x: 0, y: 0 }]));
        const move = (id: string, dx: number, dy = 0) => { const m = moves.get(id); if (m) { m.x += dx; m.y += dy; } };
        const P = (id: string) => pos.get(id)!;

        // rows
        for (const [id, p] of pos) move(id, 0, (this.rowY(this.generations.get(id) ?? 0) - p.y) * k);

        for (const c of this.couples) {
            const kids = c.childIds.filter(id => pos.has(id));
            if (!pos.has(c.motherId) || !pos.has(c.fatherId)) continue;

            // partners side by side (keeping whichever order they're in)
            const a = P(c.motherId), b = P(c.fatherId);
            const dx = b.x - a.x, dir = dx >= 0 ? 1 : -1;
            const err = Math.abs(dx) - this.separation(c.motherId, c.fatherId);
            move(c.motherId, dir * err / 2 * k);
            move(c.fatherId, -dir * err / 2 * k);

            if (!kids.length) continue;

            // siblings packed in a row around their own centre
            const sorted = [...kids].sort((i, j) => P(i).x - P(j).x);
            const centre = sorted.reduce((t, id) => t + P(id).x, 0) / sorted.length;
            const gaps = sorted.slice(1).map((id, i) => this.separation(sorted[i], id));
            const span = gaps.reduce((t, g) => t + g, 0);
            let slot = centre - span / 2;
            sorted.forEach((id, i) => {
                move(id, (slot - P(id).x) * k);
                if (i < gaps.length) slot += gaps[i];
            });

            // sibship centred under the couple (both sides meet halfway)
            const d = centre - (a.x + b.x) / 2;
            for (const id of kids) move(id, -d / 2 * k);
            move(c.motherId, d / 2 * k);
            move(c.fatherId, d / 2 * k);
        }

        // whole pedigree toward the middle of the canvas
        let sum = 0;
        for (const p of pos.values()) sum += p.x;
        const drift = (this.opts.width / 2 - sum / pos.size) * 0.05;
        for (const id of pos.keys()) move(id, drift);

        for (const [id, m] of moves) {
            const p = P(id);
            p.x += m.x; p.y += m.y;
        }

        // which way the dragged people are heading
        const held = [...this.shapes].filter(([, s]) => s.isSelected()).map(([id]) => id);
        if (held.length) {
            const x = held.reduce((t, id) => t + P(id).x, 0) / held.length;
            if (this.lastHeldX !== null && Math.abs(x - this.lastHeldX) > 0.3) this.dragDir = Math.sign(x - this.lastHeldX);
            this.lastHeldX = x;
        } else {
            this.dragDir = 0;
            this.lastHeldX = null;
        }

        // rows with someone being dragged take their order from where things are now
        for (const [g, ids] of this.rowOrder)
            if (ids.some(id => this.shapes.get(id)?.isSelected()))
                this.rowOrder.set(g, [...ids].sort((i, j) => P(i).x - P(j).x));

        // keep each row in order, with room between neighbours
        for (let pass = 0; pass < 2; pass++)
            for (const all of this.rowOrder.values()) {
                const ids = all.filter(id => pos.has(id));
                for (let i = 1; i < ids.length; i++) {
                    const overlap = this.separation(ids[i - 1], ids[i]) - (P(ids[i]).x - P(ids[i - 1]).x);
                    if (overlap <= 0) continue;
                    const leftFixed = this.shapes.get(ids[i - 1])!.isSelected();
                    const rightFixed = this.shapes.get(ids[i])!.isSelected();
                    if (leftFixed && rightFixed) continue;
                    // Someone being dragged doesn't shove the people ahead of them (or
                    // they could never be passed): you slide over them, and once
                    // you're past their middle the row re-orders and they step
                    // round behind you, which opens the gap.
                    if (rightFixed && this.dragDir < 0) continue;
                    if (leftFixed && this.dragDir > 0) continue;
                    const leftShare = leftFixed ? 0 : rightFixed ? 1 : 0.5;
                    P(ids[i - 1]).x -= overlap * leftShare * 0.5;
                    P(ids[i]).x += overlap * (1 - leftShare) * 0.5;
                }
            }

        let motion = 0;
        for (const [id, shape] of this.shapes) {
            if (shape.isSelected()) continue;
            const p = P(id), cur = shape.getWorldPosition();
            motion = Math.max(motion, Math.abs(p.x - cur.x), Math.abs(p.y - cur.y));
            if (Math.abs(p.x - cur.x) > 0.05 || Math.abs(p.y - cur.y) > 0.05)
                shape.translate(new WorldPosition(p.x, p.y));
        }
        this.motion = motion;
    }

    /**
     * The relationship lines as straight segments: couple lines between
     * partners, a drop from each couple to their sibship bar, the bar, and a
     * line down to each child.
     *
     * Sibship bars all sit at the same height above their row, so two that
     * overlap would merge into one line and you couldn't tell whose children
     * are whose. Overlapping bars are put in different lanes (heights)
     * instead, which turns a hidden overlap into a visible crossing.
     */
    public segments(): LineSegment[] {
        const h = this.opts.size / 2;
        const P = (id: string) => this.shapes.get(id)?.getWorldPosition();
        const out: LineSegment[] = [];
        const bars: Array<{ family: number; x1: number; x2: number; y: number; midX: number; coupleY: number; kids: Array<{ id: string; x: number; y: number }> }> = [];

        this.couples.forEach((c, family) => {
            const a = P(c.motherId), b = P(c.fatherId);
            if (!a || !b) return;
            const [l, r] = a.x <= b.x ? [a, b] : [b, a];
            out.push({ x1: l.x + h, y1: l.y, x2: r.x - h, y2: r.y, family, ends: [c.motherId, c.fatherId] });
            const kids = c.childIds.flatMap(id => { const p = P(id); return p ? [{ id, x: p.x, y: p.y }] : []; });
            if (!kids.length) return;
            const midX = (l.x + r.x) / 2;
            const xs = [midX, ...kids.map(k => k.x)];
            bars.push({
                family, midX, coupleY: (l.y + r.y) / 2, kids,
                x1: Math.min(...xs), x2: Math.max(...xs),
                y: Math.min(...kids.map(k => k.y)) - h - 22,
            });
        });

        // lanes: bars at the same height that overlap (or nearly touch) go one above the other
        const LANE = 9, MAX_LANES = 3;
        const byRow = new Map<number, typeof bars>();
        for (const bar of bars) {
            const key = Math.round(bar.y / 20);
            byRow.set(key, [...(byRow.get(key) ?? []), bar]);
        }
        for (const row of byRow.values()) {
            const laneEnds: number[] = [];
            for (const bar of [...row].sort((p, q) => p.x1 - q.x1)) {
                let lane = laneEnds.findIndex(end => end < bar.x1 - 8);
                if (lane < 0) lane = laneEnds.length < MAX_LANES ? laneEnds.length : MAX_LANES - 1;
                laneEnds[lane] = Math.max(laneEnds[lane] ?? -Infinity, bar.x2);
                bar.y -= lane * LANE;
            }
        }

        for (const bar of bars) {
            out.push({ x1: bar.midX, y1: bar.coupleY, x2: bar.midX, y2: bar.y, family: bar.family, ends: [] });
            out.push({ x1: bar.x1, y1: bar.y, x2: bar.x2, y2: bar.y, family: bar.family, ends: [] });
            for (const k of bar.kids) out.push({ x1: k.x, y1: bar.y, x2: k.x, y2: k.y - h - 1, family: bar.family, ends: [k.id] });
        }
        return out;
    }

    /**
     * Where the drawn lines are misleading: two families' lines crossing,
     * lines lying on top of each other, or a line running through someone
     * it doesn't belong to.
     */
    public problems(): LineProblem[] {
        const segs = this.segments();
        const h = this.opts.size / 2;
        const out: LineProblem[] = [];
        const isH = (s: LineSegment) => Math.abs(s.y1 - s.y2) < 0.5;
        const isV = (s: LineSegment) => Math.abs(s.x1 - s.x2) < 0.5;
        const lo = (a: number, b: number) => Math.min(a, b), hi = (a: number, b: number) => Math.max(a, b);

        for (let i = 0; i < segs.length; i++)
            for (let j = i + 1; j < segs.length; j++) {
                const a = segs[i], b = segs[j];
                if (a.family === b.family) continue;
                if (isH(a) && isH(b) && Math.abs(a.y1 - b.y1) < 2.5) {
                    const x1 = Math.max(lo(a.x1, a.x2), lo(b.x1, b.x2)), x2 = Math.min(hi(a.x1, a.x2), hi(b.x1, b.x2));
                    if (x2 - x1 > 2) out.push({ kind: "overlap", x1, y1: a.y1, x2, y2: a.y1 });
                } else if (isV(a) && isV(b) && Math.abs(a.x1 - b.x1) < 2.5) {
                    const y1 = Math.max(lo(a.y1, a.y2), lo(b.y1, b.y2)), y2 = Math.min(hi(a.y1, a.y2), hi(b.y1, b.y2));
                    if (y2 - y1 > 2) out.push({ kind: "overlap", x1: a.x1, y1, x2: a.x1, y2 });
                } else if ((isH(a) && isV(b)) || (isV(a) && isH(b))) {
                    const [hs, vs] = isH(a) ? [a, b] : [b, a];
                    const x = vs.x1, y = hs.y1;
                    if (x > lo(hs.x1, hs.x2) + 1 && x < hi(hs.x1, hs.x2) - 1 && y > lo(vs.y1, vs.y2) + 1 && y < hi(vs.y1, vs.y2) - 1)
                        out.push({ kind: "cross", x, y });
                }
            }

        // lines running through someone's symbol
        for (const [id, shape] of this.shapes) {
            const p = shape.getWorldPosition();
            for (const s of segs) {
                if (s.ends.includes(id)) continue;
                const pad = h - 2;
                if (isH(s) && Math.abs(s.y1 - p.y) < pad && p.x > lo(s.x1, s.x2) - pad && p.x < hi(s.x1, s.x2) + pad)
                    { out.push({ kind: "through", x: p.x, y: p.y, personId: id }); break; }
                if (isV(s) && Math.abs(s.x1 - p.x) < pad && p.y > lo(s.y1, s.y2) - pad && p.y < hi(s.y1, s.y2) + pad)
                    { out.push({ kind: "through", x: p.x, y: p.y, personId: id }); break; }
            }
        }
        return out;
    }

    /** Generation labels and relationship lines, drawn underneath the people. */
    public drawBackground(ctx: CanvasRenderingContext2D, numeralX = 12): void {
        ctx.save();
        const gens = new Set(this.generations.values());
        ctx.fillStyle = PEDIGREE_COLORS.subtleText;
        ctx.font = "bold 14px Georgia, serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        for (const g of gens) ctx.fillText(roman(g + 1), numeralX, this.rowY(g));

        ctx.strokeStyle = PEDIGREE_COLORS.line;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (const s of this.segments()) {
            ctx.moveTo(s.x1, s.y1);
            ctx.lineTo(s.x2, s.y2);
        }
        ctx.stroke();
        ctx.restore();
    }
}

function roman(n: number): string {
    const table: Array<[number, string]> = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
    let out = "";
    for (const [v, s] of table) while (n >= v) { out += s; n -= v; }
    return out;
}
