import { CanvasHolderHTML } from "../../../connectiongraph/display/canvas/canvasholderhtml";
import { CircleDisplayShape } from "../../../connectiongraph/display/drawableshapes/circledisplayshape";
import { WorldPosition } from "../../../connectiongraph/world/worldposition";
import { WorldId } from "../../../connectiongraph/world/worldid";
import { CircleEngineShape } from "../../../connectiongraph/engine/shapes/circleengineshape";
import { RectangleEngineShape } from "../../../connectiongraph/engine/shapes/rectangleengineshape";
import { RectangleDisplayShape } from "../../../connectiongraph/display/drawableshapes/rectangledisplayshape";
import { TextDisplayShape } from "../../../connectiongraph/display/drawableshapes/textdisplayshape";
import { PolygonDisplayShape } from "../../../connectiongraph/display/drawableshapes/polygondisplayshape";
import { PolygonEngineShape } from "../../../connectiongraph/engine/shapes/polygonengineshape";
import { TextEngineShape } from "../../../connectiongraph/engine/shapes/textengineshape";
import { WorldEngine } from "../../../connectiongraph/engine/worldengine";
import { World } from "../../../connectiongraph/world/world";
import { EngineConnector } from "../../../connectiongraph/engine/connectors/engineconnector";
import { EngineConnectorDef } from "../../../connectiongraph/engine/connectors/engineconnectordef";
import { LineConnectorDisplay } from "../../../connectiongraph/display/drawableshapes/lineconnectordisplay";
import { PositionerLockX } from "../../../connectiongraph/engine/connectors/connectorpositioners/positionerlockx";
import { PositionerLockY } from "../../engine/connectors/connectorpositioners/positionerlocky";
import { ShapeAndText } from "../../../connectiongraph/engine/shapes/shapeandtext";
import { BaseTest } from "./basetest";
export class Test1 extends BaseTest {

    constructor(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML)  {
      super(worldEngine,world,canvasHolder);
    }

    public buildTest() {
      console.log("building Test1");
      let world = this.world;
       let circle1:CircleEngineShape = world.worldEngine.createCircle(
          new WorldId("circle1"),
          new CircleDisplayShape(),
          25,8,
          new WorldPosition(400,400),
          {restitution:0.9}
        );
        
      let circle2:CircleEngineShape = world.worldEngine.createCircle(
        new WorldId("circle2"),
        new CircleDisplayShape(),
        40,8,
        new WorldPosition(300,300),
        {restitution:0.9}
      );
      
        
      let rectangle1:RectangleEngineShape = world.worldEngine.createRectangle(
        new WorldId("rectangle1"),
        new RectangleDisplayShape(),
        100,100,
        new WorldPosition(100,100),
        {}
      );
      
      let polygon1:PolygonEngineShape = world.worldEngine.createPolygon(
        new WorldId("polygon1"),
        new PolygonDisplayShape(),
        5,40,
        new WorldPosition(400,100),
        {}
      );
      
      
      let textBox1:TextEngineShape = world.worldEngine.createTextBox(
        new WorldId("textbox1"),
        new TextDisplayShape(
          new RectangleDisplayShape(),
          "SomeText Mg\nAnd more text Mg"),
        100,100,
        new WorldPosition(550,550),
        {}
      );
            
      
      
      let textBox2:TextEngineShape = world.worldEngine.createTextBox(
        new WorldId("textbox2"),
        new TextDisplayShape(
          new RectangleDisplayShape(),
          "hey there friend Mg"),
        //80,20,
        100,100,
        new WorldPosition(150,350),
        {}
      );
      
      let textBox3:TextEngineShape = world.worldEngine.createTextBox(
        new WorldId("textbox3"),
        new TextDisplayShape(
          new RectangleDisplayShape(),
          "SomeText Mg\nAnd more text Mg\nSomeText Mg\nAnd more text Mg\nSomeText Mg\nAnd more text Mg\nSomeText Mg\nAnd MOOORE text Mg"),
          100,100,
          new WorldPosition(550,250),
        {}
      );
      
      let c1A:EngineConnectorDef = new EngineConnectorDef(textBox1,new PositionerLockX(),200,0.01);
      let c1B:EngineConnectorDef = new EngineConnectorDef(textBox2,new PositionerLockY(),200,0.01);

      let c1Circle:CircleEngineShape = world.worldEngine.createCircle(
        new WorldId("c1Circle"),
        new CircleDisplayShape(),
        40,8,
        new WorldPosition(300,300),
        {restitution:0.9}
      );
      
      let connector1:EngineConnector = world.worldEngine.createConnector(
        new WorldId("connector1"),
        new LineConnectorDisplay(),//drawableConnector:DrawableConnector,
        c1Circle,//connectorShape:EngineShape,
        [c1A,c1B],
        {}
      );



      let shapeAndText1:ShapeAndText = new ShapeAndText(world,circle2,textBox3,100);

      
      world.addWorldObject(circle1);
      world.addWorldObject(circle2);
      world.addWorldObject(rectangle1);
      world.addWorldObject(polygon1);
      world.addWorldObject(textBox1);
      world.addWorldObject(textBox2);
      world.addWorldObject(textBox3);
      world.addWorldObject(connector1);

      world.addWorldObject(c1Circle);

      world.addWorldObject(shapeAndText1.connectorShape);
      world.addWorldObject(shapeAndText1.connector);


      world.addWorldObject(world.worldEngine.getMouseAnchor());
    }

}