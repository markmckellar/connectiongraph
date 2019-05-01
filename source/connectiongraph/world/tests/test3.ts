import { CanvasHolderHTML } from "../../../connectiongraph/display/canvas/canvasholderhtml";
import { CircleDisplayShape } from "../../../connectiongraph/display/drawableshapes/circledisplayshape";
import { WorldPosition } from "../../../connectiongraph/world/worldposition";
import { WorldId } from "../../../connectiongraph/world/worldid";
import { CircleEngineShape } from "../../../connectiongraph/engine/shapes/circleengineshape";
import { WorldEngine } from "../../../connectiongraph/engine/worldengine";
import { World } from "../../../connectiongraph/world/world";
import { EngineConnector } from "../../../connectiongraph/engine/connectors/engineconnector";
import { EngineConnectorDef } from "../../../connectiongraph/engine/connectors/engineconnectordef";
import { LineConnectorDisplay } from "../../../connectiongraph/display/drawableshapes/lineconnectordisplay";
/*
import { PositionerLockX } from "../../../connectiongraph/engine/connectors/connectorpositioners/positionerlockx";
import { PositionerLockY } from "../../../connectiongraph/engine/connectors/connectorpositioners/positionerlockxy";
import { ShapeAndText } from "../../../connectiongraph/engine/shapes/shapeandtext";
import { RectangleEngineShape } from "../../../connectiongraph/engine/shapes/rectangleengineshape";
import { RectangleDisplayShape } from "../../../connectiongraph/display/drawableshapes/rectangledisplayshape";
import { TextDisplayShape } from "../../../connectiongraph/display/drawableshapes/textdisplayshape";
import { PolygonDisplayShape } from "../../../connectiongraph/display/drawableshapes/polygondisplayshape";
import { PolygonEngineShape } from "../../../connectiongraph/engine/shapes/polygonengineshape";
import { TextEngineShape } from "../../../connectiongraph/engine/shapes/textengineshape";
*/
import { BaseTest } from "./basetest";
import { PositionerFree } from "../../engine/connectors/connectorpositioners/positionerfree";
export class Test3 extends BaseTest {

    constructor(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML)  {
      super(worldEngine,world,canvasHolder);
    }

    public buildTest() {
      console.log("building Test2");
      let world = this.world;
       let circle1a:CircleEngineShape = world.worldEngine.createCircle(
          new WorldId("circle1a"),
          new CircleDisplayShape(),
          25,8,
          new WorldPosition(200,200),
          {restitution:0.9}
        );
        
      let circle1b:CircleEngineShape = world.worldEngine.createCircle(
        new WorldId("circle1b"),
        new CircleDisplayShape(),
        40,8,
        //new WorldPosition(200+Math.sqrt(2)*100,200+Math.sqrt(2)*100),
        new WorldPosition(410,210),
        {restitution:0.9}
      );

      world.addWorldObject(circle1a);
      world.addWorldObject(circle1b);
    
      let cd1:EngineConnectorDef = new EngineConnectorDef(circle1a,new PositionerFree(),200,0.01);
      let connector1:EngineConnector = world.worldEngine.createConnector(
        new WorldId("connector1"),
        new LineConnectorDisplay(),//drawableConnector:DrawableConnector,
        circle1b,//connectorShape:EngineShape,
        [cd1],
        {}
      );
    
    

    
      world.addWorldObject(connector1);
    
      world.addWorldObject(world.worldEngine.getMouseAnchor());
    }

}