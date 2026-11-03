import { World } from "../world";
import { WorldId } from "../worldid";
import { WorldPosition } from "../worldposition";
import { WorldObject } from "../worldobject";
import { RectangleEngineShape } from "../../engine/shapes/rectangleengineshape";
import { RectangleDisplayShape } from "../../display/drawableshapes/rectangledisplayshape";
import { ContainInsideRectangle } from "../../engine/arearule/arearuleobject/containinsiderectangle";
import { EngineConnectorDef } from "../../engine/connectors/engineconnectordef";
import { EngineConnector } from "../../engine/connectors/engineconnector";
import { ElbowConnectorDisplay } from "../../display/drawableshapes/elbowconnectordisplay";
import { PositionerBelow } from "../../engine/connectors/connectorpositioners/positionerbelow";

const PERSON_STYLE     = { fillStyle:"c8e6c9ff", strokeStyle:"2e7d32ff", lineWidth:2 };
const FAMILY_STYLE     = { fillStyle:"fff3e0b0", strokeStyle:"ef6c00ff", lineWidth:1.5 };
const GENERATION_STYLE = { fillStyle:"e3f2fd90", strokeStyle:"1565c0ff", lineWidth:2 };

/** Heavy damping so the layout settles instead of drifting after collisions. */
const BODY_OPTIONS = { frictionAir:0.3 };

/**
 * Builds pedigree-style scenes: people in a row inside a family (sibship) box,
 * families optionally grouped in a generation box, and child families hung
 * below their parents with connectors.
 *
 * Shapes are collected and only added to the world in commit(), so they draw
 * back-to-front: generations, families, connectors, people.
 */
export class PedigreeBuilder {
    public personSize = 30;

    private generations:Array<WorldObject> = [];
    private families:Array<WorldObject> = [];
    private people:Array<WorldObject> = [];
    private connectors:Array<WorldObject> = [];

    constructor(public world:World) {
    }

    /** One sibship: `size` people in a row, centred on `at`. */
    public family(id:string,size:number,at:WorldPosition):ContainInsideRectangle {
        const engine = this.world.worldEngine;
        const people:Array<RectangleEngineShape> = [];
        for(let i=0;i<size;i++) {
            const x = at.x + (i-(size-1)/2)*this.personSize*1.2;
            const person = engine.createRectangle(
                new WorldId(id+".person"+i),
                new RectangleDisplayShape(PERSON_STYLE),
                this.personSize,this.personSize,
                new WorldPosition(x,at.y),
                {...BODY_OPTIONS});
            person.stopRotation();
            people.push(person);
        }

        const shape = this.createBox(id,FAMILY_STYLE,at);
        const family = new ContainInsideRectangle(engine,shape);
        family.addListToAffectedShapeList(people);
        PedigreeBuilder.noCollisionsWithin(family);
        engine.areaRuleObjectArray.push(family);

        this.families.push(shape);
        this.people.push(...people);
        return(family);
    }

    /** `count` families of `size` people, spread left-to-right starting around `at`. */
    public familyRow(prefix:string,count:number,size:number,at:WorldPosition):Array<ContainInsideRectangle> {
        const familyWidth = size*this.personSize*1.4;
        const rowWidth = familyWidth*count;
        const families:Array<ContainInsideRectangle> = [];
        for(let i=0;i<count;i++)
            families.push(this.family(prefix+i,size,
                new WorldPosition(at.x - rowWidth/2 + familyWidth*(i+0.5), at.y)));
        return(families);
    }

    /**
     * A generation: its families share one row and can't overlap, but are
     * otherwise free to slide sideways (to sit under their parents).
     */
    public generation(id:string,families:Array<ContainInsideRectangle>):ContainInsideRectangle {
        const engine = this.world.worldEngine;
        const centre = WorldPosition.getAveragePostionFromWorldPositionList(
            families.map(f => f.areaEngineShape.getWorldPosition()));
        const shape = this.createBox(id,GENERATION_STYLE,centre);
        const generation = new ContainInsideRectangle(engine,shape,"spread");
        for(const f of families) generation.addToAffectedShapeList(f.areaEngineShape);
        PedigreeBuilder.noCollisionsWithin(generation);
        engine.areaRuleObjectArray.push(generation);
        this.generations.push(shape);
        return(generation);
    }

    /** Hang `child` below `parent`, joined by a pedigree-style elbow line. */
    public connect(child:ContainInsideRectangle,parent:ContainInsideRectangle,gap:number = 40):EngineConnector {
        const def = new EngineConnectorDef(parent.areaEngineShape,new PositionerBelow(gap),gap,0);
        const connector = this.world.worldEngine.createConnector(
            new WorldId(parent.areaEngineShape.getWorldId().id+"->"+child.areaEngineShape.getWorldId().id),
            new ElbowConnectorDisplay(),
            child.areaEngineShape,
            [def],
            {});
        this.connectors.push(connector);
        return(connector);
    }

    /** Add everything to the world in back-to-front draw order. */
    public commit():void {
        for(const o of [...this.generations,...this.families,...this.connectors,...this.people])
            this.world.addWorldObject(o);
        this.world.addWorldObject(this.world.worldEngine.getMouseAnchor());
    }

    /**
     * Containers tag their members so they collide with each other. Here the
     * row layout already keeps members apart, and physical collisions would
     * stop you dragging one sibling past another to reorder them.
     */
    private static noCollisionsWithin(container:ContainInsideRectangle):void {
        for(const shape of container.engineShapeList)
            shape.removeFromCollisionTags(container.areaEngineShape.getWorldId().id);
    }

    private createBox(id:string,style:object,at:WorldPosition):RectangleEngineShape {
        const shape = this.world.worldEngine.createRectangle(
            new WorldId(id),
            new RectangleDisplayShape(style as any),
            1,1, // resized to fit its contents
            at,
            {...BODY_OPTIONS});
        shape.stopRotation();
        return(shape);
    }
}
