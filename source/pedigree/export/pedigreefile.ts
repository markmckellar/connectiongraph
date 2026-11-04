import type { PedigreeData } from "../pedigree";
import { slug } from "./pedigreepdf";

/** What a saved pedigree file holds: the pedigree itself, plus where everyone was on the chart. */
export interface PedigreeFile extends PedigreeData {
    format: typeof FORMAT;
    version: number;
    /** Chart positions by person id, so a reopened file looks the way it was left. */
    positions?: Record<string, [number, number]>;
}

const FORMAT = "connectiongraph-pedigree";

/** Download the pedigree as a .json file; returns the file name. */
export function savePedigreeFile(data: PedigreeData, positions: Map<string, { x: number; y: number }>): string {
    const file: PedigreeFile = {
        format: FORMAT,
        version: 1,
        ...data,
        positions: Object.fromEntries([...positions].map(([id, p]) => [id, [Math.round(p.x), Math.round(p.y)]])),
    };
    const blob = new Blob([JSON.stringify(file, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const filename = slug(data.title ?? "") + ".json";
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return filename;
}

/**
 * Read a pedigree from parsed JSON: a saved file, or the bare
 * {title, people, trios} the Triplets panel exports. Throws if it isn't one.
 */
export function readPedigreeFile(json: unknown): { data: PedigreeData; positions: Map<string, { x: number; y: number }> } {
    if (!json || typeof json !== "object") throw new Error("not a pedigree file");
    const o = json as Partial<PedigreeFile>;
    if (o.format !== undefined && o.format !== FORMAT) throw new Error(`unknown file format "${String(o.format)}"`);
    if (!Array.isArray(o.people) || !Array.isArray(o.trios)) throw new Error("no people and trios in it");
    for (const p of o.people)
        if (!p || typeof p.id !== "string") throw new Error("a person has no id");
    const positions = new Map<string, { x: number; y: number }>();
    for (const [id, xy] of Object.entries(o.positions ?? {}))
        if (Array.isArray(xy) && Number.isFinite(xy[0]) && Number.isFinite(xy[1])) positions.set(id, { x: xy[0], y: xy[1] });
    return { data: { title: o.title ?? "", people: o.people, trios: o.trios }, positions };
}
