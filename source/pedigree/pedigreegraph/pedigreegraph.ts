import { World } from "../../connectiongraph/world/world";
import { Pedigree } from "../pedigree/pedigree";
import { ParentChild } from "../pedigree/parentchild";
import { RectangleEngineShape } from "../../connectiongraph/engine/shapes/rectangleengineshape";
import { WorldId } from "../../connectiongraph/world/worldid";
import { RectangleDisplayShape } from "../../connectiongraph/display/drawableshapes/rectangledisplayshape";
import { WorldPosition } from "../../connectiongraph/world/worldposition";
import { PedigreeGraphParams } from "./pedigreegraphparams";

export class PedigreeGraph {
    public world:World;
    public pedigree:Pedigree;
    public pedigreeGraphParams:PedigreeGraphParams;

    constructor(world:World,pedigree:Pedigree,pedigreeGraphParams:PedigreeGraphParams) {
        this.pedigree = pedigree;
        this.world = world;
        this.pedigreeGraphParams = pedigreeGraphParams;
    }

    public getParentChildShape(parentChild:ParentChild):RectangleEngineShape {
        let  drawShapeParams =  {
            fillStyle:"0000ff4f",
            strokeStyle:"0000ffff",
            lineWidth:2
          };
          
        let parentChildShape:RectangleEngineShape = 
        this.world.worldEngine.createRectangle(
          new WorldId(JSON.stringify(
                {
                    childId:parentChild.child.personId,
                    motherId:parentChild.mother.personId,
                    fatherId:parentChild.father.personId,
                })),
          new RectangleDisplayShape(drawShapeParams),
          //rectSize*(rects.length)+rectSize/2,rectSize+rectSize/2,
          1,1,
          new WorldPosition(300,100),
          {}
        );  
        return(parentChildShape);
    }
}