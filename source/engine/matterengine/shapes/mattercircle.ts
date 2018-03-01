import { CircleEngineShape } from "../../shapes/circleengineshape";
import { WorldPosition } from "../../../world/worldposition";

import * as Matter from "matter-js";
import { MatterShape } from "./mattershape";
import { Drawable } from "../../../display/drawable";
import { WorldId } from "../../../world/worldid";
import { MatterEngine } from "../matterengine";

//import { World } from "../../walkerworld/world";
//import { WorldObjectDisplay } from "../worldobjectdisplay";

export class MatterCircle extends MatterShape implements CircleEngineShape
{
	private _circleBody:Matter.Body;
	private _curvePoints:number;
	private _radius:number;
	

	constructor(worldId:WorldId,drawable:Drawable,radius:number,curvePoints:number,position:WorldPosition,options:any,matterEngine:MatterEngine)
	{
		super(worldId,drawable,options,matterEngine);
		//super(shapeName,radius);
		this.radius = radius;
		this.curvePoints = curvePoints;
        this.circleBody = Matter.Bodies.circle(
            position.x,position.y,
            this.radius,
            options,
			this.curvePoints);	
		this.circleBody.collisionFilter.category = MatterEngine.boundsFilter;
		drawable.init(this,options);
		Matter.World.add(matterEngine.engine.world,[this.circleBody]);
		
		
	}

	public getRadius():number {
		return(this.radius);
	}

    public getBody():Matter.Body {
		return(this.circleBody);
	}

	public get circleBody(): Matter.Body {
		return this._circleBody;
	}

	public set circleBody(value: Matter.Body) {
		this._circleBody = value;
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
