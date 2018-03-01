import { CanvasHolderHTML } from "./display/canvas/canvasholderhtml";
import { WorldOfWorldObjects } from "./world/worldofworldobjects";
import { CircleDisplayShape } from "./display/drawableshapes/circledisplayshape";
import { WorldPosition } from "./world/worldposition";
import { WorldId } from "./world/worldid";
import { MatterEngine } from "./engine/matterengine/matterengine";
import * as Matter from "matter-js";
import { CircleEngineShape } from "./engine/shapes/circleengineshape";




let matterEngine = new MatterEngine();
let world:WorldOfWorldObjects = new WorldOfWorldObjects(matterEngine);
let canvasHolder:CanvasHolderHTML = new CanvasHolderHTML("worldCanvas",world);

let circle1:CircleEngineShape = world.worldEngine.createCircle(
      new WorldId("circle1"),
      new CircleDisplayShape(),
      30,8,
      new WorldPosition(400,400),
      {restitution:0.9}
    );
    
let circle2:CircleEngineShape = world.worldEngine.createCircle(
  new WorldId("circle1"),
  new CircleDisplayShape(),
  40,8,
  new WorldPosition(300,300),
  {restitution:0.9}
);

  
      
world.worldObjectArray.push(circle1);
world.worldObjectArray.push(circle2);

matterEngine.createBounds(canvasHolder.getWidth(),canvasHolder.getHeight(),{restitution:0.9});
let interval:number = 1000/30; //one millisecond over beat per second
console.log("drawing every : "+interval+"ms");
setInterval(doDraw,interval);
Matter.Engine.run(matterEngine.engine);

function doDraw()
{
  world.drawWorld(canvasHolder);	
}
