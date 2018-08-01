import { CanvasHolderHTML } from "./display/canvas/canvasholderhtml";
import { CircleDisplayShape } from "./display/drawableshapes/circledisplayshape";
import { WorldPosition } from "./world/worldposition";
import { WorldId } from "./world/worldid";
import { CircleEngineShape } from "./engine/shapes/circleengineshape";
import { RectangleEngineShape } from "./engine/shapes/rectangleengineshape";
import { RectangleDisplayShape } from "./display/drawableshapes/rectangledisplayshape";
import { TextDisplayShape } from "./display/drawableshapes/textdisplayshape";
import { PolygonDisplayShape } from "./display/drawableshapes/polygondisplayshape";
import { PolygonEngineShape } from "./engine/shapes/polygonengineshape";
import { TextEngineShape } from "./engine/shapes/textengineshape";
import { WorldEngine } from "./engine/worldengine";
import { World } from "./world/world";
import { EngineConnector } from "./engine/connectors/engineconnector";
import { EngineConnectorDef } from "./engine/connectors/engineconnectordef";
import { LineConnectorDisplay } from "./display/drawableshapes/lineconnectordisplay";
import { PositionerLockX } from "./engine/connectors/connectorpositioners/positionerlockx";
import { PositionerLockY } from "./engine/connectors/connectorpositioners/positionerlockxy";
import { ShapeAndText } from "./engine/shapes/shapeandtext";

export class Test1 {

    constructor(worldEngine:WorldEngine,world:World,canvasHolder:CanvasHolderHTML) {

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
      
      
      worldEngine.createBounds(canvasHolder.getWidth(),canvasHolder.getHeight(),{restitution:0.9});
      let interval:number = 1000/30; //one millisecond over beat per second
      console.log("drawing every : "+interval+"ms");
      setInterval(doDraw,interval);
      
      worldEngine.startEngine();
      function doDraw()
      {
        world.drawWorld(canvasHolder);	
      }
    }

}