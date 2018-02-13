import { CircleEngineShape } from "../../engine/shapes/circleengineshape";
import { WorldPosition } from "../../world/worldposition";
import { MatterTools } from "../mattertools";

import * as Matter from "matter-js";

//import { World } from "../../walkerworld/world";
//import { WorldObjectDisplay } from "../worldobjectdisplay";

export class MatterCircle extends CircleEngineShape
{
	private _circleBody:Matter.Body;

	constructor(shapeName:string,radius:number,curvePoints:number,position:WorldPosition)
	{
		super(
            shapeName,
            radius	
        );
        
        this.circleBody = Matter.Bodies.circle(
            position.x,position.y,
            radius,
            {render:{fillStyle:"blue",strokeStyle:"white"}},
            8);					
        
		
	}

    public getWorldPosition():WorldPosition {
		return( MatterTools.bodyPostion2WorldPosition(this.circleBody) );
	}

	public get circleBody(): Matter.Body {
		return this._circleBody;
	}

	public set circleBody(value: Matter.Body) {
		this._circleBody = value;
	}


}
