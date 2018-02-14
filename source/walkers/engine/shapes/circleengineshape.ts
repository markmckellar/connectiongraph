import { EngineShape } from "./engineshape";
//import { WorldPosition } from "../../world/worldposition";
//import { World } from "../../walkerworld/world";
//import { WorldObjectDisplay } from "../worldobjectdisplay";

export abstract class CircleEngineShape extends EngineShape
{
	private _radius:number;

	constructor(shapeName:string,radius:number)
	{
		super(
			shapeName		
		);
		this.radius = radius;
	}

	public get radius(): number {
		return this._radius;
	}

	public set radius(value: number) {
		this._radius = value;
	}

}
