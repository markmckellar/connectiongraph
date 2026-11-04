import { Pedigree } from "../pedigree";

type Rows = Map<number, string[]>;

/**
 * Decide the left-to-right order of people in each generation row so the
 * chart reads cleanly: partners side by side, sibships together, each
 * family under its parents, and as few crossing lines as possible.
 *
 * Two stages, the usual approach for layered graphs (Sugiyama):
 *  1. barycentre sweeps: down and up the rows, sort each row by where its
 *     people's parents (or children) sit in the neighbouring row, moving
 *     partner-connected people as one block;
 *  2. crossing reduction: a local search that tries swapping neighbouring
 *     blocks (with the families below following them) and reordering
 *     partners within a block, keeping any change that lowers
 *     countCrossings(). Some families can't be drawn without a crossing
 *     (cousins marrying, say); this finds a good order, not always a perfect one.
 *
 * @param initialX optional current x for people: the starting order, so
 *                 re-ordering after an edit stays close to what's on screen
 */
export function orderRows(
    pedigree: Pedigree,
    generations: Map<string, number>,
    initialX?: Map<string, number>,
): Rows {
    const o = new RowOrderer(pedigree, generations);
    const rows = o.initialRows(initialX);
    for (let sweep = 0, sweeps = initialX ? 2 : 4; sweep < sweeps; sweep++) {
        o.sweepDown(rows, 1);
        o.sweepUp(rows, o.maxGen - 1);
    }
    o.sweepDown(rows, 1);
    return o.reduceCrossings(rows);
}

/**
 * How badly this order would draw: line crossings between families, people
 * stuck between two partners (the couple line runs through them), and
 * outsiders inside a sibship (they'd look like one of the children).
 */
export function countCrossings(pedigree: Pedigree, generations: Map<string, number>, rows: Rows): number {
    return new RowOrderer(pedigree, generations).cost(rows);
}

class RowOrderer {
    public readonly maxGen: number;
    private couples;
    private partners = new Map<string, string[]>();
    private parents = new Map<string, [string, string]>();
    private children = new Map<string, string[]>();

    constructor(private pedigree: Pedigree, private generations: Map<string, number>) {
        this.couples = pedigree.couples();
        for (const p of pedigree.people) {
            this.partners.set(p.id, pedigree.partnersOf(p.id));
            this.children.set(p.id, pedigree.childrenOf(p.id));
            const t = pedigree.parentsOf(p.id);
            if (t) this.parents.set(p.id, [t.motherId, t.fatherId]);
        }
        this.maxGen = Math.max(0, ...pedigree.people.map(p => generations.get(p.id) ?? 0));
    }

    public initialRows(initialX?: Map<string, number>): Rows {
        const rows: Rows = new Map();
        for (const p of this.pedigree.people) {
            const g = this.generations.get(p.id) ?? 0;
            rows.set(g, [...(rows.get(g) ?? []), p.id]);
        }
        if (initialX)
            for (const row of rows.values()) row.sort((a, b) => (initialX.get(a) ?? 0) - (initialX.get(b) ?? 0));
        return rows;
    }

    // ---- barycentre sweeps -------------------------------------------------

    public sweepDown(rows: Rows, from: number): void {
        for (let g = Math.max(1, from); g <= this.maxGen; g++) this.arrange(rows, g, "parents");
    }

    public sweepUp(rows: Rows, from: number): void {
        for (let g = Math.min(this.maxGen - 1, from); g >= 0; g--) this.arrange(rows, g, "children");
    }

    /** Sort row g by the mean position of each person's parents (or children), moving partner-connected people as one block. */
    private arrange(rows: Rows, g: number, by: "parents" | "children"): void {
        const row = rows.get(g);
        if (!row || row.length < 2) return;
        const index = new Map<string, number>();
        for (const ids of rows.values()) ids.forEach((id, i) => index.set(id, i));
        const mean = (xs: number[]) => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : undefined;
        const at = (ids: string[]) => ids.map(p => index.get(p)).filter((v): v is number => v !== undefined);
        const key = (id: string): number | undefined =>
            by === "parents" ? mean(at(this.parents.get(id) ?? [])) : mean(at(this.children.get(id) ?? []));

        const blocks = this.blocks(row);
        const pos = new Map(row.map((id, i) => [id, i]));
        const allKeys = row.map(key).filter((v): v is number => v !== undefined);
        const rowMiddle = mean(allKeys) ?? (row.length - 1) / 2;
        const memberKey = (id: string, block: string[]): number => {
            const own = key(id);
            if (own !== undefined) return own;
            // someone who married in sits beside their partner, on the outer
            // side, so they don't split their partner's sibship
            const partner = (this.partners.get(id) ?? []).find(p => block.includes(p) && key(p) !== undefined);
            if (partner === undefined) return pos.get(id)!;
            const pk = key(partner)!;
            const sibs = row.filter(r => key(r) === pk).sort((x, y) => pos.get(x)! - pos.get(y)!);
            const i = sibs.indexOf(partner), middle = (sibs.length - 1) / 2;
            const goLeft = i < middle || (i === middle && pk <= rowMiddle);
            return pk + (goLeft ? -0.01 : 0.01);
        };
        const sorted = blocks.map((block, i) => {
            const keys = block.map(key).filter((v): v is number => v !== undefined);
            const k = keys.length ? mean(keys)! : mean(block.map(id => pos.get(id)!))!;
            const members = [...block].sort((a, b) => memberKey(a, block) - memberKey(b, block) || pos.get(a)! - pos.get(b)!);
            return { k, i, members };
        }).sort((a, b) => a.k - b.k || a.i - b.i);
        rows.set(g, sorted.flatMap(b => b.members));
    }

    /** Partner-connected groups in a row, in row order (by their first member). */
    private blocks(row: string[]): string[][] {
        const inRow = new Set(row);
        const seen = new Set<string>();
        const blocks: string[][] = [];
        for (const start of row) {
            if (seen.has(start)) continue;
            const block: string[] = [];
            const stack = [start];
            seen.add(start);
            while (stack.length) {
                const id = stack.pop()!;
                block.push(id);
                for (const partner of this.partners.get(id) ?? [])
                    if (inRow.has(partner) && !seen.has(partner)) { seen.add(partner); stack.push(partner); }
            }
            blocks.push(row.filter(id => block.includes(id)));
        }
        return blocks;
    }

    // ---- crossing reduction ------------------------------------------------

    public cost(rows: Rows): number {
        const index = new Map<string, number>();
        for (const ids of rows.values()) ids.forEach((id, i) => index.set(id, i));
        const gen = (id: string) => this.generations.get(id) ?? 0;
        let cost = 0;

        // edges from each couple's midpoint down to each of their children, grouped by the row they start in
        const edges = new Map<number, Array<{ top: number; bottom: number; family: number }>>();
        this.couples.forEach((c, family) => {
            const m = index.get(c.motherId), f = index.get(c.fatherId);
            if (m === undefined || f === undefined) return;
            const g = gen(c.motherId);
            if (gen(c.fatherId) === g) {
                // anyone between the partners has the couple line drawn through them
                cost += Math.max(0, Math.abs(m - f) - 1);
            }
            const kids = c.childIds.filter(k => index.has(k) && gen(k) === g + 1).map(k => index.get(k)!);
            if (!kids.length) return;
            const list = edges.get(g) ?? [];
            for (const k of kids) list.push({ top: (m + f) / 2, bottom: k, family });
            edges.set(g, list);
            // people inside the sibship who aren't in it would look like one of the children
            const lo = Math.min(...kids), hi = Math.max(...kids);
            cost += (hi - lo + 1) - kids.length;
        });

        for (const list of edges.values())
            for (let i = 0; i < list.length; i++)
                for (let j = i + 1; j < list.length; j++) {
                    const a = list[i], b = list[j];
                    if (a.family !== b.family && (a.top - b.top) * (a.bottom - b.bottom) < 0) cost++;
                }
        return cost;
    }

    /**
     * Local search: try each move, keep it if the order draws better, and
     * repeat until nothing helps. Moves:
     *  - swap two neighbouring blocks in a row, then let the rows below
     *    re-sort under them (so a family's descendants move with it), with
     *    and without the rows above re-sorting too;
     *  - reorder the people inside a block (who sits beside whom).
     */
    public reduceCrossings(rows: Rows): Rows {
        let best = this.cost(rows);
        const clone = (r: Rows): Rows => new Map([...r].map(([g, ids]) => [g, [...ids]]));
        const tryRows = (candidate: Rows): boolean => {
            const c = this.cost(candidate);
            if (c < best) { best = c; rows = candidate; return true; }
            return false;
        };

        for (let round = 0; round < 30 && best > 0; round++) {
            let improved = false;
            for (const g of [...rows.keys()].sort((a, b) => a - b)) {
                const blocks = this.blocks(rows.get(g)!);
                for (let i = 0; i + 1 < blocks.length; i++) {
                    const swapped = [...blocks];
                    [swapped[i], swapped[i + 1]] = [swapped[i + 1], swapped[i]];
                    const base = clone(rows);
                    base.set(g, swapped.flat());
                    const down = clone(base);
                    this.sweepDown(down, g + 1);
                    const both = clone(down);
                    this.sweepUp(both, g - 1);
                    if (tryRows(base) || tryRows(down) || tryRows(both)) { improved = true; break; }
                }
                for (const block of this.blocks(rows.get(g)!)) {
                    if (block.length < 2 || block.length > 4) continue;
                    for (const perm of permutations(block)) {
                        const candidate = clone(rows);
                        const row = candidate.get(g)!;
                        const start = row.indexOf(block[0]);
                        // blocks aren't always contiguous mid-search; only reorder ones that are
                        if (row.slice(start, start + block.length).some(id => !block.includes(id))) continue;
                        row.splice(start, block.length, ...perm);
                        if (tryRows(candidate)) { improved = true; break; }
                    }
                }
            }
            if (!improved) break;
        }
        return rows;
    }
}

function permutations<T>(xs: T[]): T[][] {
    if (xs.length <= 1) return [xs];
    return xs.flatMap((x, i) => permutations([...xs.slice(0, i), ...xs.slice(i + 1)]).map(rest => [x, ...rest]));
}
