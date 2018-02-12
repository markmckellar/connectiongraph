import { EngineShape } from "./engineshape";
import { WorldPosition } from "../../walkerworld/worldposition";
//import { World } from "../../walkerworld/world";
//import { WorldObjectDisplay } from "../worldobjectdisplay";

export class CircleEngineShape extends EngineShape
{
	private _radius:number;

	constructor(shapeName:string,radius:number,curvePoints:number,position:WorldPosition)
	{
		super(
			shapeName,			
			position
		);
		
	}

	public get radius(): number {
		return this._radius;
	}

	public set radius(value: number) {
		this._radius = value;
	}

}
