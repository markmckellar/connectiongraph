
import { EngineShape } from "./engineshape";

export  interface RectangleEngineShape extends EngineShape
{
	getWidth(): number;
	getHeight(): number;
	setSize(width:number,height:number):void;
}
