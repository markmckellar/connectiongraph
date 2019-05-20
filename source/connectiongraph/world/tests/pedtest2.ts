import { CanvasHolderHTML } from "../../display/canvas/canvasholderhtml";
import { WorldPosition } from "../worldposition";
import { WorldId } from "../worldid";
import { WorldEngine } from "../../engine/worldengine";
import { World } from "../world";
import { BaseTest } from "./basetest";
import { RectangleEngineShape } from "../../engine/shapes/rectangleengineshape";
import { RectangleDisplayShape } from "../../display/drawableshapes/rectangledisplayshape";
import { ContainInsideRectangle } from "../../engine/arearule/arearuleobject/containinsiderectangle";
import { EngineConnectorDef } from "../../engine/connectors/engineconnectordef";
import { EngineConnector } from "../../engine/connectors/engineconnector";
import { LineConnectorDisplay } from "../../display/drawableshapes/lineconnectordisplay";
import { PositionerLockX } from "../../engine/connectors/connectorpositioners/positionerlockx";
export class PedTest2 extends BaseTest {

    constructor(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML)  {
      super(worldEngine,world,canvasHolder);
    }
  
    public buildTest() {
      console.log("building PedTest");
      let world = this.world;
      
      let c1 = this.buildContainedRects(3,6,30);
      let c2 = this.buildContainedRects(3,2,30);
      let c3 = this.buildContainedRects(1,2,30);

      //let all1 = this.buildContainrsAroundContainers("all1",c1);
      let all2 = this.buildContainrsAroundContainers("all2",c2);
      //let all3 = this.buildContainrsAroundContainers("all2",c3);

      this.connectParentChildContainers(c2[0],c1[0]);
      this.connectParentChildContainers(c2[1],c1[1]);
      this.connectParentChildContainers(c2[2],c1[2]);

      this.connectParentChildContainers(c3[0],all2);
   



      
      // want to keep the visiual that you get a return value for these calls

      world.addWorldObject(world.worldEngine.getMouseAnchor());
    }

    public connectParentChildContainers(
      //parent:ContainInsideRectangle,child:ContainInsideRectangle
      child:ContainInsideRectangle,parent:ContainInsideRectangle
      ) {
      
      let engineConnectorDef:EngineConnectorDef = new EngineConnectorDef(parent.areaEngineShape,new PositionerLockX(),150,0.01);
      let connector:EngineConnector = this.world.worldEngine.createConnector(
        new WorldId(parent.areaEngineShape.getWorldId()+":childConnector"),
        new LineConnectorDisplay(),//drawableConnector:DrawableConnector,
        child.areaEngineShape,//connectorShape:EngineShape,
        [engineConnectorDef],
        {}
      );
      this.world.addWorldObject(connector)
      return(connector);
    }

    public buildContainrsAroundContainers(containerName:string,toAdd:Array<ContainInsideRectangle>):ContainInsideRectangle {
      let  drawShapeParams =  {
        fillStyle:"0000ff4f",
        strokeStyle:"0000ffff",
        lineWidth:2
      };
      // make the shape to hold our list of containers
      let containerShape:RectangleEngineShape = 
        this.world.worldEngine.createRectangle(
          new WorldId(containerName),
          new RectangleDisplayShape(drawShapeParams),
          //rectSize*(rects.length)+rectSize/2,rectSize+rectSize/2,
          1,1,
          new WorldPosition(300,100),
          {}
        );    
      // if we wanted them to collide...
      //containerShape.addToCollissionTags("ContainerShapeCollissionTagOuter");
      
      // make the container that will hold the list of containers
      let container = new ContainInsideRectangle(this.world.worldEngine,containerShape);      
      container.areaEngineShape.stopRotation();
      this.world.addWorldObject(containerShape);

      // add in the list to the container
      for(let i=0;i<toAdd.length;i++) {
        console.log("Adding "+toAdd[i].areaEngineShape.getWorldId().id+" to "+container.areaEngineShape.getWorldId().id);
        container.addToAffectedShapeList(toAdd[i].areaEngineShape);
      }

      // tell the world to watch this containers rules
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

        // build all the engine shapes for the rectangles we will be adding to containers
        for(let i=0;i<numbRectsInContainer;i++) rects.push(
          this.world.worldEngine.createRectangle(
            new WorldId("rect_"+r+"."+i),
            new RectangleDisplayShape(drawShapeParams),
            rectSize,rectSize,
            new WorldPosition(100+rectSize*i,100),
            {}
          ));

          // build all the shape which will be the containers holding the above rectangles
        let containerShape:RectangleEngineShape = 
        this.world.worldEngine.createRectangle(
            new WorldId("containerInsideShape"+r),
            new RectangleDisplayShape(drawShapeParams),
            //rectSize*(rects.length)+rectSize/2,rectSize+rectSize/2,
            1,1,
            new WorldPosition(300,100),
            {}
          );    
        // these containers will collide with other ContainerShapeCollissionTag
        containerShape.addToCollissionTags("ContainerShapeCollissionTag");

        // make our new container and add our rectangles to it
        let container = new ContainInsideRectangle(this.world.worldEngine,containerShape);
        containers.push(container);
        container.addListToAffectedShapeList(rects);
        for(let i=0;i<rects.length;i++) rects[i].stopRotation();
        container.areaEngineShape.stopRotation();
        this.world.addWorldObject(containerShape);
        for(let i=0;i<rects.length;i++) this.world.addWorldObject(rects[i]);

        // tell the world to watch this containers rules

        this.world.worldEngine.areaRuleObjectArray.push(container);
      }
      return(containers);
    } 

}