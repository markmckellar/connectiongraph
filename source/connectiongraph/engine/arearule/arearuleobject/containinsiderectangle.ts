import { AreaRuleObject } from "./arearuleobject";
import { WorldEngine } from "../../worldengine";
import { EngineShape } from "../../shapes/engineshape";
import { RectangleEngineShape } from "../../shapes/rectangleengineshape";
import { WorldPosition } from "../../../world/worldposition";
import { BoundingBox } from "../../shapes/boundingbox";

/**
 * Lays its shapes out in a single, evenly spaced row inside a rectangle, and
 * sizes the rectangle to fit them. The rectangle behaves like a rigid group:
 *
 *  1. Carry - if something else moved the rectangle since last tick (a
 *     connector, a collision, the mouse), its shapes get the same move.
 *  2. Centre - the rectangle sits on the centroid of its shapes, so any pull
 *     on individual shapes drags the whole group.
 *  3. Row layout - shapes are sorted by x (dragging one past a neighbour
 *     reorders the row) and all ease onto the centre line. Then either:
 *       - "packed": each eases toward its slot in a tight row around the
 *         centroid (e.g. siblings in a family), or
 *       - "spread": shapes keep their own x and are only pushed apart where
 *         they overlap (e.g. families in a generation, which need to be free
 *         to sit under their parents). The box resizes to fit.
 *     Either way the moves sum to zero, so layout never pushes the group.
 *
 * Shapes being dragged are left where the mouse puts them.
 */
export class ContainInsideRectangle extends AreaRuleObject {
    /** Fraction of the remaining distance a shape moves toward its slot per tick. */
    public static layoutStrength = 0.25;
    /** Gap between shapes and around the edge, as a fraction of the average shape width... */
    public static spacing = 0.2;
    /** ...but never more than this many pixels, so boxes of big boxes don't balloon. */
    public static maxGap = 16;

    public rectangleEngineShape:RectangleEngineShape;
    public mode:"packed"|"spread";
    /** Where this rule last left the rectangle, to detect outside moves. */
    private lastPosition:{x:number,y:number}|null = null;

    constructor(worldEngine:WorldEngine,rectangleEngineShape:RectangleEngineShape,mode:"packed"|"spread" = "packed") {
        super(worldEngine,rectangleEngineShape);
        this.rectangleEngineShape = rectangleEngineShape;
        this.mode = mode;
    }

    public processAllRules():void {
        if(this.engineShapeList.length==0) return;
        const rect = this.rectangleEngineShape;
        rect.stopRotation();

        const pos = rect.getWorldPosition();
        if(this.lastPosition) {
            const dx = pos.x-this.lastPosition.x;
            const dy = pos.y-this.lastPosition.y;
            if(dx!=0 || dy!=0)
                for(const shape of this.engineShapeList) {
                    if(shape.isSelected()) continue;
                    const p = shape.getWorldPosition();
                    shape.translate(new WorldPosition(p.x+dx,p.y+dy));
                }
        }

        const centre = WorldPosition.getAveragePostionFromWorldPositionList(
            this.engineShapeList.map(s => s.getWorldPosition()));
        if(this.mode=="packed") {
            rect.translate(centre);
            this.layoutRow(centre);
        }
        else {
            this.spreadRow(centre.y);
            this.fitToContents();
        }

        const finalPos = rect.getWorldPosition();
        this.lastPosition = {x:finalPos.x,y:finalPos.y};
    }

    private getGap():number {
        let total = 0;
        for(const shape of this.engineShapeList) total += new BoundingBox(shape.getShapePoints()).width;
        return(Math.min(ContainInsideRectangle.maxGap,ContainInsideRectangle.spacing * total/this.engineShapeList.length));
    }

    private layoutRow(center:WorldPosition):void {
        const shapes = [...this.engineShapeList].sort((a,b) => a.getWorldPosition().x - b.getWorldPosition().x);
        const widths = shapes.map(s => new BoundingBox(s.getShapePoints()).width);
        const gap = this.getGap();
        const rowWidth = widths.reduce((t,w) => t+w, 0) + gap*(shapes.length-1);

        let x = center.x - rowWidth/2;
        for(let i=0;i<shapes.length;i++) {
            const target = new WorldPosition(x + widths[i]/2, center.y);
            x += widths[i] + gap;
            if(!shapes[i].isSelected()) ContainInsideRectangle.easeToward(shapes[i],target,ContainInsideRectangle.layoutStrength);
        }
    }

    /** Keep everyone on the centre line; push apart only where neighbours overlap. */
    private spreadRow(centreY:number):void {
        const shapes = [...this.engineShapeList].sort((a,b) => a.getWorldPosition().x - b.getWorldPosition().x);
        const widths = shapes.map(s => new BoundingBox(s.getShapePoints()).width);
        const gap = this.getGap();
        const k = ContainInsideRectangle.layoutStrength;

        const xs = shapes.map(s => s.getWorldPosition().x);
        const moves = xs.map(() => 0);
        for(let i=1;i<shapes.length;i++) {
            const overlap = (widths[i-1]+widths[i])/2 + gap - (xs[i]-xs[i-1]);
            if(overlap<=0) continue;
            const aFixed = shapes[i-1].isSelected(), bFixed = shapes[i].isSelected();
            if(aFixed && bFixed) continue;
            const aShare = aFixed ? 0 : (bFixed ? 1 : 0.5);
            moves[i-1] -= overlap*aShare*k;
            moves[i]   += overlap*(1-aShare)*k;
        }
        for(let i=0;i<shapes.length;i++) {
            if(shapes[i].isSelected()) continue;
            const p = shapes[i].getWorldPosition();
            const target = new WorldPosition(p.x+moves[i], p.y + (centreY-p.y)*k);
            if(Math.abs(target.x-p.x)>=0.25 || Math.abs(target.y-p.y)>=0.25) shapes[i].translate(target);
        }
    }

    /** Resize and recentre the box around whatever it holds. */
    private fitToContents():void {
        let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
        for(const shape of this.engineShapeList) {
            const box = new BoundingBox(shape.getShapePoints());
            left = Math.min(left,box.position.x);
            right = Math.max(right,box.position.x+box.width);
            top = Math.min(top,box.position.y);
            bottom = Math.max(bottom,box.position.y+box.height);
        }
        const gap = this.getGap();
        const rect = this.rectangleEngineShape;
        const width = right-left+gap*2, height = bottom-top+gap*2;
        if(Math.abs(width-rect.getWidth())>0.5 || Math.abs(height-rect.getHeight())>0.5)
            rect.setSize(width,height);
        rect.translate(new WorldPosition((left+right)/2,(top+bottom)/2));
    }

    private static easeToward(shape:EngineShape,target:WorldPosition,strength:number):void {
        const pos = shape.getWorldPosition();
        const dx = target.x-pos.x;
        const dy = target.y-pos.y;
        if(Math.abs(dx)<0.25 && Math.abs(dy)<0.25) return;
        shape.translate(new WorldPosition(pos.x+dx*strength,pos.y+dy*strength));
    }

    public numberOfAffectedChanged():void {
        const n = this.engineShapeList.length;
        if(n==0) { this.rectangleEngineShape.setSize(1,1); return; }
        let totalWidth = 0;
        let maxHeight = 0;
        for(const shape of this.engineShapeList) {
            const box = new BoundingBox(shape.getShapePoints());
            totalWidth += box.width;
            if(box.height>maxHeight) maxHeight = box.height;
        }
        const gap = this.getGap();
        this.rectangleEngineShape.setSize(
            totalWidth + gap*(n-1) + gap*2,
            maxHeight + gap*2
        );
    }
}
