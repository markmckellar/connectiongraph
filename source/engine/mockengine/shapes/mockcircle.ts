import { CircleEngineShape } from "../../shapes/circleengineshape";
import { WorldPosition } from "../../../world/worldposition";

import * as Matter from "matter-js";
import { Drawable } from "../../../display/drawable";
import { MockShape } from "./mockshape";
import { CircleDisplayShape } from "../../../display/shapes/circledisplayshape";

//import { World } from "../../walkerworld/world";
//import { WorldObjectDisplay } from "../worldobjectdisplay";

export class MockCircle extends MockShape implements CircleEngineShape
{
	private _curvePoints:number;
	private _radius:number;
	

	constructor(drawable:Drawable,radius:number,curvePoints:number,position:WorldPosition)
	{
		super(new CircleDisplayShape(),position);
		//super(shapeName,radius);
		this.radius = radius;
		this.curvePoints = curvePoints;					
	}

	public containsWorldPosition(worldPosition:WorldPosition):boolean {
		return(false);
	}


	public getRadius():number {
		return(this.radius);
	}


	public get curvePoints(): number {
		return this._curvePoints;
	}

	public set curvePoints(value: number) {
		this._curvePoints = value;
	}
	

	public get radius(): number {
		return this._radius;
	}

	public set radius(value: number) {
		this._radius = value;
	}


}
