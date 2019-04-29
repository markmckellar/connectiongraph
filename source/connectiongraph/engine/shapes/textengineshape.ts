
import { RectangleEngineShape } from "./rectangleengineshape";

export  interface TextEngineShape extends RectangleEngineShape
{
	setText(displayText:string):void;
	getText():string;

}
