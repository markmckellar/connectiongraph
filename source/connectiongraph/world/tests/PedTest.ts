import { CanvasHolderHTML } from "../../display/canvas/canvasholderhtml";
import { WorldPosition } from "../worldposition";
import { WorldId } from "../worldid";
import { WorldEngine } from "../../engine/worldengine";
import { World } from "../world";
import { BaseTest } from "./basetest";
import { RectangleEngineShape } from "../../engine/shapes/rectangleengineshape";
import { RectangleDisplayShape } from "../../display/drawableshapes/rectangledisplayshape";
export class PedTest extends BaseTest {

    constructor(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML)  {
      super(worldEngine,world,canvasHolder);
    }

    public buildTest() {
      console.log("building PedTest");
      let world = this.world;
        
      let childGroup1_1:RectangleEngineShape = world.worldEngine.createRectangle(
          new WorldId("childGroup1_1"),
          new RectangleDisplayShape(),
          100,100,
          new WorldPosition(100,100),
          {}
        );

      let childGroup1_2:RectangleEngineShape = world.worldEngine.createRectangle(
          new WorldId("childGroup1_2"),
          new RectangleDisplayShape(),
          100,100,
          new WorldPosition(100,100),
          {}
        );      
        
        let childGroup1_3:RectangleEngineShape = world.worldEngine.createRectangle(
          new WorldId("childGroup1_3"),
          new RectangleDisplayShape(),
          100,100,
          new WorldPosition(100,100),
          {}
        );               

      let childGroup2_1:RectangleEngineShape = world.worldEngine.createRectangle(
          new WorldId("childGroup2_1"),
          new RectangleDisplayShape(),
          100,100,
          new WorldPosition(100,100),
          {}
        );    
        

      let childGroup2_2:RectangleEngineShape = world.worldEngine.createRectangle(
          new WorldId("childGroup2_2"),
          new RectangleDisplayShape(),
          100,100,
          new WorldPosition(100,100),
          {}
        );  
        
        let childGroup3_1:RectangleEngineShape = world.worldEngine.createRectangle(
          new WorldId("childGroup3_1"),
          new RectangleDisplayShape(),
          100,100,
          new WorldPosition(100,100),
          {}
        );          



      world.addWorldObject(childGroup1_1);
      world.addWorldObject(childGroup1_2);
      world.addWorldObject(childGroup1_3);

      world.addWorldObject(childGroup2_1);
      world.addWorldObject(childGroup2_2);

      world.addWorldObject(childGroup3_1);
      
    /*
      let cd1:EngineConnectorDef = new EngineConnectorDef(circle1a,new PositionerFree(),200,0.01);
      let connector1:EngineConnector = world.worldEngine.createConnector(
        new WorldId("connector1"),
        new LineConnectorDisplay(),//drawableConnector:DrawableConnector,
        circle1b,//connectorShape:EngineShape,
        [cd1],
        {}
      );

            world.addWorldObject(connector1);

    */
    

    
    
      world.addWorldObject(world.worldEngine.getMouseAnchor());
    }

}