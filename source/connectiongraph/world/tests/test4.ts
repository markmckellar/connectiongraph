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
import { BaseTest } from "./basetest";
import { PositionerCenterConnectorShape } from "../../engine/connectors/connectorpositioners/positionercenterconnectorshape";
export class Test4 extends BaseTest {

    constructor(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML)  {
      super(worldEngine,world,canvasHolder);
    }

    public buildTest() {
      console.log("building Test2");
      let world = this.world;
      let restitution = 0.0;
      let density = 0.0;


       let circle1a:CircleEngineShape = world.worldEngine.createCircle(
          new WorldId("circle1a"),
          new CircleDisplayShape(),
          20,8,
          new WorldPosition(200,200),
          {restitution:restitution,density:density}
        );
        
      let circle1b:CircleEngineShape = world.worldEngine.createCircle(
        new WorldId("circle1b"),
        new CircleDisplayShape(),
        30,8,
        //new WorldPosition(200+Math.sqrt(2)*100,200+Math.sqrt(2)*100),
        new WorldPosition(410,210),
        {restitution:restitution,density:density}
        );

        let circle1c:CircleEngineShape = world.worldEngine.createCircle(
          new WorldId("circle1c"),
          new CircleDisplayShape(),
          40,8,
          //new WorldPosition(200+Math.sqrt(2)*100,200+Math.sqrt(2)*100),
          new WorldPosition(600,600),
          {restitution:restitution,density:density}
          );
              

          circle1b.addToCollissionTags("COLLIDE");          
          circle1c.addToCollissionTags("COLLIDE");          
      let connectorCircle:CircleEngineShape = world.worldEngine.createCircle(
        new WorldId("connectorCircle"),
        new CircleDisplayShape(),
        10,8,
        //new WorldPosition(200+Math.sqrt(2)*100,200+Math.sqrt(2)*100),
        new WorldPosition(410,210),
        {restitution:restitution,density:density}
        );

      world.addWorldObject(circle1a);
      world.addWorldObject(circle1b);
      world.addWorldObject(circle1c);
      world.addWorldObject(connectorCircle);


    
      let cd1:EngineConnectorDef = new EngineConnectorDef(circle1a,new PositionerCenterConnectorShape(),50,0.01);
      let cd2:EngineConnectorDef = new EngineConnectorDef(circle1b,new PositionerCenterConnectorShape(),50,0.01);

      let connector1:EngineConnector = world.worldEngine.createConnector(
        new WorldId("connector1"),
        new LineConnectorDisplay(),//drawableConnector:DrawableConnector,
        connectorCircle,//connectorShape:EngineShape,
        [cd1,cd2],
        {}
      );
    
    

    
      world.addWorldObject(connector1);
    
      world.addWorldObject(world.worldEngine.getMouseAnchor());
    }

}