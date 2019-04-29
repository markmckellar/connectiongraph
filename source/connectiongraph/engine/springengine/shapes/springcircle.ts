import { CircleEngineShape } from "../../shapes/circleengineshape";
import { WorldPosition } from "../../../world/worldposition";
import { Drawable } from "../../../display/drawable";
import { SpringShape } from "./springshape";
import { WorldId } from "../../../world/worldid";
import { SpringEngine } from "../springengine";
import { WorldDisplay } from "../../../display/worlddisplay";

export class SpringCircle extends SpringShape implements CircleEngineShape
{
	private _curvePoints:number;
	private _radius:number;
	

	constructor(worldId:WorldId,drawable:Drawable,radius:number,curvePoints:number,position:WorldPosition,options:any,springEngine:SpringEngine)
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
		//WorldDisplay.getCirclePositionList(this.radius,this.curvePoints);
		return(WorldDisplay.getCirclePositionList(this.radius,this.curvePoints));
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
