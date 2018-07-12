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
import { TextDisplayShape } from "./display/drawableshapes/textdisplayshape";
import { Test1 } from "./test1";


export let mockEngine = new MockEngine();
export let world:WorldOfWorldObjects = new WorldOfWorldObjects(mockEngine);
export let canvasHolder:CanvasHolderHTML = new CanvasHolderHTML("worldCanvas",world);
export let test1 = new Test1(mockEngine,world,canvasHolder);

