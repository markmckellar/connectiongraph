import { CircleEngineShape } from "../../shapes/circleengineshape";
import { WorldPosition } from "../../../world/worldposition";
import { Drawable } from "../../../display/drawable";
import { MockShape } from "./mockshape";
import { WorldId } from "../../../world/worldid";
import { MockEngine } from "../mockengine";

export class MockCircle extends MockShape implements CircleEngineShape
{
	private _curvePoints:number;
	private _radius:number;
	

	constructor(worldId:WorldId,drawable:Drawable,radius:number,curvePoints:number,position:WorldPosition,options:any,mockEngine:MockEngine)
	{
		super(worldId,drawable,position,options);
		this.radius = radius;
		this.curvePoints = curvePoints;	
		drawable.init(this,options);
	}

	public containsWorldPosition(worldPosition:WorldPosition):boolean {
		let distance = this.getWorldPosition().getDistance(worldPosition);
		return(distance<=this.radius);
	}

	public getRadius():number {
		return(this.radius);
	}

	public getShapePoints():Array<WorldPosition> {
		//return( WorldDisplay.getPolygonPoints(Math.PI/4,4,this.getWidth()+this.get,this.getWorldPosition() ) ;
		return(null);
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
