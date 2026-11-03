import { Pedigree } from "../pedigree";

/**
 * Decide the left-to-right order of people in each generation row so the
 * chart reads cleanly: partners side by side, sibships together, and each
 * family under its parents. Uses the usual layered-graph approach: sweep
 * down and up the rows, sorting each row by where its people's parents (or
 * children) sit in the neighbouring row. Partners are kept together as a
 * block while sorting.
 *
 * @param initialX optional current x for people: the starting order, so
 *                 re-ordering after an edit stays close to what's on screen
 */
export function orderRows(
    pedigree: Pedigree,
    generations: Map<string, number>,
    initialX?: Map<string, number>,
): Map<number, string[]> {
    const rows = new Map<number, string[]>();
    for (const p of pedigree.people) {
        const g = generations.get(p.id) ?? 0;
        rows.set(g, [...(rows.get(g) ?? []), p.id]);
    }
    const maxGen = Math.max(0, ...rows.keys());
    const index = new Map<string, number>();
    const reindex = (g: number) => rows.get(g)?.forEach((id, i) => index.set(id, i));

    const mean = (xs: number[]) => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : undefined;
    const parentKey = (id: string) => {
        const t = pedigree.parentsOf(id);
        return t ? mean([t.motherId, t.fatherId].map(p => index.get(p)).filter((v): v is number => v !== undefined)) : undefined;
    };
    const childKey = (id: string) =>
        mean(pedigree.childrenOf(id).map(c => index.get(c)).filter((v): v is number => v !== undefined));

    /** Sort row g by `key`, moving partner-connected people as one block. */
    const arrange = (g: number, key: (id: string) => number | undefined) => {
        const row = rows.get(g);
        if (!row || row.length < 2) return;
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
                for (const partner of pedigree.partnersOf(id))
                    if (inRow.has(partner) && !seen.has(partner)) { seen.add(partner); stack.push(partner); }
            }
            blocks.push(block);
        }

        const pos = new Map(row.map((id, i) => [id, i]));
        const allKeys = row.map(key).filter((v): v is number => v !== undefined);
        const rowMiddle = mean(allKeys) ?? (row.length - 1) / 2;
        const memberKey = (id: string, block: string[]): number => {
            const own = key(id);
            if (own !== undefined) return own;
            // someone who married in sits beside their partner, on the outer
            // side, so they don't split their partner's sibship
            const partner = pedigree.partnersOf(id).find(p => block.includes(p) && key(p) !== undefined);
            if (partner === undefined) return pos.get(id)!;
            const pk = key(partner)!;
            // which end of their sibship is the partner at?
            const sibs = row.filter(r => key(r) === pk).sort((x, y) => pos.get(x)! - pos.get(y)!);
            const at = sibs.indexOf(partner), middle = (sibs.length - 1) / 2;
            const goLeft = at < middle || (at === middle && pk <= rowMiddle);
            return pk + (goLeft ? -0.01 : 0.01);
        };
        const sortedBlocks = blocks.map((block, i) => {
            const keys = block.map(id => key(id)).filter((v): v is number => v !== undefined);
            const k = keys.length ? mean(keys)! : mean(block.map(id => pos.get(id)!))!;
            const members = [...block].sort((a, b) => memberKey(a, block) - memberKey(b, block) || pos.get(a)! - pos.get(b)!);
            return { k, i, members };
        }).sort((a, b) => a.k - b.k || a.i - b.i);
        rows.set(g, sortedBlocks.flatMap(b => b.members));
        reindex(g);
    };

    // starting order
    for (const [g, row] of rows) {
        if (initialX) row.sort((a, b) => (initialX.get(a) ?? 0) - (initialX.get(b) ?? 0));
        reindex(g);
    }

    for (let sweep = 0, sweeps = initialX ? 2 : 4; sweep < sweeps; sweep++) {
        for (let g = 1; g <= maxGen; g++) arrange(g, parentKey);
        for (let g = maxGen - 1; g >= 0; g--) arrange(g, childKey);
    }
    for (let g = 1; g <= maxGen; g++) arrange(g, parentKey);
    return rows;
}
