import { CanvasHolderHTML } from "./display/canvas/canvasholderhtml";
import { WorldOfWorldObjects } from "./world/worldofworldobjects";
import { WorldId } from "./world/worldid";
import { MatterEngine } from "./engine/matterengine/matterengine";
import { Test1 } from "./test1";

export let wid = WorldId;
export let matterEngine = new MatterEngine();
export let world:WorldOfWorldObjects = new WorldOfWorldObjects(matterEngine);
export let canvasHolder:CanvasHolderHTML = new CanvasHolderHTML("worldCanvas",world);
export let test1 = new Test1(matterEngine,world,canvasHolder);
