import { EngineShape } from "./engineshape";
//import { WorldPosition } from "../../world/worldposition";
//import { World } from "../../walkerworld/world";
//import { WorldObjectDisplay } from "../worldobjectdisplay";

export  interface CircleEngineShape extends EngineShape
{
	getRadius(): number;
}
