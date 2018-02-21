import { CanvasHolderHTML } from "./display/canvas/canvasholderhtml";
import { MockEngine } from "./engine/mockengine/mockengine";
import { WorldOfWorldObjects } from "./world/worldofworldobjects";
import { MockCircle } from "./engine/mockengine/shapes/mockcircle";
import { CircleDisplayShape } from "./display/shapes/circledisplayshape";
import { WorldPosition } from "./world/worldposition";


let mockEngine = new MockEngine();
let world:WorldOfWorldObjects = new WorldOfWorldObjects(mockEngine);
let canvasHolder:CanvasHolderHTML = new CanvasHolderHTML("worldCanvas",world);

let circle:MockCircle = new MockCircle(30,8,new WorldPosition(400,400));
world.worldEngine.push(circle);

let bbm:number = 240;
let bbs:number = bbm/60.0;
let interval:number = 1000/bbs; //one millisecond over beat per second

console.log("drawing every : "+interval+"ms");

setInterval(doDraw,interval);

function doDraw()
{
  world.drawWorld(canvasHolder);	
}



