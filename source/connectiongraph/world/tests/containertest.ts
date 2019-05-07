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
        
      let rects = new Array<RectangleEngineShape>();
      for(let i=0;i<1;i++)
      rects.push(world.worldEngine.createRectangle(
          new WorldId("rect_"+i),
          new RectangleDisplayShape(),
          50,50,
          new WorldPosition(100+50*i,100),
          {}
        ));

      let container:RectangleEngineShape = world.worldEngine.createRectangle(
          new WorldId("containerInsideShape1"),
          new RectangleDisplayShape(),
          320,90,
          new WorldPosition(300,100),
          {}
        );           

      let containInsideShape = new ContainInsideRectangle(world.worldEngine,container);

      containInsideShape.addListToAffectedShapeList(rects);
      for(let i=0;i<rects.length;i++) rects[i].stopRotation();
      containInsideShape.areaEngineShape.stopRotation();
      

      world.addWorldObject(container);
      for(let i=0;i<rects.length;i++) world.addWorldObject(rects[i]);

      world.worldEngine.areaRuleObjectArray.push(containInsideShape);

    
    
      world.addWorldObject(world.worldEngine.getMouseAnchor());
    }

}