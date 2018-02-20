//import { WorldPosition } from "../../world/worldposition";
import { WalkerWorld } from "../../walkers/walkerworld/walkerworld";
//import { WorldObjectDisplay } from "../worldobjectdisplay";



export interface WorldShape {

	drawShape(walkerWorld:WalkerWorld,context:CanvasRenderingContext2D,):void;
	
};