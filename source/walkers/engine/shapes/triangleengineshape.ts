import { EngineShape } from "./engineshape";
import { WorldPosition } from "../../world/worldposition";


export abstract class TriangleEngineShape extends EngineShape
{
	constructor(shapeName:string,width:number,height:number,offsetFromOrigin: WorldPosition)
	{
		super(
			shapeName
		);
		
	}
	
}
