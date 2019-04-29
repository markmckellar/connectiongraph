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
import { PositionerLockX } from "../../../connectiongraph/engine/connectors/connectorpositioners/positionerlockx";
import { PositionerLockY } from "../../../connectiongraph/engine/connectors/connectorpositioners/positionerlockxy";
/*
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
export class Test2 extends BaseTest {

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
          new WorldPosition(400,400),
          {restitution:0.9}
        );
        
      let circle1b:CircleEngineShape = world.worldEngine.createCircle(
        new WorldId("circle1b"),
        new CircleDisplayShape(),
        40,8,
        new WorldPosition(300,300),
        {restitution:0.9}
      );

      let circle2a:CircleEngineShape = world.worldEngine.createCircle(
        new WorldId("circle2a"),
        new CircleDisplayShape(),
        25,8,
        new WorldPosition(500,500),
        {restitution:0.9}
      );
      
    let circle2b:CircleEngineShape = world.worldEngine.createCircle(
      new WorldId("circle2b"),
      new CircleDisplayShape(),
      40,8,
      new WorldPosition(550,550),
      {restitution:0.9}
    );

    let circle3a:CircleEngineShape = world.worldEngine.createCircle(
      new WorldId("circle3a"),
      new CircleDisplayShape(),
      25,8,
      new WorldPosition(100,100),
      {restitution:0.9}
    );
    
  let circle3b:CircleEngineShape = world.worldEngine.createCircle(
    new WorldId("circle3b"),
    new CircleDisplayShape(),
    40,8,
    new WorldPosition(150,150),
    {restitution:0.9}
  );

      let cd1:EngineConnectorDef = new EngineConnectorDef(circle1a,new PositionerLockX(),200,0.01);
      let cd2:EngineConnectorDef = new EngineConnectorDef(circle2a,new PositionerLockY(),200,0.01);
      let cd3:EngineConnectorDef = new EngineConnectorDef(circle3a,new PositionerFree(),200,0.01);
      let connector1:EngineConnector = world.worldEngine.createConnector(
        new WorldId("connector1"),
        new LineConnectorDisplay(),//drawableConnector:DrawableConnector,
        circle1b,//connectorShape:EngineShape,
        [cd1],
        {}
      );
      let connector2:EngineConnector = world.worldEngine.createConnector(
        new WorldId("connector2"),
        new LineConnectorDisplay(),//drawableConnector:DrawableConnector,
        circle2b,//connectorShape:EngineShape,
        [cd2],
        {}
      );
      let connector3:EngineConnector = world.worldEngine.createConnector(
        new WorldId("connector3"),
        new LineConnectorDisplay(),//drawableConnector:DrawableConnector,
        circle3b,//connectorShape:EngineShape,
        [cd3],
        {}
      );

    
      world.addWorldObject(circle1a);
      world.addWorldObject(circle1b);
      world.addWorldObject(circle2a);
      world.addWorldObject(circle2b);
      world.addWorldObject(circle3a);
      world.addWorldObject(circle3b);

      world.addWorldObject(connector1);
      world.addWorldObject(connector2);
      world.addWorldObject(connector3);

      world.addWorldObject(world.worldEngine.getMouseAnchor());
    }

}