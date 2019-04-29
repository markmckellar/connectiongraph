import { EngineShape } from "./engineshape";
import { WorldPosition } from "../../world/worldposition";

export abstract class ArcsShape extends EngineShape
{
	constructor(shapeName:string,endAngle:number,startAngle:number,radius:number,curvePoints:number,offsetFromOrigin:WorldPosition)
	{
		super(
			shapeName		);
		
	}

	
	//this.displayInfo.endAngle,this.displayInfo.startAngle
	public static toRadians(deg:number):number
	{
	    return deg * Math.PI / 180; //Converts degrees into radians
	}
}
