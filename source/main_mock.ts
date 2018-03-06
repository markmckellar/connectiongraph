import { CanvasHolderHTML } from "./display/canvas/canvasholderhtml";
import { MockEngine } from "./engine/mockengine/mockengine";
import { WorldOfWorldObjects } from "./world/worldofworldobjects";
import { CircleDisplayShape } from "./display/drawableshapes/circledisplayshape";
import { WorldPosition } from "./world/worldposition";
import { WorldId } from "./world/worldid";
import { CircleEngineShape } from "./engine/shapes/circleengineshape";
import { RectangleEngineShape } from "./engine/shapes/rectangleengineshape";
import { RectangleDisplayShape } from "./display/drawableshapes/rectangledisplayshape";
import { PolygonEngineShape } from "./engine/shapes/polygonengineshape";
import { PolygonDisplayShape } from "./display/drawableshapes/polygondisplayshape";


let mockEngine = new MockEngine();
let world:WorldOfWorldObjects = new WorldOfWorldObjects(mockEngine);
let canvasHolder:CanvasHolderHTML = new CanvasHolderHTML("worldCanvas",world);

let circle1:CircleEngineShape = world.worldEngine.createCircle(
  new WorldId("circle1"),
  new CircleDisplayShape(),
  30,8,
  new WorldPosition(400,400),
  {}
);

let circle2:CircleEngineShape = world.worldEngine.createCircle(
  new WorldId("circle1"),
  new CircleDisplayShape(),
  40,8,
  new WorldPosition(300,300),
  {}
);

let rectangle1:RectangleEngineShape = world.worldEngine.createRectangle(
  new WorldId("rectangle1"),
  new RectangleDisplayShape(),
  40,40,
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
      
world.worldObjectArray.push(circle1);
world.worldObjectArray.push(circle2);
world.worldObjectArray.push(rectangle1);
world.worldObjectArray.push(polygon1);
world.worldObjectArray.push(world.worldEngine.getMouseAnchor());




let interval:number = 1000/30; //one millisecond over beat per second

console.log("drawing every : "+interval+"ms");

setInterval(doDraw,interval);

function doDraw()
{
  world.drawWorld(canvasHolder);	
}



