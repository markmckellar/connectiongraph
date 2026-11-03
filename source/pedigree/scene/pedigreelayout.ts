import { TickRule } from "../../connectiongraph/engine/tickrule";
import { EngineShape } from "../../connectiongraph/engine/shapes/engineshape";
import { WorldPosition } from "../../connectiongraph/world/worldposition";
import { Couple, Pedigree } from "../pedigree";
import { labelWidth, PEDIGREE_COLORS } from "./persondisplay";

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
                    const leftShare = leftFixed ? 0 : rightFixed ? 1 : 0.5;
                    P(ids[i - 1]).x -= overlap * leftShare * 0.5;
                    P(ids[i]).x += overlap * (1 - leftShare) * 0.5;
                }
            }

        for (const [id, shape] of this.shapes) {
            if (shape.isSelected()) continue;
            const p = P(id), cur = shape.getWorldPosition();
            if (Math.abs(p.x - cur.x) > 0.05 || Math.abs(p.y - cur.y) > 0.05)
                shape.translate(new WorldPosition(p.x, p.y));
        }
    }

    /** Generation labels and relationship lines, drawn underneath the people. */
    public drawBackground(ctx: CanvasRenderingContext2D): void {
        const s = this.opts.size, h = s / 2;
        const P = (id: string) => this.shapes.get(id)?.getWorldPosition();

        ctx.save();
        const gens = new Set(this.generations.values());
        ctx.fillStyle = PEDIGREE_COLORS.subtleText;
        ctx.font = "bold 14px Georgia, serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        for (const g of gens) ctx.fillText(roman(g + 1), 12, this.rowY(g));

        ctx.strokeStyle = PEDIGREE_COLORS.line;
        ctx.lineWidth = 1.5;
        for (const c of this.couples) {
            const a = P(c.motherId), b = P(c.fatherId);
            if (!a || !b) continue;
            const [l, r] = a.x <= b.x ? [a, b] : [b, a];
            const coupleY = (l.y + r.y) / 2;
            ctx.beginPath();
            ctx.moveTo(l.x + h, l.y);
            ctx.lineTo(r.x - h, r.y);
            ctx.stroke();

            const kids = c.childIds.map(P).filter((p): p is WorldPosition => !!p);
            if (!kids.length) continue;
            const midX = (l.x + r.x) / 2;
            const sibY = Math.min(...kids.map(k => k.y)) - h - 22;
            const xs = [midX, ...kids.map(k => k.x)];
            ctx.beginPath();
            ctx.moveTo(midX, coupleY);
            ctx.lineTo(midX, sibY);
            ctx.moveTo(Math.min(...xs), sibY);
            ctx.lineTo(Math.max(...xs), sibY);
            for (const k of kids) {
                ctx.moveTo(k.x, sibY);
                ctx.lineTo(k.x, k.y - h - 1);
            }
            ctx.stroke();
        }
        ctx.restore();
    }
}

function roman(n: number): string {
    const table: Array<[number, string]> = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
    let out = "";
    for (const [v, s] of table) while (n >= v) { out += s; n -= v; }
    return out;
}
