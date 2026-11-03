import { Drawable } from "../../connectiongraph/display/drawable";
import { EngineShape } from "../../connectiongraph/engine/shapes/engineshape";
import { Person } from "../pedigree";

export const PEDIGREE_COLORS = {
    line: "#374151",
    stroke: "#1f2937",
    fill: "#ffffff",
    selectedStroke: "#2563eb",
    selectedFill: "#dbeafe",
    text: "#111827",
    subtleText: "#6b7280",
};

/** Approximate on-canvas width of a person's name label. */
export function labelWidth(person: Person | undefined): number {
    return person && person.name ? person.name.length * 7 + 8 : 0;
}

/**
 * Standard pedigree symbol: square = male, circle = female, diamond = unknown,
 * diagonal slash = deceased, arrow = proband. Name and age go underneath.
 */
export class PersonDisplay implements Drawable {
    private shape!: EngineShape;

    constructor(
        private getPerson: () => Person | undefined,
        private isHighlighted: () => boolean,
        private size: number) {
    }

    public init(engineShape: EngineShape, options: any): void {
        this.shape = engineShape;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const person = this.getPerson();
        if (!person) return;
        const { x, y } = this.shape.getWorldPosition();
        const s = this.size, h = s / 2;
        const selected = this.isHighlighted();

        ctx.save();
        ctx.lineWidth = selected ? 3 : 2;
        ctx.strokeStyle = selected ? PEDIGREE_COLORS.selectedStroke : PEDIGREE_COLORS.stroke;
        ctx.fillStyle = selected ? PEDIGREE_COLORS.selectedFill : PEDIGREE_COLORS.fill;

        ctx.beginPath();
        if (person.sex === "male") ctx.rect(x - h, y - h, s, s);
        else if (person.sex === "female") ctx.arc(x, y, h, 0, Math.PI * 2);
        else { ctx.moveTo(x, y - h * 1.15); ctx.lineTo(x + h * 1.15, y); ctx.lineTo(x, y + h * 1.15); ctx.lineTo(x - h * 1.15, y); ctx.closePath(); }
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = PEDIGREE_COLORS.stroke;
        ctx.lineWidth = 2;
        if (person.deceased) {
            ctx.beginPath();
            ctx.moveTo(x - s * 0.7, y + s * 0.7);
            ctx.lineTo(x + s * 0.7, y - s * 0.7);
            ctx.stroke();
        }

        if (person.proband) {
            const tipX = x - h - 3, tipY = y + h + 3;
            ctx.fillStyle = PEDIGREE_COLORS.stroke;
            ctx.beginPath();
            ctx.moveTo(tipX - 18, tipY + 18);
            ctx.lineTo(tipX - 4, tipY + 4);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(tipX, tipY);
            ctx.lineTo(tipX - 9, tipY + 2);
            ctx.lineTo(tipX - 2, tipY + 9);
            ctx.closePath();
            ctx.fill();
            ctx.font = "bold 11px system-ui, sans-serif";
            ctx.textAlign = "right";
            ctx.fillText("P", tipX - 19, tipY + 24);
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        let textY = y + h + (person.sex === "unknown" ? 8 : 5);
        if (person.name) {
            ctx.fillStyle = PEDIGREE_COLORS.text;
            ctx.font = "600 12px system-ui, sans-serif";
            ctx.fillText(person.name, x, textY);
            textY += 15;
        }
        const age = person.age != null ? person.age + "y" : "";
        const ageText = person.deceased ? ("d. " + age).trim() : age;
        if (ageText) {
            ctx.fillStyle = PEDIGREE_COLORS.subtleText;
            ctx.font = "11px system-ui, sans-serif";
            ctx.fillText(ageText, x, textY);
        }
        ctx.restore();
    }
}

/** For the engine's mouse anchor: the editor doesn't want a crosshair. */
export class NullDrawable implements Drawable {
    public init(engineShape: EngineShape, options: any): void { }
    public draw(ctx: CanvasRenderingContext2D): void { }
}
