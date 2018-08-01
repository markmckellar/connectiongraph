import { CanvasHolderHTML } from "./display/canvas/canvasholderhtml";
import { MockEngine } from "./engine/mockengine/mockengine";
import { WorldOfWorldObjects } from "./world/worldofworldobjects";
import { Test1 } from "./test1";


export let mockEngine = new MockEngine();
export let world:WorldOfWorldObjects = new WorldOfWorldObjects(mockEngine);
export let canvasHolder:CanvasHolderHTML = new CanvasHolderHTML("worldCanvas",world);
export let test1 = new Test1(mockEngine,world,canvasHolder);

