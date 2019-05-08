import { CanvasHolderHTML } from "../../display/canvas/canvasholderhtml";
import { WorldPosition } from "../worldposition";
import { WorldId } from "../worldid";
import { WorldEngine } from "../../engine/worldengine";
import { World } from "../world";
import { BaseTest } from "./basetest";
import { RectangleEngineShape } from "../../engine/shapes/rectangleengineshape";
import { RectangleDisplayShape } from "../../display/drawableshapes/rectangledisplayshape";
import { ContainInsideRectangle } from "../../engine/arearule/arearuleobject/containinsiderectangle";
export class ContainerTest extends BaseTest {

    constructor(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML)  {
      super(worldEngine,world,canvasHolder);
    }

    public buildTest() {
      console.log("building PedTest");
      let world = this.world;
      let containers = new Array<ContainInsideRectangle>();
      let  drawShapeParams =  {
        fillStyle:"ff0000ff",
        strokeStyle:"0000ffff",
        lineWidth:2
    }

      for(let r=0;r<3;r++)
      {        
        let rects = new Array<RectangleEngineShape>();
        for(let i=0;i<5;i++) rects.push(world.worldEngine.createRectangle(
            new WorldId("rect_"+r+"."+i),
            new RectangleDisplayShape(drawShapeParams),
            50,50,
            new WorldPosition(100+50*i,100),
            {}
          ));

        let containerShape:RectangleEngineShape = world.worldEngine.createRectangle(
            new WorldId("containerInsideShape"+r),
            new RectangleDisplayShape(drawShapeParams),
            50*(rects.length)+25,50+25,
            new WorldPosition(300,100),
            {}
          );    
        containerShape.addToCollissionTags("ContainerShapeCollissionTag");

        let container = new ContainInsideRectangle(world.worldEngine,containerShape);
        containers.push(container);

        container.addListToAffectedShapeList(rects);
        for(let i=0;i<rects.length;i++) rects[i].stopRotation();
        container.areaEngineShape.stopRotation();

        world.addWorldObject(containerShape);
        for(let i=0;i<rects.length;i++) world.addWorldObject(rects[i]);
        world.worldEngine.areaRuleObjectArray.push(container);
      }

      for(let i=0;i<containers.length;i++) {
      }
    
    
      world.addWorldObject(world.worldEngine.getMouseAnchor());
    }

}