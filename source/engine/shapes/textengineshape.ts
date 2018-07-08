
import { RectangleEngineShape } from "./rectangleengineshape";
//import { WorldPosition } from "../../world/worldposition";
//import { World } from "../../walkerworld/world";
//import { WorldObjectDisplay } from "../worldobjectdisplay";

export  interface TextEngineShape extends RectangleEngineShape
{
	setText(displayText:string):void;
	getText():string;

}
