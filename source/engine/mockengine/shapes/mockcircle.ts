import { CircleEngineShape } from "../../shapes/circleengineshape";
import { WorldPosition } from "../../../world/worldposition";
import { Drawable } from "../../../display/drawable";
import { MockShape } from "./mockshape";
import { WorldId } from "../../../world/worldid";

export class MockCircle extends MockShape implements CircleEngineShape
{
	private _curvePoints:number;
	private _radius:number;
	

	constructor(worldId:WorldId,drawable:Drawable,radius:number,curvePoints:number,position:WorldPosition)
	{
		super(worldId,drawable,position);
		//super(shapeName,radius);
		this.radius = radius;
		this.curvePoints = curvePoints;					
	}

	public containsWorldPosition(worldPosition:WorldPosition):boolean {
		let distance = this.getWorldPosition().getDistance(worldPosition);
		return(distance<=this.radius);
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
