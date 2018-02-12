import { EngineShape } from "./engineshape";
import { WorldPosition } from "../../world/worldposition";
//import { World } from "../../walkerworld/world";


export abstract class RectangleEngineShape extends EngineShape
{
	constructor(shapeName:string,width:number,height:number,offsetFromOrigin: WorldPosition)
	{
		super(
			shapeName
		);
		
	}

}
