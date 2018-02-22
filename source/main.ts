import { CanvasHolderHTML } from "./display/canvas/canvasholderhtml";
import { MockEngine } from "./engine/mockengine/mockengine";
import { WorldOfWorldObjects } from "./world/worldofworldobjects";
import { MockCircle } from "./engine/mockengine/shapes/mockcircle";
import { CircleDisplayShape } from "./display/drawableshapes/circledisplayshape";
import { WorldPosition } from "./world/worldposition";
import { WorldId } from "./world/worldid";


let mockEngine = new MockEngine();
let world:WorldOfWorldObjects = new WorldOfWorldObjects(mockEngine);
let canvasHolder:CanvasHolderHTML = new CanvasHolderHTML("worldCanvas",world);

let circle1:MockCircle = new MockCircle(
    new WorldId("mockCircle"),
    new CircleDisplayShape(),
    30,8,new WorldPosition(400,400));

let circle2:MockCircle = new MockCircle(
  new WorldId("mockCircle"),
  new CircleDisplayShape(),
  30,8,new WorldPosition(200,200));
      
world.worldObjectArray.push(circle1);
world.worldObjectArray.push(circle2);

let interval:number = 1000/30; //one millisecond over beat per second

console.log("drawing every : "+interval+"ms");

setInterval(doDraw,interval);

function doDraw()
{
  world.drawWorld(canvasHolder);	
}



