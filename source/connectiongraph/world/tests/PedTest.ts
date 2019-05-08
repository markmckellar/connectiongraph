import { CanvasHolderHTML } from "../../display/canvas/canvasholderhtml";
import { WorldPosition } from "../worldposition";
import { WorldId } from "../worldid";
import { WorldEngine } from "../../engine/worldengine";
import { World } from "../world";
import { BaseTest } from "./basetest";
import { RectangleEngineShape } from "../../engine/shapes/rectangleengineshape";
import { RectangleDisplayShape } from "../../display/drawableshapes/rectangledisplayshape";
import { ContainInsideRectangle } from "../../engine/arearule/arearuleobject/containinsiderectangle";
export class PedTest extends BaseTest {

    constructor(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML)  {
      super(worldEngine,world,canvasHolder);
    }

    public buildTest() {
      console.log("building PedTest");
      let world = this.world;
      
      let c1 = this.buildContainedRects(3,6,30);
      let c2 = this.buildContainedRects(3,2,30);
      let c3 = this.buildContainedRects(1,2,30);

      let all1 = this.buildContainrsAroundContainers("all1",c1);
      let all2 = this.buildContainrsAroundContainers("all2",c2);


      world.addWorldObject(world.worldEngine.getMouseAnchor());
    }

    public buildContainrsAroundContainers(containerName:string,toAdd:Array<ContainInsideRectangle>):ContainInsideRectangle {
      let  drawShapeParams =  {
        fillStyle:"0000ff4f",
        strokeStyle:"0000ffff",
        lineWidth:2
    };
      let containerShape:RectangleEngineShape = this.world.worldEngine.createRectangle(
        new WorldId(containerName),
        new RectangleDisplayShape(drawShapeParams),
        //rectSize*(rects.length)+rectSize/2,rectSize+rectSize/2,
        1,1,
        new WorldPosition(300,100),
        {}
      );    
      containerShape.addToCollissionTags("ContainerShapeCollissionTagOuter");
      containerShape.stopRotation();
      let container = new ContainInsideRectangle(this.world.worldEngine,containerShape);      
      container.areaEngineShape.stopRotation();
      this.world.addWorldObject(containerShape);
      containerShape.stopRotation();
      for(let i=0;i<toAdd.length;i++) {
        console.log("Adding "+toAdd[i].areaEngineShape.getWorldId().id+" to "+container.areaEngineShape.getWorldId().id);
        container.addToAffectedShapeList(toAdd[i].areaEngineShape);
      }
      this.world.worldEngine.areaRuleObjectArray.push(container);
      return(container);
    }


    public buildContainedRects(      
      numbContainers:number,
      numbRectsInContainer:number,
      rectSize:number):Array<ContainInsideRectangle> {
      let containers = new Array<ContainInsideRectangle>();

      
      let  drawShapeParams =  {
        fillStyle:"00ff004f",
        strokeStyle:"0000ffff",
        lineWidth:2
    };


      for(let r=0;r<numbContainers;r++)
      {        
        let rects = new Array<RectangleEngineShape>();

        for(let i=0;i<numbRectsInContainer;i++) rects.push(this.world.worldEngine.createRectangle(
            new WorldId("rect_"+r+"."+i),
            new RectangleDisplayShape(drawShapeParams),
            rectSize,rectSize,
            new WorldPosition(100+rectSize*i,100),
            {}
          ));

        let containerShape:RectangleEngineShape = this.world.worldEngine.createRectangle(
            new WorldId("containerInsideShape"+r),
            new RectangleDisplayShape(drawShapeParams),
            //rectSize*(rects.length)+rectSize/2,rectSize+rectSize/2,
            1,1,
            new WorldPosition(300,100),
            {}
          );    
        containerShape.addToCollissionTags("ContainerShapeCollissionTag");

        let container = new ContainInsideRectangle(this.world.worldEngine,containerShape);
        containers.push(container);

        container.addListToAffectedShapeList(rects);
        for(let i=0;i<rects.length;i++) rects[i].stopRotation();
        container.areaEngineShape.stopRotation();

        this.world.addWorldObject(containerShape);
        for(let i=0;i<rects.length;i++) this.world.addWorldObject(rects[i]);
        this.world.worldEngine.areaRuleObjectArray.push(container);
      }
      return(containers);
    } 

}