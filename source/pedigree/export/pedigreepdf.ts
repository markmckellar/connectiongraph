import type { jsPDF } from "jspdf";
import { Pedigree, Person } from "../pedigree";
import { PedigreeScene } from "../scene/pedigreescene";

export interface PedigreePdfOptions {
    /** Page size; defaults to US Letter for en-US/en-CA browsers, A4 elsewhere. */
    format?: "a4" | "letter";
}

const INK: [number, number, number] = [31, 41, 55];
const MUTED: [number, number, number] = [107, 114, 128];
const RULE: [number, number, number] = [216, 222, 228];

/**
 * Save the pedigree as a PDF and download it:
 *  page 1 - title, summary, the chart as currently laid out, symbol legend
 *  page 2+ - a table of everyone (generation, name, sex, age, status, parents)
 * Returns the file name it saved to.
 */
export async function savePedigreePdf(scene: PedigreeScene, pedigree: Pedigree, options: PedigreePdfOptions = {}): Promise<string> {
    const snap = scene.snapshot(3);
    if (!snap) throw new Error("Add someone to the pedigree before saving a PDF");

    const { jsPDF } = await import("jspdf");
    const format = options.format ?? (/^en-(US|CA)$/i.test(navigator.language) ? "letter" : "a4");
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format });
    const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight(), M = 14;

    const title = pedigree.title.trim() || "Pedigree";
    const generations = pedigree.generations();
    const genCount = new Set(generations.values()).size;
    const proband = pedigree.people.find(p => p.proband);
    const saved = new Date();
    const savedText = saved.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

    // ---- page 1: chart ------------------------------------------------------
    doc.setTextColor(...INK);
    doc.setFont("helvetica", "bold").setFontSize(18);
    doc.text(pdfText(title), M, M + 5);
    doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...MUTED);
    const summary = [
        proband ? "Proband: " + pedigree.label(proband.id) : null,
        plural(pedigree.people.length, "person", "people"),
        plural(genCount, "generation"),
        "Saved " + savedText,
    ].filter(Boolean).join("   ·   ");
    doc.text(pdfText(summary), M, M + 11);
    doc.setDrawColor(...RULE).setLineWidth(0.3).line(M, M + 15, W - M, M + 15);

    // fit the chart between the header and the legend, never larger than ~print size
    const areaTop = M + 20, areaBottom = H - M - 12;
    const areaW = W - 2 * M, areaH = areaBottom - areaTop;
    const mmPerPx = Math.min(areaW / snap.width, areaH / snap.height, 0.42);
    const imgW = snap.width * mmPerPx, imgH = snap.height * mmPerPx;
    doc.addImage(snap.canvas.toDataURL("image/png"), "PNG", (W - imgW) / 2, areaTop + (areaH - imgH) / 2, imgW, imgH, undefined, "FAST");

    drawLegend(doc, M, H - M - 3);

    // ---- page 2+: people table ----------------------------------------------
    const xs = scene.positions();
    const rows = [...pedigree.people].sort((a, b) =>
        (generations.get(a.id) ?? 0) - (generations.get(b.id) ?? 0) || (xs.get(a.id)?.x ?? 0) - (xs.get(b.id)?.x ?? 0));
    drawPeopleTable(doc, pedigree, rows, generations, W, H, M);

    // footers
    const pages = doc.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...MUTED);
        doc.text(pdfText(title), M, H - 6);
        doc.text(`Page ${i} of ${pages}`, W - M, H - 6, { align: "right" });
    }

    const localDate = [saved.getFullYear(), saved.getMonth() + 1, saved.getDate()].map(n => String(n).padStart(2, "0")).join("-");
    const filename = slug(title) + "-" + localDate + ".pdf";
    doc.save(filename);
    return filename;
}

function drawLegend(doc: jsPDF, x: number, baseline: number): void {
    const s = 3.4, gap = 2.5, y = baseline - 1.1; // y = middle of the label text
    doc.setDrawColor(...INK).setLineWidth(0.35).setFont("helvetica", "normal").setFontSize(8.5).setTextColor(...INK);
    const label = (text: string) => { doc.text(text, x, baseline); x += doc.getTextWidth(text) + 7; };

    doc.rect(x, y - s / 2, s, s); x += s + gap; label("Male");
    doc.circle(x + s / 2, y, s / 2); x += s + gap; label("Female");
    doc.lines([[s / 2, s / 2], [-s / 2, s / 2], [-s / 2, -s / 2], [s / 2, -s / 2]], x, y - s / 2 - 0.2, [1, 1], "S", true);
    x += s + gap; label("Unknown sex");
    doc.rect(x, y - s / 2, s, s); doc.line(x - 0.8, y + s / 2 + 0.8, x + s + 0.8, y - s / 2 - 0.8); x += s + gap; label("Deceased");
    doc.line(x, y + s / 2, x + s * 0.8, y - s / 2 + 0.6);
    doc.triangle(x + s, y - s / 2, x + s - 1.6, y - s / 2 + 0.4, x + s - 0.4, y - s / 2 + 1.6, "F");
    x += s + gap; label("Proband");
    doc.setFillColor(255, 255, 255);
}

function drawPeopleTable(doc: jsPDF, pedigree: Pedigree, people: Person[], generations: Map<string, number>, W: number, H: number, M: number): void {
    const cols = [
        { title: "Gen.", w: 14 },
        { title: "Name", w: 58 },
        { title: "Sex", w: 22 },
        { title: "Age", w: 16 },
        { title: "Status", w: 22 },
        { title: "Parents", w: 0 },
    ];
    cols[cols.length - 1].w = W - 2 * M - cols.reduce((t, c) => t + c.w, 0);
    const lineH = 4.6, padY = 1.8;

    const header = (y: number) => {
        doc.setFillColor(243, 244, 246).rect(M, y, W - 2 * M, lineH + padY * 2, "F");
        doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...INK);
        let x = M + 2;
        for (const c of cols) { doc.text(c.title, x, y + padY + 3.4); x += c.w; }
        return y + lineH + padY * 2;
    };

    doc.addPage();
    doc.setFont("helvetica", "bold").setFontSize(14).setTextColor(...INK);
    doc.text("People", M, M + 4);
    let y = header(M + 9);

    for (const p of people) {
        const trio = pedigree.parentsOf(p.id);
        const cells = [
            roman((generations.get(p.id) ?? 0) + 1),
            pedigree.label(p.id) + (p.proband ? "  (proband)" : ""),
            p.sex === "male" ? "Male" : p.sex === "female" ? "Female" : "Unknown",
            p.age != null ? String(p.age) : "",
            p.deceased ? "Deceased" : "Living",
            trio ? pedigree.label(trio.motherId) + " & " + pedigree.label(trio.fatherId) : "",
        ];
        doc.setFont("helvetica", "normal").setFontSize(9);
        const wrapped = cells.map((c, i) => doc.splitTextToSize(pdfText(c), cols[i].w - 3) as string[]);
        const rowH = Math.max(...wrapped.map(w => w.length)) * lineH + padY * 2;
        if (y + rowH > H - M - 6) { doc.addPage(); y = header(M); doc.setFont("helvetica", "normal").setFontSize(9); }

        doc.setTextColor(...INK);
        let x = M + 2;
        wrapped.forEach((lines, i) => { doc.text(lines, x, y + padY + 3.4); x += cols[i].w; });
        y += rowH;
        doc.setDrawColor(...RULE).setLineWidth(0.2).line(M, y, W - M, y);
    }
}

/** jsPDF's built-in fonts only cover Latin-1; swap anything else for "?" rather than garbling. */
function pdfText(s: string): string {
    return s.replace(/[^\x20-\x7E\xA0-\xFF–—‘’“”•…]/g, "?");
}

function plural(n: number, one: string, many = one + "s"): string {
    return n + " " + (n === 1 ? one : many);
}

function slug(s: string): string {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "pedigree";
}

function roman(n: number): string {
    const t: Array<[number, string]> = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
    let out = "";
    for (const [v, r] of t) while (n >= v) { out += r; n -= v; }
    return out;
}
