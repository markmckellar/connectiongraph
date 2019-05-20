import { ParentChild } from "../pedigree/parentchild";
import { RectangleEngineShape } from "../../connectiongraph/engine/shapes/rectangleengineshape";
import { WorldId } from "../../connectiongraph/world/worldid";
import { World } from "../../connectiongraph/world/world";
import { RectangleDisplayShape } from "../../connectiongraph/display/drawableshapes/rectangledisplayshape";
import { PedigreeGraph } from "./pedigreegraph";
import { WorldPosition } from "../../connectiongraph/world/worldposition";
import { ContainInsideRectangle } from "../../connectiongraph/engine/arearule/arearuleobject/containinsiderectangle";
import { DrawShapeWithBorderParams } from "../../connectiongraph/display/drawshapewithborderparams";

export class ParentChildGraph {
    public parentChildContainerShape:RectangleEngineShape; 
    public spouseContainerShape:RectangleEngineShape; 
    public childEngineShape:RectangleEngineShape;
    public motherEngineShape:RectangleEngineShape;
    public fatherEngineShape:RectangleEngineShape;

    public spouseContainer:ContainInsideRectangle
    public parentChildContainer:ContainInsideRectangle


    public parentChild:ParentChild;
    public world:World;
    public pedigreeGraph:PedigreeGraph

    constructor(parentChild:ParentChild,pedigreeGraph:PedigreeGraph) {
        this.parentChild = parentChild;
        this.pedigreeGraph = pedigreeGraph;
        this.world = this.pedigreeGraph.world;

        this.parentChildContainerShape = this.getContainerEngineShape(this.pedigreeGraph.pedigreeGraphParams.personChildDrawShapeParams);
        this.spouseContainerShape = this.getContainerEngineShape(this.pedigreeGraph.pedigreeGraphParams.spouseDrawShapeParams);

        this.childEngineShape = this.retiveOrCreatePersonShape();
        this.motherEngineShape = this.retiveOrCreatePersonShape();
        this.fatherEngineShape = this.retiveOrCreatePersonShape();

        this.spouseContainer = new ContainInsideRectangle(this.world.worldEngine,this.spouseContainerShape);
        this.spouseContainer.addListToAffectedShapeList([this.motherEngineShape,this.fatherEngineShape]);
        for(let i=0;i<this.spouseContainer.engineShapeList.length;i++) this.spouseContainer.engineShapeList[i].stopRotation();
        this.spouseContainer.areaEngineShape.stopRotation();
        this.world.addWorldObject(this.spouseContainerShape);
        for(let i=0;i<this.spouseContainer.engineShapeList.length;i++) this.world.addWorldObject(this.spouseContainer.engineShapeList[i]);
        
        this.parentChildContainer = new ContainInsideRectangle(this.world.worldEngine,this.parentChildContainerShape);
        //this.spouseContainer.addListToAffectedShapeList([this.motherEngineShape,this.fatherEngineShape]);
        //for(let i=0;i<this.spouseContainer.engineShapeList.length;i++) this.spouseContainer.engineShapeList[i].stopRotation();
        //this.spouseContainer.areaEngineShape.stopRotation();
        //this.world.addWorldObject(this.spouseContainerShape);
        //for(let i=0;i<this.spouseContainer.engineShapeList.length;i++) this.world.addWorldObject(this.spouseContainer.engineShapeList[i]);


    }
 

    private getContainerEngineShape(drawPrams:DrawShapeWithBorderParams):RectangleEngineShape {
        let parentChildShape:RectangleEngineShape = 
        this.world.worldEngine.createRectangle(
          new WorldId(JSON.stringify(
                {
                    childId:this.parentChild.child.personId,
                    motherId:this.parentChild.mother.personId,
                    fatherId:this.parentChild.father.personId,
                })),
          new RectangleDisplayShape(drawPrams),
          1,1, // its size is ajust by its contents
          new WorldPosition(300,100),
          {}
        );
        return(parentChildShape);
    }

    private retiveOrCreatePersonShape():RectangleEngineShape {
        let worldId = new WorldId(JSON.stringify(
            {
                personId:this.parentChild.child.personId,
            }));
        let parentChildShape:RectangleEngineShape = 
        this.world.worldEngine.createRectangle(
          worldId,
          new RectangleDisplayShape(this.pedigreeGraph.pedigreeGraphParams.personDrawShapeParams),
          this.pedigreeGraph.pedigreeGraphParams.personSize,
          this.pedigreeGraph.pedigreeGraphParams.personSize,
          new WorldPosition(300,100),
          {}
        );
        parentChildShape.addToCollissionTags("PersonShapeCollissionTag");

        return(parentChildShape);
    }
    

}